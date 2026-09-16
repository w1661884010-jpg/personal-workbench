/* 左侧章节目录：章可展开成小节 + 选中态色差
   - 每章一行，行尾是与面板收起按钮同款（.icon-toggle）的展开箭头，默认收起；
   - 展开后列出该章小节，点条目滚到对应小节锚点；展开态互斥（手风琴）；
   - 节标题只在该节确实被细分（≥2 小节）时出现，避免与单小节标题重复；
   - 选中章的底色与未选中章必须拉开可测量的色差，并带左侧标记条；
   - 窄屏（≤820px）不提供展开入口，章节条仍是横向可滚。
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

/** 打开第 1 章（章节目录里的章按钮） */
async function openChapterOne(page) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /第1章/ }).first().click();
  await page.waitForTimeout(600);
}

test("章节目录：一行一章，展开箭头在胶囊左侧内部，默认收起", async () => {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const state = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll("#chapterList .chapter-item"));
    const withToggle = items.filter((item) => item.querySelector(".chapter-toggle"));
    const intro = items.find((item) => item.dataset.chapter === "signals-intro");
    return {
      chapters: items.length,
      expanded: items.filter((item) => item.classList.contains("is-expanded")).length,
      allHidden: items.every((item) => {
        const panel = item.querySelector(".chapter-parts");
        return !panel || panel.hidden;
      }),
      /* 只有划分了节的章才有展开入口；绪论没有节，不该有箭头 */
      toggleChapters: withToggle.map((item) => item.dataset.chapter),
      introHasToggle: !!intro.querySelector(".chapter-toggle"),
      introHasParts: !!intro.querySelector(".chapter-parts"),
      toggleSharesPanelClass: withToggle.every((item) => {
        const toggle = item.querySelector(".chapter-toggle");
        return toggle.classList.contains("icon-toggle") && !!toggle.querySelector("svg");
      }),
      /* 箭头在胶囊内部、且在章名左侧（"纳入章节气泡"） */
      toggleInsidePillOnTheLeft: withToggle.length > 0 && withToggle.every((item) => {
        const row = item.querySelector(".chapter-row");
        const toggle = item.querySelector(".chapter-toggle");
        const label = item.querySelector(".ch-num") || item.querySelector(".chapter-button");
        const t = toggle.getBoundingClientRect();
        const r = row.getBoundingClientRect();
        const l = label.getBoundingClientRect();
        return row.contains(toggle) && t.left < l.left && t.left >= r.left - 1 && t.right <= r.right + 1
          && Math.abs(t.top + t.height / 2 - (r.top + r.height / 2)) <= 2;
      }),
      rowBackground: getComputedStyle(items[0].querySelector(".chapter-row")).backgroundColor,
      arrowLabel: withToggle[0].querySelector(".chapter-toggle").getAttribute("aria-label"),
    };
  });

  assert.ok(state.chapters >= 6, `信号课应有至少 6 章，实际 ${state.chapters}`);
  assert.equal(state.expanded, 0, "默认不应有展开的章");
  assert.ok(state.allHidden, "默认所有节的列表都应隐藏");
  assert.deepEqual(state.toggleChapters, ["signals-ch1", "signals-ch2", "signals-ch3", "signals-ch4", "signals-ch5"], "只有划分了节的章才给展开入口");
  assert.equal(state.introHasToggle, false, "绪论不展开：不给箭头");
  assert.equal(state.introHasParts, false, "绪论不展开：不渲染节的容器");
  assert.ok(state.toggleSharesPanelClass, "展开箭头必须复用 .icon-toggle（与面板收起按钮同一风格）");
  assert.ok(state.toggleInsidePillOnTheLeft, "展开箭头应位于胶囊内部左侧、与章名垂直居中");
  assert.doesNotMatch(state.rowBackground, /rgba\(0, 0, 0, 0\)/, "胶囊本身应有底色，箭头与章名共用一颗气泡");
  assert.equal(state.arrowLabel, "展开本章的节");

  await page.close();
});

