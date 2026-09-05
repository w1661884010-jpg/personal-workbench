/* 数字/模拟切换器真实浏览器行为测试（隔离环境）：
   - 每个用例使用独立 browser context/pages，不触碰用户浏览器的 localStorage/存档。
   - 依赖 3010 静态服务器运行中；Chromium 使用系统 Chrome（playwright 库来自 npx 缓存）。
   - 故障注入通过 URL 参数（cwReadyDelay / cwMountFail）进入副本测试钩子，
     仅影响本测试会话，正常访问无参数时无任何行为差异。 */
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
    throw new Error("3010 服务器未运行：请在 personal-workbench-shell 目录执行 node serve.mjs");
  }
  browser = await chromium.launch({ headless: true, channel: "chrome" });
});

test.after(async () => {
  await browser?.close();
});

async function openWorkbench(page, url = BASE) {
  await page.goto(url);
  await page.waitForSelector("#workbenchToggle");
  await page.click("#workbenchToggle");
  await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
  await page.waitForTimeout(250);
}

function sessionState(page, kind) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { exists: false };
    return {
      exists: true,
      hidden: el.hidden,
      inert: el.inert,
      opacity: getComputedStyle(el).opacity,
      className: el.className,
    };
  }, sessionSel(kind));
}

function switcherState(page) {
  return page.evaluate(() => ({
    thumb: document.querySelector(".kind-thumb").style.transform,
    dSel: document.querySelector("#kindTabDigital").getAttribute("aria-selected"),
    aSel: document.querySelector("#kindTabAnalog").getAttribute("aria-selected"),
    dTab: document.querySelector("#kindTabDigital").getAttribute("tabindex"),
    aTab: document.querySelector("#kindTabAnalog").getAttribute("tabindex"),
  }));
}

test("first mounts of both kinds complete the instruments bridge (layout tasks survive switching)", async () => {
  const page = await browser.newPage();
  await openWorkbench(page);

  await page.waitForFunction(() => {
    const host = document.querySelector('.prototype-workbench-session[data-kind="digital"]');
    const ins = host?.querySelector(".cw-instruments");
    const insp = host?.querySelector(".cw-inspector");
    return Boolean(ins && insp && ins.parentElement === insp);
  }, null, { timeout: 3000 });

  await page.click("#kindTabAnalog");
  await page.waitForFunction(() => {
    const host = document.querySelector('.prototype-workbench-session[data-kind="analog"]');
    const ins = host?.querySelector(".cw-instruments");
    const insp = host?.querySelector(".cw-inspector");
    return Boolean(ins && insp && ins.parentElement === insp);
  }, null, { timeout: 3000 });

  const counts = await page.evaluate(() => ({
    total: document.querySelectorAll(".prototype-workbench-session .cw-instruments").length,
    perKind: ["digital", "analog"].map((k) =>
      document.querySelectorAll(`[data-kind="${k}"] .cw-instruments`).length),
  }));
  assert.equal(counts.total, 2, "one instruments card per session, no duplicates");
  assert.deepEqual(counts.perKind, [1, 1]);
  await page.close();
});

test("old content stays fully visible while a slow target mounts, then completes", async () => {
  const page = await browser.newPage();
  await openWorkbench(page, `${BASE}?cwReadyDelay=900`);

  await page.click("#kindTabAnalog");

  await page.waitForTimeout(120);
  let d = await sessionState(page, "digital");
  let a = await sessionState(page, "analog");
  assert.equal(d.hidden, false, "digital still shown");
  assert.equal(d.opacity, "1", "digital fully visible while target mounts");

  await page.waitForTimeout(430); // ~550ms: target readiness not yet reported
  d = await sessionState(page, "digital");
  assert.equal(d.hidden, false);
  assert.equal(d.opacity, "1", "no premature fade-out during slow mount");

  await page.waitForFunction(
    (sel) => {
      const a = document.querySelector(sel);
      const d = document.querySelector('.prototype-workbench-session[data-kind="digital"]');
      return a && !a.hidden && getComputedStyle(a).opacity === "1" && d.hidden;
    },
    sessionSel("analog"),
    { timeout: 4000 },
  );
  await page.close();
});

