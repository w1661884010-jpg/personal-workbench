# Notebook 实践页实施计划

> **For agentic workers:** 按任务顺序在当前会话内执行；每项完成后更新根目录 `checklist.md` 与 `context-notes.md`。

**Goal:** 将信号与系统的 6 个 Notebook 实验从一次性提示改为可打开、可逐步勾选、可返回教材章节的静态实践页。

**Architecture:** 继续使用纯 HTML/CSS/JS。`index.html` 提供独立的 `notebookRoot`；`app.js` 让现有视图状态支持 `notebook`，并从 `courses.js` 读取实验目标、步骤与预期证据；勾选状态仅保存在当前页面内存中。

**Tech Stack:** 原生 DOM API、现有 CSS 令牌、Node 内置测试、Playwright CLI。

## Global Constraints

- 只修改 `personal-workbench-shell`，不修改 3000 原站。
- 本阶段不改数字/模拟工作台、不加入顶栏 Notebook 入口、不加入依赖。
- Notebook 勾选状态不写入 `localStorage`，刷新后清空。
- 保留当前正文、搜索、章节切换、检验与工作台行为。
- 项目没有 Git 元数据，本阶段不执行提交。

---

### Task 1：锁定 Notebook 实践页行为契约

**Files:**
- Create: `tests/notebook-practice-page.test.mjs`

**Interfaces:**
- Consumes: `courses.js` 中 `experiment.workbench === "notebook"` 的 6 条实验数据。
- Produces: 对挂载点、打开按钮、视图分支、步骤勾选和返回按钮的静态契约测试。

- [x] **Step 1:** 写入测试，断言 `#notebookRoot`、`openNotebookExperiment`、`renderNotebookView`、`notebookChecks` 和「打开实验」存在，同时旧的「查看使用方式」提示路径不存在。
- [x] **Step 2:** 运行 `node --test tests/notebook-practice-page.test.mjs`，确认在实现前失败。

### Task 2：实现 Notebook 视图与步骤交互

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `{ id, title, goal, steps, expected, limitation }` 实验对象与当前课程、章节。
- Produces: `openNotebookExperiment(experiment, chapter)`、`renderNotebookView(course, chapter, experiment)`，以及 `setView("notebook")` 分支。

- [x] **Step 1:** 在工作台挂载点前加入 `<section id="notebookRoot" class="notebook-root" hidden></section>`。
- [x] **Step 2:** 用 `textContent` 构建标题、来源、目标、步骤、完成计数、预期证据、边界说明和返回按钮。
- [x] **Step 3:** 用 `notebookChecks[experiment.id]` 保存布尔数组；步骤按钮更新 `is-done`、`aria-pressed` 与完成计数。
- [x] **Step 4:** 扩展 `setView`，仅数字/模拟分支依赖 `PrototypeWorkbench`，Notebook 分支不挂载或卸载 React 工作台。
- [x] **Step 5:** 复用既有令牌补充响应式样式，不改变教材正文与工作台样式。

### Task 3：回归和真实浏览器验收

**Files:**
- Modify: `checklist.md`
- Modify: `context-notes.md`

**Interfaces:**
- Consumes: `http://localhost:3010/`。
- Produces: 自动测试、静态检查、桌面与移动端截图及交互证据。

- [x] **Step 1:** 运行 `node --test tests/*.test.mjs` 与 `node --check app.js`。
- [x] **Step 2:** 在 1440×900 验证「信号与系统 → 连续与离散信号观察 → 打开实验 → 勾选一步 → 返回教材章节」。
- [x] **Step 3:** 在 390×844 验证页面无横向溢出、步骤与返回按钮可用。
- [x] **Step 4:** 检查页面身份、空白页、错误覆盖层、控制台和既有数字工作台入口。

## 核验结论

- 主计划的阶段 A 与当前代码相符：Notebook 实验按钮仍停留在 toast，缺少独立承载页。
- 现有数据足以生成静态实践页，不需要新增 schema 或依赖。
- 「复制表达式」缺少独立表达式字段，若从自然语言步骤中猜测公式会扩大范围，因此本阶段不做。
- 顶栏 Notebook 入口在主计划中标为可选，本阶段不做；入口仍由各章节的实验卡提供。
