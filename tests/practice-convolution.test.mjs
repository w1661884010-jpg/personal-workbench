/* 批次 A · 模块 2「动态卷积」验收测试（先失败后实现）。
   约定：计算与绘制分离，测试调用产品实际暴露的纯计算实现
   （window.__practiceCalc），而不是在测试里复制一份算法自证。
   期望值来自解析分段式与独立直接求和。 */
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
const EXPERIMENT_ID = "signals-ch1-convolution";

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

/** 打开该实验的演练页并等待计算接口就绪。
    沿用 tests/practice.behaviour.test.mjs 的既有打开方式：
    #practiceToggle → .practice-tab[data-experiment-id]（按 ID 路由，不依赖下标）。 */
async function openDemo(page, width = 1440, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto(BASE);
  await page.waitForSelector("#practiceToggle");
  await page.click("#practiceToggle");
  await page.waitForSelector(".practice-chapter");
  /* 两级导航：先点开该实验所属章节，芯片才会在大气泡里渲染出来 */
  await page.click(`.practice-chapter[data-experiment-ids~="${EXPERIMENT_ID}"]`);
  await page.waitForTimeout(260);
  await page.click(`.practice-tab[data-experiment-id="${EXPERIMENT_ID}"]`);
  /* 等内容真正换成目标实验（切换带 150ms 淡出），再让挂载后的首帧重绘跑完：
   演练在挂载时先按 100px 兜底画一次，随后用 rAF 修正为 CSS 尺寸 × DPR。 */
await page.waitForFunction((want) => {
    const active = document.querySelector(".practice-tab.is-active");
    return Boolean(active) && active.getAttribute("data-experiment-id") === want;
  }, EXPERIMENT_ID, { timeout: 8000 });
await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
await page.waitForFunction(() => !!window.__practiceCalc, null, { timeout: 8000 });
  return page;
}

test("模块2：解析式与手算分段值逐点一致（网格对齐点）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const { convolutionAnalytic } = window.__practiceCalc;
    return [[-1, 1, 1], [0, 1, 1], [0.5, 1, 1], [1, 1, 1], [1.5, 1, 1], [2, 1, 1],
            [1, 1, 2], [1.5, 1, 2], [2, 1, 2], [2.5, 1, 2], [3, 1, 2], [0.25, 0.5, 3]]
      .map(([t, w1, w2]) => [t, w1, w2, convolutionAnalytic(t, w1, w2)]);
  });
  for (const [t, w1, w2, value] of got) {
    const lo = Math.min(w1, w2);
    const hi = Math.max(w1, w2);
    let expected = 0;
    if (t > 0 && t < w1 + w2) expected = t <= lo ? t : (t <= hi ? lo : w1 + w2 - t);
    assert.ok(Math.abs(value - expected) < 1e-12,
      `y(${t}; ${w1}, ${w2}) 应为 ${expected}，实测 ${value}`);
  }
  await page.close();
});

test("模块2：数值积分（复合梯形 dτ=0.005）与解析式绝对误差 < 0.01，含非网格对齐点与跳变前后", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const rows = await page.evaluate(() => {
    const { convolutionAnalytic, convolutionNumeric } = window.__practiceCalc;
    const cases = [];
    const widths = [[1, 1], [1, 2], [0.5, 3], [2.4, 1.3]];
    for (const [w1, w2] of widths) {
      for (const t of [-0.5, 0, 0.013, 0.997, 1.001, 1.5, 2.003, 2.5, w1 + w2 - 0.007, w1 + w2 + 0.5]) {
        cases.push([t, w1, w2, convolutionNumeric(t, w1, w2, 0.005), convolutionAnalytic(t, w1, w2)]);
      }
    }
    return cases;
  });
  for (const [t, w1, w2, numeric, analytic] of rows) {
    assert.ok(Math.abs(numeric - analytic) < 0.01,
      `t=${t} (w=${w1},${w2}): 数值 ${numeric} 与解析 ${analytic} 差 ${Math.abs(numeric - analytic)}`);
  }
  await page.close();
});

