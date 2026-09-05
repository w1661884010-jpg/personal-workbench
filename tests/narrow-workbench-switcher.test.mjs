/* 窄窗口工作台滑块遮挡回归测试（真实浏览器，隔离 context）：
   - 复现 ≤820px 巨型滑块（切换器 position:static 使 thumb 参照 .workbench-stage），
     以及 821-900px 悬浮气泡盖住「启动」按钮、说明图标压住实验条。
   - 先失败后通过：修复 = ≤900px 切换器恢复定位参照并回到文档流，说明图标改为文档流。 */
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
  await page.waitForTimeout(400); /* 桥接/过渡稳定 */
}

/* 返回几何快照：切换器/thumb/启动按钮/实验条/说明图标 矩形 + 命中等（元素点探测） */
const snapScript = () => {
  const pick = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  };
  const overlaps = (a, b) => !!(a && b) && !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
  const sw = document.getElementById("kindSwitcher");
  const thumb = document.querySelector(".kind-thumb");
  const tip = document.getElementById("workbenchLimit");
  const run = document.querySelector(".cw-run-controls");
  const firstRun = run ? run.querySelector("button") : null;
  const canvasPanel = document.querySelector(".cw-canvas-panel");
  const strip = document.querySelector(".cw-experiment-strip");
  const hitAt = (r) => {
    if (!r) return "";
    const el = document.elementFromPoint(r.x + r.w / 2, r.y + r.h / 2);
    if (!el) return "";
    return el.closest(".cw-run-controls, .kind-switcher, .limit-tip-button") ? (el.closest(".cw-run-controls") ? "run" : el.closest(".kind-switcher") ? "switcher" : "tip") : el.tagName;
  };
  return {
    viewport: window.innerWidth,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    switcher: pick(sw),
    thumb: pick(thumb),
    firstRun: pick(firstRun),
    canvasPanel: pick(canvasPanel),
    strip: pick(strip),
    tip: pick(tip),
    tipVisible: !!tip && getComputedStyle(tip).display !== "none" && tip.getBoundingClientRect().width > 0,
    thumbOverlapsRun: overlaps(pick(thumb), pick(firstRun) || pick(run)),
    thumbOverlapsCanvas: overlaps(pick(thumb), pick(canvasPanel)),
    switcherOverlapsRun: overlaps(pick(sw), pick(firstRun) || pick(run)),
    tipOverlapsStrip: overlaps(pick(tip), pick(strip)),
    hitFirstRun: hitAt(pick(firstRun)),
    thumbInsideSwitcher: (() => {
      const t = pick(thumb), s = pick(sw);
      return !!(t && s) && t.x >= s.x - 0.6 && t.y >= s.y - 0.6 && t.x + t.w <= s.x + s.w + 0.6 && t.y + t.h <= s.y + s.h + 0.6;
    })(),
    thumbTransform: thumb ? getComputedStyle(thumb).transform : null,
  };
};

const NARROW = [390, 560, 760, 820];
const MID = [821, 900];

for (const width of NARROW) {
  test(`窄窗口 ${width}px：滑块在轨道内且不遮挡运行按钮/画布`, async () => {
    const page = await browser.newContext({ viewport: { width, height: 900 } }).then((c) => c.newPage());
    try {
      await openDigital(page);
      const s = await page.evaluate(snapScript);
      assert.equal(s.thumbInsideSwitcher, true, `thumb 应完全位于切换器轨道内（实际 thumb=${JSON.stringify(s.thumb)} switcher=${JSON.stringify(s.switcher)}）`);
      assert.equal(s.thumbOverlapsRun, false, "thumb 不得覆盖运行按钮");
      assert.equal(s.thumbOverlapsCanvas, false, "thumb 不得覆盖画布面板");
      assert.equal(s.hitFirstRun, "run", `运行按钮中心命中的应是运行区（实际 ${s.hitFirstRun}）`);
      assert.equal(s.scrollW, s.clientW, "页面无横向溢出");
      /* 真实点击：启动按钮应能切换为「暂停」（除非被透明层拦截） */
      const startBtn = page.locator(".cw-run-controls button").first();
      await startBtn.click({ trial: true }); /* trial 只做命中检查 */
      await page.evaluate(() => document.querySelector(".cw-run-controls button").click());
      assert.equal(await page.evaluate(() => document.querySelector(".cw-run-controls button").textContent.trim()), "暂停", "启动按钮点击后应切换为暂停");
      await page.evaluate(() => document.querySelector(".cw-run-controls button").click());
      assert.equal(await page.evaluate(() => document.querySelector(".cw-run-controls button").textContent.trim()), "启动");
      await page.close();
    } finally {
      await page.context().close();
    }
  });
}

