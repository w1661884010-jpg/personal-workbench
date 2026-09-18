import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Lenovo/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright");
let browser;
test.before(async () => { browser = await chromium.launch({ channel: "chrome", headless: true }); });
test.after(async () => { await browser?.close(); });
test("课程显式数学标记全部配对且可由KaTeX严格解析", () => {
  const context = {};
  vm.runInNewContext(readFileSync(new URL("../courses.js", import.meta.url), "utf8"), context);
  const katex = require("katex");
  let count = 0;
  function visit(value, key) {
    if (key === "formula") {
      katex.renderToString(value, { throwOnError: true, strict: false, trust: false });
      return;
    }
    if (typeof value === "string") {
      const rest = value.replace(/`[^`]+`/g, "").replace(/\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g, (_, inline, display) => {
        count++;
        katex.renderToString(inline || display, { throwOnError: true, strict: false, trust: false });
        return "";
      });
      assert.doesNotMatch(rest, /\\[()[\]]/, "不能遗留不配对的数学标记");
    } else if (value && typeof value === "object") Object.entries(value).forEach(([key, child]) => visit(child, key));
  }
  visit(context.CoursesData.courses);
  assert.ok(count > 500, "前两章正文、例题和变量说明不能退回纯文本");
});
async function open(page, chapter = 1, width = 1440) {
  await page.setViewportSize({ width, height: 950 });
  await page.goto("http://localhost:3010/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: new RegExp("第" + chapter + "章") }).first().click();
  await page.waitForSelector("#section-signals-ch" + chapter + (chapter === 1 ? "-time-singular" : "-sampling"));
}
test("正文公式可读：奇异信号有行内与独立公式，变量解释也渲染", async () => {
  const page = await browser.newPage();
  await open(page);
  const section = page.locator("#section-signals-ch1-time-singular");
  assert.ok(await section.locator("p .math-inline .katex").count() >= 6);
  assert.ok(await section.locator("p .math-display .katex").count() >= 2);
  assert.ok(await section.locator(".formula-block li .katex").count() >= 4);
  assert.equal(await page.locator(".katex-error").count(), 0);
  await page.close();
});
test("只解释显式标记：文字保持安全，代码不被数学规则吞掉", async () => {
  const page = await browser.newPage();
  await page.goto("http://localhost:3010/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    CoursesData.courseById.signals.chapters.find(c => c.id === "signals-ch1").sections[0].content =
      '文字 <img src=x onerror="window.BAD=1">，数学 \\(x_0^2\\)，代码 `a < b; x=fft(y)`，普通金额 $5。';
  });
  await page.getByRole("button", { name: /第1章/ }).first().click();
  const lead = page.locator("#section-signals-ch1-time-basic .section-lead");
  await lead.waitFor({ state: "visible" });
  assert.equal(await lead.locator(".katex").count(), 1);
  assert.equal(await lead.locator("code").textContent(), "a < b; x=fft(y)");
  assert.equal(await lead.locator("img").count(), 0);
  assert.ok((await lead.textContent()).includes("$5"));
  assert.equal(await page.evaluate(() => window.BAD), undefined);
  await page.close();
});
test("前两章数学排版在手机和桌面均不撑破正文，公式说明不挤成窄列", async () => {
  for (const width of [375, 760, 1440]) {
    for (const chapter of [1, 2]) {
      const page = await browser.newPage();
      await open(page, chapter, width);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        errors: document.querySelectorAll(".katex-error").length,
        inline: document.querySelectorAll(".section-detail .math-inline").length,
        cards: [...document.querySelectorAll(".formula-block")].map(c => {
          const math = c.querySelector(".math-formula").getBoundingClientRect();
          const vars = c.querySelector("ul").getBoundingClientRect();
          return vars.top >= math.bottom;
        }),
        clipped: [...document.querySelectorAll(".math-display,.math-formula")]
          .filter(n => n.scrollWidth > n.clientWidth + 2).map(n => n.textContent.slice(0, 80)),
      }));
      assert.ok(state.overflow <= 1, `${chapter}/${width} 页面溢出`);
      assert.equal(state.errors, 0);
      assert.ok(state.inline > 20, `${chapter}/${width} 正文数学仍未渲染`);
      assert.ok(state.cards.every(Boolean), `${chapter}/${width} 变量说明应在公式下方`);
      assert.deepEqual(state.clipped, [], `${chapter}/${width} 关键公式应拆行完整显示`);
      await page.close();
    }
  }
});
