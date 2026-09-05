# 3010 本地恢复

仓库位置：`C:\Users\Lenovo\Desktop\learning\repositories\personal-workbench-shell-3010`

- `baseline-3010`：本次优化前的完整页面。
- `workbench-ui-v1`：工作台风格与按键状态优化版。
- `restore-2026-09-05-before-kind-switcher-slider`：滑块与内容过渡**修改前**（`1c6cdf9`）。
- `restore-2026-09-05-after-kind-switcher-slider`：滑块与内容过渡**第一版**（`8c32b85`）。
- `restore-2026-09-05-before-kind-switcher-fix`：核验修正**修改前**（`8c32b85`）。
- `restore-2026-09-05-after-kind-switcher-fix`：核验修正完成版。
- `restore-2026-09-05-before-practice-polish`：演练页 UI 优化**修改前**。
- `restore-2026-09-05-after-practice-polish`：演练页 UI 优化完成版（当前提交）。
- `main`：当前开发版本。

先运行 `git status`。存在未提交修改时，先提交或备份，再切换版本。

**安全恢复方式（默认，不丢弃未提交修改）**：先查看要恢复的版本，确认无误再切换工作区。

```powershell
# 查看任一版本（只读检查，不动当前工作区）
git switch -c review-<标签名> <标签名>

# 也可以直接用 git worktree 预览，完全不动当前目录
git worktree add ..\_preview-<标签名> <标签名>
```

**恢复（切换工作区到标签版本）**——仅在确认无未提交修改、或已另行备份后执行：

```powershell
git switch -c restore-<标签名>-ws <标签名>
# 或去掉 -c，覆盖当前分支指针（慎用）：git switch <标签名>
```

**不要**把 `git reset --hard <标签>` 作为默认恢复命令：它会丢弃未提交修改。确需回退整个工作区时，先 `git status` 确认干净，或先提交一次（`feat: savepoint before restore`）再回退。

返回开发版：`git switch main`（或删掉预览分支后切换）。

切换后刷新 3010 即可；若服务未运行，执行 `node serve.mjs`。

Git 包含页面、课程和工作台编译产物，可直接恢复运行。重新构建工作台仍使用相邻原站的计算库及 node_modules。
浏览器中的电路存档和学习进度在 localStorage 中，不属于 Git；版本切换不会替你备份或恢复这些数据。
