# Dark Sites and GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将“电路自习室”改造成高对比、长时间阅读友好的暗色工程笔记界面，同时发布到 Sites，并建立独立的 GitHub 私有仓库和 GitHub Pages 网站。

**Architecture:** 当前 Sites 工程继续保留 Vinext/Vite 架构和 `.openai/hosting.json`；暗色改造只触及主题、元数据和视觉资产，不改变课程与 localStorage 模型。GitHub 交付使用独立的纯 Vite React 静态快照，复用同一套组件、数据、存储与 CSS，通过 `base` 和 Actions 构建部署到项目 Pages 子路径。

**Tech Stack:** React 19、TypeScript、Vite 8、Vinext、GitHub Actions、GitHub Pages、Sites。

## Global Constraints

- GitHub 账号：`w1661884010-jpg`。
- GitHub 仓库：`semester-electronics-learning-site`，可见性必须为 private。
- GitHub Pages 目标：`https://w1661884010-jpg.github.io/semester-electronics-learning-site/`。
- 本地仓库：`C:\Users\Lenovo\Documents\codex_projects\semester-electronics-learning-site`。
- 保留全部课程内容、交互、localStorage schema 和 JSON 导入导出。
- Sites 与 GitHub Pages 都必须使用相同暗色视觉系统。
- 不修改全局 Git `safe.directory`，不混入当前仓库已有的未跟踪用户文件。

---

### Task 1: 暗色设计基线与视觉资产

**Files:**
- Modify: `app/globals.css`
- Modify: `public/og.png`

**Interfaces:**
- Consumes: 当前 Dashboard 桌面和移动布局、现有深蓝/青绿/橙色语义。
- Produces: 暗色设计令牌与可用于 Sites/GitHub 的暗色社交预览。

- [ ] **Step 1: 生成完整桌面 Dashboard 和移动 Dashboard 暗色概念图**

  保留现有信息架构、文案和唯一主按钮；背景使用深海军蓝/石墨灰，正文使用冷白，青绿色为主操作，橙色为到期提醒，不增加装饰性渐变。

- [ ] **Step 2: 从概念图锁定主题令牌**

  记录背景、侧栏、表面、边框、正文、次要文本、青绿、橙色、阴影、焦点环和图表颜色；同时记录桌面三栏与移动底栏不变。

- [ ] **Step 3: 改写 CSS 主题并保留响应式行为**

  将所有浅色硬编码替换为暗色令牌，覆盖输入框、对话框、知识图示、进度条、错题状态、复习警告、滚动条与打印外观；不改变组件状态逻辑。

- [ ] **Step 4: 生成并接入暗色社交预览图**

  社交图必须包含准确标题“电路自习室”和副文案“本学期电子类课程个人学习站点”，尺寸 1200×630，并通过 `app/layout.tsx` 继续引用 `/og.png`。

