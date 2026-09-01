import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = (name) => readFile(new URL(`../app/components/semester/${name}`, import.meta.url), "utf8");

test("navigation exposes the three courses, two workbenches, records, and connections", async () => {
  const workbench = await readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8");
  const labels = [...workbench.matchAll(/label:\s*"([^"]+)",\s*mobileLabel/g)].map((match) => match[1]);
  assert.deepEqual(labels, [
    "课程首页", "信号与系统", "数字电子技术", "模拟电子技术",
    "数字电路工作台", "模拟电路工作台", "练习与错题", "课程连接",
  ]);
  for (const view of ["DashboardView", "CourseOverviewView", "ChapterStudyView", "CircuitWorkbench", "ChapterMistakesView", "CourseConnectionsView"]) {
    assert.match(workbench, new RegExp(view));
  }
  assert.match(workbench, /course\/\$\{id\}/);
  assert.match(workbench, /chapter\/\$\{chapterId\}/);
  assert.match(workbench, /sandbox\/\$\{kind\}/);
});

test("the home page keeps three chapter-progress entries and adds two real workbench shortcuts", async () => {
  const dashboard = await component("DashboardView.tsx");
  assert.match(dashboard, /courses\.map/);
  assert.match(dashboard, /getCurrentChapter/);
  assert.match(dashboard, /getCourseProgress/);
  assert.match(dashboard, /当前章节/);
  assert.match(dashboard, /章已完成/);
  assert.match(dashboard, /只有完成章节检验后/);
  assert.match(dashboard, /onOpenWorkbench/);
  assert.match(dashboard, /数字电路工作台/);
  assert.match(dashboard, /模拟电路工作台/);
  assert.ok(dashboard.indexOf('className="workbench-shortcuts"') < dashboard.indexOf('className="course-entry-grid"'), "workbench shortcuts must appear before course entries");
  assert.doesNotMatch(dashboard, /今日|明天|本周|周次|打卡|连续学习|todayTasks|currentWeek|studyMinutes/);
});

