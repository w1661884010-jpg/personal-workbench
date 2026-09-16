/* 批次 A · 模块 4「采样、混叠与重建」验收测试（先失败后实现）。
   约定：测试调用产品实际暴露的纯计算实现（window.__practiceCalc），
   期望值来自独立直接求和与解析折叠公式，不复制产品算法。 */
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
const EXPERIMENT_ID = "signals-ch2-aliasing";

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

/** 沿用 tests/practice.behaviour.test.mjs 的既有打开方式（按 ID 路由）。 */
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

test("模块4：观测频率 = min(r, fs−r)，r = f_in mod fs", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const rows = await page.evaluate(() => {
    const { aliasObserved } = window.__practiceCalc;
    return [[7, 20], [7, 10], [7, 14], [15, 30], [1, 2], [13, 8], [3, 2]]
      .map(([fin, fs]) => [fin, fs, aliasObserved(fin, fs)]);
  });
  for (const [fin, fs, value] of rows) {
    const r = fin % fs;
    const expected = Math.min(r, fs - r);
    assert.ok(Math.abs(value - expected) < 1e-12,
      `f_in=${fin}, fs=${fs}: 观测频率应为 ${expected}，实测 ${value}`);
  }
  /* 文档给定：7/10 → 3 Hz */
  const at710 = rows.find(([fin, fs]) => fin === 7 && fs === 10)[2];
  assert.ok(Math.abs(at710 - 3) < 1e-12, `7/10 应观测到 3 Hz，实测 ${at710}`);
  await page.close();
});

test("模块4：7 Hz 与折叠后的 3 Hz 在 fs=10 下样点完全相同", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const maxDiff = await page.evaluate(() => {
    const fs = 10;
    let worst = 0;
    for (let n = -32; n <= 32; n += 1) {
      const t = n / fs;
      const a = Math.cos(2 * Math.PI * 7 * t);
      const b = Math.cos(2 * Math.PI * 3 * t);
      worst = Math.max(worst, Math.abs(a - b));
    }
    return worst;
  });
  assert.ok(maxDiff <= 1e-10, `7 Hz 与 3 Hz 的样点差应 ≤ 1e-10，实测 ${maxDiff}`);
  await page.close();
});

test("模块4：无混叠时 sinc 重建 RMSE < 0.01、ZOH > 0.5（7 Hz / 20 Hz）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const r = await page.evaluate(() => {
    const { rmse } = window.__practiceCalc;
    return { sinc: rmse("sinc", 7, 20), zoh: rmse("zoh", 7, 20), linear: rmse("linear", 7, 20) };
  });
  assert.ok(r.sinc < 0.01, `sinc 重建 RMSE 应 < 0.01，实测 ${r.sinc}`);
  assert.ok(r.zoh > 0.5, `ZOH 重建 RMSE 应 > 0.5，实测 ${r.zoh}`);
  assert.ok(r.linear > r.sinc, `线性插值误差应大于 sinc，实测 ${r.linear} vs ${r.sinc}`);
  await page.close();
});

test("模块4：RMSE 按文档规定在 t_i = −0.5 + i/1000（i=0…1000）等权计算", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const comparison = await page.evaluate(() => {
    const { rmse, reconstruct } = window.__practiceCalc;
    const fin = 7;
    const fs = 20;
    let sum = 0;
    for (let i = 0; i <= 1000; i += 1) {
      const t = -0.5 + i / 1000;
      const d = reconstruct("sinc", fin, fs, t) - Math.cos(2 * Math.PI * fin * t);
      sum += d * d;
    }
    return { api: rmse("sinc", fin, fs), manual: Math.sqrt(sum / 1001) };
  });
  assert.ok(Math.abs(comparison.api - comparison.manual) < 1e-9,
    `rmse() 应与文档规定的 1001 点等权复算一致：接口 ${comparison.api} vs 复算 ${comparison.manual}`);
  await page.close();
});

test("模块4：混叠状态文案区分三个区间（含等号临界）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const status = await page.evaluate(() => {
    const { aliasStatus } = window.__practiceCalc;
    return { safe: aliasStatus(7, 20), critical: aliasStatus(7, 14), aliased: aliasStatus(7, 10) };
  });
  assert.match(status.safe, /满足|安全|无混叠/, `7/20 应显示满足严格条件，实测「${status.safe}」`);
  assert.match(status.critical, /临界/, `7/14 应显示临界，实测「${status.critical}」`);
  assert.match(status.critical, /相位/, `临界文案应提示依赖相位，实测「${status.critical}」`);
  assert.match(status.aliased, /混叠/, `7/10 应显示混叠，实测「${status.aliased}」`);
  await page.close();
});

test("模块4：切换重建模式后数值卡 RMSE 随之改变（控件真实生效）", async () => {
  const page = await browser.newPage();
  await openDemo(page);
  const readRmse = () => page.evaluate(() => {
    const metric = Array.from(document.querySelectorAll(".demo-metric")).find((node) =>
      /RMSE/i.test(node.querySelector(".demo-metric-label")?.textContent || ""));
    return metric ? metric.querySelector(".demo-metric-value").textContent.trim() : null;
  });
  const before = await readRmse();
  assert.ok(before, "应有 RMSE 数值卡");
  const changed = await page.evaluate(() => {
    const select = document.querySelector('.notebook-demo select');
    if (!select) return false;
    const options = Array.from(select.options).map((o) => o.value);
    const target = options.find((v) => /zoh/i.test(v)) || options[options.length - 1];
    select.value = target;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  });
  assert.equal(changed, true, "应有重建模式下拉控件");
  await page.waitForTimeout(150);
  const after = await readRmse();
  assert.notEqual(after, before, `切换重建模式后 RMSE 应变化（前 ${before}，后 ${after}）`);
  await page.close();
});
