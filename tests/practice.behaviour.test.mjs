/* 实验演练页 UI 行为测试（隔离环境）：
   - 每个用例独立 page，不触碰用户浏览器归档（未用 localStorage 持久化演练状态，均为页面内存态）。
   - 依赖 3010 静态服务器；Chromium 使用系统 Chrome（playwright 库来自 npx 缓存）。
   - 验证状态与行为（跳转、勾选、参数更新、导航、滚动隔离），不只匹配 CSS/代码字符串。 */
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
const SHORT_TITLES = ["信号观察", "卷积验证", "采样混叠", "LTI 系统", "FIR 滤波", "方差验证"];
const FULL_TITLES = [
  "连续与离散信号观察",
  "数值卷积验证三角脉冲",
  "采样率改变与混叠",
  "一阶 LTI 系统的递推与卷积核对",
  "移动平均 FIR 的降噪与频率响应",
  "固定随机种子的方差验证",
];

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

async function openPractice(page, width = 1440, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto(BASE);
  await page.waitForSelector("#practiceToggle");
  await page.click("#practiceToggle");
  await page.waitForSelector(".practice-tab");
  await page.waitForTimeout(250);
}

const tabId = (i) => [
  "signals-intro-notebook",
  "signals-ch1-convolution",
  "signals-ch2-aliasing",
  "signals-ch3-first-order-lti",
  "signals-ch4-moving-average",
  "signals-ch5-random-average",
][i];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("six tabs show short titles and jump to the matching full-titled experiment", async () => {
  const page = await browser.newPage();
  await openPractice(page);

  const labels = await page.$$eval(".practice-tab-title", (els) => els.map((el) => el.textContent.trim()));
  assert.deepEqual(labels, SHORT_TITLES);

  for (let i = 0; i < 6; i += 1) {
    const tabs = await page.$$(".practice-tab");
    await tabs[i].click();
    await page.waitForTimeout(200);
    const state = await page.evaluate(() => ({
      h1: document.querySelector(".notebook-heading h1")?.textContent.trim(),
      active: Array.from(document.querySelectorAll(".practice-tab.is-active")).map((t) => t.getAttribute("data-experiment-id")),
    }));
    assert.equal(state.h1, FULL_TITLES[i], `tab ${i} shows its full title`);
    assert.deepEqual(state.active, [tabId(i)], `tab ${i} is the active one`);
  }
  await page.close();
});

test("the total-progress overview is gone; step state and progress stay functional", async () => {
  const page = await browser.newPage();
  await openPractice(page);

  const overview = await page.evaluate(() => ({
    node: Boolean(document.querySelector(".practice-overview")),
    text: document.body.textContent.includes("已完成 0/6 个演练"),
  }));
  assert.equal(overview.node, false, "no overview node rendered");
  assert.equal(overview.text, false, "no overview text anywhere in the page");

  const steps = await page.$$(".step-check");
  assert.equal(steps.length, 3);
  await steps[0].click();
  await page.waitForTimeout(120);
  let state = await page.evaluate(() => ({
    done: document.querySelectorAll(".step-check.is-done").length,
    progress: document.querySelector(".notebook-progress")?.textContent.trim(),
    markHidden: document.querySelector(".step-check-mark")?.classList.contains("is-hidden"),
    pressed: document.querySelector(".step-check")?.getAttribute("aria-pressed"),
    tabDone: document.querySelector(".practice-tab.is-active")?.classList.contains("is-done"),
  }));
  assert.equal(state.done, 1);
  assert.equal(state.progress, "已完成 1/3");
  assert.equal(state.markHidden, false, "check mark visible once done");
  assert.equal(state.pressed, "true");
  assert.equal(state.tabDone, false, "tab done only when every step is done");

  /* 全部勾选 → 当前 tab 出现完成标记；取消恢复 */
  await steps[1].click();
  await steps[2].click();
  await page.waitForTimeout(120);
  state = await page.evaluate(() => ({
    progress: document.querySelector(".notebook-progress")?.textContent.trim(),
    tabDone: document.querySelector(".practice-tab.is-active")?.classList.contains("is-done"),
    tabMark: Boolean(document.querySelector(".practice-tab.is-active .practice-tab-done")),
  }));
  assert.equal(state.progress, "已完成 3/3");
  assert.equal(state.tabDone, true);
  assert.equal(state.tabMark, true);

  await page.click(".step-check");
  await page.waitForTimeout(120);
  state = await page.evaluate(() => ({
    progress: document.querySelector(".notebook-progress")?.textContent.trim(),
    tabDone: document.querySelector(".practice-tab.is-active")?.classList.contains("is-done"),
  }));
  assert.equal(state.progress, "已完成 2/3");
  assert.equal(state.tabDone, false);
  await page.close();
});