for (const width of NARROW) {
  test(`窄窗口 ${width}px：切到模拟后滑块仍在轨道内、说明图标不遮挡`, async () => {
    const page = await browser.newContext({ viewport: { width, height: 900 } }).then((c) => c.newPage());
    try {
      await openDigital(page);
      await page.evaluate(() => {
        document.querySelector('.kind-switch-button[data-kind="analog"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
      });
      await page.waitForSelector(`${sessionSel("analog")} .circuit-workbench`, { state: "visible", timeout: 8000 });
      await page.waitForTimeout(700); /* 内容过渡 + updateWorkbenchLimit(600ms) */
      const s = await page.evaluate(snapScript);
      assert.equal(s.thumbInsideSwitcher, true, `模拟态 thumb 应仍在轨道内（thumb=${JSON.stringify(s.thumb)}）`);
      assert.match(s.thumbTransform, /matrix\(1, 0, 0, 1, 84, 0\)/, `模拟态 thumb transform 应为横向 translateX(100%)（实际 ${s.thumbTransform}）`);
      assert.equal(s.thumbOverlapsRun, false);
      assert.equal(s.thumbOverlapsCanvas, false);
      if (s.tipVisible) assert.equal(s.tipOverlapsStrip, false, "说明图标不得压住实验条卡片");
      await page.close();
    } finally {
      await page.context().close();
    }
  });
}

for (const width of MID) {
  test(`中等窗口 ${width}px：悬浮气泡不得盖住启动按钮，说明图标不遮挡实验条`, async () => {
    const page = await browser.newContext({ viewport: { width, height: 900 } }).then((c) => c.newPage());
    try {
      await openDigital(page);
      const s = await page.evaluate(snapScript);
      assert.equal(s.switcherOverlapsRun, false, `切换器气泡不得覆盖运行按钮（switcher=${JSON.stringify(s.switcher)} firstRun=${JSON.stringify(s.firstRun)}）`);
      assert.equal(s.thumbInsideSwitcher, true);
      assert.equal(s.hitFirstRun, "run", `运行按钮中心命中的应是运行区（实际 ${s.hitFirstRun}）`);
      if (s.tipVisible) assert.equal(s.tipOverlapsStrip, false, "说明图标不得压住实验条卡片");
      /* 真实点击启动 */
      await page.evaluate(() => document.querySelector(".cw-run-controls button").click());
      assert.equal(await page.evaluate(() => document.querySelector(".cw-run-controls button").textContent.trim()), "暂停");
      await page.close();
    } finally {
      await page.context().close();
    }
  });
}

test("窄窗口 390px 快速连续切换：最后一次生效、滑块在轨道内、无残留", async () => {
  const page = await browser.newContext({ viewport: { width: 390, height: 900 } }).then((c) => c.newPage());
  try {
    await openDigital(page);
    await page.evaluate(async () => {
      const buttons = [...document.querySelectorAll(".kind-switch-button")];
      const kinds = ["analog", "digital", "analog", "digital", "analog", "digital", "analog", "digital", "analog", "digital"];
      for (const kind of kinds) {
        buttons.find((b) => b.dataset.kind === kind).dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
        await new Promise((r) => setTimeout(r, 25));
      }
    });
    await page.waitForTimeout(900); /* 内容过渡 + 桥接收敛 */
    const s = await page.evaluate(snapScript);
    assert.equal(s.thumbInsideSwitcher, true, "连点后 thumb 应仍在轨道内");
    assert.equal(s.thumbOverlapsRun, false);
    assert.equal(s.thumbOverlapsCanvas, false);
    const last = await page.evaluate(() => ({
      digitalSelected: document.querySelector('[data-kind="digital"].kind-switch-button').getAttribute("aria-selected"),
      digitalVisible: !document.querySelector('.prototype-workbench-session[data-kind="digital"]').hidden,
    }));
    assert.equal(last.digitalSelected, "true", "最后一次为数字：aria-selected 应在数字");
    assert.equal(last.digitalVisible, true, "数字会话应可见");
    await page.close();
  } finally {
    await page.context().close();
  }
});

test("跨断点：760px 选中模拟 → 1440 → 回 760，滑块归位且状态不丢", async () => {
  const page = await browser.newContext({ viewport: { width: 760, height: 900 } }).then((c) => c.newPage());
  try {
    await openDigital(page);
    await page.evaluate(() => {
      document.querySelector('.kind-switch-button[data-kind="analog"]').dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    });
    await page.waitForSelector(`${sessionSel("analog")} .circuit-workbench`, { state: "visible", timeout: 8000 });
    await page.waitForTimeout(700);
    const expectedTransform = { 1440: /matrix\(1, 0, 0, 1, 0, 36\)/, 760: /matrix\(1, 0, 0, 1, 84, 0\)/ };
    for (const width of [1440, 760, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);
      const s = await page.evaluate(snapScript);
      assert.equal(s.thumbInsideSwitcher, true, `${width}px 下 thumb 应仍在轨道内`);
      assert.equal(s.thumbOverlapsRun, false, `${width}px 下 thumb 不得覆盖运行按钮`);
      assert.match(s.thumbTransform, expectedTransform[width], `${width}px 下模拟态 thumb 应保持 ${width === 1440 ? "竖向 translateY(100%)" : "横向 translateX(100%)"}`);
      assert.equal(await page.evaluate(() => document.querySelector('[data-kind="analog"].kind-switch-button')?.getAttribute("aria-selected")), "true", `${width}px 下 aria-selected 保持在模拟`);
    }
    await page.close();
  } finally {
    await page.context().close();
  }
});
