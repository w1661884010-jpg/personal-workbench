/* 演练顶部两级导航：章节气泡（带滑块）+ 该章节实验的大气泡。
   切换逻辑对齐科目间气泡切换——单选中、滑块现场测量落位、内容淡出再淡入。 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const PLAYWRIGHT_CANDIDATES = [
  "C:/Users/Lenovo/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright",
  "C:/Users/Lenovo/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright",
];
function loadPlaywright() {
  for (const candidate of PLAYWRIGHT_CANDIDATES) {
    try { return require(candidate); } catch { /* next */ }
  }
  throw new Error("无法从 npx 缓存加载 playwright");
}

const { chromium } = loadPlaywright();
const BASE = "http://localhost:3010/";
const ALL_IDS = [
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
test.after(async () => { await browser?.close(); });

async function openPractice(page, width = 1440, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto(BASE);
  await page.waitForSelector("#practiceToggle");
  await page.click("#practiceToggle");
  await page.waitForSelector(".practice-chapter");
  await page.waitForTimeout(300);
  return page;
}

const SELECTION = `(() => {
  const nav = document.querySelector(".practice-chapters");
  const thumb = nav.querySelector(".practice-chapter-thumb");
  const active = nav.querySelector(".practice-chapter.is-active");
  const m = /matrix\\(1, 0, 0, 1, (-?[\\d.]+), 0\\)/.exec(getComputedStyle(thumb).transform);
  return {
    chapters: [...nav.querySelectorAll(".practice-chapter")].map((b) => ({
      id: b.dataset.chapterId, label: b.textContent.trim(),
      active: b.classList.contains("is-active"), selected: b.getAttribute("aria-selected"),
      ids: (b.dataset.experimentIds || "").split(" ").filter(Boolean),
    })),
    chips: [...document.querySelectorAll(".practice-tab")].map((b) => ({
      id: b.dataset.experimentId, active: b.classList.contains("is-active"),
    })),
    thumbWidth: Math.round(parseFloat(getComputedStyle(thumb).width)),
    activeWidth: active ? active.offsetWidth : -1,
    thumbX: m ? Number(m[1]) : null,
    activeLeft: active ? active.offsetLeft : -1,
    heading: document.querySelector(".notebook-heading h1")?.textContent.trim(),
  };
})()`;

test("章节气泡：章节按课程顺序归类，data-experiment-ids 覆盖全部 10 个实验且不重复", async () => {
  const page = await browser.newPage();
  await openPractice(page);
  const state = await page.evaluate(SELECTION);
  assert.deepEqual(state.chapters.map((c) => c.label), ["绪论", "第1章", "第2章", "第3章", "第4章", "第5章"],
    `章节气泡应按课程顺序排列，实测 ${JSON.stringify(state.chapters.map((c) => c.label))}`);
  const ids = state.chapters.flatMap((c) => c.ids);
  assert.deepEqual([...ids].sort(), [...ALL_IDS].sort(), "章节气泡声明的实验集合应与全部实验一致");
  assert.equal(new Set(ids).size, ids.length, "实验不得同时出现在两个章节气泡里");
  await page.close();
});

test("同一时间只有一枚章节与一枚实验处于选中态，且大气泡只装当前章节的实验", async () => {
  const page = await browser.newPage();
  await openPractice(page);
  let state = await page.evaluate(SELECTION);
  assert.equal(state.chapters.filter((c) => c.active).length, 1, "应只有一枚章节被选中");
  assert.equal(state.chips.filter((c) => c.active).length, 1, "应只有一个实验被选中");
  const activeChapter = state.chapters.find((c) => c.active);
  assert.deepEqual(state.chips.map((c) => c.id), activeChapter.ids,
    "大气泡里的实验应恰好等于当前章节的实验");
  assert.equal(activeChapter.selected, "true", "选中章节的 aria-selected 应为 true");
  assert.ok(state.chapters.filter((c) => !c.active).every((c) => c.selected === "false"),
    "未选中章节的 aria-selected 应为 false");

  /* 换一个章节后仍各只有一枚选中 */
  await page.evaluate(() => document.querySelector('.practice-chapter[data-chapter-id="signals-ch2"]').click());
  await page.waitForTimeout(600);
  state = await page.evaluate(SELECTION);
  assert.equal(state.chapters.filter((c) => c.active).length, 1, "切换后仍只有一枚章节被选中");
  assert.equal(state.chips.filter((c) => c.active).length, 1, "切换后仍只有一个实验被选中");
  const ch2 = state.chapters.find((c) => c.id === "signals-ch2");
  assert.deepEqual(state.chips.map((c) => c.id), ch2.ids, "切换后大气泡应换成第2章的实验");
  assert.equal(state.heading, "时频双域采样、混叠与模拟重建",
    "切换到第2章应打开该章第一个实验，实测 " + state.heading);
  await page.close();
});

test("章节滑块现场测量落位：宽度与位移对齐选中气泡", async () => {
  const page = await browser.newPage();
  await openPractice(page);
  for (const chapterId of ["signals-ch2", "signals-ch5", "signals-intro"]) {
    await page.evaluate((id) => document.querySelector(`.practice-chapter[data-chapter-id="${id}"]`).click(), chapterId);
    /* 等滑块过渡真正跑完再测量：缓动 --seg-ease 带约 3px 过冲，
       固定 sleep 可能在过冲区采样，测到的位移会比目标大几个像素。 */
    await page.waitForTimeout(120);
    await page.evaluate(async () => {
      const thumb = document.querySelector(".practice-chapter-thumb");
      const running = thumb.getAnimations();
      if (running.length) await Promise.all(running.map((a) => a.finished.catch(() => {})));
    });
    await page.waitForTimeout(60);
    const s = await page.evaluate(SELECTION);
    assert.ok(s.thumbX !== null, `滑块应有 translateX（章节 ${chapterId}）`);
    assert.ok(Math.abs(s.thumbWidth - s.activeWidth) <= 1,
      `滑块宽度应等于选中气泡宽度（章节 ${chapterId}：${s.thumbWidth} vs ${s.activeWidth}）`);
    assert.ok(Math.abs(s.thumbX - s.activeLeft) <= 1,
      `滑块位移应对齐选中气泡（章节 ${chapterId}：${s.thumbX} vs ${s.activeLeft}）`);
  }
  await page.close();
});

/* 淡入淡出断言用「协议」而不是「采样动画中间值」：
   逐帧采样在并发负载下会整段错过 140ms 的过渡窗口（实测最低只采到 0.93），
   因此这里断言三件确定性的事——过渡已声明、点击后先置 0、换好内容后回 1，
   并且内容不是立刻切换（说明确实走了先淡出再换的路径）。 */
test("切换章节：内容区先淡出、再换内容、然后淡入", async () => {
  const page = await browser.newPage();
  await openPractice(page);
  const observed = await page.evaluate(async () => {
    const root = document.querySelector(".notebook-root");
    const heading = () => document.querySelector(".notebook-heading h1")?.textContent.trim();
    const before = heading();
    const transition = getComputedStyle(root).transitionProperty + " " + getComputedStyle(root).transitionDuration;
    document.querySelector('.practice-chapter[data-chapter-id="signals-ch3"]').click();
    const duringOpacity = root.style.opacity;         /* 点击后立刻读：应已置 0 */
    const immediately = heading();                    /* 点击后立刻读：内容还不该换 */
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { transition, duringOpacity, immediately, before, after: heading(), finalOpacity: root.style.opacity };
  });
  assert.match(observed.transition, /opacity/, `内容区应声明 opacity 过渡，实测 ${observed.transition}`);
  assert.ok(!/^0s/.test(observed.transition.split(" ").pop()), `过渡时长应非 0，实测 ${observed.transition}`);
  assert.equal(observed.duringOpacity, "0", "点击后应先把内容区置为透明（淡出）");
  assert.equal(observed.immediately, observed.before, "点击后内容不应立刻切换——先淡出，150ms 后才换内容");
  assert.notEqual(observed.after, observed.before, "淡出后应换成新章节的实验");
  assert.equal(observed.finalOpacity, "1", "换好内容后应恢复不透明（淡入）");
  await page.close();
});

test("切换实验（同一章节）：章节选中态不变，实验选中态随点击转移", async () => {
  const page = await browser.newPage();
  await openPractice(page);
  await page.evaluate(() => document.querySelector('.practice-chapter[data-chapter-id="signals-ch1"]').click());
  await page.waitForTimeout(600);
  const before = await page.evaluate(SELECTION);
  assert.equal(before.chapters.find((c) => c.active).id, "signals-ch1");
  assert.equal(before.chips.find((c) => c.active).id, "signals-ch1-waveform-transform");

  await page.click('.practice-tab[data-experiment-id="signals-ch1-fourier-synthesis"]');
  await page.waitForTimeout(600);
  const after = await page.evaluate(SELECTION);
  assert.equal(after.chapters.find((c) => c.active).id, "signals-ch1", "同章节内切换不应改变章节选中态");
  assert.equal(after.chips.find((c) => c.active).id, "signals-ch1-fourier-synthesis", "实验选中态应随点击转移");
  assert.equal(after.chips.filter((c) => c.active).length, 1, "仍只有一个实验被选中");
  await page.close();
});

test("快速连点章节：只有最后一次生效，不叠加、不闪回", async () => {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await openPractice(page);
  await page.evaluate(() => {
    ["signals-ch2", "signals-ch4", "signals-ch3", "signals-ch5"].forEach((id) => {
      document.querySelector(`.practice-chapter[data-chapter-id="${id}"]`).click();
    });
  });
  await page.waitForTimeout(800);
  const state = await page.evaluate(SELECTION);
  assert.equal(state.chapters.filter((c) => c.active).length, 1, "连点后仍只有一枚章节被选中");
  assert.equal(state.chips.filter((c) => c.active).length, 1, "连点后仍只有一个实验被选中");
  assert.equal(state.chapters.find((c) => c.active).id, "signals-ch5", "最后一次点击应生效");
  assert.deepEqual(state.chips.map((c) => c.id), ALL_IDS.slice(9), "内容应对应最后一次点击的章节");
  assert.deepEqual(errors, [], `连点不应产生运行时错误：${errors.join("; ")}`);
  await page.close();
});

test("reduced-motion：章节滑块不滑动（只保留文字色变化）", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await openPractice(page);
  const duration = await page.evaluate(() =>
    getComputedStyle(document.querySelector(".practice-chapter-thumb")).transitionDuration);
  assert.equal(duration, "0s", `reduced-motion 下章节滑块不应有滑动过渡，实测 ${duration}`);
  await ctx.close();
});

