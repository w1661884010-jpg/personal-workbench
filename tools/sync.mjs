// 3020 试验副本 → 3010 真源：同步工具（零依赖，只用 Node 内置模块）
//
//   3010 = 唯一真源，保留完整 git 历史与远端仓库，发布/提交都在那里做
//   3020 = 本地试验副本（本目录），只放临时改动，不提交、不推送
//
// 版本记录（重要）：本文件跑在 3020（该目录没有 git），所以版本记录不在 3020，
//   而是以「归档副本 + 文件头」两处为准：
//     1) 归档副本：<3010>/tools/sync.mjs —— 由 git 跟踪，`git log -- tools/sync.mjs` 即版本历史；
//     2) 文件头：下面的 SYNC_VERSION 与「变更记录」。
//   两者与 3020 的运行副本内容不一致时，工具会在启动时告警（见 checkArchiveDrift）。
//
// 用法：
//   node sync.mjs               查看差异（等同 status）
//   node sync.mjs status        列出 3020 与 3010 的运行文件差异
//   node sync.mjs push          把 3020 的运行文件写回 3010（验证通过后同步）
//   node sync.mjs pull          把 3010 的运行文件拉回 3020（放弃试验改动，回到真源）
//   node sync.mjs check         对 3020 跑完整浏览器测试
//
// 选项：
//   --tests          连带 tests/ 一起同步（推送时自动把 localhost:3020 改写回 3010）
//   --build-inputs   连带"完整构建输入"一起同步（见 BUILD_INPUT_FILES / BUILD_INPUT_DIRS）
//   --dry-run        只显示将要发生的写入，不落盘
//   --prune          同步时删除对侧多余的文件（默认只报告，不删）
//
// 同步范围：
//   默认 = 站点运行必需的文件 + fonts/ + workbench-entry.tsx（测试静态断言所需）+（可选）tests/；
//   --build-inputs 追加 = 工作台/公式的构建源码与依赖清单（含 circuit-placement.ts）；
//   永远不同步 = 依赖目录（node_modules）、git 元数据（.git）、凭据与环境文件（.env*、*.pem、*.key）、
//   构建产物目录（dist-pages、dist-isolation-check）。
// 推送前会检查 3010 是否有未提交改动，有则停止（避免覆盖别人未提交的工作）。
// 改端口用 PW3010 环境变量：$env:PW3010 = "D:\...\personal-workbench-shell-3010"
//
// 变更记录：
//   v1.1.0  2026-09-11  新增 --build-inputs（完整构建输入，含 circuit-placement.ts）；
//                       推送前检查目标侧未提交改动（脏则停止）；启动时校验归档副本是否过期。
//   v1.0.0  2026-09-10  初版：运行文件/字体/测试的 status·push·pull·check。

import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SYNC_VERSION = "1.1.0";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const SOURCE = resolve(process.env.PW3010 ?? join(HERE, "..", "personal-workbench-shell-3010"));

const RUNTIME_FILES = [
  "index.html",
  "styles.css",
  "app.js",
  "courses.js",
  "katex.min.css",
  "katex.bundle.js",
  "workbench.bundle.css",
  "workbench.bundle.js",
];
const RUNTIME_DIRS = ["fonts"];
// tests/unified-workbench-switching.test.mjs 会对工作台入口做静态断言，需要这份源码文件
const TEST_SOURCE_FILES = ["workbench-entry.tsx"];
const TEST_DIR = "tests";

/* 完整构建输入（--build-inputs）：只列实际参与构建的文件与目录，
   依赖目录 node_modules、git 元数据、凭据/环境文件都不在其中。 */
const BUILD_INPUT_FILES = [
  "package.json",
  "package-lock.json",
  "build-workbench.mjs",
  "build-katex.mjs",
  "build-pages.mjs",
  "katex-entry.js",
  "workbench-entry.tsx",
  "CircuitWorkbench.tsx",
  "circuit-placement.ts",
];
const BUILD_INPUT_DIRS = ["circuit-source"];

/* 永不触碰的路径（双保险：即使有人往上面的清单里加错也不会同步它们） */
const FORBIDDEN = [
  /(^|\/)node_modules(\/|$)/,
  /(^|\/)\.git(\/|$)/,
  /(^|\/)\.env(\.|$)/,
  /\.(pem|key|p12|pfx)$/i,
  /(^|\/)dist-pages(\/|$)/,
  /(^|\/)dist-isolation-check(\/|$)/,
  /(^|\/)\.playwright-cli(\/|$)/,
];


