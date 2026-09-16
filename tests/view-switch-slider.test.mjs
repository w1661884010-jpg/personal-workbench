/* 顶栏三个视图入口（工作台 / 演练 / 错题）的滑动指示器：
   - 静态契约：指示器在组内、排在最前，组内按钮不自绘胶囊，共用动效 token，减少动效下不动画；
   - 浏览器行为：进入某个视图时指示器精确落在那枚按钮上（位置与尺寸一致），
     在三个入口之间切换时滑过去，退回教材正文（三个都不选中）时淡出，
     外观按钮不在组内、永远不会被指示器覆盖。
   - 依赖 3010 静态服务器；Chromium 使用系统 Chrome（playwright 库来自 npx 缓存）。 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

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

test("static contract: the view thumb rides in the group and shares the segmented-control tokens", async () => {
  const [html, styles, app] = await Promise.all([read("index.html"), read("styles.css"), read("app.js")]);

  const groupIndex = html.indexOf('id="viewSwitch"');
  const thumbIndex = html.indexOf('id="viewThumb"');
  const firstButtonIndex = html.indexOf('id="workbenchToggle"');
  const themeIndex = html.indexOf('id="themeToggle"');
  assert.ok(groupIndex >= 0 && thumbIndex > groupIndex, "指示器应在视图入口组内");
  assert.ok(firstButtonIndex > thumbIndex, "指示器应排在按钮之前（DOM 顺序）");
  assert.ok(themeIndex > firstButtonIndex, "外观按钮仍在同一导航里");

  /* 外观按钮必须在组外：指示器只服务三个视图入口 */
  const groupHtml = html.slice(groupIndex, html.indexOf("</div>", groupIndex));
  assert.equal(groupHtml.includes('id="themeToggle"'), false, "外观按钮不应被包进滑动指示器组");

  assert.match(styles, /\.view-switch\s*\{[\s\S]{0,60}position:\s*relative/, "组是定位容器");
  assert.match(styles, /\.view-thumb\s*\{[\s\S]{0,420}transition:\s*transform var\(--seg-duration\) var\(--seg-ease\)/, "指示器共用分段控件动效 token");
  assert.match(styles, /\.view-switch\.has-active \.view-thumb\s*\{\s*opacity:\s*1;\s*\}/, "有选中项时指示器才出现");
  assert.match(styles, /\.view-switch\.is-instant \.view-thumb\s*\{\s*transition:\s*none;\s*\}/, "即时落位通路存在");
  assert.match(styles, /\.view-switch > \.tool-button\.is-active\s*\{[\s\S]{0,80}background:\s*transparent/, "组内按钮不再自绘胶囊");
  /* 减少动效块必须排在基础规则之后（同权重靠源码顺序取胜，写在前面会被基础规则压掉） */
  const thumbRuleAt = styles.indexOf(".view-thumb {");
  const reducedMatch = /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.view-thumb\s*\{\s*transition:\s*none;\s*\}\s*\}/.exec(styles);
  assert.ok(thumbRuleAt >= 0, "缺少 .view-thumb 基础规则");
  assert.ok(reducedMatch, "缺少 .view-thumb 的减少动效规则");
  assert.ok(reducedMatch.index > thumbRuleAt, "减少动效块必须排在 .view-thumb 基础规则之后");

  assert.match(app, /function syncViewThumb\(instant\)/, "指示器由 shell 现场测量");
  assert.match(app, /function syncWorkbenchButton\(\)[\s\S]{0,600}syncViewThumb\(\)/, "视图变化后同步指示器");
  assert.match(app, /window\.addEventListener\(["']resize["'], resyncSegmentThumbs\)/, "断点变化走同一条重新落位通路");
  assert.doesNotMatch(app, /viewThumb[\s\S]{0,300}transitionend/, "落位不得依赖动画事件");
});

const thumbState = () => {
  const group = document.getElementById("viewSwitch");
  const thumb = document.getElementById("viewThumb");
  const buttons = ["workbenchToggle", "practiceToggle", "mistakeToggle"].map((id) => document.getElementById(id));
  const theme = document.getElementById("themeToggle");
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
  const active = buttons.find((b) => b.classList.contains("is-active"));
  return {
    hasActive: group.classList.contains("has-active"),
    thumbOpacity: getComputedStyle(thumb).opacity,
    thumb: box(thumb),
    activeId: active ? active.id : null,
    active: active ? box(active) : null,
    theme: box(theme),
    groupWidth: Math.round(group.getBoundingClientRect().width),
  };
};

test("进入/切换/退出视图时指示器精确落位、滑过去、再淡出", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE);
  await page.waitForSelector("#viewThumb");
  await page.waitForTimeout(300);

  const initial = await page.evaluate(thumbState);
  assert.equal(initial.hasActive, false, "首屏在教材正文：不应有选中的视图入口");
  assert.equal(initial.thumbOpacity, "0", "无选中项时指示器不可见");

  /* 等指示器的过渡真正跑完再测量。
     指标缓动 --seg-ease 是 cubic-bezier(.34,1.32,.64,1)，带约 3px 的过冲；
     固定 sleep 会在过渡起步被主线程阻塞时恰好采到过冲峰值（实测 1178 → 1181）。
     这里先让过渡起步，再等它 finished，最后让出一帧，测量点与负载无关。 */
  const settleThumb = async () => {
    await page.waitForTimeout(120);
    await page.evaluate(async () => {
      const thumb = document.getElementById("viewThumb");
      const running = thumb.getAnimations();
      if (running.length) await Promise.all(running.map((a) => a.finished.catch(() => {})));
    });
    await page.waitForTimeout(60);
  };

  const enter = async (id) => {
    await page.click(`#${id}`);
    await settleThumb();
    return page.evaluate(thumbState);
  };

  for (const id of ["workbenchToggle", "practiceToggle", "mistakeToggle"]) {
    const state = await enter(id);
    assert.equal(state.activeId, id, `${id} 应成为选中项`);
    assert.equal(state.hasActive, true, "有选中项时指示器应出现");
    assert.ok(Math.abs(state.thumb.x - state.active.x) <= 1, `${id}: 指示器 x 应与按钮一致（${state.thumb.x} vs ${state.active.x}）`);
    assert.ok(Math.abs(state.thumb.y - state.active.y) <= 1, `${id}: 指示器 y 应与按钮一致`);
    assert.ok(Math.abs(state.thumb.w - state.active.w) <= 1, `${id}: 指示器宽度应等于按钮宽度（${state.thumb.w} vs ${state.active.w}）`);
    assert.equal(state.thumb.h, state.active.h, `${id}: 指示器高度应等于按钮高度`);
    /* 外观按钮不在组内：指示器绝不会盖到它身上（指示器右缘应止于外观按钮左缘之前） */
    assert.ok(state.thumb.x + state.thumb.w <= state.theme.x + 1, `指示器应完全在组内、不触及外观按钮（指示器右缘 ${state.thumb.x + state.thumb.w} vs 外观按钮左缘 ${state.theme.x}）`);
  }

  /* 再点一次当前入口 = 退回教材正文：指示器淡出 */
  const exited = await enter("mistakeToggle");
  assert.equal(exited.hasActive, false, "退回教材正文后指示器应隐藏");
  assert.equal(exited.thumbOpacity, "0", "隐藏后透明度应为 0");
  assert.equal(exited.activeId, null, "三个入口都不应处于选中态");
  await page.close();
});

test("窄屏与减少动效下仍然成立", async () => {
  const narrow = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await narrow.goto(BASE);
  await narrow.waitForTimeout(300);
  await narrow.click("#mistakeToggle");
  /* 同上：等过渡跑完再量，避开过冲区 */
  await narrow.waitForTimeout(120);
  await narrow.evaluate(async () => {
    const thumb = document.getElementById("viewThumb");
    const running = thumb.getAnimations();
    if (running.length) await Promise.all(running.map((a) => a.finished.catch(() => {})));
  });
  await narrow.waitForTimeout(60);
  const state = await narrow.evaluate(thumbState);
  assert.equal(state.activeId, "mistakeToggle");
  assert.ok(Math.abs(state.thumb.x - state.active.x) <= 1 && Math.abs(state.thumb.w - state.active.w) <= 1, `窄屏指示器应与按钮重合：${JSON.stringify(state.thumb)} vs ${JSON.stringify(state.active)}`);
  await narrow.close();

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await reduced.goto(BASE);
  await reduced.waitForTimeout(300);
  await reduced.click("#practiceToggle");
  await reduced.waitForTimeout(120);
  assert.equal(await reduced.evaluate(() => getComputedStyle(document.getElementById("viewThumb")).transitionProperty), "none", "减少动效下指示器不应有过渡");
  const quick = await reduced.evaluate(thumbState);
  assert.ok(Math.abs(quick.thumb.x - quick.active.x) <= 1, "减少动效下应直接落位");
  await reduced.close();
});
