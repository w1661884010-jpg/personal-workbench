# 隔离旧 3000 仓库

将实际使用的电路源码和样式复制到本项目 circuit-source/，保持内部目录与逻辑不变；React、React DOM、KaTeX、esbuild 使用当前安装的精确版本及 npm lockfile。3020 保留实验副本定位，补齐同样的构建输入，不覆盖实验改动。

成功标准：两目录不再有指向旧仓库的有效导入；3000 移走后仍可分别构建，完整测试通过。仅在验证后将明确目标 personal-workbench-sites-3000 放入 Windows 回收站。不推送、不自动提交、不修改凭据。