const PORT_FROM = "localhost:3020";
const NUM_FROM = "3020";
const NUM_TO = "3010";

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function listRuntime(root, withBuildInputs) {
  const files = [];
  const names = withBuildInputs
    ? [...RUNTIME_FILES, ...TEST_SOURCE_FILES, ...BUILD_INPUT_FILES]
    : [...RUNTIME_FILES, ...TEST_SOURCE_FILES];
  for (const name of names) {
    try {
      await stat(join(root, name));
      files.push(name);
    } catch {
      /* 该侧缺失，由差异表报告 */
    }
  }
  const dirs = withBuildInputs ? [...RUNTIME_DIRS, ...BUILD_INPUT_DIRS] : RUNTIME_DIRS;
  for (const dir of dirs) {
    for (const full of await walk(join(root, dir))) {
      files.push(relative(root, full).split(sep).join("/"));
    }
  }
  return files.filter((rel) => !isForbidden(rel)).sort();
}

/* 双保险：即使清单写错，也绝不把依赖目录 / git 元数据 / 凭据 / 构建产物同步出去 */
function isForbidden(relPath) {
  return FORBIDDEN.some((pattern) => pattern.test(relPath));
}

async function listTests(root) {
  try {
    return (await readdir(join(root, TEST_DIR))).filter((name) => name.endsWith(".mjs")).sort().map((name) => `${TEST_DIR}/${name}`);
  } catch {
    return [];
  }
}

async function readBytes(file) {
  try {
    return await readFile(file);
  } catch {
    return null;
  }
}

