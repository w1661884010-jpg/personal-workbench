/* 画布工具栏提示文字（"N 条连线 · 点击两个端口连线；双击连线删除"）的收窄排版：
   它是工具栏里唯一可变宽的项目，而中文的 min-content 只有一个字宽 —— 一旦让它随意收缩，
   就会退化成"一字一列"的竖排（940px 下曾实测 27×188，把工具栏撑到 251px 高）。
   这里跨宽度守住三条：提示永远只有一行、保持单行高度、工具栏不因它暴涨；
   940px 以上还要求整句可见（不省略）。
   - 依赖 3010 静态服务器；Chromium 使用系统 Chrome（playwright 库来自 npx 缓存）。 */
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

/* 提示文字的排版指标：文本节点被拆成几行（rects）、自身盒、是否被省略、工具栏高度 */
function probeHint(page) {
  return page.evaluate(() => {
    const bar = document.querySelector(".cw-canvas-toolbar");
    const hint = Array.from(bar.querySelectorAll("span")).find((s) => s.textContent.includes("条连线"));
    const range = document.createRange();
    range.selectNodeContents(hint);
    const box = hint.getBoundingClientRect();
    const barBox = bar.getBoundingClientRect();
    return {
      lines: range.getClientRects().length,
      width: Math.round(box.width),
      height: Math.round(box.height),
      toolbarHeight: Math.round(barBox.height),
      clipped: hint.scrollWidth > hint.clientWidth + 1,
      whiteSpace: getComputedStyle(hint).whiteSpace,
      text: hint.textContent.trim(),
    };
  });
}

/* 工具栏分行契约：空间不足时必须是"提示文字"让位到下一行，而不是把按钮挤下去。
   四组按钮（模式 / 变换 / 缩放 / 删除）需要约 535px；提示整句约 264px。 */
const ROW_WIDTHS = [1440, 1280, 1240, 1150, 1050, 1000, 960, 940];

for (const width of ROW_WIDTHS) {
  test(`${width}px：所有按钮保持同一行，空间不足时由提示文字换行`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(BASE);
    await page.waitForSelector("#workbenchToggle");
    await page.click("#workbenchToggle");
    await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
    await page.waitForTimeout(600);

    const layout = await page.evaluate(() => {
      const bar = document.querySelector(".cw-canvas-toolbar");
      const hint = Array.from(bar.querySelectorAll("span")).find((s) => s.textContent.includes("条连线"));
      const groups = [];
      for (const child of bar.children) {
        if (child === hint) continue;
        const rect = child.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;   /* 被隐藏的组不参与 */
        groups.push({ name: child.className || child.tagName.toLowerCase(), top: Math.round(rect.top), bottom: Math.round(rect.bottom), width: Math.round(rect.width) });
      }
      const hintRect = hint.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      return {
        groups,
        rows: Array.from(new Set(groups.map((g) => g.top))).sort((a, b) => a - b),
        buttonCenter: groups.length ? Math.round(groups[0].top + (groups[0].bottom - groups[0].top) / 2) : null,
        hint: { top: Math.round(hintRect.top), center: Math.round(hintRect.top + hintRect.height / 2), width: Math.round(hintRect.width), lines: (() => {
          const range = document.createRange();
          range.selectNodeContents(hint);
          return range.getClientRects().length;
        })() },
        barWidth: Math.round(barRect.width),
      };
    });

    assert.equal(layout.rows.length, 1, `按钮必须全部在同一行（实际行 ${JSON.stringify(layout.rows)}：${JSON.stringify(layout.groups)}）`);
    assert.equal(layout.hint.lines, 1, "提示文字仍应是单行（换行由整块挪到下一行实现，不是把文字折断）");
    assert.ok(layout.hint.width >= 150, `提示宽度不应被压成细条（${layout.hint.width}）`);
    /* 提示要么与按钮同行、要么整块落在下一行（按"行中心"判定：两者盒高不同，比 top 会误判） */
    const sameRow = Math.abs(layout.hint.center - layout.buttonCenter) <= 3;
    const nextRow = layout.hint.top >= Math.max(...layout.groups.map((g) => g.bottom)) - 1;
    assert.ok(sameRow || nextRow, `提示应同行或整块换到下一行（提示 center=${layout.hint.center}，按钮 center=${layout.buttonCenter}）`);
    await page.close();
  });
}

/* 稳定性契约：按钮的尺寸与位置在任何宽度、任何提示文案下都不许变；
   提示文字只在"行尾"与"第二行整行"之间切换，且切换只取决于可用宽度。 */
