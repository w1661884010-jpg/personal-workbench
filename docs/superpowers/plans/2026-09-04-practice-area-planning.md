# 实践功能区规划（Notebook · 三科实践布局 · 统一工作台）

> **For agentic workers:** 本计划为**分期规划**，实施时按期拆分为独立 sub-plan 执行。每期结束都是可运行、可验证的状态。
> 阶段状态：**阶段 A、B 已实施并验证；阶段 C 已完成顶栏单一工作台入口，其余内容尚未实施**。

**Goal:** 把三个科目的实践部分整理为统一入口：Notebook 实验有可用的承载页，数字/模拟工作台合并为单一界面并可在两者间自由切换。

**Architecture:** 沿用现有零依赖架构（纯 HTML/CSS/JS + 打包 bundle）。实践区分为两层：
1. **实践中心（shell 层）**：`app.js` 统一管理"当前实践视图"状态，提供 Notebook 视图与工作台视图两个挂载点；
2. **统一工作台（bundle 层）**：重构 `workbench-entry.tsx` 为带 `kind` 切换的状态机，复用同一 `CircuitWorkbench` 实例（React 已用 `key={kind}` 区分，切换即换实例，代价极小），顶部加**数字/模拟分段切换器**。

**Tech Stack:** 原生 JS（app.js）+ esbuild 打包的 React bundle（workbench-entry.tsx + CircuitWorkbench + lib/circuit）+ KaTeX。无包管理、无测试框架——验证一律用 playwright-cli + 截图。

## Global Constraints

- 不修改 `personal-workbench-sites`（原站）任何文件；只读其源码作参考。
- 保留 `workbench.bundle.js` 作为唯一工作台运行时入口（重新生成用 `node build-workbench.mjs`）。
- 所有 UI 遵循既有语言：圆角（8–14px）、无重边框、`--accent`/`--panel` 令牌、40px 顶栏气泡、8px 间距节奏、150px 控件定宽。
- Notebook 实验在原型中**必须有一个可实际打开的页面**（不再只有 toast）——这是本次规划与"原站行为"的唯一有意分歧，需用户确认（见决策点 D1）。
- 数字/模拟切换不丢失当前电路草稿：切换时把当前 kind 的草稿暂存内存（不持久化，刷新即失）。

---

## 现状盘点（截止 2026-09-04）

| 科目 | 工作台实验数 | Notebook 实验数 | 承载页 |
|---|---|---|---|
| 信号与系统 | 0 | 6 | ❌ 仅 toast |
| 数字电子技术 | 8 | 0 | ✅ 数字工作台 |
| 模拟电子技术 | 11 | 0 | ✅ 模拟工作台 |

**关键事实：** `CircuitWorkbench` 数字/模拟只是 `kind` prop 不同——palette、运行按钮、仪器区（数字=逻辑分析仪/真值表，模拟=表计/示波器）三处按 kind 分支，其余（画布交互、连线、参数编辑、存储）完全共用。**"统一界面 = 在工作台内加 kind 切换器 + 复用同一容器"**，不需要第二套组件。

---

## 阶段 A：Notebook 实验页（最小承载）

**目标：** 信号课 6 个 notebook 实验可打开一个"实验步骤页"，替代仅 toast。

**决策点 D1（需用户拍板）：** Notebook 页是什么形态？
- **A1 静态步骤页（推荐，零新依赖）**：新视图 `notebookView`，渲染当前实验的目标/步骤/预期证据，步骤可勾选（checkbox，内存态），配 KaTeX 公式渲染与"复制表达式"按钮。原文案中"计算请使用课程目录中的 Notebook"改为"在本页完成步骤勾选"。
- **A2 外链跳转**：跳外部 Notebook 部署（如有 URL）。
- **A3 保持 toast**（原站行为，此规划作废）。

**假定 A1，任务分解：**

### Task A1：视图切换器扩展（`app.js`）
- **Files:** `app.js`（`setView` 已支持 `"digital" | "analog" | null` → 扩展 `"notebook"`）
- **Interfaces:** `setView(wbKind)` 签名不变，`activeWorkbench` 语义扩为 `view = null | "digital" | "analog" | "notebook"`；`syncWorkbenchButtons()` 增加 notebook 键
- **Steps:**
  1. `index.html` 工作台挂载点旁加 `<div id="notebookRoot" class="notebook-root" hidden></div>`
  2. `app.js`：`setView` 增加 `notebookRoot` 分支（与 workbenchRoot 对称：淡出→渲染→淡入）
  3. `openNotebookExperiment(experiment, chapter)`：记录 `activeNotebook` 状态 `{experimentId, chapterId}`，调 `renderNotebookView()`
  4. 实验卡按钮改文案：notebook 实验 →「打开实验」→ 调 `openNotebookExperiment` 而非 toast
  5. 验证：playwright 打开信号绪论 → 点「打开实验」→ `#notebookRoot` 显示，`#workbenchRoot` 隐藏

### Task A2：notebook 步骤页渲染（`app.js` 新增函数）
- **Files:** `app.js` 新增 `renderNotebookView(course, chapter, experiment)`
- **Interfaces:** 渲染元素：标题 `h1`（实验名）、`p.card-meta`（课程·章号）、目标、步骤 `<ol>`（每步带 `<button class="step-check">`勾选态 `is-done`）、预期证据、返回按钮「返回教材章节」（复用 `jumpToChapter`）
- **Steps:**
  1. 渲染骨架（复用 `appendContentGroup`/`textElement`）
  2. 勾选态 `notebookChecks[experimentId] = boolean[]`（内存）→ 按钮点击切换 `is-done` + 进度计数「已完成 n/m」
  3. `styles.css` 增加 `.notebook-root` 样式（复用 `.learning-section` 卡片语言）
  4. 验证：勾选流逝刷新后状态保持（页面未刷新）；返回按钮回正文