async function sha(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

// tests/ 里 "3020" 只用于本地端口、目录名与测试标题，两侧写法本就不同；
// 比较与推送时统一折算到 3010 的写法，避免把端口差异当成实质改动。
function isTest(relPath) {
  return relPath.startsWith(TEST_DIR + "/");
}

function toSource(relPath, buf) {
  if (!isTest(relPath)) return buf;
  return Buffer.from(buf.toString("utf8").split(NUM_FROM).join(NUM_TO), "utf8");
}

function toCopy(relPath, buf) {
  if (!isTest(relPath)) return buf;
  return Buffer.from(buf.toString("utf8").split(NUM_TO).join(NUM_FROM), "utf8");
}

function human(bytes) {
  if (bytes === null || bytes === undefined) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function compare(list, copyRoot, sourceRoot) {
  const rows = [];
  for (const rel of list) {
    const [a, b] = await Promise.all([readBytes(join(copyRoot, rel)), readBytes(join(sourceRoot, rel))]);
    if (a === null || b === null) {
      rows.push({ rel, state: a === null ? "仅 3010 有" : "仅 3020 有", a: a?.length ?? null, b: b?.length ?? null });
      continue;
    }
    const same = (await sha(toSource(rel, a))) === (await sha(b));
    rows.push({ rel, state: same ? "相同" : "有改动", a: a.length, b: b.length });
  }
  return { rows, sourceExtra: [] };
}

function printReport(title, { rows, sourceExtra }, options) {
  const changed = rows.filter((row) => row.state !== "相同");
  console.log(`\n${title}`);
  if (changed.length === 0 && sourceExtra.length === 0) {
    console.log("  ✔ 与 3010 一致");
    return 0;
  }
  for (const row of changed) {
    const sizes = row.state === "有改动" ? `  3020 ${human(row.a)} → 3010 ${human(row.b)}` : "";
    console.log(`  • ${row.rel.padEnd(34)} ${row.state}${sizes}`);
  }
  for (const rel of sourceExtra) console.log(`  • ${rel.padEnd(34)} ${options.tests ? "仅 3010 有（未被同步）" : "仅 3010 有"}`);
  return changed.length;
}

async function copyInto(fromRoot, toRoot, rel, { tests, dryRun, direction }) {
  const target = join(toRoot, rel);
  await mkdir(dirname(target), { recursive: true });
  if (dryRun) {
    console.log(`  [dry-run] ${direction === "push" ? "3020 → 3010" : "3010 → 3020"}  ${rel}`);
    return;
  }
  if (tests && isTest(rel)) {
    const buf = await readFile(join(fromRoot, rel));
    await writeFile(target, direction === "push" ? toSource(rel, buf) : toCopy(rel, buf));
  } else {
    await copyFile(join(fromRoot, rel), target);
  }
  console.log(`  ${direction === "push" ? "3020 → 3010" : "3010 → 3020"}  ${rel}`);
}

async function ensureSource() {
  try {
    await stat(join(SOURCE, "index.html"));
  } catch {
    console.error(`找不到 3010 真源：${SOURCE}\n用 PW3010 环境变量指定正确路径后重试。`);
    process.exit(2);
  }
}

/* 归档副本漂移检查：3010/tools/sync.mjs 是本工具的版本记录（由 git 跟踪）。
   两者内容不一致时给出明确提示，避免"记录"与"实际运行"长期分叉。 */
async function checkArchiveDrift() {
  const archive = join(SOURCE, "tools", "sync.mjs");
  const running = await readBytes(fileURLToPath(import.meta.url));
  const stored = await readBytes(archive);
  if (!stored) {
    console.log(`提示：尚未建立归档副本（${archive}）。建议把本文件复制过去并提交，作为版本记录。`);
    return;
  }
  if (running && (await sha(running)) !== (await sha(stored))) {
    console.log("⚠️  归档副本与运行副本不一致：");
    console.log(`    运行：${fileURLToPath(import.meta.url)}`);
    console.log(`    归档：${archive}（版本记录，由 git 跟踪）`);
    console.log(`    更新：Copy-Item "${fileURLToPath(import.meta.url)}" "${archive}" -Force`);
  }
}

/* 推送前检查目标侧（3010）有没有未提交改动：有就停止，避免覆盖别人未提交的工作。
   唯一豁免：本工具自己的归档副本 tools/sync.mjs —— 它由本工具维护，不该拦住同步。
   用 --untracked-files=all 拿到文件级条目（否则未跟踪目录会被折叠成 "?? tools/"）。 */
async function assertTargetClean() {
  const child = spawn("git", ["-C", SOURCE, "status", "--porcelain", "--untracked-files=all"], { stdio: ["ignore", "pipe", "pipe"] });
  let out = "";
  child.stdout.on("data", (chunk) => { out += chunk.toString("utf8"); });
  const code = await new Promise((resolve) => child.on("exit", (value) => resolve(value ?? 1)));
  if (code !== 0) {
    console.log("⚠️  无法读取 3010 的 git 状态（不是 git 仓库或 git 不可用），跳过未提交改动检查。");
    return;
  }
  const lines = out.split("\n").map((line) => line.trimEnd()).filter(Boolean);
  const archiveLine = lines.find((line) => /tools\/sync\.mjs$/.test(line));
  const dirty = lines.filter((line) => line !== archiveLine);
  if (archiveLine) console.log(`（豁免本工具归档副本：${archiveLine}）`);
  if (dirty.length > 0) {
    console.error(`\n✗ 3010 有 ${dirty.length} 项未提交改动，已停止同步（避免覆盖）：`);
    for (const line of dirty.slice(0, 20)) console.error(`    ${line}`);
    if (dirty.length > 20) console.error(`    …还有 ${dirty.length - 20} 项`);
    console.error("\n请先在 3010 里提交或撤销这些改动，再重新执行推送。");
    process.exit(4);
  }
}

async function runCheck() {
  const url = `http://${PORT_FROM}/`;
  let ok = true;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    console.log(`3020 服务 ${url} → HTTP ${res.status}`);
    ok = res.ok;
  } catch (error) {
    console.log(`3020 服务 ${url} → 不可用（${error.message}）`);
    ok = false;
  }
  if (!ok) {
    console.error("请先在本目录执行：node serve.mjs");
    process.exit(3);
  }
  console.log("运行 tests/*.test.mjs ...\n");
  const child = spawn(process.execPath, ["--test", "tests/*.test.mjs"], { cwd: HERE, stdio: "inherit" });
  child.on("exit", (code) => process.exit(code ?? 1));
}

async function main() {
  const args = process.argv.slice(2);
  const command = args.find((a) => !a.startsWith("-")) ?? "status";
  const tests = args.includes("--tests");
  const buildInputs = args.includes("--build-inputs");
  const dryRun = args.includes("--dry-run");
  const prune = args.includes("--prune");

  if (command === "check") return runCheck();
  await ensureSource();
  await checkArchiveDrift();

  const scope = [
    "站点运行组件",
    ...(buildInputs ? ["构建输入"] : []),
    ...(tests ? ["tests/"] : []),
  ].join(" + ");
  const runtime = await listRuntime(HERE, buildInputs);
  const sourceRuntimeExtra = (await listRuntime(SOURCE, buildInputs)).filter((rel) => !runtime.includes(rel));
  const runtimeReport = await compare(runtime, HERE, SOURCE);
  runtimeReport.sourceExtra = sourceRuntimeExtra;
  const testsReport = await compare(await listTests(HERE), HERE, SOURCE);

  console.log(`sync.mjs v${SYNC_VERSION}（版本记录：3010/tools/sync.mjs）`);
  console.log(`3020 副本：${HERE}`);
  console.log(`3010 真源：${SOURCE}`);
  console.log(`同步范围：${scope}`);

  if (command === "status") {
    const n = printReport(`同步文件（${scope}）：`, runtimeReport, { tests });
    printReport("tests/（端口与目录名差异已折算，只报实质改动）：", testsReport, { tests });
    const missingFlags = [!tests && "--tests", !buildInputs && "--build-inputs"].filter(Boolean).join(" ");
    console.log(
      n === 0
        ? "\n结论：3020 的同步文件与 3010 一致。"
        : `\n结论：3020 有 ${n} 个同步文件与 3010 不同。验证满意后执行：node sync.mjs push${missingFlags ? " " + missingFlags : ""}`,
    );
    return;
  }

  if (command === "push" || command === "pull") {
    if (command === "push" && !dryRun) await assertTargetClean();
    const from = command === "push" ? HERE : SOURCE;
    const to = command === "push" ? SOURCE : HERE;
    const changed = [...runtimeReport.rows, ...(tests ? testsReport.rows : [])].filter((row) => row.state === "有改动");
    /* "仅 3020 有"既包括运行组件也包括新增的测试文件：推送时都要带过去，
       否则 3010 会缺文件；拉回时它们属于副本独有的残留，按 --prune 处理。 */
    const onlyHere = [...runtimeReport.rows, ...(tests ? testsReport.rows : [])]
      .filter((row) => row.state === "仅 3020 有")
      .map((row) => row.rel);
    const toCopy = (command === "push" ? [...changed.map((row) => row.rel), ...onlyHere] : changed.map((row) => row.rel))
      .filter((rel) => {
        if (!isForbidden(rel)) return true;
        console.log(`  跳过（受保护路径，不同步）：${rel}`);
        return false;
      });

    console.log(`\n${command === "push" ? "推送 3020 → 3010" : "拉回 3010 → 3020"}（${scope}）${dryRun ? "  [dry-run]" : ""}`);
    if (toCopy.length === 0) console.log("  （没有需要同步的文件）");
    for (const rel of toCopy) await copyInto(from, to, rel, { tests, dryRun, direction: command });

    const stale = command === "pull" ? onlyHere : [];
    if (stale.length > 0) {
      console.log(`\n3020 独有（3010 没有）：${stale.join(", ")}`);
      console.log(prune ? "  按 --prune 删除：" : "  默认保留；如确认不再需要，加 --prune 删除：");
      for (const rel of stale) {
        if (prune && !dryRun) await unlink(join(HERE, rel));
        console.log(`    ${rel}`);
      }
    }
    if (command === "push" && !dryRun) {
      /* 只提示暂存本轮真正写过去的文件 —— 3010 里可能还有别人未提交的改动，
         一律 git add -A 会把它们卷进本次提交（这条提示以前就是那么写的，已修正）。 */
      console.log("\n下一步（提交在 3010 做；只暂存本轮文件，不要用 git add -A）：");
      if (toCopy.length === 0) {
        console.log("  （本次没有写入任何文件）");
      } else {
        for (const rel of toCopy) console.log(`  git -C "${SOURCE}" add -- "${rel}"`);
      }
      console.log(`  git -C "${SOURCE}" status --short   # 确认暂存清单只有上面这些`);
      console.log(`  git -C "${SOURCE}" commit -m "<说明本次改动>"`);
      console.log("3010 的服务读取的是磁盘文件，浏览器刷新即可看到新版本。");
    }
    if (dryRun) console.log("\n（dry-run：未写入任何文件）");
    return;
  }

  console.error(`未知命令：${command}\n可用：status | push | pull | check（选项 --tests --build-inputs --dry-run --prune）`);
  process.exit(2);
}

await main();
