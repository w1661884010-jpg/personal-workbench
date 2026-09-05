/* 窄窗口工作台布局整理回归测试（真实浏览器，隔离 context）：
   - ≤820px：横向紧凑分段切换器（约 176×44、两项等宽）、说明图标在切换器旁边（同行不覆盖）、
     thumb 横向位移且始终在轨道内；跨断点 760↔1440 transform 方向正确归位；
   - 821-900px：竖向切换器保持（64×80、translateY）；
   - ≤820px：运行按钮换行且启动类（cw-primary）优先；实验目标选择框独占一行、操作紧随其后；
     存区分组（名称+保存+另存 / 选择+载入+删除 / 清空与全删低强调）；输入可收缩、按钮不竖排；
   - 1440px 桌面布局对照护栏（修改前后都应通过）。
   先失败后通过：阶段 B 实现前运行，窄屏断言失败、桌面对照通过。 */
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
const sessionSel = (kind) => `.prototype-workbench-session[data-kind="${kind}"]`;

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

async function openDigital(page) {
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForSelector("#workbenchToggle");
  await page.evaluate(() => document.getElementById("workbenchToggle").click());
  await page.waitForSelector(`${sessionSel("digital")} .circuit-workbench`, { state: "visible", timeout: 8000 });
  await page.waitForTimeout(400);
}

const snapScript = () => {
  const pick = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
  };
  const overlaps = (a, b) => !!(a && b) && !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
  const sw = document.getElementById("kindSwitcher");
  const thumb = document.querySelector(".kind-thumb");
  const tip = document.getElementById("workbenchLimit");
  const visible = document.querySelector(".prototype-workbench-session:not([hidden])");
  const segs = [...sw.querySelectorAll(".kind-switch-button")].map((b) => ({ text: b.textContent.trim(), rect: pick(b) }));
  const runBtns = [...(visible?.querySelectorAll(".cw-run-controls button") ?? [])].map((b) => ({ text: b.textContent.trim(), primary: b.classList.contains("cw-primary"), rect: pick(b) }));
  const strip = visible?.querySelector(".cw-experiment-strip") ?? null;
  const select = strip?.querySelector("select") ?? null;
  const actions = strip?.querySelector(".cw-experiment-actions") ?? null;
  const bar = visible?.querySelector(".cw-storage-bar") ?? null;
  const barKids = bar ? [...bar.children].map((el, i) => ({ i: i + 1, cls: el.className, text: (el.textContent || "").trim().slice(0, 14), rect: pick(el) })) : [];
  const canvasPanel = visible?.querySelector(".cw-canvas-panel") ?? null;
  const cs = (el, prop) => el ? getComputedStyle(el)[prop] : null;
  const danger = bar ? bar.querySelector(".cw-danger") : null;
  const primaryRun = runBtns.find((b) => b.primary);
  return {
    viewport: window.innerWidth,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    switcher: pick(sw), thumb: pick(thumb), segments: segs,
    thumbTransform: thumb ? cs(thumb, "transform") : null,
    thumbInsideSwitcher: (() => { const t = pick(thumb), s = pick(sw); return !!(t && s) && t.x >= s.x - 0.6 && t.y >= s.y - 0.6 && t.x + t.w <= s.x + s.w + 0.6 && t.y + t.h <= s.y + s.h + 0.6; })(),
    tip: pick(tip), tipVisible: !!tip && cs(tip, "display") !== "none" && tip.getBoundingClientRect().width > 0,
    tipBesideSwitcher: (() => { const t = pick(tip), s = pick(sw); return !!(t && s) && t.y + t.h > s.y && t.y < s.y + s.h && t.x >= s.x + s.w; })(),
    tipOverlapsSwitcher: overlaps(pick(tip), pick(sw)),
    tipOverlapsStrip: overlaps(pick(tip), pick(strip)),
    runBtns, strip: pick(strip), select: pick(select), actions: pick(actions),
    selectAboveActions: (() => { const a = pick(actions), b = pick(select); return !!(a && b) && b.y + b.h <= a.y + 2; })(),
    bar: pick(bar), barKids,
    primaryFirst: (() => { const p = primaryRun; const others = runBtns.filter((b) => !b.primary).map((b) => b.rect); return !!p && others.every((o) => o.x >= p.rect.x - 0.6); })(),
    runWrapable: cs(visible?.querySelector(".cw-run-controls"), "flexWrap"),
    buttonsHorizontal: runBtns.every((b) => cs(document.querySelector(".cw-run-controls"), "flexWrap") !== null && b.rect.h <= 40),
    canvas: pick(canvasPanel),
  };
};

