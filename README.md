# 界面骨架（空原型）

新布局的**空副本**：顶栏科目/入口按键、左栏章节目录、中间正文模块；已移植原站点的
全局搜索（`AppShell` 的 `.global-search` + `LearningWorkbench.searchResults`）与
数字/模拟电路工作台（`CircuitWorkbench` + `lib/circuit`）。

## 文件

- `index.html` — 框架结构（按键、搜索框、正文、工作台挂载点）
- `styles.css` — 暗/亮主题（跟随系统）+ 原站变量别名（工作台 CSS 按原站命名书写）
- `app.js` — 最小脚本：顶栏滚动收起、科目切换、章节选择、全局搜索、视图切换
- `courses.js` — **由原站生成的**课程数据（`app/data/courses/*.ts` 打包为 IIFE，`CoursesData`）
- `workbench.bundle.js` + `workbench.bundle.css` — **由原站打包的**电路工作台
  （React 运行时 + `CircuitWorkbench` + `lib/circuit`，IIFE 暴露 `PrototypeWorkbench`）
- `workbench-entry.tsx` — 打包入口（mount/unmount 包装）
- `build-workbench.mjs` — 工作台 bundler 构建脚本（开发期工具，非运行时）
- `serve.mjs` — 本地静态服务器（`node serve.mjs 3010`）

## 重新生成

```powershell
node build-workbench.mjs          # 工作台 bundle（依赖原站 node_modules）
# courses.js 同理：esbuild 打包 app/data/courses/index.ts
```

## 预览

`node serve.mjs 3010` → http://localhost:3010/ 或直接双击 `index.html`
（页面无运行时依赖；工作台 bundle 本地加载，无需网络）。

## 对照最终规划

- 顶部：科目 3 项 + 工作台/错题入口 + 全局搜索 + 外观（搜索框在科目与入口之间的空档）
- 左栏：当前科目章节目录（固定、独立滚动、底部进度）
- 中间：章节名 → 学习状态 → 课程导读 → 本章重点 → 正文 → 资源入口 → 继续学习；
  数字台/模拟台 切换为真实工作台视图（元件面板、画布、参数检查器、逻辑分析仪/示波器）
- 移动端：科目/章节横向列表；搜索框独占一行
