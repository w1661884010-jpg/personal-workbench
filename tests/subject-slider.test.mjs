/* 分段控件滑块测试（顶栏科目 + 工作台数字/模拟，两者同一套做法）：
   - 静态契约：滑块节点位置与分层、选中态不再自绘胶囊、共用动效 token、即时落位与减少动效；
   - 浏览器行为：点哪个就落在哪一格上（位置与尺寸都与分段盒一致）、快速连点后落在最后一次选择、
     窄屏/竖向与横向两种排布下都对位、滚动与缩放后仍然对位。
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

/* 滑块与选中按钮的盒模型：位置、宽度、圆角端点都必须对得上 */
function thumbState(page) {
  return page.evaluate(() => {
    const thumb = document.getElementById("subjectThumb");
    const tabs = Array.from(document.querySelectorAll(".subject-tab"));
    const active = tabs.find((tab) => tab.classList.contains("is-active"));
    const t = thumb.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    const thumbStyle = getComputedStyle(thumb);
    return {
      thumb: { x: Math.round(t.x), y: Math.round(t.y), w: Math.round(t.width), h: Math.round(t.height) },
      active: { x: Math.round(a.x), y: Math.round(a.y), w: Math.round(a.width), h: Math.round(a.height) },
      activeSubject: active.dataset.subject,
      radius: thumbStyle.borderTopLeftRadius,
      transition: thumbStyle.transitionProperty,
      duration: thumbStyle.transitionDuration,
      labelZ: getComputedStyle(active.querySelector("span")).zIndex,
      thumbZ: thumbStyle.zIndex,
      labelAbove: Number(getComputedStyle(active.querySelector("span")).zIndex) > Number(thumbStyle.zIndex || 0),
    };
  });
}

