# GitHub Pages 同步计划

## 目标

将当前已验证的“电路自习室”提交同步到 GitHub 私有仓库 `w1661884010-jpg/personal-workbench` 的 `main`，并发布可从项目子路径访问的 GitHub Pages 静态版本。

## 假设与约束

- GitHub Pages 网址使用仓库名：`https://w1661884010-jpg.github.io/personal-workbench/`。
- Sites 继续使用现有 Vinext 构建，不改变 `.openai/hosting.json` 或 Sites 发布流程。
- GitHub Pages 使用单独的纯 Vite 客户端入口，直接复用 `LearningWorkbench`、课程数据、localStorage 和现有样式。
- 仓库保持 private；若当前 GitHub 套餐不支持私有仓库 Pages，明确报告阻塞，不擅自改为 public。
- 既有未跟踪 `tmp/` 不纳入提交。

## 实施步骤

1. 添加 Pages 专用 HTML、React 入口和 Vite 配置，固定项目子路径 `base`。
2. 添加 GitHub Actions Pages 工作流，在 `main` 推送时执行测试、lint、静态构建和部署。
3. 添加部署契约测试，验证基路径、构建入口、产物目录和工作流发布步骤。
4. 运行完整测试、lint、Sites 构建、Pages 构建和差异检查。
5. 创建单一语义提交，将当前 `HEAD` 推送到 GitHub `main`。
6. 启用 Pages workflow 构建源，等待 Actions 和 Pages 部署成功，最后请求公开网址确认 HTTP 与页面标题。

## 成功标准

- 本地 `HEAD` 与 GitHub `main` 指向同一提交。
- `npm test`、`npm run lint`、`npm run build` 和 `npm run build:pages` 均成功且无跳过的测试。
- GitHub Pages 工作流结论为 `success`。
- `https://w1661884010-jpg.github.io/personal-workbench/` 返回 HTTP 200，并显示“电路自习室”。
