# 本学期电子类课程个人学习站点 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有学习工作台改造成可直接运行、无登录、本地优先的三门电子类课程个人学习站点，并闭合“任务—学习—练习—错题—掌握—复习”流程。

**Architecture:** 沿用仓库已经验证的 Vinext/Vite 入口和 React 19 运行链，`app/page.tsx` 仍只组合客户端学习站点。课程静态内容、可变学习状态、派生统计和浏览器持久化分离；页面导航采用本地视图状态，不引入服务端路由或数据库。

**Tech Stack:** React 19、TypeScript 5.9、Vite 8 / Vinext、CSS、浏览器 localStorage、Node test runner。

## Global Constraints

- 必须包含 Dashboard、课程总览、知识卡片、练习与错题、三门课程连接五类页面。
- 初始内容覆盖数字电子技术 6 章、模拟电子技术 8 章、信号与系统 8 章，并提供可操作的任务、错题和复习记录。
- 所有学习状态保存在版本化 localStorage 中，支持校验后的 JSON 导出和覆盖导入。
- 不加入账号、AI 问答、云同步、社交功能、服务器、数据库或复杂后台。
- 只有一个主要 CTA“继续学习”，其他操作使用次级或文字按钮。
- 浅色工程学习笔记风格；桌面三栏、移动端顶部工具栏和底部导航。

---

## File Map

- `app/data/semester.ts`：三门课程、22 个章节知识点和真实示例内容。
- `app/lib/semester-model.ts`：状态类型、默认状态、统计、筛选、状态校验与不可变更新。
- `app/lib/semester-storage.ts`：版本化 localStorage、JSON 导入导出和下载。
- `app/components/LearningWorkbench.tsx`：顶层状态、视图导航、搜索和导入覆盖确认。
- `app/components/semester/AppShell.tsx`：桌面侧栏、移动导航、顶部搜索及数据操作。
- `app/components/semester/StudyDiagram.tsx`：按知识点类型绘制电路、波形或流程示意图。
- `app/components/semester/DashboardView.tsx`：本周进度、课程状态、今日问题、最多三项任务和复习信息。
- `app/components/semester/CourseOverviewView.tsx`：三栏课程路线、章节完成度、记录和薄弱项。
- `app/components/semester/KnowledgeCardView.tsx`：完整知识卡、筛选、掌握状态、证据和复习操作。
- `app/components/semester/MistakesView.tsx`：筛选、新增、编辑和掌握错题。
- `app/components/semester/ConnectionsView.tsx`：五阶段课程连接流程图和职责说明。
- `app/components/semester/MistakeDialog.tsx`：有校验的错题表单。
- `app/globals.css`：设计令牌、布局、控件状态和响应式规则。
- `tests/semester-model.test.mjs`：统计同步、任务、掌握、复习、错题和校验意图。
- `tests/semester-storage.test.mjs`：持久化、损坏数据回退和 JSON 往返。
- `tests/semester-ui-contract.test.mjs`：五类页面和关键交互接线契约。
- `README.md`：产品定位、启动命令、备份和已实现功能。

### Task 1: 课程内容与状态模型

**Interfaces:**
- Produces: `courses`, `topicById`, `createSemesterState(now)`, `getCourseProgress(state, courseId)`, `getOverallProgress(state)`, `updateMastery`, `toggleTask`, `markTopicReviewed`, `upsertMistake`, `validateSemesterBackup`。

- [ ] 编写失败测试，断言三门课程的章节顺序、22 个知识点的必需字段、初始非空任务/错题/复习记录。
- [ ] 运行 `npm test -- tests/semester-model.test.mjs`，确认缺少新模块而失败。
- [ ] 实现课程内容、类型、默认状态和派生统计；进度只从掌握级别计算。
- [ ] 实现任务切换、掌握更新、证据、复习日期和错题不可变更新。
- [ ] 实现严格的 schema/app 标识、ID 引用和必需文本校验。
- [ ] 重新运行模型测试并记录结果。

