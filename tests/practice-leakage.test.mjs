/* 批次 B · 模块 5「频谱分析」验收测试（先写用例，再实现）。
   期望值来自独立复算（_batchB-spec.mjs 的同款算法，见 docs/round-2026-09-16-practice/report-batchB.md），
   不是在测试里调用产品实现自证。测试只调用产品暴露的纯计算接口 window.__practiceCalc。 */
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
const EXPERIMENT_ID = "signals-ch2-spectral-leakage";
const FS = 64;

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

/** 沿用既有打开方式：`#practiceToggle` → `.practice-tab[data-experiment-id]`（按 ID 路由，不依赖下标）。 */
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

/* 独立复算：归一化频谱 |Σ w[n]x[n]e^{−j2πfn/fs}| / Σw[n]（fs=64 固定）。 */
function windowValue(win, n, L) {
  if (win === "hann") return 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (L - 1));
  return 1;
}
function sceneValue(scene, n) {
  const w = (2 * Math.PI * n) / FS;
  if (scene === "single10") return Math.cos(10 * w);
  if (scene === "single10.5") return Math.cos(10.5 * w);
  if (scene === "dual") return Math.cos(10 * w) + Math.cos(12 * w);
  throw new Error(`未知场景 ${scene}`);
}
function directSpectrum(scene, L, win, f) {
  let sumW = 0, re = 0, im = 0;
  for (let n = 0; n < L; n += 1) {
    const w = windowValue(win, n, L);
    sumW += w;
    const x = sceneValue(scene, n);
    const phase = (-2 * Math.PI * f * n) / FS;
    re += w * x * Math.cos(phase);
    im += w * x * Math.sin(phase);
  }
  return Math.hypot(re, im) / sumW;
}

test("模块5：DFT 谱点与直接求和误差 ≤1e-9，且归一化分母是 Σw[n]（不作单边翻倍）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate((fs) => {
    const out = [];
    for (const scene of ["single10", "single10.5", "dual"]) {
      for (const win of ["rect", "hann"]) {
        for (const [L, Nfft] of [[16, 16], [32, 64], [64, 128], [48, 96]]) {
          for (const k of [0, 3, 11, Math.floor(Nfft / 4)]) {
            out.push([scene, win, L, k, Nfft, window.__practiceCalc.dftMagnitude(scene, L, win, k, Nfft)]);
          }
        }
      }
    }
    return { out, fs };
  }, FS);
  assert.ok(got.out.length > 0, "dftMagnitude 应返回数值");
  for (const [scene, win, L, k, Nfft, value] of got.out) {
    const f = (k * got.fs) / Nfft;
    const expected = directSpectrum(scene, L, win, f);
    assert.ok(Math.abs(value - expected) <= 1e-9,
      `${scene}/${win}/L=${L}/k=${k}/Nfft=${Nfft}：期望 ${expected}，实测 ${value}`);
  }
  /* 单位幅度单音在自身频率上的谱峰必须是 0.5（幅度 1 分成 ±f 两条线各 0.5）。
     若实现做了单边翻倍，这里会得到 1.0 而不是 0.5。 */
  const peak = await page.evaluate(() => window.__practiceCalc.spectrumMagnitude("single10", 64, "rect", 10));
  assert.ok(Math.abs(peak - 0.5) < 1e-9, `单位幅度单音的谱峰应为 0.5（不作单边翻倍），实测 ${peak}`);
  await page.close();
});

test("模块5：补零不改变同一频率的频谱值（只改变读数密度）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    const at = (Nfft, k) => calc.dftMagnitude("single10.5", 32, "rect", k, Nfft);
    return {
      a: at(128, 21),                       /* f = 21·64/128 = 10.5 Hz */
      b: at(256, 42),                       /* f = 42·64/256 = 10.5 Hz */
      c: at(192, 31),                       /* f = 31·64/192 ≈ 10.333 Hz，非对齐频率 */
      dense: calc.spectrumMagnitude("single10.5", 32, "rect", 10.5),
      denseOther: calc.spectrumMagnitude("single10.5", 32, "rect", 31 * 64 / 192),
    };
  });
  assert.ok(Math.abs(got.a - got.b) < 1e-12,
    `同一频率 10.5 Hz 在 Nfft=128 与 256 下必须相同，实测 ${got.a} vs ${got.b}`);
  assert.ok(Math.abs(got.a - got.dense) < 1e-12,
    `DFT 谱点必须等于同频率的稠密 DTFT，实测 ${got.a} vs ${got.dense}`);
  assert.ok(Math.abs(got.c - got.denseOther) < 1e-12,
    `非对齐频率同理：${got.c} vs ${got.denseOther}`);
  await page.close();
});

test("模块5：双音分辨——L16 只有 1 个局部峰，L64 分成 2 个（不要求恰为 10/12 Hz）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const peaks = await page.evaluate(() => ({
    l16: window.__practiceCalc.localPeaks("dual", 16, "rect", 9, 13, 0.01),
    l64: window.__practiceCalc.localPeaks("dual", 64, "rect", 9, 13, 0.01),
  }));
  assert.equal(peaks.l16.length, 1, `L=16 在 [9,13]Hz 应只有 1 个局部峰，实测 ${JSON.stringify(peaks.l16)}`);
  assert.ok(peaks.l16[0][0] > 10.9 && peaks.l16[0][0] < 11.3,
    `L=16 的单峰应落在 11.08 Hz 附近，实测 ${peaks.l16[0][0]}`);
  assert.equal(peaks.l64.length, 2, `L=64 应分成 2 个局部峰，实测 ${JSON.stringify(peaks.l64)}`);
  const [lo, hi] = peaks.l64.map((p) => p[0]).sort((a, b) => a - b);
  assert.ok(lo >= 9.7 && lo <= 10.3, `低峰应落在 [9.7,10.3]Hz，实测 ${lo}`);
  assert.ok(hi >= 11.7 && hi <= 12.3, `高峰应落在 [11.7,12.3]Hz，实测 ${hi}`);
  await page.close();
});

