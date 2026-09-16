/* 批次 C · 模块 1「波形变换」验收测试（先写用例，再实现）。
   期望值来自文档 §三.1 的解析式，并由独立复算脚本逐项确认
   （见 docs/round-2026-09-16-practice/report-batchC.md）。 */
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
const EXPERIMENT_ID = "signals-ch1-waveform-transform";

/* 独立复算：梯形 x(τ)，特征点 (0,0)、(1,2)、(2,2)、(3,0) */
function xOf(tau) {
  if (tau < 0 || tau > 3) return 0;
  if (tau < 1) return 2 * tau;
  if (tau <= 2) return 2;
  return 2 * (3 - tau);
}
const FEATURES = [[0, 0], [1, 2], [2, 2], [3, 0]];

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

test("模块1：三种参数组合的支撑区间与文档一致", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    return [[2, -4], [-1, 0], [1, 0], [3, 4], [-0.5, 1]]
      .map(([a, b]) => [a, b, ...calc.transformSupport(a, b)]);
  });
  const find = (a, b) => got.find((g) => g[0] === a && g[1] === b);
  const close = (actual, expected) => Math.abs(actual - expected) < 1e-12;

  const p1 = find(2, -4);
  assert.ok(close(p1[2], 2) && close(p1[3], 3.5), `a=2,b=−4 支撑应为 [2, 3.5]，实测 ${JSON.stringify(p1)}`);
  const p2 = find(-1, 0);
  assert.ok(close(p2[2], -3) && close(p2[3], 0), `a=−1,b=0 支撑应为 [−3, 0]，实测 ${JSON.stringify(p2)}`);
  const p3 = find(1, 0);
  assert.ok(close(p3[2], 0) && close(p3[3], 3), `a=1,b=0 支撑应不变，实测 ${JSON.stringify(p3)}`);
  await page.close();
});

test("模块1：四个特征点的映射代回误差 ≤1e-10，且 a=1,b=0 时两波形逐点相同", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate((features) => {
    const calc = window.__practiceCalc;
    const cases = [[2, -4], [-1, 0], [1, 0], [3, 4], [-2, 3], [0.5, -1]];
    let worst = 0;
    const identity = [];
    for (const [a, b] of cases) {
      for (const [tau, value] of features) {
        const t = calc.transformTime(tau, a, b);
        const back = a * t + b;                       /* x(a·t+b) 的宗量必须回到 τ */
        worst = Math.max(worst, Math.abs(back - tau));
        worst = Math.max(worst, Math.abs(calc.waveformValue(back) - value));
      }
    }
    /* 下面这一条是文档验收「a=1,b=0 两波形坐标值一致」：
       对 t 轴上的取样点，原波形值 x(t) 与变换后 y(t) 必须逐点相等 */
    for (let t = -0.5; t <= 3.5; t += 0.05) {
      const y = calc.waveformValue(1 * t + 0);
      identity.push([Number(t.toFixed(4)), y, calc.waveformValue(t)]);
    }
    return { worst, identity };
  }, FEATURES);
  assert.ok(got.worst <= 1e-10, `特征点代回误差应 ≤1e-10，实测 ${got.worst}`);
  for (const [t, y, source] of got.identity) {
    assert.equal(y, source, `a=1,b=0 时 y(${t}) 应等于 x(${t})`);
  }
  await page.close();
});