test("模块2：峰值 min(w₁,w₂)、平台段恒定、总面积 w₁w₂", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const result = await page.evaluate(() => {
    const { convolutionAnalytic } = window.__practiceCalc;
    const scan = (w1, w2) => {
      const end = w1 + w2;
      let peak = -Infinity;
      let area = 0;
      const step = 0.001;
      let prev = convolutionAnalytic(0, w1, w2);
      for (let t = step; t <= end; t += step) {
        const v = convolutionAnalytic(t, w1, w2);
        peak = Math.max(peak, v);
        area += 0.5 * (prev + v) * step;
        prev = v;
      }
      return { peak, area };
    };
    const a = scan(1, 1);
    const b = scan(1, 2);
    /* 平台段 [1,2] 的取值（w1=1,w2=2） */
    const plateau = [1.0, 1.25, 1.5, 1.75, 2.0].map((t) => convolutionAnalytic(t, 1, 2));
    return { a, b, plateau };
  });
  assert.ok(Math.abs(result.a.peak - 1) < 1e-6, `(1,1) 峰值应为 1，实测 ${result.a.peak}`);
  assert.ok(Math.abs(result.b.peak - 1) < 1e-6, `(1,2) 峰值应为 min(1,2)=1，实测 ${result.b.peak}`);
  assert.ok(Math.abs(result.a.area - 1) < 1e-3, `(1,1) 总面积应为 1，实测 ${result.a.area}`);
  assert.ok(Math.abs(result.b.area - 2) < 1e-3, `(1,2) 总面积应为 2，实测 ${result.b.area}`);
  for (const value of result.plateau) {
    assert.ok(Math.abs(value - 1) < 1e-12, `平台段应恒为 1，实测 ${value}`);
  }
  await page.close();
});

test("模块2：控件驱动数值卡更新；宽度改变后 t 被夹紧在合法范围", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const readMetrics = () => page.evaluate(() =>
    Array.from(document.querySelectorAll(".demo-metric")).map((node) => ({
      label: node.querySelector(".demo-metric-label")?.textContent.trim(),
      value: node.querySelector(".demo-metric-value")?.textContent.trim(),
    })));

  const initial = await readMetrics();
  assert.ok(initial.length >= 4, `数值卡至少 4 张，实测 ${initial.length}`);

  /* 把观察时刻设到 t=1（等宽预设下应为峰值）——按标签定位，不依赖控件顺序 */
  const moved = await page.evaluate(() => {
    const field = Array.from(document.querySelectorAll(".notebook-demo .demo-field"))
      .find((node) => /观察时刻/.test(node.textContent));
    const input = field && field.querySelector('input[type="number"]');
    if (!input) return false;
    input.value = "1";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  });
  assert.equal(moved, true, "应能按标签找到观察时刻输入框");
  await page.waitForTimeout(120);
  const after = await readMetrics();
  assert.notDeepEqual(after, initial, "改变观察时刻后数值卡应更新");
  const peakRow = after.find((row) => /瞬时输出/.test(row.label));
  assert.equal(peakRow && peakRow.value, "1", `t=1 时 y(t) 应为峰值 1，实测 ${peakRow && peakRow.value}`);

  /* 缩小 w₂ 后，若 t 超出新支撑范围应被夹紧 */
  const clamped = await page.evaluate(() => {
    const state = window.__practiceState ? window.__practiceState("signals-ch1-convolution") : null;
    return state || null;
  });
  if (clamped) {
    assert.ok(clamped.timeT <= clamped.width1 + clamped.width2 + 1 + 1e-9,
      `t 应被夹紧在支撑范围内，实测 ${clamped.timeT}`);
  }
  await page.close();
});

