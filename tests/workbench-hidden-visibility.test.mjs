/* 工作台切换器 hidden 失效回归测试（真实浏览器，隔离 context）：
   - 根因：≤820px `.workbench-stage { display:flex }` 与 `.limit-tip-button { display:inline-flex }`
     是作者样式，覆盖 UA 的 `[hidden] { display:none }`——hidden 属性已正确设置，是纯 CSS 覆盖问题。
   - 断言计算样式/实际可见性/布局尺寸/可聚焦性，不只看 hidden 属性；
   - A：课程页直开（390/405/820/821/900/1440）stage 计算样式 none、无尺寸、不可聚焦；
   - B：数字台 → 返回教材（停留 700ms 后）无残留；
   - C：模拟台 → 教材、工作台 → 演练、工作台 → 错题均无切换器/说明图标/空白占位；
   - D：重新进入工作台，切换器正常、切换（含动画路径）正常；
   - E：说明图标 hidden=true 时隐藏、需要说明时显示；
   - F：停留课程页跨 820 断点缩放（390→820→821→900→1440→390）全程保持隐藏。 */
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

async function newPage(width = 390, height = 900) {
  return (await browser.newContext({ viewport: { width, height } })).newPage();
}

async function openLesson(page) {
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector("#lessonBody", { state: "visible" });
  await page.waitForTimeout(300);
}

/* 可见性快照：stage/切换器/说明图标的计算样式、尺寸与可聚焦性 */
const visScript = () => {
  const stage = document.getElementById("workbenchStage");
  const sw = document.getElementById("kindSwitcher");
  const tip = document.getElementById("workbenchLimit");
  const btn = sw ? sw.querySelector(".kind-switch-button") : null;
  const probe = (el) => {
    if (!el) return { exists: false };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { exists: true, display: cs.display, visibility: cs.visibility, w: r.width, h: r.height, hiddenAttr: el.hidden === true };
  };
  const focusable = (() => {
    if (!btn) return null;
    btn.focus();
    return document.activeElement === btn;
  })();
  return {
    stage: probe(stage), switcher: probe(sw), tip: probe(tip), focusable,
    documentRectVisible: (() => { const r = stage.getBoundingClientRect(); return r.width > 0 || r.height > 0; })(),
  };
};

const WIDTHS = [390, 405, 820, 821, 900, 1440];

test("A：课程页直开——工作台容器 display:none、无布局尺寸、不可聚焦（六视口）", async () => {
  const page = await newPage();
  try {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await openLesson(page);
      const s = await page.evaluate(visScript);
      assert.equal(s.stage.display, "none", `${width}px stage 计算样式应为 none（实际 ${s.stage.display}）`);
      assert.equal(s.stage.w, 0, `${width}px stage 无宽度`);
      assert.equal(s.stage.h, 0, `${width}px stage 无高度`);
      assert.equal(s.focusable, false, `${width}px 切换器按钮不可聚焦`);
      assert.equal(s.documentRectVisible, false, `${width}px 容器无布局尺寸`);
    }
  } finally { await page.context().close(); }
});

test("B：数字工作台 → 返回教材（停留 700ms）——无残留无占位", async () => {
  const page = await newPage(390);
  try {
    await openLesson(page);
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForSelector('.prototype-workbench-session[data-kind="digital"] .circuit-workbench', { state: "visible", timeout: 8000 });
    await page.waitForTimeout(400);
    /* 返回教材 */
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForSelector("#lessonBody", { state: "visible" });
    await page.waitForTimeout(700); /* 停留，不立即重进 */
    const s = await page.evaluate(visScript);
    assert.equal(s.stage.display, "none", "返回后 stage 应为 none");
    assert.equal(s.stage.w, 0, "返回后 stage 无宽度");
    assert.equal(s.switcher.w, 0, "切换器无占位");
    assert.equal(s.tip.w, 0, "说明图标无占位");
    assert.equal(s.focusable, false, "返回后切换器不可聚焦");
  } finally { await page.context().close(); }
});