test("static contract: slider rides in the tab row, active pill comes from the thumb, motion tokens are shared", async () => {
  const [html, styles, app] = await Promise.all([read("index.html"), read("styles.css"), read("app.js")]);

  const tabsIndex = html.indexOf('id="subjectTabs"');
  const thumbIndex = html.indexOf('id="subjectThumb"');
  const firstTabIndex = html.indexOf('data-subject="signals"');
  assert.ok(tabsIndex >= 0 && thumbIndex > tabsIndex, "the thumb lives inside the subject tab row");
  assert.ok(firstTabIndex > thumbIndex, "the thumb is painted before the tabs in DOM order");

  assert.match(styles, /\.subject-tabs\s*\{[\s\S]{0,80}position:\s*relative/, "the tab row anchors the thumb");
  assert.match(styles, /\.subject-thumb\s*\{[\s\S]{0,320}transition:\s*transform var\(--seg-duration\) var\(--seg-ease\),\s*width var\(--seg-duration\) var\(--seg-ease\)/, "position and width share one token pair");
  assert.match(styles, /\.subject-tabs\.is-instant \.subject-thumb\s*\{\s*transition:\s*none;\s*\}/, "instant placement path exists");
  assert.match(styles, /\.subject-tab > span\s*\{\s*position:\s*relative;\s*z-index:\s*2;\s*\}/, "labels are lifted above the thumb");
  assert.match(styles, /\.subject-tabs \.subject-tab\.is-active\s*\{[\s\S]{0,120}background:\s*transparent;[\s\S]{0,80}border-color:\s*transparent/, "the active tab stops painting its own capsule");
  assert.doesNotMatch(styles, /\.subject-tab\.is-active\s*\{[\s\S]{0,80}background:\s*var\(--bg\)/, "no second indicator is left behind");
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.subject-thumb\s*\{\s*transition:\s*none;\s*\}/, "reduced motion disables the slide");

  assert.match(app, /function syncSubjectThumb\(instant\)/, "the shell measures the thumb itself");
  assert.match(app, /subjectTabs\.forEach[\s\S]{0,220}syncSubjectThumb\(\)/, "a tab click slides the thumb immediately");
  assert.match(app, /window\.addEventListener\(["']resize["'], resyncSegmentThumbs\)/, "breakpoint changes re-place the thumbs");
  assert.doesNotMatch(app, /subjectThumb[\s\S]{0,400}transitionend/, "placement must not depend on animation events");
});

test("clicking a subject slides the thumb onto that pill and keeps it aligned", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE);
  await page.waitForSelector("#subjectThumb");
  await page.waitForTimeout(250);

  const start = await thumbState(page);
  assert.equal(start.activeSubject, "signals", "信号与系统 is selected on load");
  assert.ok(Math.abs(start.thumb.x - start.active.x) <= 1 && Math.abs(start.thumb.w - start.active.w) <= 1, `thumb is placed on the active pill: ${JSON.stringify(start)}`);
  assert.equal(start.thumb.h, start.active.h, "thumb matches the pill height");
  assert.equal(start.radius, "999px", "thumb keeps the capsule radius");
  assert.ok(start.labelAbove, "labels stay above the thumb so all three subjects remain readable");

  for (const [subject, label] of [["digital", "数字电子技术"], ["analog", "模拟电子技术"], ["signals", "信号与系统"]]) {
    await page.click(`.subject-tab[data-subject="${subject}"]`);
    await page.waitForTimeout(400); /* 150ms 内容淡出 + 240ms 滑块 */
    const state = await thumbState(page);
    assert.equal(state.activeSubject, subject, `clicking ${label} selects it`);
    assert.ok(Math.abs(state.thumb.x - state.active.x) <= 1, `${label}: thumb x=${state.thumb.x} vs pill x=${state.active.x}`);
    assert.ok(Math.abs(state.thumb.w - state.active.w) <= 1, `${label}: thumb width follows the pill width (${state.thumb.w} vs ${state.active.w})`);
    assert.match(await page.textContent("#lessonTitle"), /./, `${label}: lesson title renders after the switch`);
  }

  await page.close();
});

test("rapid clicks settle on the last choice instead of landing between pills", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE);
  await page.waitForSelector("#subjectThumb");
  await page.waitForTimeout(200);

  for (let i = 0; i < 3; i += 1) {
    await page.click('.subject-tab[data-subject="analog"]');
    await page.click('.subject-tab[data-subject="digital"]');
    await page.click('.subject-tab[data-subject="signals"]');
    await page.waitForTimeout(30); /* 故意在半途打断过渡 */
  }
  await page.click('.subject-tab[data-subject="analog"]');
  await page.waitForTimeout(600);

  const state = await thumbState(page);
  assert.equal(state.activeSubject, "analog", "the last clicked subject wins");
  assert.ok(Math.abs(state.thumb.x - state.active.x) <= 1, "the interrupted slide still ends exactly on the target pill");
  assert.equal(await page.evaluate(() => document.querySelectorAll(".subject-tab.is-active").length), 1, "exactly one subject stays selected");
  await page.close();
});

test("narrow layout keeps the thumb on the pill and scrolling the row drags it along", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE);
  await page.waitForSelector("#subjectThumb");
  await page.waitForTimeout(250);

  await page.click('.subject-tab[data-subject="analog"]');
  await page.waitForTimeout(400);
  const state = await thumbState(page);
  assert.equal(state.activeSubject, "analog");
  assert.ok(Math.abs(state.thumb.x - state.active.x) <= 1 && Math.abs(state.thumb.w - state.active.w) <= 1, `narrow row keeps the thumb aligned: ${JSON.stringify(state)}`);

  const shifted = await page.evaluate(() => {
    const row = document.getElementById("subjectTabs");
    row.scrollLeft = row.scrollWidth;
    const thumb = document.getElementById("subjectThumb").getBoundingClientRect();
    const active = document.querySelector(".subject-tab.is-active").getBoundingClientRect();
    return Math.abs(thumb.x - active.x);
  });
  assert.ok(shifted <= 1, "the thumb scrolls with the row it belongs to");
  await page.close();
});

/* 工作台切换器的滑块：与科目滑块同一套测量落位——位置和尺寸都要等于选中分段的盒，
   竖向（桌面 >820px）与横向（≤820px）两种排布各测一遍。 */