test("mount failure keeps content and rolls back slider, aria and retry succeeds", async () => {
  const page = await browser.newPage();
  await openWorkbench(page, `${BASE}?cwMountFail=once`);

  await page.click("#kindTabAnalog");
  await page.waitForTimeout(500); // fail fires on the first readiness poll

  const d = await sessionState(page, "digital");
  const a = await sessionState(page, "analog");
  const ui = await switcherState(page);
  assert.equal(d.hidden, false, "digital content preserved after failure");
  assert.equal(d.opacity, "1");
  assert.equal(a.hidden, true, "failed target stays hidden");
  assert.equal(ui.thumb, "translateX(0px)", "thumb rolled back to digital");
  assert.equal(ui.dSel, "true");
  assert.equal(ui.aSel, "false");

  /* 一次性注入已清除参数：再次点击应真正切换成功（不被“已选中”短路） */
  await page.click("#kindTabAnalog");
  await page.waitForFunction(
    (sel) => {
      const a = document.querySelector(sel);
      return a && !a.hidden && getComputedStyle(a).opacity === "1";
    },
    sessionSel("analog"),
    { timeout: 4000 },
  );
  const ui2 = await switcherState(page);
  assert.equal(ui2.thumb, "translateX(100%)");
  assert.equal(ui2.aSel, "true");
  await page.close();
});

test("rapid switching settles on the last choice with no half-faded residue", async () => {
  const page = await browser.newPage();
  await openWorkbench(page);

  for (let i = 0; i < 10; i += 1) {
    await page.click(i % 2 === 0 ? "#kindTabAnalog" : "#kindTabDigital");
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(700);

  const d = await sessionState(page, "digital");
  const a = await sessionState(page, "analog");
  const ui = await switcherState(page);
  assert.equal(d.hidden, false, "last click was digital");
  assert.equal(d.opacity, "1");
  assert.equal(a.hidden, true);
  assert.ok(!d.className.includes("cw-switching"), "no lingering transition class");
  assert.ok(!a.className.includes("cw-switching"), "no lingering transition class on the hidden panel");
  assert.equal(ui.thumb, "translateX(0px)");
  assert.equal(ui.dSel, "true");
  assert.equal(ui.aSel, "false");
  await page.close();
});

test("leaving mid-transition cleans up and no stale callback resurfaces", async () => {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("favicon.ico")) errors.push(m.text());
  });

  await openWorkbench(page);
  await page.click("#kindTabAnalog");
  await page.waitForTimeout(30);
  await page.click("#workbenchToggle"); // leave mid-switch
  await page.waitForTimeout(600);

  const left = await page.evaluate(() => ({
    stageHidden: document.getElementById("workbenchStage").hidden,
    sessions: document.querySelectorAll(".prototype-workbench-session").length,
  }));
  assert.equal(left.stageHidden, true);
  assert.equal(left.sessions, 0, "all sessions torn down, no stale callback re-shows content");

  await page.click("#workbenchToggle");
  await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
  await page.waitForTimeout(250);
  const d = await sessionState(page, "digital");
  const a = await sessionState(page, "analog");
  assert.equal(d.hidden, false);
  assert.equal(a.exists, false, "analog session lazily re-created only when requested");
  assert.deepEqual(errors, [], `no runtime errors after leave/re-enter: ${errors.join("; ")}`);
  await page.close();
});

test("Enter, Space, arrows, Home and End switch instantly", async () => {
  const page = await browser.newPage();
  await openWorkbench(page);

  const pressAndCheck = async (key, after) => {
    await page.keyboard.press(key);
    await page.waitForTimeout(40);
    const state = await sessionState(page, after);
    const ui = await switcherState(page);
    assert.equal(state.hidden, false, `${key} shows ${after}`);
    assert.equal(state.opacity, "1", `${key} completes within 40ms (instant)`);
    assert.equal(ui.thumb, after === "analog" ? "translateX(100%)" : "translateX(0px)");
  };

  await page.evaluate(() => document.querySelector("#kindTabDigital").focus());
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(40);
  let ui = await switcherState(page);
  assert.equal(ui.aTab, "0", "active tab gets roving tabindex 0");
  assert.equal(ui.dTab, "-1");

  await page.keyboard.press("Home"); // back to digital
  await pressAndCheck("Home", "digital");

  await page.keyboard.press("ArrowDown"); // digital -> analog
  await pressAndCheck("ArrowDown", "analog");

  await page.keyboard.press("ArrowUp"); // analog -> digital
  await pressAndCheck("ArrowUp", "digital");

  /* Enter/Space：把焦点强加在未激活的模拟 tab 上（roving tabindex 下激活 tab 才可达），
     键盘激活路径（keydown 拦截或 detail=0 合成 click）必须即时切换 */
  await page.evaluate(() => document.querySelector("#kindTabAnalog").focus());
  await page.keyboard.press("Enter");
  await pressAndCheck("Enter", "analog");

  await page.keyboard.press("Home");
  await page.waitForTimeout(40);
  await page.evaluate(() => document.querySelector("#kindTabAnalog").focus());
  await page.keyboard.press(" ");
  await pressAndCheck("Space", "analog");

  await page.evaluate(() => document.querySelector("#kindTabDigital").focus());
  await page.keyboard.press("End");
  await pressAndCheck("End", "analog");

  await page.keyboard.press("ArrowLeft"); // analog -> digital
  await pressAndCheck("ArrowLeft", "digital");
  await page.close();
});

