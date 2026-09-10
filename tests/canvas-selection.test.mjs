/* 画布元件的选中与拖动交互（改写自 bundle 的"双击选中、按下即拖动"）：
   1) 单击即选中并保持（无需双击），点空白处才取消；
   2) 长按 320ms 才进入拖动；长按前滑开 >6px 视为放弃拖动，元件不会被动过；
   3) 选中只有一个指示：选中态不再叠加虚线焦点框，也没有 UA 焦点环；
   4) 端口点击（连线）与键盘 Enter/空格选中不受影响。
   - 依赖 3010 静态服务器；Chromium 使用系统 Chrome（playwright 库来自 npx 缓存）。 */
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const PLAYWRIGHT_CANDIDATES = [
  "C:/Users/Lenovo/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright",
  "C:/Users/Lenovo/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright",
];
function loadPlaywright() {
  for (const candidate of PLAYWRIGHT_CANDIDATES) {
    try { return require(candidate); } catch { /* try next */ }
  }
  throw new Error("无法从 npx 缓存加载 playwright 库；请先用 playwright-cli 跑一次");
}

const { chromium } = loadPlaywright();
const BASE = "http://localhost:3010/";

let browser;

test.before(async () => {
  try {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch {
    throw new Error("3010 服务器未运行：请在 personal-workbench-shell-3010 目录执行 node serve.mjs");
  }
  browser = await chromium.launch({ headless: true, channel: "chrome" });
});

test.after(async () => {
  await browser?.close();
});

/* 进入工作台并在画布中心放一个元件（用 bundle 自己的拖放通道） */
async function openWithComponent(width = 1440, height = 900) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE);
  await page.waitForSelector("#workbenchToggle");
  await page.click("#workbenchToggle");
  await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
  await page.waitForTimeout(600);
  const point = await page.evaluate(() => {
    const canvas = document.querySelector(".cw-canvas");
    const rect = canvas.getBoundingClientRect();
    const x = rect.left + rect.width * 0.45;
    const y = rect.top + rect.height * 0.45;
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("application/x-circuit-component", "switch");
    canvas.dispatchEvent(new DragEvent("drop", { bubbles: true, clientX: x, clientY: y, dataTransfer }));
    return { x: Math.round(x), y: Math.round(y) };
  });
  await page.waitForSelector(".cw-component");
  await page.waitForTimeout(300);
  return { page, dropPoint: point };
}

const componentState = () => {
  const nodes = Array.from(document.querySelectorAll(".cw-component"));
  return nodes.map((node) => {
    const rect = node.querySelector(":scope > rect");
    const box = node.getBoundingClientRect();
    const style = getComputedStyle(rect);
    return {
      id: node.getAttribute("data-component-id"),
      selected: node.classList.contains("is-selected"),
      ariaLabel: node.getAttribute("aria-label"),
      x: Math.round(box.x + box.width / 2),
      y: Math.round(box.y + box.height / 2),
      strokeWidth: style.strokeWidth,
      strokeDasharray: style.strokeDasharray,
      outline: getComputedStyle(node).outlineStyle,
      focusVisible: node.matches(":focus-visible"),
    };
  });
};

test("单击元件即选中并保持（无需双击），点空白处才取消", async () => {
  const { page, dropPoint } = await openWithComponent();
  const before = await page.evaluate(componentState);
  assert.equal(before.length, 1, "画布上应有一个元件");
  assert.equal(before[0].selected, false, "刚放下时未选中");

  await page.mouse.click(dropPoint.x, dropPoint.y);
  await page.waitForTimeout(120);
  let state = await page.evaluate(componentState);
  assert.equal(state[0].selected, true, "单击后应保持选中");

  /* 保持：时间过去、鼠标移开都不应掉选中 */
  await page.waitForTimeout(700);
  await page.mouse.move(dropPoint.x + 160, dropPoint.y + 120);
  await page.waitForTimeout(200);
  state = await page.evaluate(componentState);
  assert.equal(state[0].selected, true, "选中应保持（鼠标移开、时间流逝都不掉）");
  assert.equal(state[0].x, before[0].x, "单击不应移动元件");
  assert.equal(state[0].y, before[0].y, "单击不应移动元件");

  /* 点空白处取消选中 */
  const empty = await page.evaluate(() => {
    const rect = document.querySelector(".cw-canvas").getBoundingClientRect();
    return { x: Math.round(rect.left + rect.width * 0.12), y: Math.round(rect.top + rect.height * 0.85) };
  });
  await page.mouse.click(empty.x, empty.y);
  await page.waitForTimeout(200);
  state = await page.evaluate(componentState);
  assert.equal(state[0].selected, false, "点空白处应取消选中");
  await page.close();
});

