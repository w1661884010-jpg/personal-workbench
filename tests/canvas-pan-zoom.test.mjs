/* 画布缩放与平移：
   1) 普通滚轮在画布上缩放（bundle 原本只认 Ctrl/⌘+滚轮），且不滚动页面；
   2) 按住中键拖动平移画布；平移时网格（= 可见有效区域）跟着走，不露出无网格空带；
   3) 平移后落点/拖动坐标依然精确（坐标走 getScreenCTM）；
   4) 点"重置缩放"把平移一并归零。
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

async function openWorkbench(width = 1440, height = 900) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE);
  await page.waitForSelector("#workbenchToggle");
  await page.click("#workbenchToggle");
  await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
  await page.waitForTimeout(600);
  return page;
}

/* 画布状态：缩放标签、viewBox、网格矩形（逻辑单位与屏幕覆盖） */
const canvasState = () => {
  const svg = document.querySelector(".cw-canvas");
  const grid = svg.querySelector('rect[fill^="url(#cw-grid"]');
  const vb = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  const ctm = svg.getScreenCTM();
  const tl = new DOMPoint(+grid.getAttribute("x"), +grid.getAttribute("y")).matrixTransform(ctm);
  const br = new DOMPoint(+grid.getAttribute("x") + +grid.getAttribute("width"), +grid.getAttribute("y") + +grid.getAttribute("height")).matrixTransform(ctm);
  const box = svg.getBoundingClientRect();
  return {
    zoom: document.querySelector('.cw-zoom-controls button[aria-label="重置缩放"]').textContent,
    viewBox: vb,
    grid: { x: +grid.getAttribute("x"), y: +grid.getAttribute("y") },
    /* 网格矩形是否仍完整覆盖画布（四边偏差） */
    cover: {
      left: Math.round(tl.x - box.left), top: Math.round(tl.y - box.top),
      right: Math.round(box.right - br.x), bottom: Math.round(box.bottom - br.y),
    },
    scrollY: window.scrollY,
  };
};

test("滚轮在画布上缩放，且不滚动页面", async () => {
  const page = await openWorkbench();
  const canvas = await page.locator(".cw-canvas").boundingBox();
  const cx = Math.round(canvas.x + canvas.width / 2);
  const cy = Math.round(canvas.y + canvas.height / 2);
  await page.mouse.move(cx, cy);

  const before = await page.evaluate(canvasState);
  assert.equal(before.zoom, "100%");

  /* 旧的逐步缩放按钮已隐藏（缩放入口只剩滚轮），百分比读数保留 */
  const controls = await page.evaluate(() => {
    const pick = (label) => {
      const el = document.querySelector(`.cw-zoom-controls button[aria-label="${label}"]`);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { w: Math.round(rect.width), visible: getComputedStyle(el).display !== "none" };
    };
    return { zoomOut: pick("缩小"), zoomIn: pick("放大"), reset: pick("重置缩放"), resetText: document.querySelector('.cw-zoom-controls button[aria-label="重置缩放"]').textContent.trim() };
  });
  assert.equal(controls.zoomOut.visible, false, "逐步缩小的按钮应已隐藏");
  assert.equal(controls.zoomIn.visible, false, "逐步放大的按钮应已隐藏");
  assert.equal(controls.zoomOut.w, 0, "隐藏的按钮不占位");
  assert.equal(controls.reset.visible, true, "百分比读数应保留");
  assert.match(controls.resetText, /%$/, "读数仍是百分比");

  await page.mouse.wheel(0, 120); /* 向下滚 = 缩小一步 */
  await page.waitForTimeout(250);
  const zoomedOut = await page.evaluate(canvasState);
  assert.equal(zoomedOut.zoom, "90%", `滚轮向下应缩小 10%（实际 ${zoomedOut.zoom}）`);
  assert.equal(zoomedOut.scrollY, before.scrollY, "光标在画布上滚轮不应滚动页面");
  assert.ok(zoomedOut.viewBox[2] > before.viewBox[2], "缩小后可见平面应变大");

  await page.mouse.wheel(0, -120); /* 向上滚 = 放大回来 */
  await page.waitForTimeout(250);
  const back = await page.evaluate(canvasState);
  assert.equal(back.zoom, "100%", `滚轮向上应放大回来（实际 ${back.zoom}）`);

  for (const [edge, value] of Object.entries(back.cover)) {
    assert.ok(Math.abs(value) <= 1, `缩放后网格仍应覆盖画布 ${edge} 边（偏差 ${value}px）`);
  }
  await page.close();
});