/* 规划文档 §二：重新渲染时要注销旧监听器。
   旧 demo 的 resize 监听若不注销，一次 resize 会让多份历史 demo 同时重绘
   —— 表现为同一批刻度被画多遍（曾把窄屏刻度计数从 3 抬到 6）。 */
test("切换实验会注销上一份 demo 的 resize 监听：一次 resize 只重绘当前这一份", async () => {
  const page = await browser.newPage();
  await openPractice(page);
  /* 连续切换 4 个实验，每切一次都产生一份新 demo（旧监听若不注销会累积） */
  for (const id of ["signals-ch1-convolution", "signals-ch2-aliasing",
                    "signals-ch2-spectral-leakage", "signals-ch2-circular-convolution"]) {
    await page.click(`.practice-chapter[data-experiment-ids~="${id}"]`);
    await page.waitForTimeout(220);
    await page.click(`.practice-tab[data-experiment-id="${id}"]`);
    await page.waitForFunction((want) => {
      const active = document.querySelector(".practice-tab.is-active");
      return Boolean(active) && active.getAttribute("data-experiment-id") === want;
    }, id, { timeout: 8000 });
    await page.waitForTimeout(120);
  }
  const drawn = await page.evaluate(() => {
    const original = CanvasRenderingContext2D.prototype.fillText;
    window.__canvasIds = [];
    CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxW) {
      const canvas = this.canvas;
      if (!canvas.__probeId) canvas.__probeId = (window.__probeSeq = (window.__probeSeq || 0) + 1);
      if (window.__canvasIds.indexOf(canvas.__probeId) === -1) window.__canvasIds.push(canvas.__probeId);
      return original.call(this, text, x, y, maxW);
    };
    window.dispatchEvent(new Event("resize"));
    return new Promise((resolve) => setTimeout(() => resolve(window.__canvasIds.slice()), 300));
  });
  assert.equal(drawn.length, 1,
    `一次 resize 应只重绘当前这一份 demo，实测有 ${drawn.length} 份画布被重绘（旧监听未注销）`);
  await page.close();
});