test("C：模拟台→教材 / 工作台→演练 / 工作台→错题——不残留切换器与说明图标", async () => {
  const page = await newPage(390);
  try {
    await openLesson(page);
    /* 模拟台 → 教材 */
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForSelector('.prototype-workbench-session[data-kind="digital"] .circuit-workbench', { state: "visible", timeout: 8000 });
    await page.evaluate(() => document.querySelector('.kind-switch-button[data-kind="analog"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
    await page.waitForSelector('.prototype-workbench-session[data-kind="analog"] .circuit-workbench', { state: "visible", timeout: 8000 });
    await page.waitForTimeout(400);
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForTimeout(700);
    let s = await page.evaluate(visScript);
    assert.equal(s.stage.display, "none", "模拟台→教材 无残留");
    assert.equal(s.switcher.w, 0);
    assert.equal(s.tip.w, 0);
    /* 工作台 → 演练 */
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForSelector('.prototype-workbench-session[data-kind="digital"] .circuit-workbench', { state: "visible", timeout: 8000 });
    await page.waitForTimeout(300);
    await page.evaluate(() => document.getElementById("practiceToggle").click());
    await page.waitForSelector(".notebook-demo", { state: "visible", timeout: 8000 });
    await page.waitForTimeout(700);
    s = await page.evaluate(visScript);
    assert.equal(s.stage.display, "none", "工作台→演练 无残留");
    assert.equal(s.switcher.w, 0);
    /* 工作台 → 错题 */
    await page.evaluate(() => document.getElementById("mistakeToggle").click());
    await page.waitForTimeout(700);
    s = await page.evaluate(visScript);
    assert.equal(s.stage.display, "none", "工作台→错题 无残留");
    assert.equal(s.switcher.w, 0);
    assert.equal(s.tip.w, 0);
  } finally { await page.context().close(); }
});

test("D：重新进入工作台——切换器正常显示、数字/模拟切换（动画路径）正常", async () => {
  const page = await newPage(390);
  try {
    await openLesson(page);
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForSelector('.prototype-workbench-session[data-kind="digital"] .circuit-workbench', { state: "visible", timeout: 8000 });
    await page.waitForTimeout(400);
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForTimeout(700);
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForSelector('.prototype-workbench-session[data-kind="digital"] .circuit-workbench', { state: "visible", timeout: 8000 });
    await page.waitForTimeout(500);
    const s = await page.evaluate(visScript);
    assert.equal(s.stage.display, "flex", "重进后 stage 应显示（≤820 flex）");
    assert.ok(s.stage.w > 100, "重进后 stage 有宽度");
    assert.ok(s.switcher.w > 0 && s.switcher.h > 0, "切换器可见");
    /* 动画路径切换：数字 → 模拟，thumb 位移 */
    await page.evaluate(() => document.querySelector('.kind-switch-button[data-kind="analog"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
    await page.waitForSelector('.prototype-workbench-session[data-kind="analog"] .circuit-workbench', { state: "visible", timeout: 8000 });
    await page.waitForTimeout(400);
    const tr = await page.evaluate(() => document.querySelector(".kind-thumb").style.transform);
    assert.match(tr, /translateX\(100%\)/, `模拟态滑块应横向位移（实际 ${tr}）`);
  } finally { await page.context().close(); }
});

test("E：说明图标——hidden=true 时隐藏，需要说明时显示", async () => {
  const page = await newPage(390);
  try {
    await openLesson(page);
    let s = await page.evaluate(visScript);
    assert.equal(s.tip.hiddenAttr, true, "课程页 tip hidden=true");
    /* 进入工作台并等待 updateWorkbenchLimit(600ms)：默认实验含边界说明 → 图标显示 */
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForSelector('.prototype-workbench-session[data-kind="digital"] .circuit-workbench', { state: "visible", timeout: 8000 });
    await page.waitForTimeout(900);
    s = await page.evaluate(visScript);
    assert.equal(s.tip.hiddenAttr, false, "需要说明时 tip 取消 hidden");
    assert.ok(s.tip.w > 0, "需要说明时图标可见");
    /* 返回教材后：父容器 display:none → 图标无布局尺寸（不依赖属性值——属性可能保留上次状态） */
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForTimeout(700);
    s = await page.evaluate(visScript);
    assert.equal(s.stage.display, "none", "返回后 stage 为 none");
    assert.equal(s.tip.w, 0, "返回后说明图标无布局尺寸");
    assert.equal(s.stage.h, 0, "无空白占位");
  } finally { await page.context().close(); }
});

test("F：停留课程页跨 820 断点缩放——全程保持隐藏", async () => {
  const page = await newPage(390);
  try {
    await openLesson(page);
    for (const width of [820, 821, 900, 1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);
      const s = await page.evaluate(visScript);
      assert.equal(s.stage.display, "none", `${width}px（跨断点）stage 应保持 none`);
      assert.equal(s.stage.w, 0, `${width}px stage 无尺寸`);
      assert.equal(s.tip.w, 0, `${width}px tip 无尺寸`);
    }
  } finally { await page.context().close(); }
});