test("模块1：指标卡给出支撑区间、3/|a|、t₀ 与反折状态", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const setField = (re, value) => page.evaluate(([source, v]) => {
    const label = [...document.querySelectorAll(".demo-field")].find((l) => new RegExp(source).test(l.textContent));
    if (!label) throw new Error(`未找到参数 ${source}`);
    const input = label.querySelector('input[type="number"]');
    input.value = String(v);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, [re, value]);
  const read = () => page.evaluate(() => {
    const out = {};
    document.querySelectorAll(".demo-metric").forEach((card) => {
      out[card.querySelector(".demo-metric-label").textContent.trim()] = card.querySelector(".demo-metric-value").textContent.trim();
    });
    return out;
  });
  const pick = (obj, re) => { const k = Object.keys(obj).find((x) => re.test(x)); return k ? obj[k] : undefined; };

  await setField("尺度", 2);
  await setField("平移", -4);
  await page.waitForTimeout(150);
  const s1 = await read();
  assert.match(String(pick(s1, /支撑/)), /\[2,\s*3\.5\]/, `支撑区间应为 [2, 3.5]，实测 ${JSON.stringify(s1)}`);
  assert.match(String(pick(s1, /3\s*\/\s*\|?\s*a/)), /1\.5/, `3/|a| 应为 1.5，实测 ${JSON.stringify(s1)}`);
  assert.match(String(pick(s1, /t₀|t0|延迟/)), /2\b/, `t₀ 应为 2 s，实测 ${JSON.stringify(s1)}`);
  assert.match(String(pick(s1, /反折/)), /不反折|未反折/, `a>0 应显示不反折，实测 ${JSON.stringify(s1)}`);

  await setField("尺度", -1);
  await setField("平移", 0);
  await page.waitForTimeout(150);
  const s2 = await read();
  assert.match(String(pick(s2, /支撑/)), /\[−3,\s*0\]|\[-3,\s*0\]/, `支撑区间应为 [−3, 0]，实测 ${JSON.stringify(s2)}`);
  assert.match(String(pick(s2, /反折/)), /反折/, `a<0 应显示已反折，实测 ${JSON.stringify(s2)}`);
  await page.close();
});

test("模块1：a=0 被拒绝并保留上一个有效值（不传播 NaN）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const state = () => page.evaluate(() => window.__practiceState("signals-ch1-waveform-transform"));
  const setField = (re, value) => page.evaluate(([source, v]) => {
    const label = [...document.querySelectorAll(".demo-field")].find((l) => new RegExp(source).test(l.textContent));
    const input = label.querySelector('input[type="number"]');
    input.value = String(v);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, [re, value]);

  const initial = await state();
  assert.equal(initial.a, 1, "a 默认应为 1");
  assert.equal(initial.b, 0, "b 默认应为 0");

  await setField("尺度", 2.5);
  await page.waitForTimeout(120);
  const valid = await state();
  assert.equal(valid.a, 2.5, "合法值应写入");

  await setField("尺度", 0);
  await page.waitForTimeout(120);
  const rejected = await state();
  assert.equal(rejected.a, 2.5, `a=0 应被拒绝并保留 2.5，实测 ${rejected.a}`);
  assert.ok(Number.isFinite(rejected.a) && Number.isFinite(rejected.b), "状态不得出现 NaN/Infinity");

  /* 非有限值同样拒绝 */
  await setField("尺度", "abc");
  await page.waitForTimeout(120);
  assert.equal((await state()).a, 2.5, "非有限输入应被拒绝");
  await page.close();
});

test("模块1：视野同时覆盖原支撑与新支撑", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    return [[2, -4], [-1, 0], [1, 0], [-0.5, 1]].map(([a, b]) => {
      const view = calc.viewRange(a, b);
      const support = calc.transformSupport(a, b);
      return { a, b, view, support };
    });
  });
  for (const { a, b, view, support } of got) {
    assert.ok(view[0] <= 0 && view[1] >= 3,
      `a=${a},b=${b}：视野 ${JSON.stringify(view)} 应含原支撑 [0,3]`);
    assert.ok(view[0] <= support[0] + 1e-12 && view[1] >= support[1] - 1e-12,
      `a=${a},b=${b}：视野 ${JSON.stringify(view)} 应含新支撑 ${JSON.stringify(support)}`);
  }
  await page.close();
});

test("模块1：课程条目含预测问题、≥2 组反例对照与「用自己的话解释」步骤", async () => {
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