test("模块5：窗对照——矩形第一旁瓣约 −13.3dB，Hann 约 −31.5dB，且 Hann 主瓣更宽", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => ({
    rectSide: window.__practiceCalc.windowFirstSidelobeDb("rect", 64, 0.001),
    hannSide: window.__practiceCalc.windowFirstSidelobeDb("hann", 64, 0.001),
    rectEdge: window.__practiceCalc.windowMainLobeEdge("rect", 64, 0.001),
    hannEdge: window.__practiceCalc.windowMainLobeEdge("hann", 64, 0.001),
  }));
  assert.ok(got.rectSide >= -14 && got.rectSide <= -12,
    `矩形窗第一旁瓣应落在 [−14,−12]dB，实测 ${got.rectSide}`);
  assert.ok(got.hannSide >= -33 && got.hannSide <= -30,
    `Hann 第一旁瓣应落在 [−33,−30]dB，实测 ${got.hannSide}`);
  assert.ok(got.hannEdge > got.rectEdge,
    `Hann 主瓣应更宽：矩形 ${got.rectEdge}Hz，Hann ${got.hannEdge}Hz`);
  await page.close();
});

test("模块5：控件驱动指标卡——L/f_s、f_s/L、f_s/N_fft 随 L 与 M 更新", async () => {
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

  const defaults = await read();
  /* 默认 L=32、f_s=64、M=0 ⇒ N_fft=32：L/f_s=0.5 s、f_s/L=2 Hz、f_s/N_fft=2 Hz */
  assert.equal(pick(defaults, /L\s*\/\s*f/), "0.5 s", `L/fs 定义有误：${JSON.stringify(defaults)}`);
  assert.equal(pick(defaults, /f_?s\s*\/\s*L/), "2 Hz", `fs/L 定义有误：${JSON.stringify(defaults)}`);
  assert.equal(pick(defaults, /N_?fft|网格/), "2 Hz（N_fft=32）", `补零后网格定义有误：${JSON.stringify(defaults)}`);

  /* 改 L：L=64 → L/fs=1 s、fs/L=64 Hz */
  await page.evaluate(() => {
    const label = [...document.querySelectorAll(".demo-field")].find((l) => /观察长度/.test(l.textContent));
    const input = label.querySelector('input[type="number"]');
    input.value = "64";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(150);
  const afterL = await read();
  assert.equal(pick(afterL, /L\s*\/\s*f/), "1 s", `L=64 时 L/fs 应为 1 s，实测 ${JSON.stringify(afterL)}`);
  assert.equal(pick(afterL, /f_?s\s*\/\s*L/), "1 Hz", `L=64 时 fs/L 应为 1 Hz，实测 ${JSON.stringify(afterL)}`);

  /* 改 M：补零只改网格，不改观察时间 */
  await page.evaluate(() => {
    const label = [...document.querySelectorAll(".demo-field")].find((l) => /补零/.test(l.textContent));
    const input = label.querySelector('input[type="number"]');
    input.value = "64";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(150);
  const afterM = await read();
  assert.equal(pick(afterM, /N_?fft|网格/), "0.5 Hz（N_fft=128）", `M=64 时 N_fft=128（网格 0.5 Hz），实测 ${JSON.stringify(afterM)}`);
  assert.equal(pick(afterM, /L\s*\/\s*f/), "1 s", `补零不得改变观察时间 L/fs，实测 ${JSON.stringify(afterM)}`);
  await page.close();
});

test("模块5：最短记录Hann窗也能找到并显示主瓣和旁瓣", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const result = await page.evaluate(() => {
    const field = [...document.querySelectorAll(".demo-field")].find((f) => /观察长度/.test(f.textContent));
    const input = field.querySelector('input[type="number"]');
    input.value = "16";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    const win = [...document.querySelectorAll(".notebook-demo select")].find((s) => [...s.options].some((o) => o.value === "hann"));
    win.value = "hann";
    win.dispatchEvent(new Event("change", { bubbles: true }));
    return {
      lobe: window.__practiceCalc.windowLobe("hann", 16, .001),
      metric: [...document.querySelectorAll(".demo-metric")].find((c) => /窗主瓣/.test(c.textContent)).textContent,
    };
  });
  assert.ok(result.lobe.mainLobeEdge > 8.5 && result.lobe.mainLobeEdge < 8.6, "L16 Hann的第一零点约为2fs/(L-1)=8.533Hz");
  assert.ok(result.lobe.firstSidelobe > result.lobe.mainLobeEdge && result.lobe.firstSidelobe < 13);
  assert.ok(!result.metric.includes("—"), "短记录的有效窗指标不能显示为空");
  await page.close();
});

test("模块5：课程条目含预测问题、≥2 组反例对照与「用自己的话解释」步骤", async () => {
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