test("中键拖动平移画布：网格跟着走、无空带、重置归零", async () => {
  const page = await openWorkbench();
  const canvas = await page.locator(".cw-canvas").boundingBox();
  const cx = Math.round(canvas.x + canvas.width / 2);
  const cy = Math.round(canvas.y + canvas.height / 2);
  const before = await page.evaluate(canvasState);

  await page.mouse.move(cx, cy);
  await page.mouse.down({ button: "middle" });
  await page.mouse.move(cx + 140, cy + 90, { steps: 8 });
  await page.mouse.up({ button: "middle" });
  await page.waitForTimeout(200);

  const panned = await page.evaluate(canvasState);
  assert.ok(Math.abs(panned.viewBox[0] - before.viewBox[0]) > 50, `中键拖动应平移视图（x: ${before.viewBox[0]} → ${panned.viewBox[0]}）`);
  assert.ok(Math.abs(panned.viewBox[1] - before.viewBox[1]) > 30, `中键拖动应平移视图（y: ${before.viewBox[1]} → ${panned.viewBox[1]}）`);
  assert.equal(panned.viewBox[2], before.viewBox[2], "平移不应改变缩放（宽度不变）");
  for (const [edge, value] of Object.entries(panned.cover)) {
    assert.ok(Math.abs(value) <= 1, `平移后网格仍应覆盖画布 ${edge} 边（偏差 ${value}px）——否则露出无网格空带`);
  }
  assert.equal(panned.scrollY, before.scrollY, "中键平移不应滚动页面");

  /* 重置缩放按钮：平移一并归零 */
  await page.click('.cw-zoom-controls button[aria-label="重置缩放"]');
  await page.waitForTimeout(200);
  const reset = await page.evaluate(canvasState);
  assert.ok(Math.abs(reset.viewBox[0] - before.viewBox[0]) <= 1 && Math.abs(reset.viewBox[1] - before.viewBox[1]) <= 1, `重置后视图应回到原点（${reset.viewBox.slice(0, 2)} vs ${before.viewBox.slice(0, 2)}）`);
  await page.close();
});

test("平移后落点依然精确；中键拖过元件不会移动它", async () => {
  const page = await openWorkbench();
  const canvas = await page.locator(".cw-canvas").boundingBox();
  const cx = Math.round(canvas.x + canvas.width / 2);
  const cy = Math.round(canvas.y + canvas.height / 2);

  /* 先平移一段 */
  await page.mouse.move(cx, cy);
  await page.mouse.down({ button: "middle" });
  await page.mouse.move(cx + 120, cy + 70, { steps: 6 });
  await page.mouse.up({ button: "middle" });
  await page.waitForTimeout(200);

  /* 在中键拖动会经过的位置放一个元件，再用中键从它身上拖过去 */
  const dropPoint = { x: cx + 40, y: cy + 30 };
  await page.evaluate(({ x, y }) => {
    const cv = document.querySelector(".cw-canvas");
    const dt = new DataTransfer();
    dt.setData("application/x-circuit-component", "switch");
    cv.dispatchEvent(new DragEvent("drop", { bubbles: true, clientX: x, clientY: y, dataTransfer: dt }));
  }, dropPoint);
  await page.waitForSelector(".cw-component");
  await page.waitForTimeout(300);
  /* 量元件本体 <rect> 的中心：<g> 的包围盒包含右侧端口标签，中心会被带偏 */
  const placed = await page.evaluate(() => {
    const r = document.querySelector(".cw-component").querySelector(":scope > rect").getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  assert.ok(Math.abs(placed.x - dropPoint.x) <= 2 && Math.abs(placed.y - dropPoint.y) <= 2, `平移后落点仍应精确命中光标（${JSON.stringify(placed)} vs ${JSON.stringify(dropPoint)}）`);

  await page.mouse.move(placed.x, placed.y);
  await page.mouse.down({ button: "middle" });
  await page.mouse.move(placed.x + 80, placed.y + 50, { steps: 5 });
  await page.mouse.up({ button: "middle" });
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => {
    const r = document.querySelector(".cw-component").querySelector(":scope > rect").getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  /* 视图平移了，元件在屏幕上的位置会跟着移动；这里验证它没有被"拖动"，即逻辑位置不变 */
  const logical = await page.evaluate(() => {
    const rect = document.querySelector(".cw-component").querySelector(":scope > rect");
    return { x: rect.x.baseVal.value, y: rect.y.baseVal.value };
  });
  const logicalAfter = await page.evaluate(() => {
    const rect = document.querySelector(".cw-component").querySelector(":scope > rect");
    return { x: rect.x.baseVal.value, y: rect.y.baseVal.value };
  });
  assert.deepEqual(logicalAfter, logical, `中键拖动不应移动元件本身（逻辑位置 ${JSON.stringify(logical)}）`);
  assert.ok(after.x !== placed.x || after.y !== placed.y, "视图平移后元件在屏幕上的位置应发生变化（说明真的平移了）");
  await page.close();
});