test("prefers-reduced-motion media simulation disables slider and content animation", async () => {
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openWorkbench(page);

  const styles = await page.evaluate(() => {
    const thumb = document.querySelector(".kind-thumb");
    const session = document.querySelector(".prototype-workbench-session");
    return {
      thumb: getComputedStyle(thumb).transition,
      session: getComputedStyle(session).transition,
    };
  });
  assert.match(styles.thumb, /(^|, )0s|none/, `thumb transition disabled under reduce: ${styles.thumb}`);
  assert.match(styles.session, /(^|, )0s|none/, `session transition disabled under reduce: ${styles.session}`);

  await page.click("#kindTabAnalog");
  await page.waitForTimeout(40);
  const a = await sessionState(page, "analog");
  assert.equal(a.hidden, false);
  assert.equal(a.opacity, "1", "switch completes instantly under reduced motion");
  await page.close();
});

test("during transition old panel is inert but the switcher stays responsive", async () => {
  const page = await browser.newPage();
  await openWorkbench(page);

  await page.click("#kindTabAnalog");
  /* 等待目标挂载就绪并进入淡出阶段（startSwitch 设置 outgoing inert） */
  await page.waitForFunction(
    () => document.querySelector('.prototype-workbench-session[data-kind="digital"]').inert === true,
    null,
    { timeout: 3000 },
  );

  const early = await page.evaluate(() => {
    const d = document.querySelector('.prototype-workbench-session[data-kind="digital"]');
    const a = document.querySelector('.prototype-workbench-session[data-kind="analog"]');
    return { dInert: d.inert, aHidden: a.hidden };
  });
  assert.equal(early.dInert, true, "outgoing panel is inert during transition");
  assert.equal(early.aHidden, true, "incoming panel still hidden during fade-out");

  /* 淡入期间目标面板同样 inert：等待目标进入过渡态 */
  await page.waitForFunction(
    () => {
      const a = document.querySelector('.prototype-workbench-session[data-kind="analog"]');
      return a && !a.hidden && a.inert === true;
    },
    null,
    { timeout: 2000 },
  );

  const mid = await page.evaluate(() => {
    const d = document.querySelector('.prototype-workbench-session[data-kind="digital"]');
    const a = document.querySelector('.prototype-workbench-session[data-kind="analog"]');
    const btn = d.querySelector(".cw-canvas-toolbar button");
    if (btn) btn.focus();
    return { dInert: d.inert, aInert: a.inert, focusInsidePanel: d.contains(document.activeElement) };
  });
  assert.equal(mid.dInert, true);
  assert.equal(mid.aInert, true, "incoming panel is inert while fading in");
  assert.equal(mid.focusInsidePanel, false, "inert panel cannot receive focus");

  /* 过渡期间切换控件仍可响应：立即切回数字 */
  await page.click("#kindTabDigital");
  await page.waitForTimeout(400);
  const d = await sessionState(page, "digital");
  const ui = await switcherState(page);
  assert.equal(d.hidden, false, "switcher click during transition takes effect");
  assert.equal(d.opacity, "1");
  assert.equal(d.inert, false, "settled panel is interactive");
  assert.equal(ui.thumb, "translateX(0px)");
  await page.close();
});

test("session state (probe mode, zoom) survives a kind round-trip", async () => {
  const page = await browser.newPage();
  await openWorkbench(page);

  const probeBtn = page.locator('.cw-canvas-toolbar button', { hasText: "探针模式" });
  await probeBtn.click();
  const zoomIn = page.locator('.cw-canvas-toolbar button[aria-label="放大"]');
  await zoomIn.click();
  await zoomIn.click();
  await page.waitForTimeout(80);

  const readState = () =>
    page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll(".cw-canvas-toolbar button"));
      const probe = buttons.find((b) => b.textContent.includes("探针模式"));
      const zoom = buttons.find((b) => b.getAttribute("aria-label") === "重置缩放");
      return { probe: probe?.getAttribute("aria-pressed"), zoom: zoom?.textContent.trim() };
    });
  const before = await readState();

  await page.click("#kindTabAnalog");
  await page.waitForTimeout(400);
  await page.click("#kindTabDigital");
  await page.waitForTimeout(400);

  const after = await readState();
  assert.equal(after.zoom, before.zoom, "zoom scale survives the round-trip");
  assert.equal(after.probe, "true", "probe mode survives the round-trip");
  await page.close();
});