test("展开第 1 章：只列 5 个节，不标注「第几节」，节以下不铺开", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);

  await page.locator('.chapter-item[data-chapter="signals-ch1"] .chapter-toggle').click();
  await page.waitForTimeout(250);

  const outline = await page.evaluate(() => {
    const item = document.querySelector('.chapter-item[data-chapter="signals-ch1"]');
    return {
      expanded: item.classList.contains("is-expanded"),
      panelHidden: item.querySelector(".chapter-parts").hidden,
      ariaExpanded: item.querySelector(".chapter-toggle").getAttribute("aria-expanded"),
      title: item.querySelector(".chapter-toggle").getAttribute("title"),
      parts: Array.from(item.querySelectorAll(".chapter-part")).map((node) => node.textContent.trim()),
      /* 节以下不铺开：目录里不该出现小节标题或小节 id */
      leaksSectionTitles: Array.from(item.querySelectorAll(".chapter-part"))
        .some((node) => /时域描述、运算与分解|傅里叶级数|Z 变换|相关系数/.test(node.textContent)),
    };
  });

  /* 节名取自教材目录，且不显示"第N节"字样 */
  assert.deepEqual(outline.parts, [
    "连续信号的时域描述和分析",
    "连续信号的频域分析",
    "连续信号的复频域分析",
    "信号的相关分析",
    "应用MATLAB的连续信号分析",
  ]);
  assert.ok(outline.expanded && !outline.panelHidden, "点击后应展开节目录");
  assert.equal(outline.ariaExpanded, "true");
  assert.equal(outline.title, "收起节目录");
  assert.equal(outline.leaksSectionTitles, false, "节以下的小节不应出现在目录里");

  /* 点"连续信号的频域分析" → 滚到该节的第一个小节 */
  await page.locator('.chapter-item[data-chapter="signals-ch1"] .chapter-part').nth(1).click();
  await page.waitForTimeout(900);
  const landed = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll(".learning-section h2")).find((node) => {
      const rect = node.getBoundingClientRect();
      return rect.top >= -10 && rect.top < window.innerHeight * 0.5;
    });
    return heading ? heading.textContent.trim() : null;
  });
  assert.match(landed ?? "", /连续信号的频域分析/, `应停在第二节，实际是「${landed}」`);

  await page.close();
});

test("展开/收起与换科目自愈", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);

  const ch1Toggle = '.chapter-item[data-chapter="signals-ch1"] .chapter-toggle';
  await page.locator(ch1Toggle).click();
  await page.waitForTimeout(200);
  assert.equal(await page.locator('.chapter-item[data-chapter="signals-ch1"] .chapter-parts').isVisible(), true);

  /* 再点一次同一条目 → 收起 */
  await page.locator(ch1Toggle).click();
  await page.waitForTimeout(200);
  const collapsed = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#chapterList .chapter-item")).filter((item) => item.classList.contains("is-expanded")).length);
  assert.equal(collapsed, 0);

  /* 换到别门课再回来：展开态自动清空，不会留下"箭头开着但内容是空的" */
  await page.locator(ch1Toggle).click();
  await page.waitForTimeout(200);
  await page.locator('[data-subject="analog"]').first().click();
  await page.waitForTimeout(700);
  await page.locator('[data-subject="signals"]').first().click();
  await page.waitForTimeout(700);
  const afterSubjectSwitch = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#chapterList .chapter-item")).filter((item) => item.classList.contains("is-expanded")).length);
  assert.equal(afterSubjectSwitch, 0, "换科目回来后不应残留展开态");

  await page.close();
});