test("chapter study renders the fixed seven-stage workflow and enforces the check gate", async () => {
  const [chapter, formula] = await Promise.all([component("ChapterStudyView.tsx"), component("MathFormula.tsx")]);
  const labels = ["学习目标", "前置知识", "知识讲解", "典型例题", "动手实验", "章节检验", "复习总结"];
  let previous = -1;
  for (const label of labels) {
    const current = chapter.indexOf(`title="${label}"`);
    assert.ok(current > previous, `${label} must appear in the fixed order`);
    previous = current;
  }
  assert.match(chapter, /主线必学/);
  assert.match(chapter, /选择学习/);
  assert.doesNotMatch(chapter, /本地资料已核对|本地补充资料|资料不足/);
  assert.match(chapter, /onOpenExperiment\(chapter,\s*experiment\.id\)/);
  assert.match(chapter, /disabled=\{!allAnswered\}/);
  assert.match(chapter, /disabled=\{!passed\s*\|\|/);
  assert.match(chapter, /onSubmitCheck\(chapter,\s*answers\)/);
  assert.match(chapter, /onComplete\(chapter\.id\)/);
  assert.match(chapter, /得分达到 \{CHECK_PASS_SCORE\}% 才能完成本章/);
  assert.match(chapter, /答错题会自动进入错题复盘/);
  assert.match(chapter, /MathFormula/);
  assert.match(formula, /katex\.renderToString/);
  assert.match(formula, /aria-label=\{`公式：\$\{expression\}`\}/);
  assert.match(chapter, /<details className="example-answer">/);
});

test("course overview keeps one directory and previews one chapter without duplicating the route list", async () => {
  const [overview, chapter, styles] = await Promise.all([
    component("CourseOverviewView.tsx"),
    component("ChapterStudyView.tsx"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const readerSurface = `${overview}\n${chapter}`;
  assert.doesNotMatch(readerSurface, /内容依据|资料状态|本地资料已核对|本地补充资料|资料不足/);
  assert.match(overview, /本章重点/);
  assert.match(overview, /selectedChapterId/);
  assert.match(overview, /onPreviewChapter/);
  assert.match(overview, /onContinueChapter/);
  assert.match(overview, /aria-current=\{isSelected \? "true" : undefined\}/);
  assert.match(overview, /course-guide-panel/);
  assert.match(overview, /coreSections\.map/);
  assert.match(overview, /course-optional-sections/);
  assert.match(overview, /MathFormula/);
  assert.match(overview, /步骤验证/);
  assert.match(overview, /预设可载入并运行/);
  assert.match(overview, /自由搭建 · 拓扑与手算核对/);
  assert.match(overview, /submission \? `得分 \$\{submission\.score\}%` : "尚未检验"/);
  assert.match(overview, /继续学习本章/);
  assert.match(overview, /开始学习本章/);
  assert.doesNotMatch(overview, /route-list|教材学习路线/);
  assert.match(styles, /\.chapter-link\s*\{[^}]*grid-template-columns:\s*44px\s+minmax\(0,\s*1fr\)\s+auto;/s);
  assert.match(styles, /\.chapter-link-number\s*\{[^}]*white-space:\s*nowrap;/s);
  assert.match(styles, /\.chapter-study-nav nav button\s*\{[^}]*grid-template-columns:\s*44px\s+minmax\(0,\s*1fr\)\s+auto;/s);
  assert.match(styles, /\.chapter-study-nav nav button span\s*\{[^}]*white-space:\s*nowrap;/s);
  assert.match(styles, /\.course-overview-grid\s*\{[^}]*grid-template-columns:\s*minmax\(190px,\s*220px\)\s+minmax\(480px,\s*1fr\)\s+minmax\(220px,\s*260px\)/s);
  assert.match(styles, /\.chapter-directory nav\s*\{[^}]*display:\s*flex;[^}]*overflow-x:\s*auto;/s);
  assert.match(styles, /\.chapter-status\s*\{[^}]*align-self:\s*flex-start;[^}]*flex:\s*0\s+0\s+auto;[^}]*white-space:\s*nowrap;/s);
});

test("course directory preview stays local until the single continue action is used", async () => {
  const [overview, workbench] = await Promise.all([
    component("CourseOverviewView.tsx"),
    readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(overview, /function previewChapter\(chapterId: string\)[\s\S]*onPreviewChapter\(chapterId\);/);
  assert.match(overview, /onClick=\{\(\) => previewChapter\(chapter\.id\)\}/);
  assert.match(overview, /onClick=\{\(\) => onContinueChapter\(selected\.id\)\}/);
  assert.match(workbench, /const \[selectedChapterId, setSelectedChapterId\] = useState<string \| null>\(null\)/);
  assert.match(workbench, /const navigate = useCallback\(\(next: string\) => \{\s*setSelectedChapterId\(null\);/);
  assert.match(workbench, /const listener = \(\) => \{\s*const nextRoute = currentRoute\(\);\s*setSelectedChapterId\(null\);/);
  assert.match(workbench, /onPreviewChapter=\{setSelectedChapterId\}/);
  assert.match(workbench, /onContinueChapter=\{\(chapterId\) => openChapter\(course, chapterId\)\}/);
});

test("course and chapter actions are wired to immutable learning-state handlers", async () => {
  const workbench = await readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8");
  for (const handler of ["startChapter", "submitChapterCheck", "completeChapter", "upsertMistake", "markMistakeReviewed"]) {
    assert.match(workbench, new RegExp(handler));
  }
  assert.match(workbench, /setState\(\(current\)\s*=>\s*submitChapterCheck/);
  assert.match(workbench, /setState\(\(current\)\s*=>\s*completeChapter/);
  assert.match(workbench, /课程进度已按章节同步/);
});

test("the circuit workbench calls graph, persistence, and real simulation engines", async () => {
  const [shell, graph, storage, digital, analog] = await Promise.all([
    readFile(new URL("../app/components/sandbox/CircuitWorkbench.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/circuit/graph.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/circuit/circuit-storage.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/circuit/digital-simulator.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/circuit/analog-simulator.ts", import.meta.url), "utf8"),
  ]);
  const implementation = [shell, graph, storage, digital, analog].join("\n");
  for (const operation of ["addComponent", "moveComponent", "removeComponent", "connect", "resetCircuit"]) assert.match(implementation, new RegExp(operation));
  for (const operation of ["saveCircuit", "loadCircuit", "copyStoredCircuit", "deleteCircuit"]) assert.match(implementation, new RegExp(operation));
  for (const operation of ["evaluateDigitalCircuit", "generateTruthTable", "sampleDigitalCircuit"]) assert.match(implementation, new RegExp(operation));
  for (const operation of ["solveAnalogDc", "simulateAnalogTransient"]) assert.match(implementation, new RegExp(operation));
  for (const label of ["保存电路", "载入", "复制电路", "清空画布", "删除", "实验目标", "载入实验预设", "返回教材章节"]) assert.match(shell, new RegExp(label));
  assert.match(shell, /getCircuitPreset/);
  assert.match(shell, /预设可载入并由当前求解器运行/);
  assert.match(shell, /仅支持自由搭建、拓扑核对与手算记录/);
  assert.match(shell, /onPointerDown|onDragStart|draggable/);
  assert.match(shell, /onDoubleClick/);
  assert.match(shell, /双击元件保持选中/);
  for (const label of ["旋转 90°", "水平翻转", "缩小", "放大", "重置缩放"]) assert.match(shell, new RegExp(label));
  for (const helper of ["findAvailablePosition", "separateOverlappingComponents"]) assert.match(shell, new RegExp(helper));
  assert.match(shell, /is-connected/);
  assert.match(shell, /条连线/);
  assert.match(shell, /onClick|onChange/);
  assert.doesNotMatch(shell, /预设动画|静态仿真图/);
});

test("real pointer double-click creates the only sticky component selection", async () => {
  const shell = await readFile(new URL("../app/components/sandbox/CircuitWorkbench.tsx", import.meta.url), "utf8");
  const placeComponent = shell.slice(shell.indexOf("function placeComponent"), shell.indexOf("function handlePort"));
  const startDrag = shell.slice(shell.indexOf("function startDrag"), shell.indexOf("function handlePointerMove"));
  assert.doesNotMatch(placeComponent, /setSelectedComponentId/,
    "placing or single-clicking a component must not imitate a locked selection");
  assert.match(startDrag, /event\.currentTarget\.setPointerCapture\(event\.pointerId\)/,
    "the component must own pointer capture so the browser keeps double-click targeted to it");
  assert.doesNotMatch(startDrag, /svgRef\.current\?\.setPointerCapture/);
  assert.match(shell, /aria-pressed=\{selectedComponentId === component\.id\}/);
  assert.match(shell, /event\.preventDefault\(\);\s*setCircuit\(\(current\) => removeComponent\(current, selectedComponentId\)\)/,
    "Backspace and Delete must not navigate away before deleting the selected component");
});

test("wires keep the original single curve while terminal state remains readable", async () => {
  const [shell, styles] = await Promise.all([
    readFile(new URL("../app/components/sandbox/CircuitWorkbench.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/sandbox/workbench.css", import.meta.url), "utf8"),
  ]);
  assert.match(shell, /<path className="cw-wire" d=\{`M \$\{a\.x\} \$\{a\.y\} C /);
  assert.doesNotMatch(shell, /createWirePath|cw-wire-group|cw-wire-hit|cw-wire-halo/);
  assert.match(styles, /\.cw-wire\s*\{[^}]*stroke:\s*#b9bec4;[^}]*pointer-events:\s*stroke;/s);
  assert.doesNotMatch(styles, /cw-wire-group|cw-wire-hit|cw-wire-halo/);
  assert.match(shell, /cw-port-status-ring/);
  assert.match(shell, /is-connected/);
});

test("global search and JSON safeguards remain real interactions", async () => {
  const [workbench, shell] = await Promise.all([
    readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8"),
    component("AppShell.tsx"),
  ]);
  assert.match(workbench, /course\.chapters/);
  assert.match(workbench, /chapter\.sections/);
  assert.match(workbench, /chapter\.experiments/);
  assert.match(workbench, /section\.formula/);
  assert.match(workbench, /section\.variables/);
  assert.match(workbench, /downloadLearningBackup/);
  assert.match(workbench, /restoreLearningBackup/);
  assert.match(workbench, /导入会覆盖当前浏览器中的学习记录/);
  assert.match(shell, /搜索课程、章节、知识讲解或实验/);
  assert.match(shell, /onSearchSelect\(result\)/);
  assert.match(shell, /导入 JSON/);
  assert.match(shell, /导出 JSON/);
  assert.match(shell, /accept="application\/json,\.json"/);
});

test("appearance defaults to the system and persists explicit light or dark choices", async () => {
  const [layout, theme, workbench, shell, styles] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/theme.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8"),
    component("AppShell.tsx"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(theme, /themePreferences\s*=\s*\["system",\s*"dark",\s*"light"\]/);
  assert.match(theme, /THEME_STORAGE_KEY\s*=\s*"personal-workbench-theme"/);
  assert.match(layout, /localStorage\.getItem/);
  assert.match(layout, /matchMedia\("\(prefers-color-scheme: dark\)"\)/);
  assert.match(layout, /dangerouslySetInnerHTML=\{\{ __html: themeInitializationScript \}\}/);
  assert.match(workbench, /themePreferenceRef\s*=\s*useRef<ThemePreference>\("system"\)/);
  assert.match(workbench, /mediaQuery\.addEventListener\("change",\s*syncSystemTheme\)/);
  assert.match(workbench, /localStorage\?\.setItem\(THEME_STORAGE_KEY,\s*next\)/);
  assert.match(shell, /外观模式：\$\{themeLabels\[themePreference\]\}/);
  assert.match(shell, /onThemePreferenceCycle/);
  assert.match(styles, /light-dark\(/);
  assert.match(styles, /--accent-contrast:/);
});

test("mistake records show origin and keep the next review date visible and editable", async () => {
  const mistakes = await component("ChapterMistakesView.tsx");
  assert.match(mistakes, /下次复习/);
  assert.match(mistakes, /nextReviewDate/);
  assert.match(mistakes, /type="date"/);
  assert.match(mistakes, /标记已复盘/);
  assert.match(mistakes, /检验自动收录/);
  assert.match(mistakes, /手动记录/);
  assert.match(mistakes, /示例/);
});
