/* 批次 B · 模块 6「循环卷积」验收测试（先写用例，再实现）。
   期望值来自文档 §三.6 的三组手算结果，并由独立复算脚本逐项确认
   （见 docs/round-2026-09-16-practice/report-batchB.md）。 */
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
const EXPERIMENT_ID = "signals-ch2-circular-convolution";

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

/* 独立复算：从 0 开始的单位矩形序列的直接线性卷积与按 n mod N 累加。 */
function directLinear(N1, N2) {
  const y = new Array(N1 + N2 - 1).fill(0);
  for (let i = 0; i < N1; i += 1) for (let j = 0; j < N2; j += 1) y[i + j] += 1;
  return y;
}
function directCircular(N1, N2, N) {
  const y = directLinear(N1, N2);
  const c = new Array(N).fill(0);
  for (let n = 0; n < y.length; n += 1) c[n % N] += y[n];
  return c;
}
/* 反例（产品不得采用）：先把输入截断到长度 N 再算循环卷积。 */
function truncatedCircular(N1, N2, N) {
  const a = new Array(Math.min(N1, N)).fill(1);
  const b = new Array(Math.min(N2, N)).fill(1);
  const c = new Array(N).fill(0);
  for (let i = 0; i < a.length; i += 1) for (let j = 0; j < b.length; j += 1) c[(i + j) % N] += a[i] * b[j];
  return c;
}

test("模块6：线性/循环卷积与文档三组手算结果逐项一致", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    return {
      lin44: calc.linearConv(4, 4),
      circ44n4: calc.circularConv(4, 4, 4),
      err44n4: calc.circError(4, 4, 4),
      circ44n7: calc.circularConv(4, 4, 7),
      circ44n10: calc.circularConv(4, 4, 10),
      circ88n2: calc.circularConv(8, 8, 2),
      folded88n2: calc.foldedSamples(8, 8, 2),
      affected88n2: calc.affectedBins(8, 8, 2),
    };
  });
  assert.deepEqual(got.lin44, directLinear(4, 4), "(4,4) 线性卷积");
  assert.deepEqual(got.lin44, [1, 2, 3, 4, 3, 2, 1], "(4,4) 线性卷积应为 [1,2,3,4,3,2,1]");
  assert.deepEqual(got.circ44n4, [4, 4, 4, 4], "(4,4,N4) 循环卷积应为 [4,4,4,4]");
  assert.equal(got.err44n4, 6, "(4,4,N4) 首 N 点误差 E 应为 6");
  assert.deepEqual(got.circ44n7, got.lin44, "N=7=L 时循环卷积应与线性卷积完全一致");
  assert.deepEqual(got.circ44n10, [1, 2, 3, 4, 3, 2, 1, 0, 0, 0], "N=10>L 时尾部应补 3 个零");
  assert.deepEqual(got.circ88n2, [32, 32], "(8,8,N2) 循环卷积应为 [32,32]");
  assert.equal(got.folded88n2, 13, "(8,8,N2) 折回样本应为 13");
  assert.equal(got.affected88n2, 2, "(8,8,N2) 受影响桶应为 2");
  await page.close();
});

test("模块6：折回指标只适用于当前正值矩形——由 L 与 N 推出，而非写死", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate((cases) => cases.map(([n1, n2, n]) => [
    n1, n2, n,
    window.__practiceCalc.foldedSamples(n1, n2, n),
    window.__practiceCalc.affectedBins(n1, n2, n),
  ]), [[4, 4, 4], [4, 4, 7], [4, 4, 10], [8, 8, 2], [3, 7, 5], [8, 3, 16]]);
  for (const [n1, n2, n, folded, affected] of got) {
    const L = n1 + n2 - 1;
    assert.equal(folded, Math.max(0, L - n), `(${n1},${n2},N${n}) 折回样本`);
    assert.equal(affected, Math.min(n, Math.max(0, L - n)), `(${n1},${n2},N${n}) 受影响桶`);
  }
  await page.close();
});