function kindThumbState(page) {
  return page.evaluate(() => {
    const thumb = document.querySelector(".kind-thumb").getBoundingClientRect();
    const active = document.querySelector(".kind-switch-button.is-active").getBoundingClientRect();
    const switcher = document.getElementById("kindSwitcher").getBoundingClientRect();
    const box = (r) => ({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
    const t = box(thumb);
    const s = box(switcher);
    return {
      thumb: t,
      active: box(active),
      switcher: s,
      kind: document.querySelector(".kind-switch-button.is-active").dataset.kind,
      insideSwitcher: t.x >= s.x - 1 && t.y >= s.y - 1 && t.x + t.w <= s.x + s.w + 1 && t.y + t.h <= s.y + s.h + 1,
    };
  });
}

for (const [width, layout] of [[1440, "竖向"], [760, "横向"]]) {
  test(`${width}px ${layout}排布：工作台滑块贴住选中分段（位置与尺寸）`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(BASE);
    await page.waitForSelector("#workbenchToggle");
    await page.click("#workbenchToggle");
    await page.waitForFunction(() => !document.getElementById("workbenchStage").hidden);
    await page.waitForTimeout(400);

    const digital = await kindThumbState(page);
    assert.equal(digital.kind, "digital", "工作台默认数字");
    assert.ok(Math.abs(digital.thumb.x - digital.active.x) <= 1 && Math.abs(digital.thumb.y - digital.active.y) <= 1, `数字态滑块应与分段重合：${JSON.stringify(digital)}`);
    assert.ok(Math.abs(digital.thumb.w - digital.active.w) <= 1 && Math.abs(digital.thumb.h - digital.active.h) <= 1, "滑块尺寸应等于分段尺寸");
    assert.ok(digital.insideSwitcher, "滑块不得溢出切换器");

    await page.click("#kindTabAnalog");
    await page.waitForTimeout(500);
    const analog = await kindThumbState(page);
    assert.equal(analog.kind, "analog");
    assert.ok(Math.abs(analog.thumb.x - analog.active.x) <= 1 && Math.abs(analog.thumb.y - analog.active.y) <= 1, `模拟态滑块应与分段重合：${JSON.stringify(analog)}`);
    assert.ok(Math.abs(analog.thumb.w - analog.active.w) <= 1 && Math.abs(analog.thumb.h - analog.active.h) <= 1, "滑块尺寸应等于分段尺寸");
    assert.ok(analog.insideSwitcher, "滑块不得溢出切换器");
    await page.close();
  });
}

test("reduced motion snaps the thumb instantly and keyboard focus stays visible", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.goto(BASE);
  await page.waitForSelector("#subjectThumb");
  await page.waitForTimeout(250);

  assert.equal(
    await page.evaluate(() => getComputedStyle(document.getElementById("subjectThumb")).transitionProperty),
    "none",
    "reduced motion removes the slide entirely",
  );

  await page.click('.subject-tab[data-subject="analog"]');
  await page.waitForTimeout(60); /* 远小于 240ms：正常动画此时还在半路 */
  const state = await thumbState(page);
  assert.equal(state.activeSubject, "analog");
  assert.ok(Math.abs(state.thumb.x - state.active.x) <= 1, `reduced motion lands directly on the pill: ${JSON.stringify(state.thumb)}`);

  /* 键盘可达性与焦点可见性：重新载入页面让顺序焦点从文档开头开始（点击后 Chromium 会从
     最后聚焦的元素继续，测不到行内顺序），连续 Tab 应依次落在三个科目上 */
  await page.goto(BASE);
  await page.waitForSelector("#subjectThumb");
  await page.waitForTimeout(200);
  const rings = [];
  for (let i = 0; i < 3; i += 1) {
    await page.keyboard.press("Tab");
    rings.push(await page.evaluate(() => {
      const el = document.activeElement;
      const style = getComputedStyle(el);
      return { cls: String(el.className), subject: el.dataset ? el.dataset.subject : null, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
    }));
  }
  assert.deepEqual(rings.map((ring) => ring.subject), ["signals", "digital", "analog"], `Tab walks the subjects in order: ${JSON.stringify(rings)}`);
  for (const ring of rings) {
    assert.match(ring.cls, /subject-tab/, "the tab stop is a subject tab");
    assert.notEqual(ring.outlineStyle, "none", "the focused tab keeps a visible focus ring");
    assert.ok(parseFloat(ring.outlineWidth) >= 2, `focus ring stays at least 2px (${ring.outlineWidth})`);
  }
  await page.close();
});
