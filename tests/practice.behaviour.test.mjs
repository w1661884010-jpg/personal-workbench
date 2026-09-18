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
const SHORT_TITLES = ["信号观察", "波形变换", "动态卷积", "傅里叶表示", "采样与重建", "频谱分析", "循环卷积", "LTI 系统", "FIR 滤波", "方差验证"];
const FULL_TITLES = [
  "连续与离散信号观察",
  "新时刻取到了哪个旧时刻的值",
  "连续卷积与图解五步动态演示",
  "谐波逼近和谱线变密是两回事",
  "时频双域采样、混叠与模拟重建",
  "观察时间、窗与补零分别改变了什么",
  "循环卷积：尾部如何绕回头部",
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
    throw new Error("3010 服务器未运行：请在 personal-workbench-shell-3010 目录执行 node serve.mjs");
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

/* 按实验 ID 打开：两级导航下必须先点开所属章节气泡，实验芯片才会在大气泡里渲染出来 */
async function switchToExperiment(page, id) {
  await page.click(`.practice-chapter[data-experiment-ids~="${id}"]`);
  await page.waitForTimeout(200);
  await page.click(`.practice-tab[data-experiment-id="${id}"]`);
  /* 等内容真正换成目标实验（切换带 150ms 淡出），再让挂载后的首帧重绘跑完 */
  await page.waitForFunction((want) => {
    const active = document.querySelector(".practice-tab.is-active");
    return Boolean(active) && active.getAttribute("data-experiment-id") === want;
  }, id, { timeout: 8000 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

const TAB_IDS = [
  "signals-intro-notebook",
  "signals-ch1-waveform-transform",
  "signals-ch1-convolution",
  "signals-ch1-fourier-synthesis",
  "signals-ch2-aliasing",
  "signals-ch2-spectral-leakage",
  "signals-ch2-circular-convolution",
  "signals-ch3-first-order-lti",
  "signals-ch4-moving-average",
  "signals-ch5-random-average",
];
const tabId = (i) => TAB_IDS[i];
const tabIds = () => TAB_IDS.slice();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("ten experiments are grouped by chapter; each chip shows its short title and full title when opened", async () => {
  const page = await browser.newPage();
  await openPractice(page);

  /* 两级导航：章节气泡按课程顺序归类，同一时间只有一枚章节被选中 */
  const chapters = await page.$$eval(".practice-chapter", (els) => els.map((el) => ({
    id: el.getAttribute("data-chapter-id"),
    label: el.textContent.trim(),
    ids: (el.getAttribute("data-experiment-ids") || "").split(" ").filter(Boolean),
    active: el.classList.contains("is-active"),
  })));
  assert.deepEqual(chapters.map((c) => c.id),
    ["signals-intro", "signals-ch1", "signals-ch2", "signals-ch3", "signals-ch4", "signals-ch5"]);
  assert.equal(chapters.filter((c) => c.active).length, 1, "同一时间只有一枚章节被选中");
  assert.deepEqual(chapters.flatMap((c) => c.ids), tabIds(), "章节声明的实验集合应覆盖全部实验且保持课程顺序");

  /* 逐章打开：大气泡只装该章的实验，短标题与全标题逐一对应 */
  for (let i = 0; i < 10; i += 1) {
    const id = tabId(i);
    await page.click(`.practice-chapter[data-experiment-ids~="${id}"]`);
    await page.waitForTimeout(300);
    await page.click(`.practice-tab[data-experiment-id="${id}"]`);
    await page.waitForTimeout(300);
    const state = await page.evaluate(() => ({
      h1: document.querySelector(".notebook-heading h1")?.textContent.trim(),
      activeChips: Array.from(document.querySelectorAll(".practice-tab.is-active")).map((t) => t.getAttribute("data-experiment-id")),
      activeChapters: Array.from(document.querySelectorAll(".practice-chapter.is-active")).map((t) => t.getAttribute("data-chapter-id")),
      shortTitles: Array.from(document.querySelectorAll(".practice-tab-title")).map((t) => t.textContent.trim()),
    }));
    assert.equal(state.h1, FULL_TITLES[i], `实验 ${id} 打开后应显示自己的全标题`);
    assert.deepEqual(state.activeChips, [id], `实验 ${id} 应是唯一选中的芯片`);
    assert.equal(state.activeChapters.length, 1, `实验 ${id} 打开后仍只有一枚章节被选中`);
    assert.ok(state.shortTitles.includes(SHORT_TITLES[i]), `实验 ${id} 的短标题应出现在大气泡里`);
  }
  await page.close();
});

test("the total-progress overview is gone and steps are listed without checks", async () => {
  const page = await browser.newPage();
  await openPractice(page);

  const overview = await page.evaluate(() => ({
    node: Boolean(document.querySelector(".practice-overview")),
    text: document.body.textContent.includes("已完成 0/6 个演练"),
  }));
  assert.equal(overview.node, false, "no overview node rendered");
  assert.equal(overview.text, false, "no overview text anywhere in the page");

  const steps = await page.evaluate(() => ({
    items: document.querySelectorAll(".notebook-step-item").length,
    numbers: document.querySelectorAll(".notebook-step-item .step-number").length,
    copies: Array.from(document.querySelectorAll(".notebook-step-item .step-copy")).map((e) => e.textContent.trim()),
    progress: Boolean(document.querySelector(".notebook-progress")),
    checks: document.querySelectorAll(".step-check").length,
    progressText: document.body.textContent.includes("已完成 0/3"),
  }));
  assert.equal(steps.items, 3, "three steps listed");
  assert.equal(steps.numbers, 3);
  assert.equal(steps.copies[0].length > 10, true, "full step text present");
  assert.equal(steps.progress, false, "no completion progress in the steps header");
  assert.equal(steps.checks, 0, "no check buttons — steps are a plain list");
  assert.equal(steps.progressText, false, "no 已完成 x/y text");
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
    /* 按标签定位而不是按下标：参数区改成"滑块 + 数字框"后下标会移位 */
    const label = Array.from(document.querySelectorAll(".demo-field")).find((l) => /频率/.test(l.textContent));
    const input = label.querySelector('input[type="number"]');   // frequency
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

test("experiment round-trip keeps metrics state and back navigates to the chapter", async () => {
  const page = await browser.newPage();
  await openPractice(page);

  const readMetrics = () =>
    page.evaluate(() => Array.from(document.querySelectorAll(".demo-metric-value")).map((e) => e.textContent.trim()));
  const before = await readMetrics();

  /* 换一个实验再回来（都在第1章，章节选中态不动） */
  await switchToExperiment(page, "signals-ch1-convolution");
  await switchToExperiment(page, "signals-intro-notebook");
  const after = await readMetrics();
  assert.deepEqual(after, before, "demo state (metrics) survives the experiment round-trip");

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
  /* 快速连点全部章节气泡（切换会经过 150ms 淡出，连点应只让最后一次生效） */
  for (const id of ["signals-ch2", "signals-ch4", "signals-ch1", "signals-ch5", "signals-intro", "signals-ch3"]) {
    await page.evaluate((chapterId) => document.querySelector(`.practice-chapter[data-chapter-id="${chapterId}"]`).click(), id);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(700);
  const scrollAfter = await page.evaluate(() => window.scrollY);
  assert.equal(scrollAfter, scrollBefore, "rapid switching must not move the page scroll");
  assert.deepEqual(errors, [], `no runtime errors: ${errors.join("; ")}`);
  await page.close();
});

test("narrow screen: page has no horizontal overflow; only the chapter strip scrolls itself", async () => {
  const page = await browser.newPage();
  await openPractice(page, 390, 844);

  const layout = await page.evaluate(() => {
    const chapters = document.querySelector(".practice-chapters");
    const chips = document.querySelector(".practice-tabs");
    const doc = document.documentElement;
    const active = chapters.querySelector(".practice-chapter.is-active");
    const a = active.getBoundingClientRect();
    const t = chapters.getBoundingClientRect();
    return {
      docScroll: doc.scrollWidth,
      docClient: doc.clientWidth,
      chaptersScroll: chapters.scrollWidth,
      chaptersClient: chapters.clientWidth,
      chipsScroll: chips.scrollWidth,
      chipsClient: chips.clientWidth,
      columns: getComputedStyle(document.querySelector(".practice-layout")).gridTemplateColumns,
      activeVisible: a.left >= t.left - 1 && a.right <= t.right + 1,
    };
  });
  assert.equal(layout.docScroll, layout.docClient, "no page-level horizontal overflow");
  assert.ok(layout.chaptersScroll > layout.chaptersClient,
    `章节导航条自身应滚动（scrollWidth=${layout.chaptersScroll} clientWidth=${layout.chaptersClient}）`);
  assert.ok(layout.chipsScroll <= layout.chipsClient + 1,
    `当前章节的芯片应放得下、不需要滚动（scrollWidth=${layout.chipsScroll} clientWidth=${layout.chipsClient}）`);
  assert.ok(!layout.columns.includes(" "), "single-column layout on narrow screens");
  assert.equal(layout.activeVisible, true, "active chapter is scrolled into view");

  /* 切到最后一章（方差验证）：页面滚动不动，选中的章节气泡被滚进视野 */
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.click('.practice-chapter[data-experiment-ids~="signals-ch5-random-average"]');
  await page.waitForTimeout(700);
  const after = await page.evaluate(() => {
    const chapters = document.querySelector(".practice-chapters");
    const active = chapters.querySelector(".practice-chapter.is-active");
    const a = active.getBoundingClientRect();
    const t = chapters.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      activeVisible: a.left >= t.left - 1 && a.right <= t.right + 1,
      chaptersLeft: Math.round(chapters.scrollLeft),
    };
  });
  assert.equal(after.scrollY, scrollBefore, "page scroll unchanged after chapter switch");
  assert.equal(after.activeVisible, true, "last chapter scrolled into view");
  assert.ok(after.chaptersLeft > 0, "chapter strip scrolled itself");
  await page.close();
});

test("keyboard can reach tabs and the back button", async () => {
  const page = await browser.newPage();
  await openPractice(page);

  const reachable = await page.evaluate(() => {
    const back = document.querySelector(".notebook-back");
    const activeTab = document.querySelector(".practice-tab.is-active");
    back.focus();
    const b = document.activeElement === back;
    activeTab.focus();
    const c = document.activeElement === activeTab;
    return { back: b, tab: c };
  });
  assert.equal(reachable.back, true);
  assert.equal(reachable.tab, true);
  await page.close();
});

test("LTI / FIR / variance experiments render interactive demos with correct baselines", async () => {
  const page = await browser.newPage();
  await openPractice(page);

  /* 按实验 ID 切换（两级导航：先点章节气泡，再点芯片） */
  const switchTo = (id) => switchToExperiment(page, id);
  const state = () =>
    page.evaluate(() => ({
      demo: Boolean(document.querySelector(".notebook-demo")),
      canvas: Boolean(document.querySelector(".demo-canvas")),
      placeholder: Boolean(document.querySelector(".practice-placeholder")),
      metrics: Array.from(document.querySelectorAll(".demo-metric-value")).map((el) => el.textContent.trim()),
      numericFields: Array.from(document.querySelectorAll(".demo-field input")).map((el) => el.value),
      selects: Array.from(document.querySelectorAll(".demo-field select")).map((el) => el.value),
    }));

  await switchTo("signals-ch3-first-order-lti"); // LTI
  let s = await state();
  assert.equal(s.demo, true, "LTI has a demo panel");
  assert.equal(s.placeholder, false, "LTI placeholder replaced");
  assert.deepEqual(s.metrics.slice(0, 4), ["2", "2", "0", "2"], "LTI defaults: both algorithms 2, zero error, steady state 2");
  assert.deepEqual(s.numericFields, ["0.5", "20", "0"], "LTI defaults a/N/y[-1]");
  assert.deepEqual(s.selects, ["step"]);

  await switchTo("signals-ch4-moving-average"); // FIR
  s = await state();
  assert.equal(s.demo, true, "FIR has a demo panel");
  assert.equal(s.metrics[0], "-3.779 dB", "FIR default high-freq attenuation at fs=200, f2=20, M=5");
  assert.equal(s.metrics[1], "2 个样点", "FIR group delay (M-1)/2");
  assert.deepEqual(s.numericFields, ["2", "20", "5", "0.6"]);
  assert.deepEqual(s.selects, ["rect"]);

  await switchTo("signals-ch5-random-average"); // variance
  s = await state();
  assert.equal(s.demo, true, "variance has a demo panel");
  assert.deepEqual(s.numericFields, ["100000", "9", "3"]);
  assert.deepEqual(s.selects, ["gauss"]);
  const inVar = Number(s.metrics[1]);
  const outVar = Number(s.metrics[2]);
  assert.ok(Math.abs(inVar - 9) < 0.2, `input variance ≈ 9 (got ${inVar})`);
  assert.ok(Math.abs(outVar - 3) < 0.15, `output variance ≈ 3 (got ${outVar})`);
  assert.equal(s.metrics[3], "3", "theoretical σ²/L with L=3");

  /* LTI 参数互动：a=0.3 → 稳态 1.429 */
  await switchTo("signals-ch3-first-order-lti");
  await page.evaluate(() => {
    const input = document.querySelector(".demo-field input");
    input.value = "0.3";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(150);
  s = await state();
  assert.equal(s.metrics[0], "1.429", "LTI recursion output updates with a");
  assert.equal(s.metrics[3], "1.429", "theoretical steady state 1/(1-a)");

  /* LTI 冲激输入：输出降为零并标注瞬态衰减 */
  await page.evaluate(() => {
    const select = document.querySelector(".demo-field select");
    select.value = "impulse";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(150);
  s = await state();
  assert.ok(s.metrics[3].includes("瞬态"), "impulse input labels transient decay");

  /* FIR 汉宁窗：高频衰减改变（主瓣变宽 → 大于矩形窗的 −3.78 dB） */
  await switchTo("signals-ch4-moving-average");
  await page.evaluate(() => {
    const select = document.querySelector(".demo-field select");
    select.value = "hann";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(150);
  s = await state();
  assert.equal(s.metrics[0], "-0.872 dB", "Hann window attenuation differs from rect");
  assert.equal(s.metrics[1], "2 个样点", "group delay unchanged by window type");

  /* 方差：L=5 + 均匀分布 → 输出方差 ≈ σ²/L = 1.8 */
  await switchTo("signals-ch5-random-average");
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".demo-field input"));
    inputs[2].value = "5";
    inputs[2].dispatchEvent(new Event("input", { bubbles: true }));
    const select = document.querySelector(".demo-field select");
    select.value = "uniform";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(500);
  s = await state();
  assert.equal(s.metrics[3], "1.8", "theoretical σ²/L with L=5");
  assert.ok(Math.abs(Number(s.metrics[2]) - 1.8) < 0.1, `uniform output variance ≈ 1.8 (got ${s.metrics[2]})`);
  await page.close();
});