test("选中章与未选中章：底色差可测量，且带左侧标记条", async () => {
  for (const scheme of ["light", "dark"]) {
    const page = await browser.newPage({ colorScheme: scheme });
    await openChapterOne(page);

    const contrast = await page.evaluate(() => {
      const luminance = (color) => {
        const [r, g, b] = color.match(/[\d.]+/g).slice(0, 3).map(Number);
        const channel = (value) => {
          const s = value / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };
      const selected = document.querySelector(".chapter-item.is-selected .chapter-row");
      const other = Array.from(document.querySelectorAll(".chapter-item:not(.is-selected) .chapter-row"))[0];
      const selectedStyle = getComputedStyle(selected);
      const otherStyle = getComputedStyle(other);
      const a = luminance(selectedStyle.backgroundColor);
      const b = luminance(otherStyle.backgroundColor);
      return {
        ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        selectedBg: selectedStyle.backgroundColor,
        otherBg: otherStyle.backgroundColor,
        shadow: selectedStyle.boxShadow,
        weight: Number(getComputedStyle(selected.querySelector(".ch-title")).fontWeight),
      };
    });

    assert.ok(
      contrast.ratio >= 1.35,
      `[${scheme}] 选中章与未选中章的底色对比只有 ${contrast.ratio.toFixed(2)}：${contrast.selectedBg} vs ${contrast.otherBg}`,
    );
    assert.match(contrast.shadow, /inset/, `[${scheme}] 选中章缺少左侧标记条：${contrast.shadow}`);
    assert.ok(contrast.weight >= 800, `[${scheme}] 选中章标题应加重，实际 ${contrast.weight}`);

    await page.close();
  }
});

test("目录里的当前节跟随滚动点亮", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);
  await page.locator('.chapter-item[data-chapter="signals-ch1"] .chapter-toggle').click();
  await page.waitForTimeout(250);

  const currentSection = () => page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll(".chapter-part.is-current"));
    return { count: nodes.length, id: nodes[0] ? nodes[0].dataset.part : null };
  });

  /* 点目录里的第 1 节（连续信号的时域描述和分析）→ 滚过去并点亮该节 */
  await page.locator('.chapter-item[data-chapter="signals-ch1"] .chapter-part').first().click();
  await page.waitForTimeout(1000);
  let state = await currentSection();
  assert.equal(state.count, 1, "同一时刻只能有一个当前节");
  assert.equal(state.id, "0");

  /* 滚到第三节（复频域）→ 点亮跟着走到第 3 条 */
  await page.evaluate(() => document.getElementById("section-signals-ch1-laplace").scrollIntoView({ block: "start" }));
  await page.waitForTimeout(700);
  state = await currentSection();
  assert.equal(state.count, 1);
  assert.equal(state.id, "2", "复频域是第三节，对应目录第 3 条");

  /* 高亮态与章选中态同一套语汇，但必须淡一档：底色更靠近底色、标记条更细 */
  const look = await page.evaluate(() => {
    const luminance = (color) => {
      const [r, g, b] = color.match(/[\d.]+/g).slice(0, 3).map(Number);
      const channel = (value) => {
        const s = value / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };
    const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const style = (node) => {
      const computed = getComputedStyle(node);
      return { background: computed.backgroundColor, shadow: computed.boxShadow, weight: Number(computed.fontWeight) };
    };
    const part = style(document.querySelector(".chapter-part.is-current"));
    const chapter = style(document.querySelector(".chapter-item.is-selected .chapter-row"));
    const base = style(document.querySelector(".chapter-item:not(.is-selected) .chapter-row"));
    return {
      part,
      chapter,
      /* 离底色多远：数值越小越接近底色 */
      distancePart: ratio(luminance(base.background), luminance(part.background)),
      distanceChapter: ratio(luminance(base.background), luminance(chapter.background)),
    };
  });
  assert.doesNotMatch(look.part.background, /rgba\(0, 0, 0, 0\)/, "当前节应有底色");
  assert.match(look.part.shadow, /inset/, "当前节应有左侧标记条");
  assert.ok(look.part.weight >= 700, `当前节字重应加重，实际 ${look.part.weight}`);
  assert.ok(
    look.distancePart < look.distanceChapter - 0.1,
    `当前节的底色应比选中章更接近底色：节 ${look.distancePart.toFixed(2)} vs 章 ${look.distanceChapter.toFixed(2)}`,
  );
  /* Chrome 计算值形如 "rgb(...) 2px 0px 0px 0px inset" */
  assert.match(look.part.shadow, /2px 0px 0px 0px inset/, "当前节的标记条应比选中章更细（2px vs 3px）");
  assert.match(look.chapter.shadow, /3px 0px 0px 0px inset/, "选中章的标记条应保持 3px");

  /* 收起列表后：不应再有"看得见"的高亮（类名可以留在隐藏节点上，但不能显示出来） */
  await page.locator('.chapter-item[data-chapter="signals-ch1"] .chapter-toggle').click();
  await page.waitForTimeout(200);
  const visibleCurrent = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".chapter-part.is-current")).filter((node) => node.offsetParent !== null).length);
  assert.equal(visibleCurrent, 0);

  await page.close();
});

