/* 画布（平面坐标系）与工具栏模式切换：
   1) 画布铺满面板的弹性行 —— 否则中间那行提示被隐藏后，画布会被排进 auto 行、
      按 viewBox 的 5:3 固有比例定高，面板底部留下"看着像画布、实际不可交互"的死区；
   2) 网格（= 有效坐标范围）在任意缩放下都覆盖整块画布，不留 letterbox 空白；
   3) 中心提示是不随缩放变化的固定字号浮层，且与网格有底色隔离；
   4) 连线/探针两个等宽分段：滑动胶囊落在选中段上，两段自身不再画底色。
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

async function openWorkbench(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE);
  await page.waitForSelector("#workbenchToggle");
  await page.click("#workbenchToggle");
  await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
  await page.waitForTimeout(600);
  return page;
}

/* 缩放入口已统一为滚轮（逐步缩放的 −/+ 按钮已隐藏）：在画布上向下滚 = 缩小 10% */
async function zoomOut(page, times) {
  const box = await page.locator(".cw-canvas").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < times; i += 1) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(300);
}

/* 画布几何：面板/画布底边差、网格在屏幕空间对画布的覆盖、两处宽高比 */
const canvasGeometry = () => {
  const svg = document.querySelector(".cw-canvas");
  const panel = document.querySelector(".cw-canvas-panel");
  const grid = Array.from(svg.querySelectorAll("rect")).find((r) => (r.getAttribute("fill") || "").startsWith("url(#cw-grid"));
  const vb = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  const ctm = svg.getScreenCTM();
  const toScreen = (x, y) => new DOMPoint(x, y).matrixTransform(ctm);
  const s = svg.getBoundingClientRect();
  const p = panel.getBoundingClientRect();
  const gx = +grid.getAttribute("x");
  const gy = +grid.getAttribute("y");
  const tl = toScreen(gx, gy);
  const br = toScreen(gx + +grid.getAttribute("width"), gy + +grid.getAttribute("height"));
  return {
    panelCanvasGap: Math.round(p.bottom - s.bottom),
    letterbox: {
      left: Math.round(tl.x - s.left),
      top: Math.round(tl.y - s.top),
      right: Math.round(s.right - br.x),
      bottom: Math.round(s.bottom - br.y),
    },
    canvasAspect: +(s.width / s.height).toFixed(3),
    viewBoxAspect: +(vb[2] / vb[3]).toFixed(3),
    zoomLabel: document.querySelector('.cw-zoom-controls button[aria-label="重置缩放"]').textContent,
  };
};

for (const [width, height] of [[1440, 900], [1150, 982], [1024, 900]]) {
  test(`${width}×${height}：画布铺满面板、网格无 letterbox（100% 与 50% 缩放）`, async () => {
    const page = await openWorkbench(width, height);

    const full = await page.evaluate(canvasGeometry);
    assert.ok(full.panelCanvasGap <= 8, `画布应铺满面板底部（剩余死区 ${full.panelCanvasGap}px）`);
    for (const [edge, value] of Object.entries(full.letterbox)) {
      assert.ok(Math.abs(value) <= 1, `网格应覆盖画布 ${edge} 边（偏差 ${value}px）`);
    }
    assert.ok(Math.abs(full.canvasAspect - full.viewBoxAspect) <= 0.05, `画布与视图矩形宽高比应一致：${JSON.stringify(full)}`);

    await zoomOut(page, 5);
    const zoomed = await page.evaluate(canvasGeometry);
    assert.equal(zoomed.zoomLabel, "50%", "应缩到 50%");
    assert.ok(zoomed.panelCanvasGap <= 8, `缩到 50% 后画布仍应铺满面板（剩余 ${zoomed.panelCanvasGap}px）`);
    for (const [edge, value] of Object.entries(zoomed.letterbox)) {
      assert.ok(Math.abs(value) <= 1, `缩到 50% 后网格仍应覆盖画布 ${edge} 边（偏差 ${value}px）——否则就是无效的不可交互区域`);
    }
    await page.close();
  });
}

