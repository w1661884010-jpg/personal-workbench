# 3010 本地恢复

仓库位置：`C:\Users\Lenovo\Documents\codex_projects\personal-workbench-shell`

- `baseline-3010`：本次优化前的完整页面。
- `workbench-ui-v1`：工作台风格与按键状态优化版。
- `main`：当前开发版本。

先运行 `git status`。存在未提交修改时，先提交或备份，再切换版本。

查看优化前版本（保留优化版历史）：

```powershell
git switch -c review-baseline baseline-3010
```

返回当前开发版：

```powershell
git switch main
```

切换后刷新 3010 即可；若服务未运行，执行 `node serve.mjs`。

Git 包含页面、课程和工作台编译产物，可直接恢复运行。重新构建工作台仍使用相邻原站的计算库及 node_modules。
浏览器中的电路存档和学习进度在 localStorage 中，不属于 Git；版本切换不会替你备份或恢复这些数据。
