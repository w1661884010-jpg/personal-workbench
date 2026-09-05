# 统一数字/模拟工作台切换 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 3010 副本的工作台内部加入“数字 / 模拟”分段切换器，并在同一次工作台会话中分别保留两类画布草稿。

**Architecture:** shell 层新增独立 `workbenchStage`，把切换器与 React 挂载点分开，避免 `createRoot()` 清除切换器。bundle 入口按 kind 懒创建两个独立 React root；切换时隐藏/显示 root 而不卸载，退出工作台时统一卸载，因此无需修改 3000 原站组件，也无需给 `CircuitWorkbench` 增加状态导出接口。

**Tech Stack:** 原生 HTML/CSS/JS、React bundle、esbuild、Node 内置测试、Playwright CLI。

## Global Constraints

- 只修改 `C:\Users\Lenovo\Documents\codex_projects\personal-workbench-shell`；不修改 `personal-workbench-sites`。
- 不新增运行时依赖，不引入持久化；草稿只在当前工作台会话内保留，退出或刷新后清空。
- 保持 `PrototypeWorkbench.mount(container, options)` 与 `unmount()` 兼容，新增 `setKind(kind)`。
- 切换器位于工作台内容顶部，采用现有色彩、圆角和 40px 控件语言。
- 阶段 C 的入口统一与 Dashboard 快捷入口不在本轮范围内。
- 当前目录没有 Git 元数据，因此不执行提交；以测试、构建与浏览器证据作为检查点。

---

### Task 1: 建立阶段 B 行为契约

**Files:**
- Create: `tests/unified-workbench-switching.test.mjs`

**Interfaces:**
- Consumes: `index.html`、`app.js`、`workbench-entry.tsx` 文本。
- Produces: 可识别切换器层级、`setKind` 公共接口和双会话保留策略的 Node 测试。

- [x] **Step 1: 写入预期失败的结构与草稿保留测试**

```js
test("the shell exposes an in-workbench digital/analog switcher", () => {
  assert.match(html, /id="workbenchStage"[\s\S]*id="kindSwitcher"[\s\S]*id="workbenchRoot"/);
});

test("kind switching keeps separate mounted sessions until workbench exit", () => {
  assert.match(entry, /export function setKind\(kind: CircuitKind\)/);
  assert.match(entry, /roots: Partial<Record<CircuitKind, Root>>/);
  assert.match(entry, /container\.hidden = sessionKind !== kind/);
});
```

- [x] **Step 2: 运行专项测试并确认失败原因指向缺少阶段 B 接口**

Run: `node --test tests/unified-workbench-switching.test.mjs`

Expected: FAIL，分别指出 `workbenchStage/kindSwitcher`、`setKind` 或双 root 会话尚不存在。

### Task 2: 在 bundle 入口保留双 kind 会话

**Files:**
- Modify: `workbench-entry.tsx`
- Modify (generated): `workbench.bundle.js`

**Interfaces:**
- Consumes: 原站 `CircuitWorkbench`、`CircuitKind`、现有 `MountOptions`。
- Produces: `mount(container, options): void`、`setKind(kind: CircuitKind): void`、`unmount(): void`。

- [x] **Step 1: 把单一 root 改为按 kind 保存的会话表**

```ts
const roots: Partial<Record<CircuitKind, Root>> = {};
const sessionContainers: Partial<Record<CircuitKind, HTMLElement>> = {};
let activeKind: CircuitKind | null = null;
let activeOptions: MountOptions | null = null;
```

- [x] **Step 2: 懒创建当前 kind 的容器和 React root**

```ts
function ensureSession(kind: CircuitKind, initialExperimentId?: string) {
  if (!activeContainer || !activeOptions || roots[kind]) return;
  const container = document.createElement("div");
  container.className = "prototype-workbench-session";
  container.dataset.kind = kind;
  activeContainer.appendChild(container);
  const sessionRoot = createRoot(container);
  roots[kind] = sessionRoot;
  sessionContainers[kind] = container;
  sessionRoot.render(createElement(CircuitWorkbench, { ...activeOptions, kind, initialExperimentId }));
  scheduleBridge(container);
}
```

- [x] **Step 3: 实现只切显隐、不卸载的 `setKind`**