### Task 2: localStorage 与 JSON 安全备份

**Interfaces:**
- Consumes: `SemesterState`, `validateSemesterBackup`。
- Produces: `SEMESTER_STORAGE_KEY`, `loadSemesterState`, `saveSemesterState`, `serializeSemesterBackup`, `restoreSemesterBackup`, `downloadSemesterBackup`。

- [ ] 编写失败测试，覆盖版本化键、损坏数据回退、完整备份往返和外部 app/schema 拒绝。
- [ ] 实现只读一次的懒加载入口，所有 Storage API 使用 `try/catch`。
- [ ] 导出带 `app`、`schemaVersion`、`exportedAt`、`state` 的 JSON；导入先校验、后覆盖。
- [ ] 运行存储测试并记录结果。

### Task 3: 应用壳与 Dashboard

**Interfaces:**
- Consumes: 完整状态树和状态更新函数。
- Produces: 可访问的导航、全局搜索结果、数据操作、今日任务主流程。

- [ ] 替换旧学习台组合层，保留 `LearningWorkbench` 导出以维持入口稳定。
- [ ] 实现桌面固定导航、顶部搜索、移动底栏、导入/导出和覆盖确认。
- [ ] 实现 Dashboard 的当前周、本周总进度、三门课程、主问题、最多三任务、复习和明日第一件事。
- [ ] 任务行可切换完成；主 CTA 打开当前知识点。
- [ ] 初始手动检查首屏内容与概念图信息一致。

### Task 4: 课程、知识卡、错题和连接页面

**Interfaces:**
- Consumes: `courses`, `SemesterState`, 顶层更新回调。
- Produces: 五类页面完整学习闭环。

- [ ] 实现课程总览三栏布局，并在三门课程之间复用同一组件。
- [ ] 实现知识卡全部十项内容、课程/标签/掌握筛选、前后知识点和已复习操作。
- [ ] 使用 Canvas 绘制与知识点对应的电路、波形或流程示意，不使用静态占位框。
- [ ] 实现错题筛选、新增、编辑、标记掌握和下次复习日期。
- [ ] 实现五节点课程连接图和三门课程作用说明；节点可打开对应课程。
- [ ] 编写 UI 契约测试，断言所有关键按钮均绑定处理函数。

### Task 5: 视觉、响应式与可访问性

**Interfaces:**
- Consumes: 已生成的桌面 Dashboard、知识卡和移动 Dashboard 设计参考。
- Produces: 与参考一致的工程学习笔记视觉系统。

- [ ] 定义背景、文本、强调、警告、边界、字号、间距和动效令牌。
- [ ] 实现桌面左/中/右布局、开放式分隔和安静的按钮层级。
- [ ] 在 `max-width: 760px` 下切换顶部工具和固定底栏，保证 44px 触控目标和无横向溢出。
- [ ] 添加 focus-visible、disabled、hover 和 reduced-motion 状态。
- [ ] 对照三张参考图修正首屏平衡、字号、颜色、留白、边界和容器模型。

### Task 6: 最终验证和交付

**Interfaces:**
- Produces: 可复现的测试、构建、浏览器与发布证据。

- [ ] 运行 `npm test`，所有测试必须 0 跳过通过。
- [ ] 运行 `npm run lint` 并修复所有错误。
- [ ] 运行 `npm run build` 并确认生产构建成功。
- [ ] 用 Browser 在桌面和 390px 移动视口验证页面身份、非空、无覆盖层、控制台健康和截图。
- [ ] 实测导航、搜索、两类筛选、任务同步、掌握进度同步、错题 CRUD、复习、导入导出和刷新恢复。
- [ ] 使用 `view_image` 对照概念图与最新实现截图，记录至少五项一致性检查及任何有意偏差。
- [ ] 更新 README、检查清单和上下文记录；在通过构建后按现有 Sites 配置发布。
