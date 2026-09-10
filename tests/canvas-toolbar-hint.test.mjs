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
        groups.push({ name: child.className || child.tagName.toLowerCase(), top: Math.round(rect.top), width: Math.round(rect.width) });
      }
      const hintRect = hint.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      return {
        groups,
        rows: Array.from(new Set(groups.map((g) => g.top))).sort((a, b) => a - b),
        hint: { top: Math.round(hintRect.top), width: Math.round(hintRect.width), lines: (() => {
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
    /* 提示要么与按钮同行（宽屏放得下），要么单独占下一行 */
    const sameRow = Math.abs(layout.hint.top - layout.rows[0]) <= 2;
    const nextRow = layout.hint.top > layout.rows[0];
    assert.ok(sameRow || nextRow, `提示应同行或在其下一行（提示 top=${layout.hint.top}，按钮 top=${layout.rows[0]}）`);
    await page.close();
  });
}

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
