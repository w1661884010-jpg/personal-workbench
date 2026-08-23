import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the home entry mounts the V2 workbench with Chinese dark-site metadata", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /import\s+\{\s*LearningWorkbench\s*\}\s+from\s+"\.\/components\/LearningWorkbench"/);
  assert.match(page, /return\s+<LearningWorkbench\s*\/>/);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview|codex-preview/);
  assert.match(layout, /电路自习室｜本学期电子类课程个人学习站点/);
  assert.match(layout, /按教材章节学习、检验并在自由电路工作台中验证/);
  assert.match(layout, /<html lang="zh-CN">/);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);
  assert.match(layout, /new URL\("\/og\.png", metadataBase\)/);
  assert.match(layout, /colorScheme:\s*"dark"/);
  assert.match(layout, /themeColor:\s*"#07141f"/);
});
test("the first render is deterministic and later restores only V2 or explicitly migrated state", async () => {
  const workbench = await readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8");
  assert.match(workbench, /createLearningState\(courses,\s*new Date\("2026-08-24T00:00:00\.000Z"\)\)/);
  assert.match(workbench, /nextState\s*=\s*loadLearningState\(\)\s*\?\?\s*createLearningState\(courses\)/);
  assert.match(workbench, /setState\(nextState\)/);
  assert.match(workbench, /正在读取本地学习记录/);
  assert.match(workbench, /LEARNING_STORAGE_KEY/);
  assert.match(workbench, /globalThis\.addEventListener\("storage"/);
  assert.match(workbench, /},\s*220\)/);
});

test("active V2 home and chapter surfaces do not restore daily, weekly, or time-based progress", async () => {
  const [dashboard, chapter, model] = await Promise.all([
    readFile(new URL("../app/components/semester/DashboardView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/semester/ChapterStudyView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/course-model.ts", import.meta.url), "utf8"),
  ]);
  const activeV2 = [dashboard, chapter, model].join("\n");
  assert.doesNotMatch(activeV2, /todayTasks|currentWeek|studyMinutes|streakDays|今日任务|今日主问题|明天第一件事|当前学习周次|连续学习/);
  assert.match(dashboard, /getCourseProgress/);
  assert.match(chapter, /提交章节检验/);
  assert.match(model, /completed\/total|completed,\s*total|completed\s*\/\s*counted\.length/);
});

test("the production interface keeps the dark engineering-notebook palette and responsive layouts", async () => {
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /color-scheme:\s*dark/);
  assert.match(styles, /--paper-bg:\s*#07141f/i);
  assert.match(styles, /--paper:\s*#0d2230/i);
  assert.match(styles, /--ink:\s*#e8f2f4/i);
  assert.match(styles, /--teal:\s*#27b8a6/i);
  assert.match(styles, /--orange:\s*#ff934d/i);
  assert.match(styles, /\.app-sidebar\s*\{[^}]*position:\s*fixed/s);
  assert.match(styles, /\.chapter-study\s*\{[^}]*grid-template-columns/s);
  assert.match(styles, /\.course-entry\s*\{[^}]*grid-template-columns/s);
  assert.match(styles, /@media\s*\(max-width:\s*1280px\)/);
  assert.match(styles, /@media\s*\(max-width:\s*980px\)/);
  assert.match(styles, /@media\s*\(max-width:\s*760px\)/);
  assert.match(styles, /\.mobile-nav\s*\{[^}]*position:\s*fixed/s);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(styles, /@media\s*\(prefers-contrast:\s*more\)/);
  assert.doesNotMatch(styles, /transition:\s*all\b/);
  assert.doesNotMatch(styles, /color-scheme:\s*light/);
  assert.doesNotMatch(styles, /linear-gradient\(/);
});

test("mobile navigation is course-first and excludes oversized secondary tools", async () => {
  const [workbench, shell, styles] = await Promise.all([
    readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/semester/AppShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(workbench, /id:\s*"dashboard"[\s\S]*mobileLabel:\s*"首页"/);
  for (const id of ["sandbox-digital", "sandbox-analog", "mistakes", "connections"]) {
    assert.match(workbench, new RegExp(`id:\\s*"${id}"[\\s\\S]*?mobile:\\s*false`));
  }
  assert.match(shell, /navigation\.filter\(\(item\)\s*=>\s*item\.mobile\s*!==\s*false\)/);
  assert.match(shell, /aria-label="移动端课程导航"/);
  assert.match(styles, /@media\s*\(max-width:\s*760px\)[\s\S]*\.mobile-nav\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*1fr\)/);
});
