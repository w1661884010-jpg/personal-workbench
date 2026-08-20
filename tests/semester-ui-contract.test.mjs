import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the semester site exposes all five required product surfaces", async () => {
  const workbench = await readFile(new URL("../app/components/LearningWorkbench.tsx", import.meta.url), "utf8");
  for (const label of ["学习总览", "三门课程", "知识卡片", "练习与错题", "课程连接"]) {
    assert.match(workbench, new RegExp(label));
  }
  assert.match(workbench, /DashboardView/);
  assert.match(workbench, /CourseOverviewView/);
  assert.match(workbench, /KnowledgeCardView/);
  assert.match(workbench, /MistakesView/);
  assert.match(workbench, /ConnectionsView/);
});
test("the primary workflows are wired to real handlers", async () => {
  const files = await Promise.all([
    "DashboardView.tsx",
    "KnowledgeCardView.tsx",
    "MistakesView.tsx",
    "AppShell.tsx",
  ].map((name) => readFile(new URL(`../app/components/semester/${name}`, import.meta.url), "utf8")));
  const source = files.join("\n");
  assert.match(source, /onToggleTask/);
  assert.match(source, /onMasteryChange/);
  assert.match(source, /onReviewed/);
  assert.match(source, /onSaveMistake/);
  assert.match(source, /onMarkMastered/);
  assert.match(source, /onExport/);
  assert.match(source, /onImport/);
  assert.match(source, /onSearchSelect/);
});

test("knowledge cards render every required learning field", async () => {
  const card = await readFile(new URL("../app/components/semester/KnowledgeCardView.tsx", import.meta.url), "utf8");
  for (const label of ["要解决的问题", "前置知识", "核心概念", "公式及变量解释", "最小示例", "常见错误", "自测题", "学习证据", "掌握状态", "标记为已复习"]) {
    assert.match(card, new RegExp(label));
  }
});
