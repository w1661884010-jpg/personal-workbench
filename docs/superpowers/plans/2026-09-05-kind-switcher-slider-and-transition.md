# 2026-09-05：数字/模拟切换滑块与工作台内容淡入淡出

仅修改 3010 副本（`personal-workbench-shell`，localhost:3010），不触碰原站
`personal-workbench-sites`。目标：把「数字/模拟」两个独立胶囊合并为共享滑块分段控件，
并为工作台内容切换加入淡出/淡入过渡（由 `workbench-entry.tsx` 统一管理）。

## 目标

1. 滑块：约 184×44px、内部 4px 边距、两项等宽的连续圆角分段控件；灰阶配色沿用
   `--bg/--panel/--panel-2/--ink/--ink-soft`；轨道深灰、选中滑块深色填充 + 1px 细描边、
   选中文字清晰突出、未选中弱化；文字位置固定，仅选中底块左右滑动；动画 180ms、
   `cubic-bezier(.22, 1, .36, 1)`、只过渡 `transform`；点击当前项不重播。
2. 内容过渡：数字⇄模拟时当前内容约 80ms 淡出 → 切换会话 → 目标约 120ms 淡入
   （整体约 200ms）；只改变不透明度，无位移/缩放/模糊；两套电路画面不叠加；
   切换控件始终可见可响应。首次打开另一工作台须等目标组件挂载完成再替换（不用固定
   延迟猜就绪）；加载失败保留可用内容并给出错误反馈。
3. 交互边界：快速连点以最后一次为准（代号机制取消过期回调）；过渡期间旧内容不可操作、
   过渡结束后仅目标面板可操作；离开/卸载清理动画/监听/延迟回调；键盘方向键可切换、
   焦点保留在切换项；键盘与 `prefers-reduced-motion` 采用即时切换。
4. 独立 React 会话保持：不卸载重建、不重置元件/连线/探针/缩放/模式，维持现有仿真语义。

## 修改前基线

- git：`main` 干净；既有标签 `baseline-3010`、`workbench-ui-v1`；本任务新增
  `restore-2026-09-05-before-kind-switcher-slider`（HEAD `1c6cdf9`）。
- 结构：`#kindSwitcher` 是 `#workbenchRoot` 外的原生 DOM（index.html 98-101）；
  `setView()` 对 circuit→circuit 直调 `PrototypeWorkbench.setKind()`（app.js 1528-1535）；
  `syncKindSwitcher()` 同步 `is-active`/`aria-pressed`（app.js 1603-1609）；
  `workbench-entry.tsx` 维护 `roots`/`sessionContainers`，`setKind` 只切换 `hidden`。
- 旧样式：styles.css 91-117 基础胶囊规则 + 1576-1578 移动端互覆盖补丁（本轮清理合并）。
- 测试基线：12/12 通过（`node --test tests/*.test.mjs`），`node --check app.js` 通过。

## 实施步骤（顺序执行）

### 1. 滑块（index.html + styles.css + app.js）
- `#kindSwitcher` 改为 `role="tablist"`：新增 `<span class="kind-thumb">`（指示块）+ 两个
  `role="tab"` 按钮（`aria-selected`、`aria-controls` 指向会话面板 id）。
- 样式重写为单条基础规则（无断点差异）：轨道深灰 `184px` 宽、`4px` padding、圆角 12px；
  thumb 绝对定位 `top/left:4px`、`宽 calc(50% - 4px)`、`translateX(0|100%)`、仅过渡
  `transform 180ms cubic-bezier(.22, 1, .36, 1)`；按钮 `position:relative` 文字固定于
  轨道层之上；删除 1576-1578 旧覆盖。新增 `.kind-switcher.is-instant .kind-thumb{transition:none}`。
- `app.js`：`syncKindSwitcher(instant)` 增加 thumb `transform` 同步与 `is-instant` 帧级开关；
  点击 → 默认动画路径；键盘（ArrowLeft/Right/Home/End）→ 即时路径。

### 2. 内容过渡（workbench-entry.tsx 为主）
- `setKind(kind, immediate?)`：
  1. `activeKind === kind` 直接返回（不重播）；
  2. `ensureSession(kind)`（懒会话保持不销毁）；
  3. 目标就绪 = 容器出现 `.circuit-workbench`（轮询 40ms，上限 1500ms）；
     超时 → `onNotify` 错误反馈并保留旧内容、中止本次切换；
  4. 即时路径（immediate / 无旧可见内容 / `prefers-reduced-motion`）：直接显隐切换；
  5. 动画路径：旧容器加 `.cw-switching`（opacity 0，80ms；同时 `pointer-events:none`）
     → 目标就绪后切 `hidden` → 目标容器 `.cw-switching-in`（opacity 0→1，120ms）
     → 完成后移除限制；全流程由 `switchSeq` 代号取消过期回调。
- `unmount()`：`switchSeq++`、清定时器、断开观察器（防旧回调重显已离开内容）。
- 会话容器补 `role="tabpanel"` + `id`（`workbenchPanelDigital/Analog`）+ `aria-labelledby`。
- `mount()` 走即时路径（入场动画继续由外层 `setView` 的 stage 140/150ms 淡入负责）。

### 3. 测试与验收
- 更新/新增 `tests/unified-workbench-switching.test.mjs` 断言：滑块结构、thumb 动画
  参数、instant 与 reduced-motion、代号取消、unmount 清理、aria-selected/tabpanel。
- `node build-workbench.mjs`、`node --test tests/*.test.mjs`、`node --check app.js`。
- Playwright：双向切换、快速连点 10 次、首次加载模拟台/动画中返回教材/再进入、
  状态保留（元件/连线/探针/缩放/模式）、桌面+移动布局、键盘、reduced-motion 仿真。
- 浏览器内验证滑块与内容一致、无半透明残留、无过期回调。

## 完成后
- 提交逻辑变更 + 创建 `restore-2026-09-05-after-kind-switcher-slider` 标签；不推送远程。
- 汇报修改内容、测试结果、已知限制、修改前后标签与恢复方法
  （`docs/restore.md`；Git 恢复仅限项目文件，不含浏览器电路存档与学习进度）。
