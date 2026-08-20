import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the home entry mounts the semester learning workbench with Chinese metadata", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /import\s+\{\s*LearningWorkbench\s*\}\s+from\s+"\.\/components\/LearningWorkbench"/);
  assert.match(page, /return\s+<LearningWorkbench\s*\/>/);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview|codex-preview/);

  assert.match(layout, /const siteTitle = "电路自习室｜本学期电子类课程个人学习站点"/);
  assert.match(layout, /数字电子技术、模拟电子技术与信号与系统个人学习站点/);
  assert.match(layout, /<html lang="zh-CN">/);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);
  assert.match(layout, /new URL\("\/og\.png", metadataBase\)/);
  assert.match(layout, /colorScheme:\s*"dark"/);
  assert.match(layout, /themeColor:\s*"#07141f"/);
});
test("the current home view preserves the five-surface semester learning contract", async () => {
  const [workbench, dashboard, shell] = await Promise.all([
    readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/semester/DashboardView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/semester/AppShell.tsx", import.meta.url), "utf8"),
  ]);

  const navLabels = [...workbench.matchAll(/label:\s*"([^"]+)",\s*mobileLabel/g)].map((match) => match[1]);
  assert.deepEqual(navLabels, ["学习总览", "三门课程", "知识卡片", "练习与错题", "课程连接"]);
  assert.match(dashboard, /state\.todayTasks\.slice\(0, 3\)/);
  assert.match(dashboard, /今日主问题/);
  assert.match(dashboard, /明天第一件事/);
  assert.equal((dashboard.match(/className="primary-action"/g) ?? []).length, 1);
  assert.match(dashboard, /继续学习/);
  assert.match(shell, /aria-label="一级导航"/);
  assert.match(shell, /aria-label="移动端一级导航"/);
  assert.match(shell, /搜索课程、章节或知识点/);
});

test("backup, restore, persistence, and cross-tab synchronization remain wired", async () => {
  const [workbench, shell, storage] = await Promise.all([
    readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/semester/AppShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/semester-storage.ts", import.meta.url), "utf8"),
  ]);

  assert.match(workbench, /downloadSemesterBackup/);
  assert.match(workbench, /loadSemesterState/);
  assert.match(workbench, /restoreSemesterBackup/);
  assert.match(workbench, /saveSemesterState/);
  assert.match(workbench, /SEMESTER_STORAGE_KEY/);
  assert.match(workbench, /globalThis\.addEventListener\("storage"/);
  assert.match(workbench, /}, 250\)/);
  assert.match(workbench, /导入会覆盖当前浏览器中的学习记录/);
  assert.match(shell, /导入 JSON/);
  assert.match(shell, /导出 JSON/);
  assert.match(shell, /accept="application\/json,\.json"/);
  assert.match(storage, /semester-electronics-learning-site:state:v1/);
});

test("static HTML and the first client render share deterministic semester data before local restore", async () => {
  const workbench = await readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8");
  assert.match(workbench, /const HYDRATION_DATE = new Date\("2026-08-20T08:00:00\.000Z"\)/);
  assert.match(workbench, /useState<SemesterState>\(\(\) => createSemesterState\(HYDRATION_DATE\)\)/);
  assert.match(workbench, /loadSemesterState\(\) \?\? createSemesterState\(\)/);
  assert.match(workbench, /正在读取本地学习记录/);
});

test("the production interface follows the selected dark engineering-notebook contract", async () => {
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /color-scheme:\s*dark/);
  assert.match(styles, /--paper-bg:\s*#07141f/i);
  assert.match(styles, /--paper:\s*#0d2230/i);
  assert.match(styles, /--ink:\s*#e8f2f4/i);
  assert.match(styles, /--teal:\s*#27b8a6/i);
  assert.match(styles, /--orange:\s*#ff934d/i);
  assert.match(styles, /\.app-sidebar\s*\{[^}]*position:\s*fixed/s);
  assert.match(styles, /@media\s*\(max-width:\s*760px\)/);
  assert.match(styles, /\.mobile-nav\s*\{[^}]*position:\s*fixed/s);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(styles, /@media\s*\(prefers-contrast:\s*more\)/);
  assert.doesNotMatch(styles, /transition:\s*all\b/);
  assert.doesNotMatch(styles, /color-scheme:\s*light/);
  assert.doesNotMatch(styles, /linear-gradient\(/);
});