test("提示换行不推动按钮：按钮几何在跨宽度与换文案时都不变", async () => {
  const readGeometry = () => {
    const bar = document.querySelector(".cw-canvas-toolbar");
    const hint = Array.from(bar.querySelectorAll("span")).find((s) => s.textContent.includes("连线") || s.textContent.includes("探针"));
    const groups = [];
    for (const child of bar.children) {
      if (child === hint) continue;
      const rect = child.getBoundingClientRect();
      if (rect.width === 0) continue;
      groups.push({
        name: (child.className || child.tagName.toLowerCase()).split(" ")[0],
        x: Math.round(rect.x),
        w: Math.round(rect.width),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
      });
    }
      const hintRect = hint.getBoundingClientRect();
      return {
        groups,
        hint: { top: Math.round(hintRect.top), bottom: Math.round(hintRect.bottom), center: Math.round(hintRect.top + hintRect.height / 2), width: Math.round(hintRect.width), text: hint.textContent.trim() },
        buttonTop: groups.length ? groups[0].top : null,
        buttonBottom: groups.length ? Math.max(...groups.map((g) => g.bottom)) : null,
        buttonCenter: groups.length ? Math.round(groups[0].top + (groups[0].bottom - groups[0].top) / 2) : null,
      };
    };

  /* 1) 同一宽度下切换模式（提示文案从"N 条连线…"变成"已选 N 个探针"）：按钮不许动 */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE);
  await page.waitForSelector("#workbenchToggle");
  await page.click("#workbenchToggle");
  await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
  await page.waitForTimeout(600);
  const wire = await page.evaluate(readGeometry);
  await page.click('.cw-canvas-toolbar > div:first-child > button:nth-child(2)');
  await page.waitForTimeout(400);
  const probe = await page.evaluate(readGeometry);
  assert.notEqual(wire.hint.text, probe.hint.text, "两种模式的提示文案应不同（用于验证文案变化不影响按钮）");
  assert.deepEqual(probe.groups, wire.groups, `切换模式改变了按钮几何：${JSON.stringify({ wire: wire.groups, probe: probe.groups })}`);
  await page.close();

  /* 2) 跨宽度（含提示换行的临界区间）：按钮的尺寸与行内位置必须一致 */
  const samples = [];
  for (const width of [1440, 1300, 1220, 1150, 1080, 1000, 940, 901]) {
    const p = await browser.newPage({ viewport: { width, height: 900 } });
    await p.goto(BASE);
    await p.waitForSelector("#workbenchToggle");
    await p.click("#workbenchToggle");
    await p.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
    await p.waitForTimeout(600);
    samples.push({ width, geometry: await p.evaluate(readGeometry) });
    await p.close();
  }
  const first = samples[0].geometry;
  for (const { width, geometry } of samples) {
    assert.deepEqual(
      geometry.groups.map((g) => ({ name: g.name, x: g.x, w: g.w })),
      first.groups.map((g) => ({ name: g.name, x: g.x, w: g.w })),
      `${width}px 下按钮几何与 1440px 不一致（被压缩或移位）：${JSON.stringify({ at1440: first.groups, [`at${width}`]: geometry.groups })}`,
    );
    assert.equal(geometry.buttonTop, first.buttonTop, `${width}px 下按钮所在行变了`);
  }
  /* 提示确实在该换行时换了行（否则上面的一致性是"因为都没换行"白拿的）。
     注意：按钮盒高 32、提示文字行高 19，两者在行内垂直居中，所以必须按"行中心"判定，
     直接比 top 会把同行的提示误判成换行。 */
  const hintRows = samples.map(({ geometry }) => (Math.abs(geometry.hint.center - geometry.buttonCenter) <= 3 ? "inline" : "next"));
  assert.ok(hintRows.includes("inline") && hintRows.includes("next"), `提示应同时出现"同行"与"换行"两种状态（实际 ${hintRows.join(",")}）`);
});

/* 收窄到"逐字竖排"曾出现的那些宽度：提示必须仍是单行、不撑高工具栏 */
const WIDTHS = [1440, 1280, 1100, 1000, 940, 820, 393];

for (const width of WIDTHS) {
  test(`${width}px：工具栏提示保持单行、不竖排、不撑高工具栏`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(BASE);
    await page.waitForSelector("#workbenchToggle");
    await page.click("#workbenchToggle");
    await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
    await page.waitForTimeout(600);

    const hint = await probeHint(page);
    assert.equal(hint.lines, 1, `提示文字必须只有一行（实际被拆成 ${hint.lines} 行）: ${JSON.stringify(hint)}`);
    assert.ok(hint.height <= 26, `提示保持单行高度（实际 ${hint.height}px）`);
    assert.ok(hint.width >= 150, `提示宽度不应被压成细条（实际 ${hint.width}px）`);
    assert.equal(hint.whiteSpace, "nowrap", "提示不得允许换行");
    assert.ok(hint.toolbarHeight <= 120, `工具栏不得被提示撑高（实际 ${hint.toolbarHeight}px）`);
    if (width >= 940) {
      assert.equal(hint.clipped, false, `桌面宽度下整句应完整可见（宽 ${hint.width}px / 文案「${hint.text}」）`);
    }
    await page.close();
  });
}
