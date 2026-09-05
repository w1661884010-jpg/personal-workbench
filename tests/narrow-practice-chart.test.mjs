/* 演练页图表适配回归测试（真实浏览器，隔离 context）：
   - X 轴刻度按绘图区宽度自适应（窄图减少显示刻度）：窄屏下刻度标签不再与“t / s / 样本 n”单位重叠；
   - Canvas 属性尺寸与 CSS 尺寸 × devicePixelRatio 一致（不拉伸/不模糊）；CSS 高度保持（不压扁）；
   - 图例在画布之下文档流内（不遮曲线）；
   - 六个演练全部覆盖；窄/宽两档绘图区对比。
   先失败后通过：修复前运行，单位与末端刻度重叠断言失败。 */
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

async function openPractice(page) {
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector("#practiceToggle");
  await page.evaluate(() => document.getElementById("practiceToggle").click());
  await page.waitForSelector(".notebook-demo", { state: "visible", timeout: 8000 });
  await page.waitForTimeout(500);
}

async function openTab(page, index) {
  await page.locator(".practice-tab").nth(index).click();
  await page.waitForTimeout(350);
}

/* 在页面里挂 fillText 记录器，清空后触发一次窗口 resize 让当前宽度上的 draw() 重绘 */
async function captureTexts(page) {
  await page.evaluate(() => {
    if (!window.__textPatch) {
      window.__textPatch = true;
      const orig = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxW) {
        window.__texts = window.__texts || [];
        window.__texts.push({ text: String(text), x, y, cw: this.canvas ? this.canvas.clientWidth : 0 });
        return orig.call(this, text, x, y, maxW);
      };
    }
    window.__texts = [];
    window.dispatchEvent(new Event("resize"));
  });
  await page.waitForTimeout(300);
  return page.evaluate(() => window.__texts || []);
}

const UNIT_PATTERN = /\/|样本/;

test("390px：X 刻度与单位不重叠（刻度数量按绘图区宽度收敛）", async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  try {
    await openPractice(page);
    /* 演练1（信号观察）：5 段网格 + “t / s” —— 只统计可见画布（clientWidth ≥ 200，滤除切页瞬态绘制） */
    const texts = (await captureTexts(page)).filter((t) => t.cw >= 200);
    const unit = texts.filter((t) => UNIT_PATTERN.test(t.text));
    assert.ok(unit.length >= 1, "应存在单位标签");
    const tickLabels = texts.filter((t) => /^[-\d]/.test(t.text));
    const sameRow = (a, b) => Math.abs(a.y - b.y) <= 2;
    /* 单位行内不得有刻度标签与单位水平距离 < 14px */
    let collision = 0;
    for (const u of unit) {
      for (const t of tickLabels) {
        if (sameRow(t, u) && Math.abs(t.x - u.x) < 14) collision += 1;
      }
    }
    assert.equal(collision, 0, `末端刻度与单位重叠 ${collision} 处（unit=${JSON.stringify(unit.slice(0, 2))} ticks=${JSON.stringify(tickLabels.slice(0, 8))}）`);
    /* 窄图应减少显示刻度：单位行内的数字刻度 ≤ 4（含 Y 轴同行标签不算） */
    const unitRowTicks = tickLabels.filter((t) => unit.some((u) => Math.abs(t.y - u.y) <= 2));
    assert.ok(unitRowTicks.length <= 4, `窄图刻度应减少（单位行实际 ${unitRowTicks.length} 个：${JSON.stringify(unitRowTicks)}）`);
    /* 六演练逐一重测（每个演练独立 canvas） */
    for (let t = 1; t < 6; t += 1) {
      await openTab(page, t);
      const texts2 = (await captureTexts(page)).filter((tt) => tt.cw >= 200);
      const u2 = texts2.filter((tt) => UNIT_PATTERN.test(tt.text));
      const ticks2 = texts2.filter((tt) => /^[-\d]/.test(tt.text));
      let c2 = 0;
      for (const u of u2) {
        for (const tt of ticks2) {
          if (sameRow(tt, u) && Math.abs(tt.x - u.x) < 14) c2 += 1;
        }
      }
      assert.equal(c2, 0, `演练${t + 1} 末端刻度与单位重叠 ${c2} 处`);
    }
  } finally { await page.context().close(); }
});

test("1440px：宽图刻度完整且与单位不重叠", async () => {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  try {
    await openPractice(page);
    const texts = (await captureTexts(page)).filter((t) => t.cw >= 200);
    const unit = texts.filter((t) => UNIT_PATTERN.test(t.text));
    const ticks = texts.filter((t) => /^[-\d]/.test(t.text));
    assert.ok(ticks.length >= 4, `宽图应保留较多刻度（实际 ${ticks.length}）`);
    let collision = 0;
    for (const u of unit) {
      for (const t of ticks) {
        if (Math.abs(t.y - u.y) <= 2 && Math.abs(t.x - u.x) < 14) collision += 1;
      }
    }
    assert.equal(collision, 0, `宽图末端刻度与单位重叠 ${collision} 处`);
  } finally { await page.context().close(); }
});

test("Canvas 属性尺寸与 CSS 尺寸 × DPR 一致（390/760/1440 × 六演练），CSS 高度保持", async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  try {
    for (const width of [390, 760, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await openPractice(page);
      for (let t = 0; t < 6; t += 1) {
        await openTab(page, t);
        const s = await page.evaluate(`(() => {
          const c = document.querySelector('.demo-canvas');
          const r = c.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          return { w: c.width, h: c.height, cssW: r.width, cssH: r.height, dpr };
        })()`);
        assert.ok(Math.abs(s.w - Math.round(s.cssW * s.dpr)) <= 1, `${width}px 演练${t + 1} canvas.width 应等于 CSS×DPR（${s.w} vs ${s.cssW}×${s.dpr}）`);
        assert.ok(Math.abs(s.h - Math.round(s.cssH * s.dpr)) <= 1, `${width}px 演练${t + 1} canvas.height 应等于 CSS×DPR`);
        assert.ok(s.cssH >= 230, `${width}px 演练${t + 1} 画布高度不应被压扁（实际 ${s.cssH}）`);
      }
    }
  } finally { await page.context().close(); }
});

test("图例在画布下方文档流内，不遮曲线", async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  try {
    await openPractice(page);
    const s = await page.evaluate(`(() => {
      const c = document.querySelector('.demo-canvas').getBoundingClientRect();
      const l = document.querySelector('.demo-legend').getBoundingClientRect();
      return { cTop: c.top, cBottom: c.bottom, lTop: l.top, lBottom: l.bottom, wrap: getComputedStyle(document.querySelector('.demo-legend')).flexWrap };
    })()`);
    assert.ok(s.lTop >= s.cBottom - 2, `图例应在画布之下（legend.top=${s.lTop} canvas.bottom=${s.cBottom}）`);
    assert.equal(s.wrap, "wrap", "图例允许自然换行");
  } finally { await page.context().close(); }
});