test("模块6：首 N 点误差 E 的定义——超出线性长度的循环值按 0 参与", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate(() => {
    const calc = window.__practiceCalc;
    const manual = (n1, n2, n) => {
      const lin = calc.linearConv(n1, n2);
      const circ = calc.circularConv(n1, n2, n);
      let e = 0;
      for (let i = 0; i < n; i += 1) e += Math.abs(circ[i] - (i < lin.length ? lin[i] : 0));
      return e;
    };
    return [[4, 4, 4], [4, 4, 10], [8, 8, 2], [3, 7, 5], [8, 8, 16]]
      .map(([n1, n2, n]) => [n1, n2, n, calc.circError(n1, n2, n), manual(n1, n2, n)]);
  });
  for (const [n1, n2, n, actual, expected] of got) {
    assert.ok(Math.abs(actual - expected) < 1e-9, `(${n1},${n2},N${n}) E：期望 ${expected}，实测 ${actual}`);
  }
  const n10 = got.find(([n1, n2, n]) => n1 === 4 && n2 === 4 && n === 10);
  assert.equal(n10[3], 0, "N=10>L 时循环结果前 L 项与线性一致、其余为 0，E 应为 0");
  await page.close();
});

test("模块6：DFT 核对必须先按模 N 折叠——折叠路线与直接路线一致，截断路线则不一致", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const got = await page.evaluate((cases) => cases.map(([n1, n2, n]) => ({
    n1, n2, n,
    direct: window.__practiceCalc.circularConv(n1, n2, n),
    byDft: window.__practiceCalc.circularByDft(n1, n2, n),
  })), [[4, 4, 4], [8, 8, 2], [3, 7, 5], [8, 3, 16], [2, 2, 3]]);
  for (const { n1, n2, n, direct, byDft } of got) {
    assert.equal(byDft.length, n, `(${n1},${n2},N${n}) DFT 路线应返回 N 点`);
    for (let i = 0; i < n; i += 1) {
      assert.ok(Math.abs(byDft[i] - direct[i]) < 1e-9,
        `(${n1},${n2},N${n}) DFT 路线第 ${i} 点：期望 ${direct[i]}，实测 ${byDft[i]}`);
    }
    assert.deepEqual(direct, directCircular(n1, n2, n), `(${n1},${n2},N${n}) 与独立复算一致`);
  }
  /* 反例有效性：若改用"截断到长度 N"而非"按模 N 折叠"，(8,8,N2) 会得到 [2,2] 而非 [32,32]。
     该断言保证"必须折叠"这条要求不是空话。 */
  assert.deepEqual(truncatedCircular(8, 8, 2), [2, 2], "截断路线本身应给出 [2,2]");
  const folded = got.find((c) => c.n1 === 8 && c.n2 === 8 && c.n === 2);
  assert.notDeepEqual(folded.direct, truncatedCircular(8, 8, 2),
    "产品结果不得等于截断路线的结果");
  await page.close();
});

test("模块6：单步按钮推进观察 m 并在边界停住；改 N 后 m 被夹紧", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const state = () => page.evaluate(() => window.__practiceState("signals-ch2-circular-convolution"));
  const stepOnce = () => page.evaluate(() => {
    const btn = [...document.querySelectorAll(".demo-button-row button, .demo-controls button")]
      .find((b) => /单步/.test(b.textContent));
    if (!btn) throw new Error("未找到单步按钮");
    btn.click();
  });

  const initial = await state();
  assert.equal(initial.n1, 4, "N₁ 默认 4");
  assert.equal(initial.n2, 4, "N₂ 默认 4");
  assert.equal(initial.n, 4, "N 默认 4");
  assert.equal(initial.m, 0, "观察 m 默认 0");

  await stepOnce();
  assert.equal((await state()).m, 1, "单步后 m 应为 1");
  await stepOnce();
  await stepOnce();
  assert.equal((await state()).m, 3, "再走两步 m 应为 3");
  await stepOnce();
  assert.equal((await state()).m, 3, "m 到 N−1 后应停住，不回绕");

  /* 把 N 改小，m 必须被夹紧到 [0, N−1] */
  await page.evaluate(() => {
    const label = [...document.querySelectorAll(".demo-field")].find((l) => /循环长度/.test(l.textContent));
    const input = label.querySelector('input[type="number"]');
    input.value = "2";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(150);
  const clamped = await state();
  assert.equal(clamped.n, 2, "N 应改为 2");
  assert.ok(clamped.m <= 1, `改 N 后 m 应夹紧到 ≤ N−1=1，实测 ${clamped.m}`);
  await page.close();
});

test("模块6：课程条目含预测问题、≥2 组反例对照与「用自己的话解释」步骤", async () => {
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
