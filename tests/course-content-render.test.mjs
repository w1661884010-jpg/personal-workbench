/* 课程正文「充实」后的渲染与跳转测试（以信号与系统第 1 章为样板章）：
   - 小节里渲染出 承接正文 + 展开段 + 要点 + 易混点 + 相关小节；
   - 章末新增「章节联系」，按 前置 / 后续 / 跨课程 分组，条目可点击；
   - 点小节内的相关链接 → 滚到目标小节锚点；点跨课程联系 → 切到另一门课的目标章；
   - 窄屏 390px 下新块不产生横向溢出，键盘 Enter 也能触发跳转。
   依赖 3010 静态服务器；Chromium 使用系统 Chrome（playwright 库来自 npx 缓存）。 */
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

async function openChapterOne(page, width = 1360, height = 950) {
  await page.setViewportSize({ width, height });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const subject = page.locator('[data-subject="signals"]').first();
  if (await subject.count()) await subject.click();
  await page.waitForTimeout(350);
  await page.getByRole("button", { name: /第1章/ }).first().click();
  await page.waitForTimeout(550);
}

/** 等窗口滚动停稳（连续两次采样一致），用于判断"滚到了哪一节"。 */
async function settleScroll(page) {
  let last = -1;
  for (let i = 0; i < 40; i += 1) {
    const y = await page.evaluate(() => window.scrollY);
    if (y === last) return;
    last = y;
    await page.waitForTimeout(60);
  }
}

test("信号第 1 章：小节有展开段/要点/易混点，章末有分组章节联系", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);

  const state = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll(".learning-section"));
    return {
      sections: sections.map((section) => ({
        id: section.id,
        paragraphs: section.querySelectorAll(":scope > p").length,
        points: section.querySelectorAll(".section-points li").length,
        pitfalls: section.querySelectorAll(".section-pitfalls li").length,
        links: section.querySelectorAll(".section-link").length,
      })),
      groups: Array.from(document.querySelectorAll(".connection-group")).map((group) => ({
        kind: group.querySelector(".connection-kind")?.textContent.trim(),
        count: group.querySelectorAll(".connection-item").length,
        clickable: Array.from(group.querySelectorAll(".connection-item")).every((item) => item.tagName === "BUTTON"),
      })),
      sourceNote: !!document.querySelector(".source-note"),
    };
  });

  assert.equal(state.sections.length, 10);
  for (const section of state.sections) {
    assert.ok(section.id.startsWith("section-signals-ch1-"), `小节缺少锚点 id：${section.id}`);
    assert.ok(section.paragraphs >= 3, `${section.id} 应有一段正文加展开段`);
    assert.ok(section.points >= 3, `${section.id} 要点少于 3 条`);
    assert.ok(section.pitfalls >= 1, `${section.id} 缺易混点`);
    assert.ok(section.links >= 1, `${section.id} 缺相关小节链接`);
  }
  assert.deepEqual(state.groups.map((group) => group.kind), ["前置", "后续", "跨课程"]);
  assert.ok(state.groups.every((group) => group.count >= 1 && group.clickable), "章节联系条目必须是可点击按钮");
  assert.ok(state.sourceNote, "缺少材料出处折叠块");

  await page.close();
});

test("本章重点全章只出现一次，且跟在第一节分组条之后", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);

  const state = await page.evaluate(() => {
    const focuses = document.querySelectorAll(".lesson-focus");
    const body = document.querySelector(".lesson-body");
    const order = Array.from(body.children).map((node) => node.className.split(" ")[0]);
    return {
      count: focuses.length,
      insideBody: body.contains(focuses[0]),
      afterGroupBar: order.indexOf("lesson-focus") === order.indexOf("lesson-group") + 1,
      objectives: document.querySelectorAll("#lessonFocusList li").length,
      headingAboveBody: document.querySelector(".lesson-heading h1").textContent.trim(),
      labels: Array.from(document.querySelectorAll(".learning-section .importance-label")).map((node) => node.textContent.trim()),
      hasCoreLabel: document.body.textContent.includes("主线必学"),
    };
  });

  assert.equal(state.count, 1, "「本章重点」整块应只渲染一次");
  assert.ok(state.insideBody, "「本章重点」应在正文容器内");
  assert.ok(state.afterGroupBar, "「本章重点」应紧跟在第一节分组条之后");
  assert.ok(state.objectives >= 3, "本章重点应列出学习目标");
  assert.equal(state.headingAboveBody, "连续信号的分析", "章标题仍留在页面顶部");

  /* 只保留"选择学习"：主线必学是默认状态，不再显示字样 */
  assert.equal(state.hasCoreLabel, false, "不应再出现「主线必学」字样");
  assert.deepEqual(state.labels, ["选择学习"], "第 1 章只有 signals-ch1-advanced 一个小节是选学");

  await page.close();
});

