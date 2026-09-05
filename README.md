# 个人电子工作台 · 3010 稳定版

本版本替换旧 3000 对应的 GitHub Pages。在线地址：https://w1661884010-jpg.github.io/personal-workbench/

## 当前发布与恢复

- 本地稳定版（3010）：`C:\Users\Lenovo\Desktop\learning\repositories\personal-workbench-shell-3010`。
- 本地原站（3000）：`C:\Users\Lenovo\Desktop\learning\repositories\personal-workbench-sites-3000`。
- 构建入口通过相对路径引用同级 `personal-workbench-sites-3000`，移动整个 repositories 目录无需修改这些入口。

- 启动：`node serve.mjs 3010`；发布包：`node build-pages.mjs`。
- main 推送触发 Pages，只上传已验证的 HTML/CSS/JS 与字体，不上传开发文档或本地配置。
- 稳定快照：`stable-3010-2026-09-05`（0a8cee4）；旧线上快照：`before-3010-pages-2026-09-05`（ae25963）。新提交保留两条历史，不强推。
- 查看旧版请使用新目录：`git worktree add --detach <新目录> before-3010-pages-2026-09-05`。线上回滚用新提交重新部署，不覆盖共享历史。
- `node --test tests/*.test.mjs` 是本地完整测试，需要 3010 服务、系统 Chrome 和测试中指定的 Playwright 缓存。CI 仅执行脚本语法和发布资源校验，不等于完整浏览器回归。
- 发布使用已提交 bundle。重新构建源码仍依赖同级 personal-workbench-sites-3000 的源码和 node_modules，并非可独立重建的开发包。
- Git 不包含浏览器学习记录。localhost 与 GitHub Pages 属于不同来源，localStorage 不会自动迁移，本次不会上传浏览器数据；旧线上数据也不保证与新模型兼容，请保留导出备份。

## 以下为早期骨架设计记录（不代表当前功能清单）

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