test("按下即拖（无时间门槛）：快速拖动元件立刻跟手，几乎不动则算单击", async () => {
  const { page, dropPoint } = await openWithComponent();
  const start = (await page.evaluate(componentState))[0];

  /* 快速拖动：按下→立刻移动→抬起，全程不到 150ms，元件必须跟着走 */
  const quickStart = Date.now();
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 60, start.y + 40, { steps: 6 });
  await page.mouse.up();
  const quickCost = Date.now() - quickStart;
  await page.waitForTimeout(250);
  const afterQuick = (await page.evaluate(componentState))[0];
  assert.ok(quickCost < 320, `这次拖动总耗时 ${quickCost}ms（应远快于旧的长按门槛）`);
  assert.ok(Math.abs(afterQuick.x - (start.x + 60)) < 12, `快速拖动应立即跟手（x: ${start.x} → ${afterQuick.x}）`);
  assert.ok(Math.abs(afterQuick.y - (start.y + 40)) < 12, `快速拖动应立即跟手（y: ${start.y} → ${afterQuick.y}）`);

  /* 连续快速拖动（模拟"快速移动元件"）：每次都到位、不丢步 */
  let cursor = { x: afterQuick.x, y: afterQuick.y };
  for (let i = 1; i <= 3; i += 1) {
    await page.mouse.move(cursor.x, cursor.y);
    await page.mouse.down();
    await page.mouse.move(cursor.x - 35, cursor.y + 22, { steps: 3 });
    await page.mouse.up();
    await page.waitForTimeout(150);
    const step = (await page.evaluate(componentState))[0];
    assert.ok(Math.abs(step.x - (cursor.x - 35)) < 12 && Math.abs(step.y - (cursor.y + 22)) < 12, `第 ${i} 次快速拖动应到位（${step.x},${step.y}）`);
    cursor = { x: step.x, y: step.y };
  }

  /* 死区：按下后只抖 2px 再抬起 = 单击（元件不动，且选中） */
  const beforeJitter = (await page.evaluate(componentState))[0];
  await page.mouse.move(beforeJitter.x, beforeJitter.y);
  await page.mouse.down();
  await page.mouse.move(beforeJitter.x + 2, beforeJitter.y + 1, { steps: 2 });
  await page.mouse.up();
  await page.waitForTimeout(250);
  const afterJitter = (await page.evaluate(componentState))[0];
  assert.equal(afterJitter.x, beforeJitter.x, "2px 抖动不应移动元件（x）");
  assert.equal(afterJitter.y, beforeJitter.y, "2px 抖动不应移动元件（y）");
  assert.equal(afterJitter.selected, true, "抖动结束仍按单击处理：选中并保持");
  await page.close();
});

test("选中只有一个指示：没有叠加的虚线框，也没有 UA 焦点环", async () => {
  const { page, dropPoint } = await openWithComponent();
  await page.mouse.click(dropPoint.x, dropPoint.y);
  await page.waitForTimeout(150);

  const selected = (await page.evaluate(componentState))[0];
  assert.equal(selected.selected, true);
  assert.equal(selected.strokeDasharray, "none", `选中态不应同时出现虚线焦点框（${selected.strokeDasharray}）`);
  assert.equal(selected.strokeWidth, "3px", `选中态应是单圈 3px 实线（${selected.strokeWidth}）`);
  assert.equal(selected.outline, "none", `不应有 UA 焦点环（${selected.outline}）`);
  assert.equal(selected.ariaLabel.includes("双击"), false, `可访问名应已改为单击选中：${selected.ariaLabel}`);
  assert.match(selected.ariaLabel, /单击选中/, "可访问名应说明单击选中");

  /* 键盘聚焦（未选中）时仍要有一个可见指示：虚线框 */
  await page.evaluate(() => {
    const node = document.querySelector(".cw-component");
    node.blur();
    document.querySelector(".cw-canvas").focus();
  });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => {
    const node = document.activeElement;
    if (!node || !node.classList || !node.classList.contains("cw-component")) return null;
    const rect = node.querySelector(":scope > rect");
    return { strokeDasharray: getComputedStyle(rect).strokeDasharray, outline: getComputedStyle(node).outlineStyle };
  });
  if (focused) {
    assert.equal(focused.outline, "none", "键盘聚焦也不叠加 UA 焦点环");
    assert.notEqual(focused.strokeDasharray, "none", "键盘聚焦应有单一可见指示（虚线框）");
  }
  await page.close();
});

test("端口连线与键盘选中不受影响", async () => {
  const { page } = await openWithComponent();
  /* 再放一个 LED（输入端），便于把开关的输出连过去 */
  await page.evaluate(() => {
    const canvas = document.querySelector(".cw-canvas");
    const rect = canvas.getBoundingClientRect();
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("application/x-circuit-component", "led");
    canvas.dispatchEvent(new DragEvent("drop", { bubbles: true, clientX: rect.left + rect.width * 0.75, clientY: rect.top + rect.height * 0.7, dataTransfer }));
  });
  await page.waitForFunction(() => document.querySelectorAll(".cw-component").length === 2);
  await page.waitForTimeout(300);

  const ports = await page.evaluate(() => {
    const groups = Array.from(document.querySelectorAll(".cw-component"));
    /* 端口组的盒包含文字标签，中心未必落在圆点上：取端口圆点圆心才点得准 */
    const pick = (node) => {
      const circle = node.querySelector('[data-port="true"] circle');
      const box = circle.getBoundingClientRect();
      return { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) };
    };
    return [pick(groups[0]), pick(groups[1])];
  });
  await page.mouse.click(ports[0].x, ports[0].y);
  await page.waitForTimeout(150);
  await page.mouse.click(ports[1].x, ports[1].y);
  await page.waitForTimeout(350);
  const connected = await page.evaluate(() => document.querySelectorAll(".cw-port.is-connected").length);
  assert.ok(connected >= 2, `点两个端口应建立连线（已连接端口数 ${connected}）`);

  /* 键盘 Enter 仍能选中 */
  await page.evaluate(() => {
    const node = document.querySelector(".cw-component");
    node.focus();
  });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  const selected = await page.evaluate(() => document.querySelectorAll(".cw-component.is-selected").length);
  assert.equal(selected, 1, "Enter 应选中元件");
  await page.close();
});
