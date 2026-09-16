/* 批次 C · 模块 3「傅里叶表示」验收测试（先写用例，再实现）。
   期望值来自文档 §三.3 的系数式与独立复算脚本（见 report-batchC.md）。
   关键区分：谱密度 T·c_k 的包络不随 T 变，c_k 本身随 T 变小——
   「谱线变密」与「谐波逼近」是两回事。 */
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
const EXPERIMENT_ID = "signals-ch1-fourier-synthesis";

const sinc = (u) => (Math.abs(u) < 1e-12 ? 1 : Math.sin(Math.PI * u) / (Math.PI * u));
/* 独立复算：τ=1，c_k=(τ/T)sinc(kτ/T) */
const directCoef = (k, T) => (1 / T) * sinc(k / T);
const directPartial = (t, T, N) => {
  let sum = directCoef(0, T);
  for (let k = 1; k <= N; k += 1) sum += 2 * directCoef(k, T) * Math.cos((2 * Math.PI * k * t) / T);
  return sum;
};

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

test("模块3：系数与部分和与独立复算逐点一致", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    const coefs = [];
    for (const T of [2, 3, 4, 8]) for (const k of [0, 1, 2, 3, 7, 16]) coefs.push([T, k, calc.fourierCoefficient(k, T)]);
    const sums = [];
    for (const [T, N] of [[2, 1], [2, 5], [2, 21], [4, 101], [8, 13]]) {
      for (const t of [-1, -0.5, -0.25, 0, 0.13, 0.5, 0.9, 1.75]) sums.push([T, N, t, calc.fourierPartialSum(t, T, N)]);
    }
    return { coefs, sums };
  });
  for (const [T, k, value] of got.coefs) {
    assert.ok(Math.abs(value - directCoef(k, T)) <= 1e-12, `c_${k}(T=${T})：期望 ${directCoef(k, T)}，实测 ${value}`);
  }
  for (const [T, N, t, value] of got.sums) {
    assert.ok(Math.abs(value - directPartial(t, T, N)) <= 1e-12, `x_${N}(${t}, T=${T})：期望 ${directPartial(t, T, N)}，实测 ${value}`);
  }
  await page.close();
});

test("模块3：谱点数量只由 T 决定（T2→17、T8→65，含零系数）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    return {
      t2: calc.spectrumPoints(2, 4).length,
      t8: calc.spectrumPoints(8, 4).length,
      t10: calc.spectrumPoints(10, 4).length,
      /* 谱点集合与合成阶数无关：换 N 不影响 */
      ks2: calc.spectrumPoints(2, 4).map((p) => p.k),
      zeroIncluded: calc.spectrumPoints(2, 4).filter((p) => Math.abs(p.value) < 1e-12).length,
    };
  });
  assert.equal(got.t2, 17, `T=2 时 |k/T|≤4 应含 17 个谱点，实测 ${got.t2}`);
  assert.equal(got.t8, 65, `T=8 时应含 65 个谱点，实测 ${got.t8}`);
  assert.equal(got.t10, 81, `T=10 时应含 81 个谱点，实测 ${got.t10}`);
  assert.equal(got.ks2[0], -8, "T=2 的最小谐波序号应为 −8");
  assert.equal(got.ks2[got.ks2.length - 1], 8, "T=2 的最大谐波序号应为 8");
  assert.ok(got.zeroIncluded >= 4, `T=2 半占空比下应有若干零系数谱点，实测 ${got.zeroIncluded}`);
  await page.close();
});

test("模块3：谱点落在连续包络 τ·sinc(τf) 上，误差 ≤1e-10", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    const out = [];
    for (const T of [2, 4, 8]) {
      for (const point of calc.spectrumPoints(T, 4)) {
        out.push([T, point.k, point.f, point.value, calc.envelopeValue(point.f)]);
      }
    }
    return out;
  });
  assert.ok(got.length >= 100, `应有足够谱点参与比对，实测 ${got.length}`);
  for (const [T, k, f, value, envelope] of got) {
    assert.ok(Math.abs(f - k / T) < 1e-12, `T=${T},k=${k}：谱点频率应为 k/T，实测 ${f}`);
    assert.ok(Math.abs(value - envelope) <= 1e-10,
      `T=${T},k=${k}：T·c_k 应落在包络上（包络 ${envelope}，实测 ${value}）`);
  }
  await page.close();
});

test("模块3：半占空比时偶次系数自然消失，其他周期不消失", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    const evens = (T) => [2, 4, 6, 8].map((k) => Math.abs(calc.fourierCoefficient(k, T)));
    return { t2: evens(2), t3: evens(3) };
  });
  for (const [i, value] of got.t2.entries()) {
    assert.ok(value < 1e-12, `T=2（半占空比）第 ${i} 个偶次系数应为 0，实测 ${value}`);
  }
  assert.ok(got.t3.some((value) => value > 1e-3), `T=3 非半占空比，偶次系数不应全为 0，实测 ${JSON.stringify(got.t3)}`);
  await page.close();
});