test("中心提示是固定字号浮层：不随缩放变小、与网格有隔离、空画布时居中", async () => {
  const page = await openWorkbench(1150, 982);
  const read = () => page.evaluate(() => {
    const el = document.querySelector(".canvas-empty-hint");
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const c = document.querySelector(".cw-canvas").getBoundingClientRect();
    return {
      w: Math.round(r.width), h: Math.round(r.height), fontSize: cs.fontSize,
      background: cs.backgroundColor, borderWidth: cs.borderTopWidth, backdrop: cs.backdropFilter,
      visible: cs.opacity === "1",
      dx: Math.round(r.left + r.width / 2 - (c.left + c.width / 2)),
      dy: Math.round(r.top + r.height / 2 - (c.top + c.height / 2)),
      text: el.textContent.trim(),
      hiddenSource: (() => {
        const text = document.querySelector(".cw-empty-canvas");
        return text ? getComputedStyle(text).display : "(bundle 已移除该节点)";
      })(),
    };
  });

  const at100 = await read();
  assert.ok(at100, "空画布时应存在中心提示浮层");
  assert.equal(at100.visible, true, "空画布时提示可见");
  assert.equal(at100.hiddenSource, "none", "bundle 原来的 SVG 文字应被隐藏（避免与浮层重叠）");
  assert.ok(Math.abs(at100.dx) <= 2 && Math.abs(at100.dy) <= 2, `提示应居于画布中心：dx=${at100.dx} dy=${at100.dy}`);
  assert.ok(parseFloat(at100.fontSize) >= 12, `提示字号应可读（${at100.fontSize}）`);
  assert.notEqual(at100.backdrop, "none", "提示需要背景隔离（模糊/底色）以免压在网格上");
  assert.ok(parseFloat(at100.borderWidth) >= 1, "提示应有描边以与画布分离");

  await zoomOut(page, 5);
  const at50 = await read();
  assert.equal(at50.w, at100.w, `缩放到 50% 后提示宽度不应变化（${at100.w} → ${at50.w}）`);
  assert.equal(at50.h, at100.h, `缩放到 50% 后提示高度不应变化（${at100.h} → ${at50.h}）`);
  assert.equal(at50.fontSize, at100.fontSize, "字号不随缩放变化");
  assert.ok(Math.abs(at50.dx) <= 2 && Math.abs(at50.dy) <= 2, "缩放后提示仍居中");

  /* 放一个元件后提示应消失（与 bundle 的空画布判定保持一致） */
  const canvas = page.locator(".cw-canvas");
  await canvas.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("application/x-circuit-component", "switch");
    el.dispatchEvent(new DragEvent("drop", { bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, dataTransfer }));
  });
  await page.waitForTimeout(400);
  const afterDrop = await read();
  assert.equal(afterDrop.visible, false, "画布上有元件后中心提示应隐藏");
  await page.close();
});

test("连线/探针：滑动胶囊落在选中段上，两段自身不再画底色", async () => {
  const page = await openWorkbench(1440, 900);
  const read = () => page.evaluate(() => {
    const container = document.querySelector(".cw-canvas-toolbar > div:first-child");
    const before = getComputedStyle(container, "::before");
    const buttons = Array.from(container.querySelectorAll("button")).map((b) => {
      const r = b.getBoundingClientRect();
      return {
        text: b.textContent.trim(), w: Math.round(r.width), x: Math.round(r.x),
        background: getComputedStyle(b).backgroundColor, color: getComputedStyle(b).color,
        pressed: b.getAttribute("aria-pressed"),
      };
    });
    return { thumbTransform: before.transform, thumbWidth: Math.round(parseFloat(before.width)), thumbWidthFloat: parseFloat(before.width), height: before.height, buttons };
  });

  const first = await read();
  assert.equal(first.buttons.length, 2, "应为两个模式分段");
  assert.equal(first.buttons[0].w, first.buttons[1].w, "两个分段应等宽（胶囊按 50% 定位的前提）");
  assert.ok(Math.abs(first.thumbWidth - first.buttons[0].w) <= 1, `胶囊宽度应等于分段宽度（${first.thumbWidth} vs ${first.buttons[0].w}）`);
  assert.match(first.thumbTransform, /matrix\(1, 0, 0, 1, 0, 0\)/, `连线态胶囊应在左侧（实际 ${first.thumbTransform}）`);
  for (const button of first.buttons) {
    assert.equal(button.background, "rgba(0, 0, 0, 0)", `分段自身不画底色，胶囊由滑块提供（${button.text}）`);
  }

  await page.click('.cw-canvas-toolbar > div:first-child > button:nth-child(2)');
  await page.waitForTimeout(450);
  const second = await read();
  assert.equal(second.buttons[1].pressed, "true", "探针模式应被选中");
  const expected = first.thumbWidthFloat + 4; /* 位移 = 胶囊宽（= 分段宽）+ 4px 间隙 */
  const shift = Number((second.thumbTransform.match(/matrix\(1, 0, 0, 1, ([\d.-]+),/) || [])[1]);
  assert.ok(Math.abs(shift - expected) <= 1, `胶囊应滑到第二段（位移 ${shift} 期望 ${expected}）`);
  assert.notEqual(second.buttons[1].color, first.buttons[1].color, "选中段文字应提亮");
  await page.close();
});
