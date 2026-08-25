import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = (name) => readFile(new URL(`../app/components/semester/${name}`, import.meta.url), "utf8");

test("V2 navigation exposes the three courses, two workbenches, records, and connections", async () => {
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
  assert.doesNotMatch(dashboard, /今日|明天|本周|周次|打卡|连续学习|todayTasks|currentWeek|studyMinutes/);
});

test("chapter study renders the fixed seven-stage workflow and enforces the check gate", async () => {
  const chapter = await component("ChapterStudyView.tsx");
  const labels = ["学习目标", "前置知识", "知识讲解", "典型例题", "动手实验", "章节检验", "复习总结"];
  let previous = -1;
  for (const label of labels) {
    const current = chapter.indexOf(`title="${label}"`);
    assert.ok(current > previous, `${label} must appear in the fixed order`);
    previous = current;
  }
  assert.match(chapter, /主线必学/);
  assert.match(chapter, /选择学习/);
  assert.match(chapter, /资料不足/);
  assert.match(chapter, /onOpenExperiment\(chapter,\s*experiment\.id\)/);
  assert.match(chapter, /disabled=\{!allAnswered\}/);
  assert.match(chapter, /disabled=\{!submitted\s*\|\|/);
  assert.match(chapter, /onSubmitCheck\(chapter,\s*answers\)/);
  assert.match(chapter, /onComplete\(chapter\.id\)/);
  assert.match(chapter, /分数只用于反馈，不设置额外及格线/);
});

test("course and chapter actions are wired to immutable V2 model handlers", async () => {
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
  for (const label of ["保存电路", "载入", "复制电路", "清空画布", "删除", "实验目标", "返回教材章节"]) assert.match(shell, new RegExp(label));
  assert.match(shell, /onPointerDown|onDragStart|draggable/);
  assert.match(shell, /onDoubleClick/);
  assert.match(shell, /双击元件保持选中/);
  for (const label of ["旋转 90°", "水平翻转", "缩小", "放大", "重置缩放"]) assert.match(shell, new RegExp(label));
  for (const helper of ["findAvailablePosition", "separateOverlappingComponents", "createWirePath"]) assert.match(shell, new RegExp(helper));
  assert.match(shell, /is-connected/);
  assert.match(shell, /条连线/);
  assert.match(shell, /onClick|onChange/);
  assert.doesNotMatch(shell, /预设动画|静态仿真图/);
});

test("global search and JSON safeguards remain real interactions", async () => {
  const [workbench, shell] = await Promise.all([
    readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8"),
    component("AppShell.tsx"),
  ]);
  assert.match(workbench, /course\.chapters/);
  assert.match(workbench, /chapter\.sections/);
  assert.match(workbench, /chapter\.experiments/);
  assert.match(workbench, /downloadLearningBackup/);
  assert.match(workbench, /restoreLearningBackup/);
  assert.match(workbench, /导入会覆盖当前浏览器中的学习记录/);
  assert.match(shell, /搜索课程、章节、知识讲解或实验/);
  assert.match(shell, /onSearchSelect\(result\)/);
  assert.match(shell, /导入 JSON/);
  assert.match(shell, /导出 JSON/);
  assert.match(shell, /accept="application\/json,\.json"/);
});

test("mistake records keep the next review date visible and editable", async () => {
  const mistakes = await component("ChapterMistakesView.tsx");
  assert.match(mistakes, /下次复习/);
  assert.match(mistakes, /nextReviewDate/);
  assert.match(mistakes, /type="date"/);
  assert.match(mistakes, /标记已复盘/);
});
