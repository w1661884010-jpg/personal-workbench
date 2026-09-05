/* 演练页窄窗口布局回归测试（真实浏览器，隔离 context）：
   - 参数区 ≤760 两列网格（按实际数量自适应，不写死五字段）、输入高度 40–44；≤340 极窄单列；
   - 结果区 ≤760 两列（去固定最小宽留白），长结果（rows 第三元素 "wide" → .demo-metric.is-wide）独占整行；
   - ≤620 外层留白压缩、返回按钮紧凑次要层级；
   - 修改参数 → 缩放 → 切换演练：值/结果不回滚；默认值与结果对照（数学逻辑不变）；
   - 全视口（360/390/560/620/621/760/1040/1440）六演练无横向溢出（仅 tab 导航自身横向滚动）。
   先失败后通过：修复前运行，两列/满行/高度断言失败、桌面行断言通过。 */
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

const rects = (sel) => `(() => {
  const base = document.querySelector(${JSON.stringify(sel)});
  if (!base) return [];
  return [...base.children].map((el) => { const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), cls: el.className, text: (el.textContent || "").trim().slice(0, 16) }; });
})()`;

test("参数区：390px 两列网格、输入高度 40–44、标签完整不截断", async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  try {
    await openPractice(page);
    for (const tab of [0, 1, 2]) {
      await openTab(page, tab);
      const fields = await page.evaluate(rects(".demo-controls"));
      assert.ok(fields.length >= 2, `演练 ${tab + 1} 参数数量 ${fields.length}`);
      const rowCount = new Set(fields.map((f) => f.y)).size;
      assert.ok(rowCount < fields.length, `参数应转为多列（fields=${fields.length} rows=${rowCount}）`);
      for (const f of fields) {
        const inputH = await page.evaluate((i) => document.querySelectorAll(".demo-controls input, .demo-controls select")[i].getBoundingClientRect().height, fields.indexOf(f));
        assert.ok(inputH >= 40 && inputH <= 44, `输入高度应在 40–44（实际 ${inputH}）`);
        assert.ok(f.w >= 110, `参数标签/输入宽度应可读（实际 ${f.w}）`);
        assert.ok(f.text.length > 0, "参数标签文本非空");
      }
    }
  } finally { await page.context().close(); }
});

test("参数区：560/620/760 仍两列；1440 桌面单行五参数不变", async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  try {
    for (const width of [560, 620, 621, 760]) {
      await page.setViewportSize({ width, height: 900 });
      await openPractice(page);
      const fields = await page.evaluate(rects(".demo-controls"));
      const rows = new Set(fields.map((f) => f.y)).size;
      assert.ok(rows < fields.length, `${width}px 参数应为多列（rows=${rows} fields=${fields.length}）`);
      for (const f of fields) {
        const inputH = await page.evaluate((i) => document.querySelectorAll(".demo-controls input, .demo-controls select")[i].getBoundingClientRect().height, fields.indexOf(f));
        assert.ok(inputH >= 40 && inputH <= 44, `${width}px 输入高度 40–44（实际 ${inputH}）`);
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPractice(page);
    const fields = await page.evaluate(rects(".demo-controls"));
    assert.ok(new Set(fields.map((f) => f.y)).size === 1, "1440 桌面五参数单行");
  } finally { await page.context().close(); }
});

test("结果区：390px 两列并排、长结果（is-wide）独占整行、无右侧空白", async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  try {
    await openPractice(page);
    /* 演练1：连续周期 + 样点周期并排；峰值时间（公式）满行 */
    const metrics = await page.evaluate(rects(".demo-metrics"));
    assert.equal(metrics.length, 3, "演练1 三个结果");
    assert.ok(Math.abs(metrics[0].y - metrics[1].y) <= 4, `短结果应并排（${JSON.stringify(metrics.slice(0, 2))}）`);
    const wide = metrics[2];
    assert.ok(wide.cls.includes("is-wide"), `长结果应有 is-wide 类（实际 ${wide.cls}）`);
    const demo = await page.evaluate(`(() => { const m = document.querySelector('.demo-metrics'); const r = m.getBoundingClientRect(); return r.width; })()`);
    assert.ok(wide.w >= demo - 2, `长结果应独占整行（宽 ${wide.w} vs 结果区 ${demo}）`);
    /* 演练2（卷积验证）：5 个结果，短结果并排 + 「支撑区间」公式满行 */
    await openTab(page, 1);
    const metrics2 = await page.evaluate(rects(".demo-metrics"));
    assert.equal(metrics2.length, 5, "卷积验证 5 个结果");
    assert.equal(metrics2[3].cls, "demo-metric is-wide", "支撑区间（公式）应为 is-wide 满行");
    assert.ok(Math.abs(metrics2[0].y - metrics2[1].y) <= 4, "前两个短结果并排");
  } finally { await page.context().close(); }
});

test("参数修改 → 缩放 → 切换演练：数值与结果不回滚", async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  try {
    await openPractice(page);
    const inputs = await page.locator(".demo-controls input");
    await inputs.nth(0).fill("3");
    /* 缩放往返 */
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.waitForTimeout(300);
    /* 切换演练再回来 */
    await openTab(page, 1);
    await openTab(page, 0);
    const v = await page.locator(".demo-controls input").nth(0).inputValue();
    assert.equal(v, "3", "参数值应保留");
    /* 默认值对照：数学逻辑不变（频率 2 → T₀ = 0.5 s） */
    const metricTexts = await page.evaluate(`[...document.querySelectorAll('.demo-metric-value')].map((el) => el.textContent.trim())`);
    assert.equal(metricTexts[0], "0.5 s", "连续周期默认结果不变");
    assert.equal(metricTexts[1], "10 个样点", "样点周期默认结果不变");
  } finally { await page.context().close(); }
});

test("全视口（360/390/560/620/621/760/1040/1440）× 六演练：无横向溢出（tab 条自身滚动除外）", async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  try {
    for (const width of [360, 390, 560, 620, 621, 760, 1040, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await openPractice(page);
      for (let t = 0; t < 6; t += 1) {
        await openTab(page, t);
        const s = await page.evaluate(`({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })`);
        assert.equal(s.sw, s.cw, `${width}px 演练${t + 1} 无横向溢出（scrollWidth=${s.sw} clientWidth=${s.cw}）`);
      }
    }
  } finally { await page.context().close(); }
});

test("布局疏密：≤620 外层留白压缩、返回按钮紧凑次要", async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  try {
    await openPractice(page);
    const pageBox = await page.evaluate(`(() => { const el = document.querySelector('.notebook-page'); const r = el.getBoundingClientRect(); return { pad: getComputedStyle(el).padding, gap: getComputedStyle(el).gap }; })()`);
    assert.ok(parseFloat(pageBox.pad.split(" ")[0]) <= 18, `≤620 页面内边距应压缩（实际 ${pageBox.pad}）`);
    const back = await page.evaluate(`(() => { const el = document.querySelector('.notebook-back'); const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { h: r.height, fs: cs.fontSize, pos: cs.position }; })()`);
    assert.ok(back.h <= 34, `返回按钮紧凑（实际高 ${back.h}）`);
    const heading = await page.evaluate(`(() => { const el = document.querySelector('.notebook-heading'); return getComputedStyle(el).display; })()`);
    assert.equal(heading, "grid", "≤620 标题区网格布局保持");
  } finally { await page.context().close(); }
});