test("信号第 1 章：节分组条按教材目录渲染", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);

  const bars = await page.evaluate(() => {
    const out = [];
    for (const bar of document.querySelectorAll(".lesson-group")) {
      const title = bar.querySelector("h2").textContent.trim();
      let count = 0;
      let first = null;
      for (let node = bar.nextElementSibling; node; node = node.nextElementSibling) {
        if (node.classList.contains("lesson-group")) break;
        if (!node.classList.contains("learning-section")) continue;
        if (!first) first = node.id.replace("section-", "");
        count += 1;
      }
      out.push({ title, count, first });
    }
    return out;
  });

  /* 只钉住"节的顺序 + 每节归属的第一个小节 + 第一节的 6 个小节"；
     第二至五节尚未细分，每节目前只有 1 个小节，不在这里写死 */
  assert.deepEqual(bars.map((bar) => bar.title), [
    "第一节 连续信号的时域描述和分析",
    "第二节 连续信号的频域分析",
    "第三节 连续信号的复频域分析",
    "第四节 信号的相关分析",
    "第五节 应用MATLAB的连续信号分析",
  ]);
  assert.deepEqual(bars.map((bar) => bar.first), [
    "signals-ch1-time-basic",
    "signals-ch1-frequency",
    "signals-ch1-laplace",
    "signals-ch1-correlation",
    "signals-ch1-advanced",
  ]);
  assert.equal(bars[0].count, 6, "第一节应包含 6 个小节");

  const firstGroup = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".learning-section"))
      .slice(0, 6)
      .map((node) => node.id.replace("section-", "")),
  );
  assert.deepEqual(firstGroup, [
    "signals-ch1-time-basic",
    "signals-ch1-time-singular",
    "signals-ch1-time-ops",
    "signals-ch1-time-composite",
    "signals-ch1-time-convolution",
    "signals-ch1-time-decomposition",
  ]);

  await page.close();
});

test("小节相关链接滚到锚点，跨课程联系切到另一门课的目标章", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);

  /* 小节内「相关」：跳到同课程的另一小节 */
  const sectionLink = page.locator(".section-link").first();
  const sectionLabel = (await sectionLink.locator("strong").textContent()).trim();
  await sectionLink.click();
  /* 等滚动真正停稳再判断落点：固定 sleep 在负载下会在滚动途中取样，
     视口上半可能还没有目标小节（实测偶发停在 null）。 */
  await page.waitForTimeout(150);
  await settleScroll(page);
  const landed = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll(".learning-section h2")).find((node) => {
      const rect = node.getBoundingClientRect();
      return rect.top >= -10 && rect.top < window.innerHeight * 0.5;
    });
    return {
      heading: heading ? heading.textContent.trim() : null,
      hashTargetVisible: !!document.querySelector(".learning-section[id]"),
    };
  });
  assert.ok(sectionLabel.length > 0, "相关链接应显示目标小节名");
  assert.ok(landed.heading && sectionLabel.includes(landed.heading), `期望滚到「${sectionLabel}」，实际停在「${landed.heading}」`);

  /* 章末「跨课程」：切到模拟/数字课程的目标章 */
  await page.locator(".source-note").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const crossItem = page.locator(".connection-group").last().locator(".connection-item").first();
  const crossLabel = (await crossItem.locator("strong").textContent()).trim();
  await crossItem.click();
  /* 等到真的切走科目，而不是等一个固定时长 */
  await page.waitForFunction(
    () => document.querySelector(".subject-tab.is-active")?.dataset.subject !== "signals",
    null, { timeout: 8000 });
  const after = await page.evaluate(() => ({
    subject: document.querySelector(".subject-tab.is-active")?.dataset.subject,
    title: (document.querySelector(".lesson-title") || document.querySelector(".lesson h1"))?.textContent.trim(),
  }));
  assert.notEqual(after.subject, "signals", `跨课程联系应切走科目，标签为「${crossLabel}」`);
  assert.ok(crossLabel.includes(after.title), `期望打开「${crossLabel}」，实际是「${after.title}」`);

  await page.close();
});

