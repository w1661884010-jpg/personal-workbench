/* 拖动时的"不可重叠"效果：
   bundle 的 ta() 在目标位置与别的元件重叠时会做 24 单位环状搜索取第一个空位，
   指针每动一下环序就变 → 元件在两处之间反复回弹（视觉抽搐）。
   app.js 在拖动期间用同一套 AABB + 20 间隔自己判定，只把空位喂给 bundle，
   并在贴住时沿墙滑动。这个测试守住三条：
     1) 任何时刻两个元件都不重叠（含 20 单位间隔）；
     2) 朝邻居推的过程中位置单调逼近，不来回跳；
     3) 退开后能立刻恢复跟手（没有被过滤卡死）。
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
const GAP = 20; /* 与 bundle 的 ch 常数一致 */

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

const readBoxes = () => {
  const nodes = Array.from(document.querySelectorAll(".cw-component"));
  return nodes.map((node) => {
    const rect = node.querySelector(":scope > rect");
    return {
      id: node.getAttribute("data-component-id"),
      x: rect.x.baseVal.value,
      y: rect.y.baseVal.value,
      width: rect.width.baseVal.value,
      height: rect.height.baseVal.value,
      centerX: rect.x.baseVal.value + rect.width.baseVal.value / 2,
      centerY: rect.y.baseVal.value + rect.height.baseVal.value / 2,
    };
  });
};

function overlapDepth(a, b, gap = GAP) {
  const half = gap / 2;
  const overlapX = Math.min(a.x + a.width + half, b.x + b.width + half) - Math.max(a.x - half, b.x - half);
  const overlapY = Math.min(a.y + a.height + half, b.y + b.height + half) - Math.max(a.y - half, b.y - half);
  return overlapX > 0 && overlapY > 0 ? Math.min(overlapX, overlapY) : 0;
}

async function setUpPair(page) {
  await page.goto(BASE);
  await page.waitForSelector("#workbenchToggle");
  await page.click("#workbenchToggle");
  await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
  await page.waitForTimeout(600);
  const drops = await page.evaluate(() => {
    const canvas = document.querySelector(".cw-canvas");
    const r = canvas.getBoundingClientRect();
    const put = (kind, fx, fy) => {
      const dt = new DataTransfer();
      dt.setData("application/x-circuit-component", kind);
      const clientX = r.left + r.width * fx;
      const clientY = r.top + r.height * fy;
      canvas.dispatchEvent(new DragEvent("drop", { bubbles: true, clientX, clientY, dataTransfer: dt }));
      return { x: Math.round(clientX), y: Math.round(clientY) };
    };
    return { left: put("switch", 0.28, 0.45), right: put("and", 0.68, 0.45) };
  });
  await page.waitForFunction(() => document.querySelectorAll(".cw-component").length === 2);
  await page.waitForTimeout(300);
  return drops;
}

test("朝邻居拖动时单调逼近并停住，不来回回弹；退开后立刻恢复", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const drops = await setUpPair(page);
  const ids = (await page.evaluate(readBoxes)).map((box) => box.id);
  const [movedId, staticId] = ids;

  const startBoxes = await page.evaluate(readBoxes);
  const movedStart = startBoxes.find((box) => box.id === movedId);
  const staticBox = startBoxes.find((box) => box.id === staticId);
  assert.equal(overlapDepth(movedStart, staticBox), 0, "初始两个元件不应重叠");

  /* 按住左侧元件，向右一点点推 */
  await page.mouse.move(drops.left.x, drops.left.y);
  await page.mouse.down();
  await page.waitForTimeout(60);

  const samples = [];
  for (let step = 1; step <= 22; step += 1) {
    await page.mouse.move(drops.left.x + step * 18, drops.left.y, { steps: 1 });
    await page.waitForTimeout(45);
    const boxes = await page.evaluate(readBoxes);
    const moved = boxes.find((box) => box.id === movedId);
    const fixed = boxes.find((box) => box.id === staticId);
    samples.push({ step, movedX: moved.centerX, moved, depth: overlapDepth(moved, fixed) });
  }
  await page.mouse.up();
  await page.waitForTimeout(200);

  /* 1) 全程不重叠（含 20 单位间隔） */
  const worst = samples.reduce((max, sample) => Math.max(max, sample.depth), 0);
  assert.equal(worst, 0, `拖动全程都不应重叠（最深 ${worst.toFixed(1)} 单位）`);

  /* 2) 单调逼近：不允许回到"上一步之内"（旧实现的环状搜索会产生 ±24 单位的回跳） */
  let maxBackstep = 0;
  for (let i = 1; i < samples.length; i += 1) {
    const delta = samples[i].movedX - samples[i - 1].movedX;
    if (delta < 0) maxBackstep = Math.max(maxBackstep, -delta);
  }
  assert.ok(maxBackstep <= 3, `向右推的过程中不应回跳（最大回跳 ${maxBackstep.toFixed(1)} 单位）`);

  /* 3) 确实被邻居挡住：前进了一段，但停在邻居左侧且仍有间隔 */
  const finalMoved = samples[samples.length - 1].moved;
  assert.ok(finalMoved.centerX > movedStart.centerX + 60, `元件应确实向右移动了（${movedStart.centerX.toFixed(0)} → ${finalMoved.centerX.toFixed(0)}）`);
  assert.ok(finalMoved.x + finalMoved.width <= staticBox.x - GAP / 2 + 1, "应停在邻居左侧并保留间隔");

  /* 4) 退开立刻恢复跟手：重新按住元件当前位置（被挡住后指针已经越过它），再往左拖 */
  const beforeBack = finalMoved.centerX;
  const grab = await page.evaluate((id) => {
    const node = Array.from(document.querySelectorAll(".cw-component")).find((n) => n.getAttribute("data-component-id") === id);
    const r = node.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  }, movedId);
  await page.mouse.move(grab.x, grab.y);
  await page.mouse.down();
  for (let step = 1; step <= 8; step += 1) {
    await page.mouse.move(grab.x - step * 20, grab.y, { steps: 1 });
    await page.waitForTimeout(45);
  }
  await page.mouse.up();
  await page.waitForTimeout(200);
  const afterBack = (await page.evaluate(readBoxes)).find((box) => box.id === movedId);
  assert.ok(afterBack.centerX < beforeBack - 60, `向左退开后应恢复跟随（${beforeBack.toFixed(0)} → ${afterBack.centerX.toFixed(0)}）`);
  const finalFixed = (await page.evaluate(readBoxes)).find((box) => box.id === staticId);
  assert.equal(overlapDepth(afterBack, finalFixed), 0, "退开后仍不应重叠");
  await page.close();
});
