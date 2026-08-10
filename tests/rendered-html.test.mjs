import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the home entry mounts the learning workbench with Chinese metadata", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(
    page,
    /import\s+\{\s*LearningWorkbench\s*\}\s+from\s+"\.\/components\/LearningWorkbench"/,
  );
  assert.match(page, /return\s+<LearningWorkbench\s*\/>/);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview|codex-preview/);

  assert.match(layout, /const siteTitle = "自动化基础学习台"/);
  assert.match(layout, /本地优先的 F28335\/CCS 学习执行台/);
  assert.match(layout, /<html lang="zh-CN">/);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);
  assert.match(layout, /new URL\("\/og\.png", metadataBase\)/);
  assert.doesNotMatch(layout, /Starter Project|Your site is taking shape/);
});

test("the current home view preserves the five-page learning contract", async () => {
  const [workbench, todayView] = await Promise.all([
    readFile(
      new URL("../app/components/LearningWorkbench.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/views/TodayView.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  const navLabels = [
    ...workbench.matchAll(
      /\{\s*id:\s*"(?:today|roadmap|knowledge|records|deferred)",\s*label:\s*"([^"]+)"/g,
    ),
  ].map((match) => match[1]);
  assert.deepEqual(navLabels, [
    "今日学习",
    "学习路线",
    "知识与开发板",
    "学习记录",
    "以后再学",
  ]);

  assert.equal((todayView.match(/id="main-question"/g) ?? []).length, 1);
  assert.match(todayView, /state\.today\.tasks\.slice\(0,\s*3\)/);
  assert.match(todayView, /今日任务[\s\S]*最多 3 项/);
  assert.match(todayView, /上次未解决的问题/);
  assert.match(todayView, /下次第一件事/);
  assert.match(todayView, /继续学习/);
  assert.equal(
    (todayView.match(/className="primary-action"/g) ?? []).length,
    1,
  );
  assert.match(workbench, /aria-label="一级导航"/);
  assert.match(workbench, /aria-label="移动端一级导航"/);
});

test("backup, restore, persistence, and Markdown actions remain wired", async () => {
  const [workbench, recordsView] = await Promise.all([
    readFile(
      new URL("../app/components/LearningWorkbench.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/views/RecordsView.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(workbench, /import \{ downloadDailyMarkdown \}/);
  assert.match(workbench, /downloadBackup,[\s\S]*loadState,[\s\S]*readTextFile,[\s\S]*restoreBackup,[\s\S]*saveState/);
  assert.match(workbench, /saveState\(state\)/);
  assert.match(workbench, /}, 400\)/);
  assert.match(
    workbench,
    /const restored = rolloverDailyState\(restoreBackup\(serialized\)\)/,
  );
  assert.match(workbench, /saveState\(pendingImport\)/);
  assert.match(workbench, /恢复备份会覆盖当前数据/);
  assert.match(workbench, /先备份当前数据/);

  assert.match(recordsView, /导出 Markdown/);
  assert.match(recordsView, /备份 JSON/);
  assert.match(recordsView, /恢复备份/);
  assert.match(recordsView, /accept="application\/json,\.json"/);
});

test("static HTML and the first client render share one deterministic state before daily rollover", async () => {
  const workbench = await readFile(
    new URL("../app/components/LearningWorkbench.tsx", import.meta.url),
    "utf8",
  );

  assert.match(workbench, /const HYDRATION_DATE = new Date\("2026-07-30T08:00:00Z"\)/);
  assert.match(workbench, /createDefaultState\(HYDRATION_DATE\)/);
  assert.match(workbench, /rolloverDailyState\(stored \?\? createDefaultState\(\)\)/);
  assert.match(workbench, /if \(!hydrated\) \{/);
  assert.match(workbench, /aria-busy="true"/);
  assert.match(workbench, /正在加载本地学习数据/);
});

test("the production interface follows the selected dark control-room design contract", async () => {
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(styles, /color-scheme:\s*dark/);
  assert.match(styles, /--control-bg:\s*#080b12/i);
  assert.match(styles, /--control-panel:\s*#111827/i);
  assert.match(styles, /--control-accent:\s*#8ea7ff/i);
  assert.match(styles, /--control-success:\s*#61d8c9/i);
  assert.match(styles, /--control-warning:\s*#f4b963/i);
  assert.match(styles, /\.question-sheet::before[\s\S]*content:\s*"Q"/);
  assert.match(styles, /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/);
  assert.match(styles, /@media\s*\(prefers-reduced-transparency:\s*reduce\)/);
  assert.match(styles, /@media\s*\(prefers-contrast:\s*more\)/);
  assert.match(styles, /:active[\s\S]*transform:\s*scale\(0\.97\)/);
  assert.doesNotMatch(styles, /transition:\s*all\b/);
  assert.doesNotMatch(styles, /\bease-in\b/);
  assert.doesNotMatch(styles, /scale\(0\)/);
});
