# Mobile Canvas Fit Implementation Plan

**Goal:** 移除移动端 SVG 等比绘制区域上下的无效空带，保持数字/模拟坐标与缩放。
**Architecture:** 只在 3010 styles.css 的 ≤900px 范围覆盖共享 bundle 的高度限制，不改 3000 源码。SVG viewBox 为 1200×720，外框保持相同 5:3 比例。
**Tech Stack:** CSS、现有 node:test + Playwright。

## Task: 画布等比外框
- [ ] tests/mobile-canvas-fit.test.mjs：375/393/760/900px 和横屏 844×393，数字/模拟 SVG 屏幕坐标上下边界应与 viewBox 边界相差 ≤1px；缩放后仍成立；页面不横向溢出。
- [ ] 先运行新测试确认旧版失败。
- [ ] styles.css 新增 `@media (max-width: 900px) { .workbench-root .cw-canvas { height: auto; min-height: 0; max-height: none; aspect-ratio: 5 / 3; } }`。
- [ ] 新测试、完整 `node --test tests/*.test.mjs`、`node build-pages.mjs` 和 `git diff --check`；393px 截图核验。
- [ ] 不提交、不推送；用户本次仅授权本地调整。

## Evidence and scope
执行完成：修改前 375/393px 两项失败；修改后新增 5/5、完整 95/95，缩放/横屏与桌面既有回归通过，构建和截图已核验；未提交、未推送。
修改前 393px：SVG 369×360，viewBox 1200×720，上下各 69.3px 空带。
不变更导航、滚动状态、工具栏、图形比例、数据存档、桌面画布。
此前残影按用户反复尝试未复现的反馈标记已修复；浏览器状态延迟仅为假设。
