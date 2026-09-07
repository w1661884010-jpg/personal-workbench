# Adaptive Canvas and Palette Implementation Plan

**Goal:** 增大移动画布，任意容器比例和缩放下网格/坐标覆盖整个 SVG；元件可搜索，工具栏更紧凑。
**Architecture:** ResizeObserver 读取 SVG 尺寸，viewBox 按实际比例扩展且保留基础 1200×720 区域。背景使用当前 viewBox；指针使用逆 CTM。搜索为会话内派生过滤。不改 3000，不推送。
**Tech Stack:** React、CSS、node:test/Playwright。

## Steps
- [ ] 测试：mobile-canvas-fit 增加 320/1440 尺寸、不同缩放网格覆盖断言；新测试查询中英文/空结果、点击放置、工具栏高度、边缘拖动。
- [ ] CircuitWorkbench.tsx：增加尺寸观察与清理；viewBox 使用比例扩展；背景 rect 跟随 viewBox；canvasPoint 使用 getScreenCTM().inverse()。
- [ ] 搜索过滤 label/kind；空结果显示反馈；移动元件多列、有限高度内纵滚，保留桌面布局。
- [ ] styles.css：移动画布 `height:clamp(400px,65svh,720px)`；取代上一轮固定 5:3 外框。模式/缩放优先，选中才显示编辑控件；触控至少 40px。
- [ ] `node build-workbench.mjs`，新测试失败→修复→通过，完整测试与 Pages 构建、截图核验；不提交、不推送。

## Acceptance
完成记录：98/98 测试通过，包含新增 320/1440 比例、负坐标/超出720的放置与像素级拖动验证；构建、截图通过。额外必要文件 circuit-placement.ts 解除共享放置逻辑的固定边界，避免扩展网格成为无效区。未提交、未推送；真机微信待用户核验。
SVG/viewBox 比例一致；背景覆盖全部可见坐标；不裁掉初始基础坐标区；移动绘图区≥400px，工具栏未选中≤120px；元件无横滚，搜索不改变已有电路；数字/模拟会话保持。旧空带问题方案被本轮动态 viewBox 取代，不叠加冲突方案。