### Task 2: 主题回归测试与真实浏览器验收

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/semester-ui-contract.test.mjs`

**Interfaces:**
- Consumes: 暗色 CSS 和现有五页面交互。
- Produces: 防止浅色背景回归、保留功能契约的测试证据。

- [ ] **Step 1: 先更新主题契约测试并确认旧主题失败**

  测试应要求 `color-scheme: dark`、暗色根背景、青绿主按钮和橙色提醒，同时继续拒绝装饰性渐变。

- [ ] **Step 2: 运行测试、lint 和生产构建**

  Run: `npm test`, `npm run lint`, `npm run build`。

  Expected: 34 项及新增主题断言全部通过，0 跳过；lint 和构建退出码均为 0。

- [ ] **Step 3: 浏览器验收核心流程**

  Flow: Dashboard 加载 → 点击一项今日任务 → 打开知识卡 → 修改掌握状态 → 返回 Dashboard 查看进度同步。

- [ ] **Step 4: 桌面与移动视觉验收**

  验证 1440×900 和 390×844 无横向溢出、无框架错误覆盖、控制台无 error/warn；将最新截图与暗色概念图一起用 `view_image` 比较。

### Task 3: 发布暗色版本到 Sites

**Files:**
- Modify: `.openai/hosting.json` only if Sites returns a different project id; otherwise preserve.

**Interfaces:**
- Consumes: 已验证的当前提交和 `dist`。
- Produces: 同一 Sites 项目的新生产版本。

- [ ] **Step 1: 提交暗色逻辑变更**

  Stage only: CSS、暗色预览图、测试、计划与相关元数据；不提交 `checklist.md` 和 `context-notes.md` 的既有内容。

- [ ] **Step 2: 推送精确提交到 Sites 源仓库并打包**

  使用命令级凭据和 `scripts/package-site.sh`，归档必须包含 `dist/server/index.js` 与 `dist/.openai/hosting.json`。

- [ ] **Step 3: 保存并部署 Sites 版本**

  复用 `appgprj_6a6b44eb3800819193f62dfcff4da6c9`；用户本轮明确选择 Sites 并要求移植，因此允许部署到当前 public 访问级别。

### Task 4: 创建独立静态 Vite 本地仓库

**Files:**
- Create: `C:\Users\Lenovo\Documents\codex_projects\semester-electronics-learning-site\index.html`
- Create: `...\src\main.tsx`
- Create: `...\src\components/**`
- Create: `...\src\data\semester.ts`
- Create: `...\src\lib\semester-model.ts`
- Create: `...\src\lib\semester-storage.ts`
- Create: `...\src\globals.css`
- Create: `...\vite.config.ts`
- Create: `...\package.json`
- Create: `...\tsconfig.json`
- Create: `...\eslint.config.mjs`
- Create: `...\.github\workflows\pages.yml`
- Create: `...\README.md`

**Interfaces:**
- Consumes: 当前 React 客户端组件、课程数据、本地存储和暗色 CSS。
- Produces: 不依赖服务端渲染、能从 Pages 子路径加载的静态 SPA。

- [ ] **Step 1: 创建明确目标目录并复制必要源码**

  只复制 `LearningWorkbench`、`Icons`、`semester` 组件、semester 数据/模型/存储、CSS、favicon 和 og 图；不复制 Sites 配置、旧课程遗留文件或构建输出。

- [ ] **Step 2: 建立纯 Vite 入口**

  `src/main.tsx` 使用 `createRoot` 渲染 `<LearningWorkbench />`，`vite.config.ts` 设置 `base: "/semester-electronics-learning-site/"`。

- [ ] **Step 3: 建立 Pages Actions**

  工作流在 push 到 `main` 时执行 `npm ci`、`npm test`、`npm run lint`、`npm run build`，再用 `actions/configure-pages@v5`、`actions/upload-pages-artifact@v4` 和 `actions/deploy-pages@v4` 发布 `dist`。

- [ ] **Step 4: 初始化本地 Git 仓库并验证**

  `git init -b main`，显式暂存交付文件，提交 `feat: publish dark semester electronics learning site`；运行测试、lint 与静态构建。

### Task 5: 创建 GitHub 私有仓库并发布 Pages

**Files:**
- No additional local source files unless GitHub Pages reports a build-specific fix.

**Interfaces:**
- Consumes: 已验证本地静态仓库的 `main` 提交。
- Produces: 私有 GitHub 仓库与公开项目 Pages URL。

- [ ] **Step 1: 创建私有仓库并推送**

  Run: `gh repo create w1661884010-jpg/semester-electronics-learning-site --private --source <local-path> --remote origin --push`。

- [ ] **Step 2: 启用 Actions 作为 Pages 构建源**

  使用 GitHub Pages API 设置 `build_type: workflow`；如果账号套餐不支持私有仓库 Pages，保留私有仓库并明确报告套餐阻塞，不把仓库擅自改为 public。

- [ ] **Step 3: 等待并核验工作流**

  检查最新 Actions 运行完成且结论为 success，再访问 `https://w1661884010-jpg.github.io/semester-electronics-learning-site/`，核对标题、暗色首屏、静态资源和控制台。

### Task 6: 收尾记录

**Files:**
- Modify: `README.md`
- Modify: `checklist.md`
- Modify: `context-notes.md`

**Interfaces:**
- Consumes: Sites 和 GitHub Pages 实际结果。
- Produces: 可重复启动、构建和发布的交付说明。

- [ ] **Step 1: 更新 README 与检查点**

  写明暗色主题、Sites URL、本地仓库、GitHub 私有仓库、Pages URL、启动命令和验证结果。

- [ ] **Step 2: 确认无未解释失败**

  当前 Sites 仓库只允许既有用户记录文件保持未跟踪；新 GitHub 仓库必须为干净工作树。任何 Pages 套餐或权限失败必须明确暴露。