test("前置联系切回绪论；键盘 Enter 同样能触发", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);

  const prereq = page.locator(".connection-group").first().locator(".connection-item").first();
  assert.equal((await prereq.locator(".connection-kind").count()), 0);
  await prereq.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => ({
    subject: document.querySelector(".subject-tab.is-active")?.dataset.subject,
    title: (document.querySelector(".lesson-title") || document.querySelector(".lesson h1"))?.textContent.trim(),
  }));
  assert.equal(after.subject, "signals");
  assert.equal(after.title, "信号分析与处理概览");

  await page.close();
});

test("公式卡：KaTeX 全部渲染成功，变量说明齐全，390/760/1440 三档都不裁切", async () => {
  /* 已按教材目录重写的小节都要过这一关：新增公式卡最容易在窄屏被裁切 */
  const chapters = [
    { label: "第1章", pattern: /第1章/, minCards: 8 },
    { label: "第2章", pattern: /第2章/, minCards: 13 },
  ];
  for (const chapter of chapters) {
    for (const width of [1440, 760, 390]) {
      const page = await browser.newPage();
      await page.setViewportSize({ width, height: 950 });
      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      await page.getByRole("button", { name: chapter.pattern }).first().click();
      await page.waitForTimeout(700);

      const state = await page.evaluate(() => ({
        cards: document.querySelectorAll(".formula-block").length,
        rendered: document.querySelectorAll(".math-formula .katex").length,
        errors: Array.from(document.querySelectorAll(".katex-error")).map((node) => node.textContent.slice(0, 60)),
        varRows: Array.from(document.querySelectorAll(".formula-block ul")).map((node) => node.children.length),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        /* 公式卡内部横向滚动 = 公式被裁切看不全，窄屏最容易出现 */
        clipped: Array.from(document.querySelectorAll(".math-formula"))
          .filter((node) => node.scrollWidth > node.clientWidth + 2)
          .map((node) => node.closest(".learning-section")?.id.replace("section-", "") ?? "?"),
      }));

      const where = `${chapter.label}/${width}px`;
      assert.ok(state.cards >= chapter.minCards, `[${where}] 应有至少 ${chapter.minCards} 张公式卡，实际 ${state.cards}`);
      assert.equal(state.rendered, state.cards, `[${where}] 每张公式卡都应渲染出 KaTeX`);
      assert.deepEqual(state.errors, [], `[${where}] 不得有 KaTeX 渲染错误`);
      assert.ok(state.varRows.every((count) => count >= 4), `[${where}] 每张卡的变量说明至少 4 条：${state.varRows}`);
      assert.ok(state.overflow <= 1, `[${where}] 页面横向溢出 ${state.overflow}px`);
      assert.deepEqual(state.clipped, [], `[${where}] 这些公式卡被裁切，需要拆行或缩字号：${state.clipped}`);

      await page.close();
    }
  }
});

test("窄屏 390px：新块不产生横向溢出，条目仍可点击", async () => {
  const page = await browser.newPage();
  await openChapterOne(page, 390, 844);

  const overflow = await page.evaluate(() => ({
    docWidth: document.documentElement.scrollWidth,
    viewWidth: window.innerWidth,
  }));
  assert.ok(overflow.docWidth <= overflow.viewWidth + 1, `横向溢出：${overflow.docWidth} > ${overflow.viewWidth}`);

  const boxes = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll(".section-points, .section-pitfalls, .section-links, .connection-item"));
    return nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { width: Math.round(rect.width), right: Math.round(rect.right), left: Math.round(rect.left) };
    });
  });
  assert.ok(boxes.length > 0, "窄屏下新块应仍然渲染");
  for (const box of boxes) {
    assert.ok(box.left >= -1 && box.right <= 391, `窄屏下有块溢出视口：${JSON.stringify(box)}`);
  }

  await page.close();
});