const NARROW = [390, 560, 760, 820];

for (const width of NARROW) {
  test(`窄窗口 ${width}px：切换器为横向等宽分段（约 176×44），滑块横向且在轨道内`, async () => {
    const page = await browser.newContext({ viewport: { width, height: 900 } }).then((c) => c.newPage());
    try {
      await openDigital(page);
      const s = await page.evaluate(snapScript);
      assert.ok(Math.abs(s.switcher.w - 176) <= 4, `切换器宽度应约 176px（实际 ${s.switcher.w}）`);
      assert.ok(Math.abs(s.switcher.h - 44) <= 4, `切换器高度应约 44px（实际 ${s.switcher.h}）`);
      assert.equal(s.segments.length, 2, "两个分段");
      assert.ok(Math.abs(s.segments[0].rect.w - s.segments[1].rect.w) <= 3, `两项等宽（${s.segments[0].rect.w} vs ${s.segments[1].rect.w}）`);
      assert.equal(s.thumbInsideSwitcher, true);
      assert.match(s.thumbTransform, /matrix\(1, 0, 0, 1, 0, 0\)/, `数字态应 translateX(0)（实际 ${s.thumbTransform}）`);
      assert.ok(Math.abs(s.thumb.w - 84) <= 3, `thumb 宽度应约 84px（实际 ${s.thumb.w}）`);
      /* 切模拟：横向 84px 位移 */
      await page.evaluate(() => document.querySelector('.kind-switch-button[data-kind="analog"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
      await page.waitForSelector(`${sessionSel("analog")} .circuit-workbench`, { state: "visible", timeout: 8000 });
      await page.waitForTimeout(400);
      const s2 = await page.evaluate(snapScript);
      assert.match(s2.thumbTransform, /matrix\(1, 0, 0, 1, 84, 0\)/, `模拟态应 translateX(100%)（实际 ${s2.thumbTransform}）`);
      assert.equal(s2.thumbInsideSwitcher, true);
      await page.close();
    } finally {
      await page.context().close();
    }
  });
}

for (const width of NARROW) {
  test(`窄窗口 ${width}px：说明图标在切换器旁边同行且不遮挡`, async () => {
    const page = await browser.newContext({ viewport: { width, height: 900 } }).then((c) => c.newPage());
    try {
      await openDigital(page);
      const s = await page.evaluate(snapScript);
      assert.equal(s.tipVisible, true, "说明图标应可见");
      assert.equal(s.tipBesideSwitcher, true, `说明图标应在切换器右侧同行（tip=${JSON.stringify(s.tip)} switcher=${JSON.stringify(s.switcher)}）`);
      assert.equal(s.tipOverlapsSwitcher, false);
      assert.equal(s.tipOverlapsStrip, false);
      await page.close();
    } finally {
      await page.context().close();
    }
  });
}

test("跨断点：760 选中模拟 → 1440 → 回 760，transform 方向随断点归位且状态不丢", async () => {
  const page = await browser.newContext({ viewport: { width: 760, height: 900 } }).then((c) => c.newPage());
  try {
    await openDigital(page);
    await page.evaluate(() => document.querySelector('.kind-switch-button[data-kind="analog"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
    await page.waitForSelector(`${sessionSel("analog")} .circuit-workbench`, { state: "visible", timeout: 8000 });
    await page.waitForTimeout(400);
    let s = await page.evaluate(snapScript);
    assert.match(s.thumbTransform, /matrix\(1, 0, 0, 1, 84, 0\)/, "760px 模拟态应为横向 translateX(100%)");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);
    s = await page.evaluate(snapScript);
    assert.match(s.thumbTransform, /matrix\(1, 0, 0, 1, 0, 36\)/, "1440px 模拟态应切回竖向 translateY(100%)");
    assert.equal(s.thumbInsideSwitcher, true);
    await page.setViewportSize({ width: 760, height: 900 });
    await page.waitForTimeout(300);
    s = await page.evaluate(snapScript);
    assert.match(s.thumbTransform, /matrix\(1, 0, 0, 1, 84, 0\)/, "回到 760px 应恢复横向 translateX(100%)");
    assert.equal(s.thumbInsideSwitcher, true);
    assert.equal(await page.evaluate(() => document.querySelector('[data-kind="analog"].kind-switch-button').getAttribute("aria-selected")), "true");
    await page.close();
  } finally {
    await page.context().close();
  }
});

for (const width of [821, 900]) {
  test(`中等窗口 ${width}px：竖向切换器保持 64×80、模拟态 translateY`, async () => {
    const page = await browser.newContext({ viewport: { width, height: 900 } }).then((c) => c.newPage());
    try {
      await openDigital(page);
      const s = await page.evaluate(snapScript);
      assert.ok(Math.abs(s.switcher.w - 64) <= 2 && Math.abs(s.switcher.h - 80) <= 2, `切换器应 64×80（实际 ${s.switcher.w}×${s.switcher.h}）`);
      await page.evaluate(() => document.querySelector('.kind-switch-button[data-kind="analog"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
      await page.waitForSelector(`${sessionSel("analog")} .circuit-workbench`, { state: "visible", timeout: 8000 });
      await page.waitForTimeout(400);
      const s2 = await page.evaluate(snapScript);
      assert.match(s2.thumbTransform, /matrix\(1, 0, 0, 1, 0, 36\)/, `模拟态应 translateY(100%)（实际 ${s2.thumbTransform}）`);
      assert.equal(s2.thumbInsideSwitcher, true);
      await page.close();
    } finally {
      await page.context().close();
    }
  });
}

for (const width of NARROW) {
  test(`窄窗口 ${width}px：运行按钮可换行且启动类优先、不竖排；选择框独占一行、操作紧随其后`, async () => {
    const page = await browser.newContext({ viewport: { width, height: 900 } }).then((c) => c.newPage());
    try {
      await openDigital(page);
      /* 切模拟：3 个按钮（求解 DC / 启动瞬态 primary / 重置仿真）更能检验优先级 */
      await page.evaluate(() => document.querySelector('.kind-switch-button[data-kind="analog"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
      await page.waitForSelector(`${sessionSel("analog")} .circuit-workbench`, { state: "visible", timeout: 8000 });
      await page.waitForTimeout(400);
      const s = await page.evaluate(snapScript);
      assert.equal(s.primaryFirst, true, `启动类（cw-primary）应最先出现（${JSON.stringify(s.runBtns.map((b) => b.text))}）`);
      assert.equal(s.runWrapable, "wrap", "运行按钮应允许自然换行");
      assert.ok(s.runBtns.every((b) => b.rect.h <= 40), "运行按钮不应竖排成多行文字");
      assert.equal(s.selectAboveActions, true, `实验目标选择框应独占一行（select=${JSON.stringify(s.select)} actions=${JSON.stringify(s.actions)}）`);
      await page.close();
    } finally {
      await page.context().close();
    }
  });
}

for (const width of [390, 820]) {
  test(`窄窗口 ${width}px：存区按用途分组且清空/全删低强调`, async () => {
    const page = await browser.newContext({ viewport: { width, height: 900 } }).then((c) => c.newPage());
    try {
      await openDigital(page);
      const s = await page.evaluate(snapScript);
      const kids = s.barKids;
      const [name, save, saveAs, sel, load, del, danger, delAll] = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => kids[i].rect);
      /* 第一组：名称 + 保存 + 另存，同一行 */
      assert.ok(Math.abs(name.y - save.y) <= 4 && Math.abs(save.y - saveAs.y) <= 4, `第一组应同行（${kids.map((k) => `${k.i}:${k.text}@${k.rect.y}`).join(" ")}）`);
      /* 第二组：选择 + 载入 + 删除，同一行且在第一组下方 */
      assert.ok(Math.abs(sel.y - load.y) <= 4 && Math.abs(load.y - del.y) <= 4, "第二组应同行");
      assert.ok(sel.y > name.y + 2, "第二组应在第一组下方");
      /* 清空画布、删除本类存档：在第二组下方，低强调 */
      assert.ok(danger.y > sel.y + 2, "清空画布应在第二组下方");
      assert.ok(delAll.y > danger.y + 2, "删除本类存档应在其下方");
      assert.ok(s.barKids[6].cls.includes("cw-danger") && s.barKids[7].cls.includes("cw-text-button"), "低强调按钮类名保持");
      const dangerColor = await page.evaluate(() => getComputedStyle(document.querySelector(".cw-storage-bar .cw-danger")).color);
      const primaryColor = await page.evaluate(() => getComputedStyle(document.querySelector(".cw-primary")).color);
      assert.notEqual(dangerColor, primaryColor, "清空画布颜色应与主操作区分（低强调）");
      /* 输入可收缩：名称输入与本地电路选择宽度都 > 140px 且换行不挤压按钮成竖排 */
      const inputs = await page.evaluate(() => [...document.querySelectorAll(".cw-storage-bar input, .cw-storage-bar select")].map((el) => ({ w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height })));
      assert.ok(inputs.every((i) => i.w >= 140), `输入应保持可收缩宽度（${inputs.map((i) => i.w).join(",")}）`);
      assert.ok(inputs.every((i) => i.h <= 40), "输入不应竖排");
      assert.equal(s.scrollW, s.clientW, "页面无横向溢出");
      await page.close();
    } finally {
      await page.context().close();
    }
  });
}

/* 桌面对照护栏：1440px 布局保持（阶段 B 前后均应通过） */
test("桌面对照：1440px 竖向切换器、运行单行、实验同行、存区单行", async () => {
  const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then((c) => c.newPage());
  try {
    await openDigital(page);
    const s = await page.evaluate(snapScript);
    assert.ok(Math.abs(s.switcher.w - 64) <= 2 && Math.abs(s.switcher.h - 80) <= 2, "1440 切换器 64×80");
    assert.match(s.thumbTransform, /matrix\(1, 0, 0, 1, 0, 0\)/);
    assert.equal(s.primaryFirst, true, "1440 启动类在最前");
    assert.equal(s.runWrapable, "nowrap", "1440 运行按钮不换行");
    const sameRow = (a, b) => Math.abs(a.y - b.y) <= 6;
    assert.ok(sameRow(s.select, s.actions), `1440 实验选择与操作同行（select=${JSON.stringify(s.select)} actions=${JSON.stringify(s.actions)}）`);
    assert.ok(s.bar.h <= 90, `1440 存区应保持单行紧凑（实际高 ${s.bar.h}）`);
    assert.equal(s.scrollW, s.clientW);
    await page.close();
  } finally {
    await page.context().close();
  }
});

test("窄窗口 390px：返回教材后重新进入，无残留遮挡", async () => {
  const page = await browser.newContext({ viewport: { width: 390, height: 900 } }).then((c) => c.newPage());
  try {
    await openDigital(page);
    await page.evaluate(() => document.querySelector('.kind-switch-button[data-kind="analog"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
    await page.waitForSelector(`${sessionSel("analog")} .circuit-workbench`, { state: "visible", timeout: 8000 });
    await page.waitForTimeout(400);
    /* 返回教材 */
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForSelector("#lessonBody", { state: "visible" });
    await page.waitForTimeout(200);
    /* 重新进入 */
    await page.evaluate(() => document.getElementById("workbenchToggle").click());
    await page.waitForSelector(`${sessionSel("digital")} .circuit-workbench`, { state: "visible", timeout: 8000 });
    await page.waitForTimeout(500);
    const s = await page.evaluate(snapScript);
    assert.equal(s.thumbInsideSwitcher, true, "重新进入后 thumb 应在轨道内");
    assert.match(s.thumbTransform, /matrix\(1, 0, 0, 1, 0, 0\)/, "重新进入默认数字态 translateX(0)");
    assert.equal(s.tipOverlapsStrip, false);
    assert.equal(s.scrollW, s.clientW, "无横向溢出");
    await page.close();
  } finally {
    await page.context().close();
  }
});
