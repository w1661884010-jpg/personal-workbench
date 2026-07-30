# 自动化基础学习台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建并发布一个本地优先、无需登录的 F28335/CCS 学习执行台，完成今日学习闭环、证据约束、备份恢复和 Obsidian Markdown 导出。

**Architecture:** 使用 Sites 的 vinext/React 骨架。静态学习内容放在独立数据文件中；用户状态由一个带 `schemaVersion` 的浏览器本地对象管理；页面组件只消费数据与状态接口。五个一级页面由同一个客户端应用壳切换，核心功能不依赖后端。

**Tech Stack:** React 19、TypeScript、vinext、CSS、浏览器 localStorage、Blob/File API、Node 内置测试。

## Global Constraints

- 一级导航固定为：今日学习、学习路线、知识与开发板、学习记录、以后再学。
- 首页恰好一个主问题、最多三项任务、一个主操作。
- 主线固定为六个 F28335/CCS 主题，不增加独立 C 语言阶段。
- `apply` 掌握等级必须至少关联一条完整证据。
- V1 不实现登录、后端、数据库、AI 问答、真实设备控制或多人协作。
- JSON 导入采用完整替换；失败时不得部分覆盖现有状态。
- Markdown 使用 UTF-8、普通标题和简洁 YAML，默认文件名为 `YYYY-MM-DD.md`。

---

## File Map

- `app/page.tsx`：页面入口，只挂载学习台应用。
- `app/layout.tsx`：中文页面元数据、动态图像分享元数据和根布局。
- `app/globals.css`：设计令牌、桌面/移动布局、控件与状态样式。
- `app/components/LearningWorkbench.tsx`：客户端状态、导航与业务流程编排。
- `app/components/Icons.tsx`：一致的可访问 SVG 图标。
- `app/components/views/*.tsx`：五个一级页面。
- `app/data/*.ts`：路线、主题、信号路径和延期内容。
- `app/lib/model.ts`：类型、默认状态、迁移与完整校验。
- `app/lib/storage.ts`：本地保存、备份、恢复与下载。
- `app/lib/markdown.ts`：Obsidian 每日 Markdown 生成。
- `tests/model.test.mjs`：核心业务约束与导出测试。
- `README.md`：本地运行、备份恢复、Obsidian 对接及范围说明。

### Task 1: 数据模型和静态内容

**Files:**
- Create: `app/lib/model.ts`
- Create: `app/data/roadmap.ts`
- Create: `app/data/board.ts`
- Create: `app/data/deferred.ts`
- Test: `tests/model.test.mjs`

**Interfaces:**
- Produces: `UserState`, `MasteryLevel`, `createDefaultState()`, `validateBackup()`, `setMastery()`.

- [ ] 写测试：任务不超过三项、无证据不能升级为“能应用”、无效 schema 与损坏外键被拒绝。
- [ ] 运行 `node --test tests/model.test.mjs`，确认先失败。
- [ ] 实现模型、六个主题、五条信号路径和延期内容。
- [ ] 再运行测试并确认通过。

### Task 2: 今日学习闭环和五页应用壳

**Files:**
- Modify: `app/page.tsx`
- Create: `app/components/LearningWorkbench.tsx`
- Create: `app/components/Icons.tsx`
- Create: `app/components/views/TodayView.tsx`
- Create: `app/components/views/RoadmapView.tsx`
- Create: `app/components/views/KnowledgeView.tsx`
- Create: `app/components/views/RecordsView.tsx`
- Create: `app/components/views/DeferredView.tsx`

**Interfaces:**
- Consumes: Task 1 的内容数据和 `UserState`。
- Produces: 可导航、可编辑、可验证的五页本地应用。

- [ ] 实现桌面左侧导航和移动端底部导航。
- [ ] 实现首页唯一主问题、三项任务、遗留问题、下一步和“继续学习”。
- [ ] 实现路线主题选择、掌握等级和证据约束。
- [ ] 实现信号路径切换、学习记录表单和延期说明。
- [ ] 验证每项常用操作不超过两次点击。

### Task 3: 持久化、备份恢复和 Markdown

**Files:**
- Create: `app/lib/storage.ts`
- Create: `app/lib/markdown.ts`
- Modify: `app/components/LearningWorkbench.tsx`
- Modify: `app/components/views/RecordsView.tsx`
- Test: `tests/model.test.mjs`

**Interfaces:**
- Produces: `loadState()`, `saveState()`, `downloadBackup()`, `restoreBackup()`, `buildDailyMarkdown()`.

- [ ] 为本地日期、JSON 往返、Markdown 固定章节和 YAML 转义写测试。
- [ ] 实现 400ms 自动保存以及“保存中/已保存/保存失败”文字反馈。
- [ ] 实现 JSON 备份、导入预检、覆盖确认和先备份入口。
- [ ] 实现 UTF-8 每日 Markdown 下载。
- [ ] 实现删除确认、导入成功/失败和导出成功反馈。

### Task 4: 视觉、响应式和元数据

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Delete: `app/_sites-preview/*`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: `docs/design/*-concept.png` 视觉规范。

- [ ] 落地冷白工程笔记本视觉系统、导航、任务表格、信号路径和表单控件。
- [ ] 完成 1440px 桌面与 390px 手机布局，触控目标至少 44px。
- [ ] 添加中文元数据、Open Graph 图和无障碍标签。
- [ ] 移除 starter 预览和未使用依赖。
- [ ] 补充本地运行、备份恢复、Obsidian 放置路径及 V1 不做项。

### Task 5: 验证与发布

**Files:**
- Modify: `.openai/hosting.json`
- Create: `public/og.png`

- [ ] 运行 `node --test tests/model.test.mjs`。
- [ ] 运行 `npm run build` 并修复全部构建错误。
- [ ] 在桌面与手机尺寸检查首屏、核心闭环、刷新持久化、备份恢复和 Markdown。
- [ ] 将验证后的精确源提交、推送、打包并保存 Sites 版本。
- [ ] 私有部署并检查生产状态。

## Self-Review

- Spec coverage: 规划中的 12 条验收标准分别由 Task 1–5 覆盖。
- Placeholder scan: 无 TBD、TODO 或“稍后实现”。
- Type consistency: 页面、存储、校验和导出统一使用 `UserState`；主题和记录均使用稳定 ID。
