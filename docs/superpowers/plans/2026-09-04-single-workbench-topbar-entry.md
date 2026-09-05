# 顶栏单一工作台入口 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将顶栏“数字台 / 模拟台”两个入口合并为一个“工作台”入口，类型选择只保留在工作台内部。

**Architecture:** `index.html` 只保留一个带芯片图标的 `#workbenchToggle`。`app.js` 将该按钮视为整个电路工作台的进入/退出开关：正文或 Notebook 中点击默认进入数字台，任一电路工作台中点击则退出；内部 `kindSwitcher` 与双 React 会话保持不变。

**Tech Stack:** 原生 HTML/JavaScript、Node 内置测试、Playwright CLI。

## Global Constraints

- 只修改 3010 副本，不修改原站或工作台 bundle。
- 不改变工作台内部数字/模拟切换和草稿保留行为。
- 不新增图标、依赖或入口；复用现有芯片 SVG，文案改为“工作台”。
- 当前目录没有 Git 元数据，因此不提交。

---

### Task 1: 合并顶栏入口并验证交互

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `tests/unified-workbench-switching.test.mjs`
- Modify: `checklist.md`
- Modify: `context-notes.md`

**Interfaces:**
- Consumes: `setView("digital")`、`setView(null)`、`isCircuitWorkbench(activeWorkbench)`。
- Produces: `#workbenchToggle` 单一入口及 `syncWorkbenchButton()`。

- [x] **Step 1: 写入单入口行为契约测试**

```js
assert.equal(html.match(/class="tool-button workbench-button"/g)?.length, 1);
assert.match(html, /id="workbenchToggle"[\s\S]*<span>工作台<\/span>/);
assert.doesNotMatch(html, /<span>数字台<\/span>|<span>模拟台<\/span>/);
assert.match(app, /isCircuitWorkbench\(activeWorkbench\)\s*\?\s*null\s*:\s*"digital"/);
```

- [x] **Step 2: 运行测试确认旧双入口按预期失败**

Run: `node --test tests/unified-workbench-switching.test.mjs`

Expected: FAIL，指出顶栏仍有两个工作台按钮。

- [x] **Step 3: 用一个“工作台”按钮替换两个旧按钮**

```html
<button id="workbenchToggle" type="button" class="tool-button workbench-button" data-tip="电路工作台：进入后切换数字与模拟电路">
  <!-- 复用现有芯片 SVG -->
  <span>工作台</span>
</button>
```

- [x] **Step 4: 把数组监听改为单按钮进入/退出逻辑**

```js
function syncWorkbenchButton() {
  var active = isCircuitWorkbench(activeWorkbench);
  workbenchButton.classList.toggle("is-active", active);
  workbenchButton.setAttribute("aria-pressed", active ? "true" : "false");
}

workbenchButton.addEventListener("click", function () {
  setView(isCircuitWorkbench(activeWorkbench) ? null : "digital");
});
```

- [x] **Step 5: 运行完整测试与浏览器验收**

Run: `node --test tests/*.test.mjs; node --check app.js`

Flow: `http://localhost:3010/` → 点击“工作台” → 默认数字台 → 内部切到模拟 → 顶栏仍为一个选中入口 → 点击“工作台”退出。

Expected: 全部测试通过；桌面与 390px 移动视口无页面溢出、无相关控制台错误。

## Self-Review

- **Spec coverage:** 顶栏两个图标及文案合并为一个入口；工作台内部类型切换不变。
- **Placeholder scan:** 无待定项或未定义步骤。
- **Interface consistency:** `setView` 签名不变，唯一新增 DOM 接口是 `#workbenchToggle`。
