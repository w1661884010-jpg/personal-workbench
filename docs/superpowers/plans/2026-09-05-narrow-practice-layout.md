# 2026-09-05 演练页窄窗口布局优化（阶段 A：参数/结果/间距；阶段 B：图表刻度/单位/画布）

范围：仅 3010 副本（`personal-workbench-shell-3010`）；不改 sites-3000；不动已验收的工作台/顶栏/数字模拟切换。
不改变计算、默认参数、状态保存、完成判定；不新增“已完成 0/6”。两阶段分别验证、分别提交。
修改前恢复标签 `restore-2026-09-05-before-narrow-practice-layout`（HEAD ec041b9，工作区干净）。

## 现状（代码核对）

- `.demo-controls`：`repeat(auto-fit, minmax(150px, 1fr))`，gap 10 —— 390px 时仅剩 1 列（五个参数纵向）。
- `.demo-metric`：`min-width: 170px; flex: 0 0 auto` —— 窄屏换行后右侧留白；无长结果语义类。
- 图表：六段 draw 各有 `gxt <= 5` 的 6 个 X 刻度 + `fillText("t / s", width - margin.right, …)`，
  窄绘图区（390px 约 250px）刻度密集且末端刻度与单位可能重叠；Canvas 高固定 240/340px、
  `canvas.width = round(rect.width * dpr)` + `setTransform(dpr…)`（需核验一致性）。
- 结果显示样式：所有演示共用 `.demo-metrics/.demo-metric`，rows 为 `[label, value]` 二元组。

## 阶段 A：参数网格、结果卡片、间距（只改显示）

1. 参数区：`≤760px` 用 `repeat(2, minmax(0, 1fr))`（间距 12px），输入/选择 `min-height: 42px`
   （40–44 区间），序号不变、按 quantity 自适应（不限 5 字段）；`≤340px`（极窄）单列满宽。
   不改字体/不隐藏单位。
2. 结果区：`≤760px` 改 `display: grid; repeat(2, minmax(0, 1fr))`，`.demo-metric { min-width: 0 }`；
   长结果（公式/区间值）在 rows 数据上加语义第三元素 `"wide"` → `demo-metric is-wide`（`grid-column: 1/-1` 满行），
   不用 nth-child；`≤340px` 全部单列满宽；数值/公式/单位不截断（white-space 正常）。
3. 间距：≤620px 压缩 `.notebook-demo` 底部留白与 `.notebook-page` gap；返回按钮保持次要层级、
   窄屏紧凑不占整行。桌面（>760 参数 auto-fit、>620 原间距）基本不变。
4. 验证：360/390/560/620/621/760/1040/1440，六演练全部；横向无溢出；输入标签完整；结果满宽；
   修改参数→缩放→切换演练后状态与结果不回滚；默认值与结果对照修改前；完整套件 + diff --check。

## 阶段 B：图表刻度、单位、尺寸适配（只改刻度显示）

1. X 刻度数量按绘图区宽度自适应（如 `max(3, min(5, floor(plotW/72)))`），窄图不再 6 个刻度拥挤，
   末端刻度与 “t / s” 不重叠；单位标签保留在轴末端（必要时留边距），不进入数据区。
2. 只改刻度数量/间距/单位位置，不减少计算数据与采样点（曲线采样 400 点等不变）。
3. Canvas：核验 `canvas.width/height === round(CSS 尺寸 × devicePixelRatio)`、CSS 高度 240/340 不变
   （不压扁）；Legend 自然换行且不遮曲线（现有 flex-wrap，逐项目检）。
4. 验证：同上六演练全视口 + 画布尺寸/DPR 断言 + 单位不重叠（刻度末位与单位文本位置测量）+ 截图对照。

## 交付

阶段 A/B 各自：修改文件、原因、提交号、测试结果、前后截图（含 390/560 + 1440 桌面回归）；
未验证项明确列出；完成后停本地验收，不推送、不发布；恢复走分支/revert，不用 reset --hard。