test("切换章节：目录选中态立即生效，正文随后再换", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);

  /* 在同一个同步任务里点章并立刻读状态：选中态必须先动，正文还没换
     （正文有 150ms 淡出，若选中态也跟着等，就会显得"慢一拍"） */
  const immediate = await page.evaluate(() => {
    const selected = () => Array.from(document.querySelectorAll("#chapterList .chapter-item.is-selected"))
      .map((item) => item.dataset.chapter);
    const before = selected();
    document.querySelector('.chapter-item[data-chapter="signals-ch2"] .chapter-button').click();
    return {
      before,
      after: selected(),
      titleRightAfterClick: document.getElementById("lessonTitle").textContent,
      currentAttr: document.querySelector('.chapter-item[data-chapter="signals-ch2"] .chapter-button').getAttribute("aria-current"),
    };
  });

  assert.deepEqual(immediate.before, ["signals-ch1"]);
  assert.deepEqual(immediate.after, ["signals-ch2"], "点下章的同一刻，选中态就应落到新章");
  assert.equal(immediate.currentAttr, "true", "新章的章按钮应带上 aria-current");
  assert.match(immediate.titleRightAfterClick, /连续信号的分析/, "此刻正文还应是旧章（内容后换）");

  /* 150ms 之后正文跟上，且选中态仍是新章 */
  await page.waitForTimeout(400);
  const settled = await page.evaluate(() => ({
    title: document.getElementById("lessonTitle").textContent,
    selected: Array.from(document.querySelectorAll("#chapterList .chapter-item.is-selected")).map((item) => item.dataset.chapter),
  }));
  assert.match(settled.title, /离散信号的分析/);
  assert.deepEqual(settled.selected, ["signals-ch2"]);

  await page.close();
});

test("点目录里的节：选中态在同一刻就落到该节，不等平滑滚动", async () => {
  const page = await browser.newPage();
  await openChapterOne(page);
  await page.locator('.chapter-item[data-chapter="signals-ch1"] .chapter-toggle').click();
  await page.waitForTimeout(250);

  /* 同一个同步任务里点第 4 节并立刻读状态 */
  const immediate = await page.evaluate(() => {
    const current = () => {
      const node = document.querySelector(".chapter-part.is-current");
      return node ? node.dataset.part : null;
    };
    const parts = document.querySelectorAll('.chapter-item[data-chapter="signals-ch1"] .chapter-part');
    const before = current();
    parts[3].click();
    return { before, after: current(), count: parts.length };
  });

  assert.equal(immediate.count, 5);
  assert.equal(immediate.before, null, "初始在页面顶部，还没有“当前节”");
  assert.equal(immediate.after, "3", "点下第 4 节的那一刻，选中态就该落到它");

  /* 平滑滚动结束后仍然是它（解锁后的校正不会把它改掉） */
  await page.waitForTimeout(1400);
  const settled = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll(".chapter-part.is-current"));
    return { count: nodes.length, id: nodes[0] ? nodes[0].dataset.part : null };
  });
  assert.equal(settled.count, 1);
  assert.equal(settled.id, "3");

  await page.close();
});