test("parameter edits update the chart metrics for the same defaults", async () => {
  const page = await browser.newPage();
  await openPractice(page); // 信号观察 experiment, defaults f=2

  const readMetric = () =>
    page.evaluate(() => Array.from(document.querySelectorAll(".demo-metric-value")).map((el) => el.textContent.trim()));
  const before = await readMetric();
  assert.equal(before[0], "0.5 s", "default period 0.5 s at f=2");
  assert.equal(before[1], "10 个样点", "default 10 samples per period at fs=20/f=2");

  await page.evaluate(() => {
    const input = Array.from(document.querySelectorAll(".demo-field input"))[1]; // frequency
    input.value = "3";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(150);
  const after = await readMetric();
  assert.equal(after[0], "0.333 s", "period updates to 1/3 s");
  assert.equal(after[1], "6.667 个样点", "samples per period updates to 20/3");

  /* canvas 位图尺寸跟随 CSS 宽度（dpr=1 时一致），不出现拉伸错位 */
  const canvas = await page.evaluate(() => {
    const c = document.querySelector(".demo-canvas");
    return { pixel: c.width, css: Math.round(c.getBoundingClientRect().width) };
  });
  assert.equal(canvas.pixel, canvas.css, "bitmap equals CSS width (no upscale blur)");
  await page.close();
});

test("check state survives experiment round-trip and back navigates to the chapter", async () => {
  const page = await browser.newPage();
  await openPractice(page);

  await page.click(".step-check");
  await page.waitForTimeout(100);
  const tabs = await page.$$(".practice-tab");
  await tabs[1].click();
  await page.waitForTimeout(200);
  await page.evaluate(() => Array.from(document.querySelectorAll(".practice-tab"))[0].click());
  await page.waitForTimeout(200);
  const restored = await page.evaluate(() => ({
    progress: document.querySelector(".notebook-progress")?.textContent.trim(),
    done: document.querySelectorAll(".step-check.is-done").length,
  }));
  assert.equal(restored.progress, "已完成 1/3", "memory state survives the round-trip");
  assert.equal(restored.done, 1);

  await page.click(".notebook-back");
  await page.waitForTimeout(800);
  const lesson = await page.evaluate(() => ({
    title: document.getElementById("lessonTitle")?.textContent.trim(),
    stageHidden: document.getElementById("workbenchStage").hidden,
  }));
  assert.equal(lesson.title, "信号分析与处理概览", "back lands on the 绪论 chapter");
  assert.equal(lesson.stageHidden, true);
  await page.close();
});

test("rapid tab switching keeps the page scroll stable and logs no runtime errors", async () => {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("favicon.ico")) errors.push(m.text());
  });
  await openPractice(page);

  const scrollBefore = await page.evaluate(() => window.scrollY);
  for (let i = 1; i < 6; i += 1) {
    await page.evaluate((idx) => Array.from(document.querySelectorAll(".practice-tab"))[idx].click(), i);
    await page.waitForTimeout(150);
  }
  const scrollAfter = await page.evaluate(() => window.scrollY);
  assert.equal(scrollAfter, scrollBefore, "rapid switching must not move the page scroll");
  assert.deepEqual(errors, [], `no runtime errors: ${errors.join("; ")}`);
  await page.close();
});

test("narrow screen: page has no horizontal overflow; only the tab strip scrolls itself", async () => {
  const page = await browser.newPage();
  await openPractice(page, 390, 844);

  const layout = await page.evaluate(() => {
    const tabs = document.querySelector(".practice-tabs");
    const doc = document.documentElement;
    const active = document.querySelector(".practice-tab.is-active");
    return {
      docScroll: doc.scrollWidth,
      docClient: doc.clientWidth,
      tabsScroll: tabs.scrollWidth,
      tabsClient: tabs.clientWidth,
      columns: getComputedStyle(document.querySelector(".practice-layout")).gridTemplateColumns,
      activeVisible: (() => {
        const a = active.getBoundingClientRect();
        const t = tabs.getBoundingClientRect();
        return a.left >= t.left - 1 && a.right <= t.right + 1;
      })(),
    };
  });
  assert.equal(layout.docScroll, layout.docClient, "no page-level horizontal overflow");
  assert.ok(layout.tabsScroll > layout.tabsClient, "the tab strip itself overflows and scrolls");
  assert.ok(!layout.columns.includes(" "), "single-column layout on narrow screens");
  assert.equal(layout.activeVisible, true, "active tab is scrolled into view");

  /* 切到最后一个实验：页面滚动不动，选中的 tab 被滚进视野 */
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => Array.from(document.querySelectorAll(".practice-tab"))[5].click());
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => {
    const active = document.querySelector(".practice-tab.is-active");
    const tabs = document.querySelector(".practice-tabs");
    const a = active.getBoundingClientRect();
    const t = tabs.getBoundingClientRect();
    return { scrollY: window.scrollY, activeVisible: a.left >= t.left - 1 && a.right <= t.right + 1, tabsLeft: Math.round(tabs.scrollLeft) };
  });
  assert.equal(after.scrollY, scrollBefore, "page scroll unchanged after tab switch");
  assert.equal(after.activeVisible, true, "last tab scrolled into view");
  assert.ok(after.tabsLeft > 0, "tab strip scrolled itself");
  await page.close();
});

test("keyboard can reach step checks, tabs and the back button", async () => {
  const page = await browser.newPage();
  await openPractice(page);

  const reachable = await page.evaluate(() => {
    const first = document.querySelector(".step-check");
    const back = document.querySelector(".notebook-back");
    const activeTab = document.querySelector(".practice-tab.is-active");
    first.focus();
    const a = document.activeElement === first;
    back.focus();
    const b = document.activeElement === back;
    activeTab.focus();
    const c = document.activeElement === activeTab;
    return { step: a, back: b, tab: c };
  });
  assert.equal(reachable.step, true);
  assert.equal(reachable.back, true);
  assert.equal(reachable.tab, true);

  /* 焦点在步骤按钮上按 Enter → 勾选切换（原生按钮激活路径） */
  await page.evaluate(() => document.querySelector(".step-check").focus());
  await page.keyboard.press("Enter");
  await page.waitForTimeout(120);
  const state = await page.evaluate(() => ({
    progress: document.querySelector(".notebook-progress")?.textContent.trim(),
    pressed: document.querySelector(".step-check")?.getAttribute("aria-pressed"),
  }));
  assert.equal(state.progress, "已完成 1/3");
  assert.equal(state.pressed, "true");
  await page.close();
});