```ts
export function setKind(kind: CircuitKind) {
  if (!activeContainer || !activeOptions) return;
  ensureSession(kind);
  for (const sessionKind of ["digital", "analog"] as const) {
    const container = sessionContainers[sessionKind];
    if (container) container.hidden = sessionKind !== kind;
  }
  activeKind = kind;
}
```

- [x] **Step 4: `unmount` 还原 instruments 后卸载所有已创建 root**

```ts
for (const kind of ["digital", "analog"] as const) {
  const container = sessionContainers[kind];
  if (container) restoreInstruments(container);
  roots[kind]?.unmount();
}
activeContainer.replaceChildren();
```

- [x] **Step 5: 重新构建 bundle 并运行专项测试**

Run: `node build-workbench.mjs && node --test tests/unified-workbench-switching.test.mjs`

Expected: bundle 构建成功，`PrototypeWorkbench` 包含 `setKind`，专项测试通过。

### Task 3: 接入 shell 分段切换器并完成验收

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Modify: `checklist.md`
- Modify: `context-notes.md`
- Modify: `docs/superpowers/plans/2026-09-04-practice-area-planning.md`

**Interfaces:**
- Consumes: `PrototypeWorkbench.mount/setKind/unmount`。
- Produces: `#workbenchStage`、`#kindSwitcher`、`.kind-switch-button` 与 `syncKindSwitcher()`。

- [x] **Step 1: 把切换器放在 React 挂载点外层**

```html
<section id="workbenchStage" class="workbench-stage" hidden>
  <nav id="kindSwitcher" class="kind-switcher" aria-label="工作台类型">
    <button type="button" class="kind-switch-button" data-kind="digital">数字</button>
    <button type="button" class="kind-switch-button" data-kind="analog">模拟</button>
  </nav>
  <div id="workbenchRoot" class="workbench-root"></div>
</section>
```

- [x] **Step 2: 让 circuit → circuit 走 `setKind`，离开工作台才 `unmount`**

```js
if (isCircuitWorkbench(prev) && isCircuitWorkbench(wbKind)) {
  activeWorkbench = wbKind;
  PrototypeWorkbench.setKind(wbKind);
  syncKindSwitcher();
  syncWorkbenchButtons();
  return;
}
```

- [x] **Step 3: 同步分段控件的 `is-active` 与 `aria-pressed`**

```js
function syncKindSwitcher() {
  kindSwitchButtons.forEach(function (button) {
    var active = button.dataset.kind === activeWorkbench;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}
```

- [x] **Step 4: 用现有令牌实现 40px 紧凑分段控件和移动端不溢出布局**

```css
.workbench-stage { min-width: 0; opacity: 1; transition: opacity 140ms ease-out; }
.kind-switcher { display: inline-grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }
.kind-switch-button { min-height: 40px; border-radius: 9px; }
.kind-switch-button.is-active { background: var(--accent); color: #fff; }
```

- [x] **Step 5: 运行完整自动验证**

Run: `node --test tests/*.test.mjs; node --check app.js; node build-workbench.mjs`

Expected: 全部测试通过、无跳过，语法和 bundle 构建成功。

- [x] **Step 6: 用 Playwright 验证桌面与移动交互**

Flow: `http://localhost:3010/` → 数字台 → 添加一个数字元件 → 切到模拟 → 添加一个模拟元件 → 两次往返切换 → 两边元件各自仍存在。

Expected: 页面身份正确、无空白或框架错误覆盖层、无相关控制台错误、分段与顶栏状态同步，桌面和 390px 移动视口无横向页面溢出。

## Self-Review

- **Spec coverage:** 阶段 B 的就地切换、双草稿保留、切换器位置、bundle 接口、构建和浏览器验证均有对应任务；阶段 C 明确排除。
- **Placeholder scan:** 无 TBD、TODO 或未定义的“类似处理”。
- **Type consistency:** `CircuitKind`、`MountOptions` 和 `setKind(kind)` 在入口与 shell 消费端一致；两个会话仍消费同一 `courses/onOpenChapter/onNotify`。
- **Conflict resolution:** 放弃 D2a“确认后丢弃”，采用双 root 内存保留；原因是它无需修改原站组件且直接满足主计划的全局约束。