### Task A3：顶栏入口（可选）
- 顶栏加「Notebook」工具按钮（`data-view="notebook"`），点击进入最近一次 notebook 实验，无则默认第一个 notebook 实验。验证：按钮状态与 `syncWorkbenchButtons` 一致。

---

## 阶段 B：统一工作台（数字 ⇄ 模拟自由切换）

**目标：** 工作台内顶部加分段切换器「数字 | 模拟」，免退出即可互切；草稿按 kind 暂存。

### Task B1：entry 暴露切换接口（`workbench-entry.tsx`）
- **Files:** `workbench-entry.tsx`
- **Interfaces:** 新增 `setKind(kind: "digital" | "analog"): void`；`mount(container, options)` 保持兼容；内部状态 `currentKind`
- **Steps:**
  1. 新增 `setKind`：按 kind 懒创建独立 React root，切换时只改容器显隐
  2. 每个 root 分别执行 `scheduleBridge`，把各自 instruments 移入 inspector
  3. 退出工作台时统一还原 instruments 并卸载两个 root
  4. `build-workbench.mjs` 重跑 → 验证 bundle 产出

### Task B2：分段切换器（`index.html` + `app.js` + `styles.css`）
- **Files:** `index.html`（工作台挂载点容器内加切换条？——不行，bundle 内部 DOM。改：切换器放 `shell` 层的 `workbenchRoot` 上方独立 div）；`app.js`；`styles.css`
- **Interfaces:** `window.PrototypeWorkbench.setKind(kind)`；app.js 监听切换器点击 → `setView(kind)`（若已在工作台则只调 `setKind`）
- **Steps:**
  1. `index.html`：`workbenchRoot` 容器 `display:grid`，内嵌 `<nav class="kind-switcher">`（在 React 容器外、同一 wrapper 内）——**注意**：React `createRoot(container)` 会清空 container 内非 React DOM！因此改为 `workbenchRoot` 外套 `workbench-stage` div，切换器作为 stage 子元素，React mount 到 stage 内的 `workbench-mount` 子 div
  2. `styles.css`：`.kind-switcher` 分段控件（两个胶囊，`is-active` 描边，与顶栏语言一致，40px）
  3. `app.js`：circuit → circuit 直接调用 `PrototypeWorkbench.setKind(kind)`；切换时 `syncKindSwitcher()`
  4. 验证：数字台 → 点「模拟」→ 标题/palette/仪器区全变；再点「数字」回；两类画布草稿分别保留

### Task B3：草稿暂存（`workbench-entry.tsx`）
- **Interfaces:** `roots` 与 `sessionContainers` 按 `CircuitKind` 分开保存；`setKind` 不卸载非活动会话。
- **Steps（已核验并实施）:**
  1. 首次进入只挂载当前 kind，首次切到另一 kind 时再懒挂载第二个 root。
  2. 数字/模拟往返只切换 `hidden`，组件内部电路状态自然保留。
  3. 返回教材或刷新页面时统一卸载，会话草稿清空；已保存电路仍沿用原组件本地存储。

---

## 阶段 C：实践总入口优化（三科统一布局）

**目标：** 让"三科实践"入口一致：每科正文底部动手实验区 →「打开实践」进入各自承载视图；entry 不再按科目二分。

### Task C1：实验卡按钮文案统一
- 数字/模拟实验：「在工作台中打开」；notebook：「打开实验」
- `app.js` 实验卡渲染处 `experiment.workbench === "notebook" ? "打开实验" : "在工作台中打开"`

### Task C2：Dashboard（课程首页）快捷入口（如保留）
- 当前原型无 dashboard；规划：课程首页（若有）三个科目各一个「打开实践」按钮 → 信号=notebookView（最近实验）、数字/模拟=统一工作台（kind 预设）

---

## 决策点汇总（实施前需用户确认）

| 编号 | 问题 | 推荐 |
|---|---|---|
| D1 | Notebook 页形态：静态步骤页 / 外链 / 维持 toast | A1 静态步骤页（已实施：零依赖、可勾选） |
| D2 | 切换工作台时草稿：confirm 丢弃 / 自动暂存恢复 | 双 React 会话内存保留（阶段 B 已核验：不改原组件即可实现） |
| D3 | 分段切换器位置：工作台内顶部 / 顶栏 tool 按钮区 | 工作台内顶部（视觉就近、无需跨栏） |
| D4 | 阶段顺序：A→B→C 还是 B→A？ | 先 A（notebook 是功能缺口），后 B（体验增强），C 最后 |

## 自检（Self-Review）

- **覆盖度：** 三科实践现状 ✓（现状表）、notebook 承载 ✓（阶段A）、双工作台统一 ✓（阶段B）、实践入口一致性 ✓（阶段C）；D1-D4 决策点已列出。
- **占位符：** 无 TBD；Task B3 的 D2b 明确标注为"后续增强"并给出理由。
- **类型一致：** `setView`/`activeWorkbench` 签名在 A1 扩展后全篇一致；`PrototypeWorkbench.setKind` 在 B1 定义、B2/B3 消费，签名固定。
- **风险提示：** `workbench-entry.tsx` 的 instruments 桥接（moveInstrumentsIntoInspector）在 setKind 重挂载后必须重新执行——`scheduleBridge` 需在 setKind 后再次调用（B1 Step 1 已含）。