test("模块3：文档点名的三项数值——c₂=1/(2π)、x_N(0)≈1、过冲 8.8%–9.2%", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    return {
      c2: calc.fourierCoefficient(2, 4),
      atZero: calc.fourierPartialSum(0, 4, 101),
      overshoot: calc.jumpOvershootPercent(2, 101),
      gibbs: calc.gibbsPeakValue,
    };
  });
  assert.ok(Math.abs(got.c2 - 1 / (2 * Math.PI)) <= 1e-12,
    `T=4,k=2 时 c₂ 应为 1/(2π)，实测 ${got.c2}`);
  assert.ok(Math.abs(got.atZero - 1) <= 0.02,
    `T=4,N=101 时 |x_N(0)−1| 应 ≤0.02，实测 ${got.atZero}`);
  assert.ok(got.overshoot >= 8.8 && got.overshoot <= 9.2,
    `T=2,N=101 跳变内侧过冲应落在 8.8%–9.2%，实测 ${got.overshoot}%`);
  /* 只声明渐近参考线的取值，不声称有限 N 一定低于它（文档明确） */
  assert.ok(Math.abs(got.gibbs - 1.08949) < 1e-5, `渐近参考线应为 1.08949，实测 ${got.gibbs}`);
  await page.close();
});

test("模块3：MSE 按一个周期 4096 个中点等权计算，且随 N 增大而减小", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    return {
      n5: calc.fourierMse(2, 5),
      n21: calc.fourierMse(2, 21),
      n101: calc.fourierMse(2, 101),
      samples: calc.mseSampleCount,
    };
  });
  assert.equal(got.samples, 4096, `MSE 取样点数应为 4096，实测 ${got.samples}`);
  assert.ok(got.n101 < got.n21 && got.n21 < got.n5,
    `MSE 应随 N 增大而减小，实测 ${got.n5} / ${got.n21} / ${got.n101}`);
  assert.ok(got.n101 > 0.02 && got.n101 < 0.05, `T=2,N=101 的 RMSE 应在 0.02–0.05，实测 ${got.n101}`);
  await page.close();
});

test("模块3：控件驱动指标——T·c_k 与谱点数分裂成「变密」与「逼近」两件事", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const read = () => page.evaluate(() => {
    const out = {};
    document.querySelectorAll(".demo-metric").forEach((card) => {
      out[card.querySelector(".demo-metric-label").textContent.trim()] = card.querySelector(".demo-metric-value").textContent.trim();
    });
    return out;
  });
  const pick = (obj, re) => { const k = Object.keys(obj).find((x) => re.test(x)); return k ? obj[k] : undefined; };
  const setField = (re, value) => page.evaluate(([source, v]) => {
    const label = [...document.querySelectorAll(".demo-field")].find((l) => new RegExp(source).test(l.textContent));
    if (!label) throw new Error(`未找到参数 ${source}`);
    const input = label.querySelector('input[type="number"]');
    input.value = String(v);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, [re, value]);

  const state = () => page.evaluate(() => window.__practiceState("signals-ch1-fourier-synthesis"));
  const initial = await state();
  assert.equal(initial.T, 2, "T 默认应为 2");
  assert.equal(initial.N, 5, "N 默认应为 5");

  const s2 = await read();
  assert.match(String(pick(s2, /谱点数|谱线数/)), /17/, `T=2 时谱点数应为 17，实测 ${JSON.stringify(s2)}`);

  /* 只加 N：谱点范围不变，逼近变好 */
  await setField("谐波", 101);
  await page.waitForTimeout(200);
  const s2n = await read();
  assert.match(String(pick(s2n, /谱点数|谱线数/)), /17/,
    `增加 N 不得改变谱点范围（仍是 17 个），实测 ${JSON.stringify(s2n)}`);
  const mseBefore = Number(String(pick(s2, /MSE|RMSE/)).replace(/[^\d.]/g, ""));
  const mseAfter = Number(String(pick(s2n, /MSE|RMSE/)).replace(/[^\d.]/g, ""));
  assert.ok(mseAfter < mseBefore, `增加 N 应让 MSE 下降：${mseBefore} → ${mseAfter}`);

  /* 只加 T：谱点变密（65 个），但包络不动 */
  await setField("周期", 8);
  await page.waitForTimeout(200);
  const s8 = await read();
  assert.match(String(pick(s8, /谱点数|谱线数/)), /65/, `T=8 时谱点数应为 65，实测 ${JSON.stringify(s8)}`);
  assert.match(String(pick(s8, /频率间隔|f_?0|基频/)), /0\.125/, `T=8 时基频应为 0.125 Hz，实测 ${JSON.stringify(s8)}`);
  await page.close();
});

test("模块3：课程条目含预测问题、≥2 组反例对照与「用自己的话解释」步骤", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const steps = await page.evaluate(() =>
    [...document.querySelectorAll(".notebook-step-section li, .notebook-step-section p")].map((x) => x.textContent.trim()));
  const all = steps.join("\n");
  assert.ok(steps.length >= 5, `步骤数应 ≥5，实测 ${steps.length}`);
  assert.match(all, /先预测/, "必须含预测问题");
  assert.ok((all.match(/反例/g) || []).length >= 2, `必须含 ≥2 组反例对照，实测 ${(all.match(/反例/g) || []).length} 处`);
  assert.match(all, /用自己的话解释/, "必须含「用自己的话解释」步骤");
  await page.close();
});