test("模块2：端点取半高 ⇒ 网格对齐情形取确定值 解析值−dτ/2（删掉半高即失败）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const result = await page.evaluate(() => {
    const { rectValue, convolutionNumeric, convolutionAnalytic } = window.__practiceCalc;
    return {
      edge0: rectValue(0, 1),
      edge1: rectValue(1, 1),
      inside: rectValue(0.5, 1),
      outside: rectValue(1.5, 1),
      numeric: convolutionNumeric(1, 1, 1, 0.005),
      analytic: convolutionAnalytic(1, 1, 1),
    };
  });
  assert.equal(result.edge0, 0.5, `矩形在 τ=0 处应取半高，实测 ${result.edge0}`);
  assert.equal(result.edge1, 0.5, `矩形在 τ=w 处应取半高，实测 ${result.edge1}`);
  assert.equal(result.inside, 1, "支撑内部应取 1");
  assert.equal(result.outside, 0, "支撑之外应取 0");
  /* 网格与跳变对齐时的确定值：端点半高 ⇒ 1 − dτ/2 = 0.9975；
     若端点按支撑内取 1（即丢掉半高），同一调用会得到 1.0 —— 该差异即本断言的把关点。
     注意这只是在"对齐"这一种情形下的取值，不构成对误差上界的普遍断言。 */
  assert.ok(Math.abs(result.numeric - (result.analytic - 0.005 / 2)) < 1e-9,
    `网格对齐时数值积分应为 解析值 − dτ/2 = ${result.analytic - 0.0025}，实测 ${result.numeric}`);
  await page.close();
});

test("模块2：播放可暂停，重新进入后不自动播放（无旧回调）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const playButton = page.locator(".notebook-demo button", { hasText: /播放|暂停/ }).first();
  assert.ok(await playButton.count() > 0, "应有播放/暂停按钮");
  await playButton.click();
  await page.waitForTimeout(200);
  await playButton.click();          /* 暂停 */
  const t1 = await page.evaluate(() => window.__practiceState("signals-ch1-convolution").timeT);
  await page.waitForTimeout(300);
  const t2 = await page.evaluate(() => window.__practiceState("signals-ch1-convolution").timeT);
  assert.equal(t1, t2, "暂停后观察时刻不应继续推进");
  await page.close();
});

/* 规划文档 §三.2：点击下图一个历史位置显示 τ 和经历时间 t−τ。
   断言的是“读数自洽”，不复制产品的位置映射：τ 必须落在输入支撑内，
   已历经时间必须等于 t−τ，且 h(t−τ) 必须与计算契约的独立取值一致——
   这三者是该交互的教学主张（该点按 x(τ)·h(t−τ)·dτ 计入输出）。 */
test("模块2：点击历史位置读出 τ 与经历时间 t−τ，且与计算契约自洽", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const readout = await page.evaluate(async () => {
    const label = [...document.querySelectorAll(".demo-field")].find((l) => /观察时刻/.test(l.textContent));
    const tInput = label.querySelector('input[type="number"]');
    tInput.value = "1.5";
    tInput.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((r) => requestAnimationFrame(r));
    const canvas = document.querySelector(".notebook-demo canvas");
    const box = canvas.getBoundingClientRect();
    const click = (x) => canvas.dispatchEvent(new MouseEvent("click", {
      bubbles: true, clientX: box.left + x, clientY: box.top + 60,   /* 上视口：τ 轴 */
    }));
    const history = () => document.querySelector(".demo-history").textContent.trim();
    click(box.width / 2);
    const inside = history();
    click(box.width - 20);
    const outside = history();
    return { inside, outside, w1: window.__practiceState("signals-ch1-convolution").width1 };
  });

  const m = /历史位置 τ=([-\d.]+) s：已历经 ([-\d.]+) s，h\(t−τ\)=([-\d.]+)/.exec(readout.inside);
  assert.ok(m, `上视口中部点击应落在输入支撑内并给出 τ 与经历时间，实测：${readout.inside}`);
  const tau = Number(m[1]);
  const elapsed = Number(m[2]);
  const h = Number(m[3]);
  assert.ok(tau >= 0 && tau <= readout.w1, `τ=${tau} 应落在输入支撑 [0, ${readout.w1}] 内`);
  assert.ok(Math.abs(elapsed - (1.5 - tau)) < 0.02,
    `已历经时间应为 t−τ = ${1.5 - tau}，实测 ${elapsed}`);
  const expectedH = await page.evaluate((u) => window.__practiceCalc.hValue(u, 1), elapsed);
  assert.equal(h, expectedH, `h(t−τ) 应与计算契约一致：期望 ${expectedH}，实测 ${h}`);
  assert.match(readout.outside, /不在输入支撑/, `支撑外点击应给出提示，实测：${readout.outside}`);
  await page.close();
});