test("各章节的节目录：按教材目录列出，节名不带「第几节」", async () => {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const expected = {
    "signals-ch1": [
      "连续信号的时域描述和分析",
      "连续信号的频域分析",
      "连续信号的复频域分析",
      "信号的相关分析",
      "应用MATLAB的连续信号分析",
    ],
    "signals-ch2": [
      "离散信号的时域描述和分析",
      "离散信号的频域分析",
      "快速傅里叶变换（FFT）",
      "离散信号的z域分析",
      "应用MATLAB的离散信号分析",
    ],
    "signals-ch3": [
      "系统及其性质",
      "信号的线性系统处理",
      "解卷积（逆滤波与系统辨识）",
      "数字信号处理技术",
      "应用MATLAB的信号处理",
    ],
    "signals-ch4": ["滤波器概述", "模拟滤波器", "数字滤波器", "应用MATLAB的滤波器设计"],
    "signals-ch5": [
      "随机信号的描述与分析",
      "随机信号通过线性系统的分析",
      "最优线性滤波",
      "非平稳随机信号的分析",
      "应用MATLAB的随机信号分析、处理",
    ],
  };

  /* 逐章展开：每次只应展开一章（手风琴），节名逐条对齐教材目录 */
  for (const [chapterId, parts] of Object.entries(expected)) {
    await page.locator(`.chapter-item[data-chapter="${chapterId}"] .chapter-toggle`).click();
    await page.waitForTimeout(200);
    const state = await page.evaluate((id) => ({
      expanded: Array.from(document.querySelectorAll("#chapterList .chapter-item.is-expanded")).map((item) => item.dataset.chapter),
      parts: Array.from(document.querySelectorAll(`.chapter-item[data-chapter="${id}"] .chapter-part`))
        .map((node) => node.textContent.trim()),
    }), chapterId);
    assert.deepEqual(state.parts, parts, `${chapterId} 的节目录应逐条对齐教材`);
    assert.deepEqual(state.expanded, [chapterId], "同时只展开一章");
  }

  /* 点第 3 章的"数字信号处理技术"→ 滚到该节首个小节（先把第 3 章重新展开） */
  await page.locator('.chapter-item[data-chapter="signals-ch3"] .chapter-toggle').click();
  await page.waitForTimeout(200);
  await page.locator('.chapter-item[data-chapter="signals-ch3"] .chapter-part').nth(3).click();
  /* 第 3 章扩写到 15 个小节后滚动距离明显变长：等"目标小节标题到达视口上部"这个
     可观察状态，而不是固定延时。几何断言保持不变——标题没到位就超时失败。 */
  await page.waitForFunction(
    (expected) => {
      const node = Array.from(document.querySelectorAll(".learning-section h2"))
        .find((item) => item.textContent.trim() === expected);
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      return rect.top >= -10 && rect.top < window.innerHeight * 0.5;
    },
    "数字信号处理的特点",
    { timeout: 6000 },
  );
  const landed = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll(".learning-section h2")).find((node) => {
      const rect = node.getBoundingClientRect();
      return rect.top >= -10 && rect.top < window.innerHeight * 0.5;
    });
    return heading ? heading.textContent.trim() : null;
  });
  assert.match(landed ?? "", /数字信号处理的特点/, `应停在第 3 章第 4 节，实际是「${landed}」`);

  await page.close();
});

test("窄屏 760px 与 390px：不提供展开入口，逐章打开也不横向溢出", async () => {
  for (const width of [760, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    const state = await page.evaluate(() => {
      const toggle = document.querySelector(".chapter-toggle");
      const list = document.getElementById("chapterList");
      return {
        toggleDisplay: toggle ? getComputedStyle(toggle).display : "missing",
        listDirection: getComputedStyle(list).flexDirection,
        docWidth: document.documentElement.scrollWidth,
        viewWidth: window.innerWidth,
      };
    });

    assert.equal(state.toggleDisplay, "none", `[${width}px] 窄屏不应显示展开入口`);
    assert.equal(state.listDirection, "row", `[${width}px] 章节条应保持横向排列`);
    assert.ok(state.docWidth <= state.viewWidth + 1, `[${width}px] 横向溢出：${state.docWidth} > ${state.viewWidth}`);

    /* 逐章打开：正文里的长公式/长串最容易在窄屏把栅格列撑宽（本轮实测溢出过 163px），
       所以不能只查"停在绪论"的首页状态 */
    for (const chapterId of ["signals-ch1", "signals-ch2", "signals-ch3", "signals-ch4", "signals-ch5"]) {
      await page.locator(`.chapter-item[data-chapter="${chapterId}"] .chapter-button`).click();
      await page.waitForTimeout(450);
      const after = await page.evaluate(() => ({
        docWidth: document.documentElement.scrollWidth,
        viewWidth: window.innerWidth,
      }));
      assert.ok(
        after.docWidth <= after.viewWidth + 1,
        `[${width}px] 打开 ${chapterId} 后横向溢出：${after.docWidth} > ${after.viewWidth}`,
      );
    }

    await page.close();
  }
});
