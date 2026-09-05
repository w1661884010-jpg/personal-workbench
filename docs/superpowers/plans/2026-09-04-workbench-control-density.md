# 工作台顶部控制区密度优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 减少超宽屏工作台顶部控制区的无效留白，使运行、实验目标和电路存档三组比例更稳定、控件对齐更紧凑。

**Architecture:** 不修改原站 React 组件及 bundle DOM，只在副本 `styles.css` 增加 ≥1500px 的宽屏布局覆盖。运行区使用固定宽度并让按钮等分；实验区把操作按钮与下拉框放在同一行；存档区把名称输入与本地电路选择改为弹性宽度，其余操作保持两行对齐。

**Tech Stack:** CSS Grid/Flexbox、Node 内置测试、Playwright CLI。

## Global Constraints

- 只修改 3010 副本，不修改 `personal-workbench-sites` 原站或重新构建工作台 bundle。
- 不删除、重命名或改变任何按钮、输入框、下拉框及其行为。
- 宽屏优化只在 `min-width: 1500px` 生效，保留已验证的普通桌面和 ≤760px 移动端布局。
- 沿用既有颜色、字体、边框和控件高度，不引入新依赖。
- 当前目录没有 Git 元数据，因此不提交。

---

### Task 1: 重排宽屏顶部控制区并验证

**Files:**
- Modify: `styles.css`
- Modify: `tests/unified-workbench-switching.test.mjs`
- Modify: `checklist.md`
- Modify: `context-notes.md`

**Interfaces:**
- Consumes: `.circuit-workbench`、`.cw-heading`、`.cw-experiment-strip`、`.cw-storage-bar` 及其既有子节点顺序。
- Produces: `@media (min-width: 1500px)` 下的紧凑三段网格；不改变 DOM 或 JavaScript 接口。

- [x] **Step 1: 写入宽屏密度行为测试**

在 `tests/unified-workbench-switching.test.mjs` 中断言宽屏规则包含 220px 运行列、实验按钮同排、存档弹性主列与输入控件全宽。

- [x] **Step 2: 运行测试确认旧样式按预期失败**

Run: `node --test tests/unified-workbench-switching.test.mjs`

Expected: 新增测试 FAIL，指出缺少 `@media (min-width: 1500px)` 宽屏密度规则；既有测试结果单独记录，不把外部新增功能导致的失败归入本轮。

- [x] **Step 3: 实现最小 CSS 覆盖**

```css
@media (min-width: 1500px) {
  .workbench-root .circuit-workbench {
    grid-template-columns: 220px minmax(0, 1.08fr) minmax(0, .92fr);
  }

  .workbench-root .cw-heading .cw-run-controls {
    width: 100%;
  }

  .workbench-root .cw-heading .cw-run-controls button {
    flex: 1 1 0;
  }

  .workbench-root .cw-experiment-strip > label { grid-area: 1 / 1; }
  .workbench-root .cw-experiment-strip .cw-experiment-actions { grid-area: 1 / 2; }
  .workbench-root .cw-experiment-strip .cw-capability { grid-area: 2 / 1 / 3 / -1; }

  .workbench-root .cw-storage-bar {
    grid-template-columns: minmax(240px, 1fr) repeat(3, auto);
  }

  .workbench-root .cw-storage-bar .cw-name-field {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .workbench-root .cw-storage-bar .cw-name-field input,
  .workbench-root .cw-storage-bar select {
    width: 100%;
    min-width: 0;
    max-width: none;
  }
}
```

- [x] **Step 4: 运行专项与完整自动测试**

Run: `node --test tests/unified-workbench-switching.test.mjs`

Run: `node --test tests/*.test.mjs`

Expected: 本轮新增测试通过；若完整测试仍有修改前已存在的失败，逐项报告且不静默宣称全绿。

- [x] **Step 5: 完成真实浏览器验收**

Flow: `http://localhost:3010/` → 打开工作台 → 2037×900 检查三段尺寸与对齐 → 切换模拟工作台 → 390×844 检查无横向溢出。

Expected: 宽屏输入区明显扩展、实验操作同排、运行按钮等分；数字/模拟切换正常；移动端 `scrollWidth === clientWidth`；无新增相关控制台错误。

## Self-Review

- **Spec coverage:** 直接处理截图中的空白和比例问题；不扩大到画布、顶栏或功能改造。
- **Placeholder scan:** 无 TBD、TODO 或未定义实现步骤。
- **Interface consistency:** 只依赖已读取的稳定 class 与子节点顺序；React/JavaScript 接口不变。
