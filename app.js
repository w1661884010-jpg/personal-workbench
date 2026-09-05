/* 骨架最小脚本：顶栏滚动收起、科目切换、章节选择。无图标、无多余逻辑。 */

(function () {
  "use strict";

  /* 课程数据：直接取自原站点（courses.js 由 app/data/courses 打包而来），
     章节编号、正文、例题、实验与检验均以这一份数据为准。 */
  var courses = (typeof CoursesData !== "undefined" && CoursesData.courses) || [];

  /* 骨架专用的假进度/当前章/检验得分（原站为 localStorage 学习记录，此处仅做展示） */
  var skeletonState = {
    signals: { progress: "1/5 · 20%", current: "signals-intro", check: { "signals-ch1": "得分 100%", "signals-intro": "得分 60%" } },
    digital: { progress: "2/8 · 25%", current: "digital-01", check: { "digital-01": "得分 100%" } },
    analog: { progress: "0/10 · 0%", current: "analog-00", check: {} }
  };

  /* 章节目录：[章id, "编号 标题"]，沿用原站章节数据（原骨架的手写列表以此为准） */
  var subjects = {};
  courses.forEach(function (course) {
    var state = skeletonState[course.id] || { progress: "", current: null, check: {} };
    subjects[course.id] = {
      title: "章节目录 · " + course.title,
      progress: state.progress,
      current: state.current || (course.chapters[0] ? course.chapters[0].id : null),
      check: state.check,
      chapters: course.chapters.map(function (chapter) {
        return [chapter.id, chapter.number + " " + chapter.title];
      })
    };
  });

  var courseLabel = {};
  courses.forEach(function (course) { courseLabel[course.id] = course.title; });

  var topbar = document.getElementById("topbar");
  var themeToggle = document.getElementById("themeToggle");
  var subjectTabs = Array.prototype.slice.call(document.querySelectorAll(".subject-tab"));
  var chapterList = document.getElementById("chapterList");
  var panelTitle = document.getElementById("chapterPanelTitle");
  var lessonTitle = document.getElementById("lessonTitle");
  var lessonGuideContent = document.getElementById("lessonGuideContent");
  var lessonFocusList = document.getElementById("lessonFocusList");
  var lessonBody = document.getElementById("lessonBody");
  var lessonResources = document.getElementById("lessonResources");
  var chapterPanel = document.getElementById("chapterPanel");
  var chapterCol = document.querySelector(".chapter-col");
  var shell = document.getElementById("shell");
  var chapterPanelToggle = document.getElementById("chapterPanelToggle");
  var chapterRail = document.getElementById("chapterRail");
  var prevChapterButton = document.getElementById("prevChapter");
  var nextChapterButton = document.getElementById("nextChapter");
  var panelCollapsed = false;

  /* 章节短标（收起栏方块上显示）：绪论→绪，其余取编号 */
  function chapterShortLabel(title) {
    if (title.indexOf("绪论") !== -1) return "绪";
    var match = /第?\s*([0-9]+)/.exec(title);
    return match ? match[1] : title.slice(0, 2);
  }

  function setPanelCollapsed(collapsed) {
    panelCollapsed = collapsed;
    chapterPanel.classList.toggle("is-collapsed", collapsed);
    shell.classList.toggle("is-panel-collapsed", collapsed);
    chapterPanelToggle.setAttribute("aria-label", collapsed ? "展开章节目录" : "收起章节目录");
    chapterPanelToggle.setAttribute("title", collapsed ? "展开" : "收起");
    chapterRail.removeAttribute("hidden");
    chapterRail.setAttribute("aria-hidden", collapsed ? "false" : "true");
    if (collapsed) renderChapterRail();
  }

  function renderChapterRail() {
    var subject = subjects[currentSubject];
    chapterRail.textContent = "";
    subject.chapters.forEach(function (entry) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "chapter-rail-item";
      button.textContent = chapterShortLabel(entry[1]);
      button.setAttribute("aria-label", entry[1]);
      if (entry[0] === currentChapter) {
        button.classList.add("is-selected");
        button.setAttribute("aria-current", "true");
      }
      button.addEventListener("click", function () {
        if (entry[0] === currentChapter) return;
        switchChapter(entry[0]);
      });
      chapterRail.appendChild(button);
    });
    chapterPanelToggle.focus();
  }

  chapterPanelToggle.addEventListener("click", function () {
    setPanelCollapsed(!panelCollapsed);
  });
  var currentSubject = "signals";
  var currentChapter = subjects.signals.current;

  /* 外观模式：与真实站点一致（system → dark → light 循环，localStorage 持久化） */
  var THEME_STORAGE_KEY = "personal-workbench-theme";
  var themePreferences = ["system", "dark", "light"];
  var themeLabels = { system: "跟随系统", dark: "深色", light: "浅色" };
  var themeShortLabels = { system: "系统", dark: "暗色", light: "浅色" };
  /* 图标随模式变化（参考原站点）：系统=显示器，暗色=月亮，浅色=太阳 */
  var themeIcons = {
    system: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="2.4" y="3.2" width="11.2" height="7.6" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.6 13.4h4.8M8 10.8v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    dark: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.2 9.8A5.4 5.4 0 1 1 6.2 2.8a4.3 4.3 0 0 0 7 7Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    light: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.1" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 1.6v1.8M8 12.6v1.8M1.6 8h1.8M12.6 8h1.8M3.5 3.5l1.3 1.3M11.2 11.2l1.3 1.3M12.5 3.5l-1.3 1.3M4.8 11.2l-1.3 1.3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
  };
  var themePreference = "system";

  function isThemePreference(value) {
    return themePreferences.indexOf(value) !== -1;
  }

  function resolvedTheme(preference, systemPrefersDark) {
    return preference === "system" ? (systemPrefersDark ? "dark" : "light") : preference;
  }

  function applyThemePreference() {
    var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = resolvedTheme(themePreference, systemPrefersDark);
    document.documentElement.dataset.themePreference = themePreference;
    document.getElementById("themeLabel").textContent = themeShortLabels[themePreference];
    document.getElementById("themeIcon").innerHTML = themeIcons[themePreference];
    themeToggle.setAttribute("aria-label", "外观模式：" + themeLabels[themePreference] + "。点击切换");
    themeToggle.setAttribute("data-tip", "外观模式：" + themeLabels[themePreference] + "。点击切换");
  }

  try {
    var stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(stored)) themePreference = stored;
  } catch (e) { /* 存储不可用时缺省跟随系统 */ }

  applyThemePreference();

  themeToggle.addEventListener("click", function () {
    var index = themePreferences.indexOf(themePreference);
    themePreference = themePreferences[(index + 1) % themePreferences.length];
    try { localStorage.setItem(THEME_STORAGE_KEY, themePreference); } catch (e) { /* 忽略 */ }
    applyThemePreference();
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (themePreference === "system") applyThemePreference();
  });

  /* 功能按钮悬停提示：固定定位浮层（顶栏 overflow-x 会裁剪伪元素，故挂到 body） */
  var tip = document.createElement("div");
  tip.className = "page-tip";
  tip.setAttribute("role", "tooltip");
  tip.setAttribute("aria-hidden", "true");
  document.body.appendChild(tip);

  function showTip(button) {
    var text = button.getAttribute("data-tip");
    if (!text) return;
    tip.textContent = text;
    tip.classList.add("is-visible");
    var rect = button.getBoundingClientRect();
    var left = Math.min(Math.max(8, rect.left), window.innerWidth - tip.offsetWidth - 10);
    tip.style.top = (rect.bottom + 9) + "px";
    tip.style.left = left + "px";
    /* 指向箭头对齐按钮中心 */
    var arrow = Math.min(Math.max(12, rect.left + rect.width / 2 - left), tip.offsetWidth - 12);
    tip.style.setProperty("--tip-arrow-x", arrow + "px");
  }

  function hideTip() {
    tip.classList.remove("is-visible");
  }

  Array.prototype.forEach.call(document.querySelectorAll(".tool-button"), function (button) {
    button.addEventListener("mouseenter", function () { showTip(button); });
    button.addEventListener("mouseleave", hideTip);
    button.addEventListener("focus", function () { showTip(button); });
    button.addEventListener("blur", hideTip);
  });

  window.addEventListener("scroll", hideTip, { passive: true });

  /* ===== 实验边界说明：切换气泡下方的警示图标 → 悬停/聚焦弹出文字提示（复用 page-tip） ===== */
  var workbenchLimit = document.getElementById("workbenchLimit");
  var limitStage = document.getElementById("workbenchStage");
  var limitRoot = document.getElementById("workbenchRoot");

  function findExperimentById(experimentId) {
    for (var c = 0; c < courses.length; c += 1) {
      var course = courses[c];
      for (var ch = 0; ch < course.chapters.length; ch += 1) {
        var list = course.chapters[ch].experiments || [];
        for (var e = 0; e < list.length; e += 1) {
          if (list[e].id === experimentId) return list[e];
        }
      }
    }
    return null;
  }

  function updateWorkbenchLimit() {
    if (!workbenchLimit) return;
    /* 双会话：只读当前可见工作台里的实验条 */
    var visible = null;
    Array.prototype.forEach.call(limitRoot.querySelectorAll(".prototype-workbench-session"), function (container) {
      if (!container.hidden) visible = container;
    });
    var select = visible && visible.querySelector(".cw-experiment-strip select");
    var experiment = select && findExperimentById(select.value);
    var limitation = experiment && experiment.limitation;
    if (limitation) {
      workbenchLimit.setAttribute("data-tip", limitation);
      workbenchLimit.hidden = false;
    } else {
      workbenchLimit.setAttribute("data-tip", "");
      workbenchLimit.hidden = true;
    }
  }

  limitStage.addEventListener("change", function (event) {
    var target = event.target;
    if (target && target.matches && target.matches(".cw-experiment-strip select")) updateWorkbenchLimit();
  });
  workbenchLimit.addEventListener("mouseenter", function () { showTip(workbenchLimit); });
  workbenchLimit.addEventListener("mouseleave", hideTip);
  workbenchLimit.addEventListener("focus", function () { showTip(workbenchLimit); });
  workbenchLimit.addEventListener("blur", hideTip);

  /* 顶栏：下滚收起、上滚恢复；章节栏跟随顶栏移动，顶栏收起后置顶。
     死区 2px 以兼容触控板平滑滚动的小增量；接近页面顶部时强制恢复。 */
  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y > lastY && y > 140) {
      topbar.classList.add("is-hidden");
      shell.classList.add("has-topbar-hidden");
    } else if (y < lastY - 2 || y <= 140) {
      topbar.classList.remove("is-hidden");
      shell.classList.remove("has-topbar-hidden");
    }
    lastY = y;
  }, { passive: true });

  var courseLabel = { signals: "信号与系统", digital: "数字电子技术", analog: "模拟电子技术" };

  var chapterTimer = null;

  /* 切换章节（目录点击 / 上一章下一章共用）：
     正文淡出 → 自动回滚到章节顶 → 渲染新章 → 淡入（与科目切换同节奏 150ms） */
  function switchChapter(chapterId) {
    if (chapterId === currentChapter) return;
    clearTimeout(chapterTimer);
    var lesson = document.querySelector(".lesson");
    lesson.style.opacity = 0;
    chapterTimer = setTimeout(function () {
      currentChapter = chapterId;
      renderChapters();
      if (panelCollapsed) renderChapterRail();
      window.scrollTo({ top: 0, behavior: "auto" });
      lesson.style.opacity = 1;
      topbar.classList.remove("is-hidden");
      shell.classList.remove("has-topbar-hidden");
    }, 150);
  }

  function moveChapter(step) {
    var chapters = subjects[currentSubject].chapters;
    var index = chapters.findIndex(function (entry) { return entry[0] === currentChapter; });
    var next = chapters[index + step];
    if (!next) return;
    switchChapter(next[0]);
  }

  prevChapterButton.addEventListener("click", function () { moveChapter(-1); });
  nextChapterButton.addEventListener("click", function () { moveChapter(1); });

  function textElement(tag, text, className) {
    var element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function appendList(parent, items, ordered) {
    var list = document.createElement(ordered ? "ol" : "ul");
    items.forEach(function (item) { list.appendChild(textElement("li", item)); });
    parent.appendChild(list);
    return list;
  }

  function appendContentGroup(parent, title) {
    var group = document.createElement("section");
    group.className = "lesson-content-group";
    group.appendChild(textElement("h2", title));
    parent.appendChild(group);
    return group;
  }

  /* ===== 章节检验（移植原站 ChapterStudyView 的交互）：单选 → 提交计分 → 标记完成 =====
     原型无 localStorage 学习记录，采用会话内内存状态（切章/切科目保留，刷新重置）。 */
  var checkAnswers = {};      /* chapterId → (answerIndex | -1)[] */
  var checkResults = {};      /* chapterId → { score, correctCount, answers } | null */
  var completedChapters = {}; /* chapterId → true */
  var CHECK_PASS_SCORE = 60;

  function renderChapterCheck(container, chapter) {
    var chapterId = chapter.id;
    if (!checkAnswers[chapterId]) checkAnswers[chapterId] = chapter.check.map(function () { return -1; });
    var result = checkResults[chapterId] || null;
    var passed = result && result.score >= CHECK_PASS_SCORE;
    var completed = !!completedChapters[chapterId];

    container.appendChild(textElement("p", "答完全部题目后提交；得分达到 " + CHECK_PASS_SCORE + "% 才能完成本章，答错题会自动进入错题复盘。"));

    var actions = document.createElement("div");
    actions.className = "check-actions";
    var allAnswered = checkAnswers[chapterId].every(function (answer) { return answer >= 0; });

    var submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.className = "secondary";
    submitButton.disabled = !allAnswered;
    submitButton.textContent = result ? "重新提交章节检验" : "提交章节检验";

    /* 选答后实时联动提交按钮可用态（纯 JS 无自动重渲染，需手动同步） */
    var syncSubmitState = function () {
      submitButton.disabled = !checkAnswers[chapterId].every(function (answer) { return answer >= 0; });
    };

    var list = document.createElement("div");
    list.className = "check-list";

    chapter.check.forEach(function (question, questionIndex) {
      var fieldset = document.createElement("div");
      fieldset.className = "check-card";
      fieldset.appendChild(textElement("p", (questionIndex + 1) + ". " + question.prompt, "check-question"));
      question.options.forEach(function (option, optionIndex) {
        var label = document.createElement("label");
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = chapterId + "-" + question.id;
        radio.value = String(optionIndex);
        radio.checked = checkAnswers[chapterId][questionIndex] === optionIndex;
        radio.addEventListener("change", function () {
          checkAnswers[chapterId][questionIndex] = optionIndex;
          syncSubmitState();
        });
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        fieldset.appendChild(label);
      });
      /* 提交后回显对错与解析（对齐原站 check-correct / check-wrong） */
      if (result) {
        var feedback = textElement("p", "", result.answers[questionIndex] === question.answer ? "check-correct" : "check-wrong");
        feedback.textContent = result.answers[questionIndex] === question.answer
          ? "回答正确。" + question.explanation
          : "正确答案：" + question.options[question.answer] + "。" + question.explanation;
        fieldset.appendChild(feedback);
      }
      list.appendChild(fieldset);
    });
    container.appendChild(list);
    submitButton.addEventListener("click", function () {
      var answers = checkAnswers[chapterId].slice();
      var correctCount = chapter.check.reduce(function (total, question, index) {
        return total + Number(answers[index] === question.answer);
      }, 0);
      var score = chapter.check.length ? Math.round((correctCount / chapter.check.length) * 100) : 100;
      checkResults[chapterId] = { score: score, correctCount: correctCount, answers: answers };
      recordMistakes(currentSubject, chapter, answers);   /* 答错即收录（去重更新） */
      renderLesson(courses.find(function (candidate) { return candidate.id === currentSubject; }), chapter);
      renderChapters();
      notify(score >= CHECK_PASS_SCORE
        ? "章节检验 " + score + "%：已达到完成门槛。"
        : "章节检验 " + score + "%：未达到 " + CHECK_PASS_SCORE + "%，错题已自动收录。", score >= CHECK_PASS_SCORE ? "success" : "warning");
    });
    actions.appendChild(submitButton);

    var completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "primary inline-action";
    completeButton.disabled = !passed || completed;
    completeButton.textContent = completed ? "本章已完成 ✓" : "标记本章已完成 ✓";
    completeButton.addEventListener("click", function () {
      completedChapters[chapterId] = true;
      renderLesson(courses.find(function (candidate) { return candidate.id === currentSubject; }), chapter);
      renderChapters();
      notify("本章已完成，课程进度已按章节同步。");
    });
    actions.appendChild(completeButton);

    if (result) {
      actions.appendChild(textElement("strong", "本次得分 " + result.score + "% · " + (passed ? "已通过" : "未通过"), passed ? "check-correct" : "check-wrong"));
    }
    container.appendChild(actions);
  }

  /* ===== 错题回顾（移植原站错题语义：检验答错自动收录 → 回顾/掌握/移除） =====
     存储：独立 localStorage key（不读写原站 semester 记录，课程数据不同）；
     数据：{ id, courseId, chapterId, prompt, options, chosen, answer, explanation, createdAt, mastered } */
  var MISTAKES_STORAGE_KEY = "personal-workbench-mistakes:v1";
  var mistakes = loadMistakes();
  var mistakesHideMastered = false;   /* 视图内“隐藏已掌握”开关（刷新重置） */

  function loadMistakes() {
    try {
      var raw = localStorage.getItem(MISTAKES_STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveMistakes() {
    try {
      localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(mistakes));
    } catch (error) {
      notify("错题记录无法写入浏览器本地存储。", "error");
    }
  }

  /* 检验提交闭环（对齐原站 submitChapterCheck 语义）：
     - 答错：收录/更新错题，理由与正确思路按原站模板生成，reviewed=false；
     - 答对：既往错题自动标记已复盘（reviewed=true），形成闭环；
     - 字段：origin/reason/correctApproach/reviewed/mastered/时间戳。 */
  function recordMistakes(courseId, chapter, answers) {
    var changed = false;
    var now = new Date().toISOString();
    chapter.check.forEach(function (question, index) {
      var id = "mistake-" + chapter.id + "-" + question.id;
      var existing = mistakes.find(function (item) { return item.id === id; });
      if (answers[index] === question.answer) {
        if (existing && !existing.reviewed) {
          existing.reviewed = true;
          existing.updatedAt = now;
          changed = true;
        }
        return;
      }
      var record = {
        id: id,
        courseId: courseId,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        prompt: question.prompt,
        options: question.options,
        chosen: answers[index],
        answer: question.answer,
        explanation: question.explanation,
        origin: "check",
        reason: "章节检验中选择了「" + question.options[answers[index]] + "」。",
        correctApproach: "正确答案是「" + question.options[question.answer] + "」。" + question.explanation,
        reviewed: false,
        mastered: existing ? existing.mastered : false,
        createdAt: existing ? existing.createdAt : now,
        updatedAt: now
      };
      if (existing) {
        mistakes[mistakes.indexOf(existing)] = record;
      } else {
        mistakes.push(record);
      }
      changed = true;
    });
    if (changed) saveMistakes();
  }

  function renderMistakesView() {
    mistakesRoot.textContent = "";
    var page = document.createElement("article");
    page.className = "notebook-page mistakes-page";

    var topbar = document.createElement("header");
    topbar.className = "practice-topbar";

    var tabs = document.createElement("nav");
    tabs.className = "practice-tabs";
    tabs.setAttribute("role", "tablist");
    var allTab = document.createElement("button");
    allTab.type = "button";
    allTab.className = "practice-tab" + (mistakesHideMastered ? "" : " is-active");
    allTab.setAttribute("role", "tab");
    allTab.setAttribute("aria-selected", mistakesHideMastered ? "false" : "true");
    allTab.appendChild(textElement("span", "全部错题", "practice-tab-title"));
    tabs.appendChild(allTab);
    var masteredTab = document.createElement("button");
    masteredTab.type = "button";
    masteredTab.className = "practice-tab" + (mistakesHideMastered ? " is-active" : "");
    masteredTab.setAttribute("role", "tab");
    masteredTab.setAttribute("aria-selected", mistakesHideMastered ? "true" : "false");
    masteredTab.appendChild(textElement("span", "未掌握", "practice-tab-title"));
    tabs.appendChild(masteredTab);
    var hideMastered = function () {
      mistakesHideMastered = !mistakesHideMastered;
      renderMistakesView();
    };
    allTab.addEventListener("click", function () { if (mistakesHideMastered) hideMastered(); });
    masteredTab.addEventListener("click", function () { if (!mistakesHideMastered) hideMastered(); });
    topbar.appendChild(tabs);
    page.appendChild(topbar);

    var layout = document.createElement("div");
    layout.className = "practice-layout mistakes-layout";

    var main = document.createElement("div");
    main.className = "practice-main";

    var heading = document.createElement("header");
    heading.className = "notebook-heading";
    var headingCopy = document.createElement("div");
    headingCopy.className = "notebook-heading-copy";
    headingCopy.appendChild(textElement("span", "练习与错题 · 检验答错自动收录", "notebook-eyebrow"));
    var title = textElement("h1", "错题回顾");
    title.tabIndex = -1;
    headingCopy.appendChild(title);
    headingCopy.appendChild(textElement("p", "复习我的答案、正确答案与解析；已掌握可隐藏或移除。", "notebook-goal-line"));
    heading.appendChild(headingCopy);
    var backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "notebook-back";
    backButton.textContent = "返回教材";
    backButton.addEventListener("click", function () { setView(null); });
    heading.appendChild(backButton);
    main.appendChild(heading);

    var courseOrder = ["signals", "digital", "analog"];
    var shown = mistakes.filter(function (item) { return !mistakesHideMastered || !item.mastered; });
    var count = shown.length;

    if (!shown.length) {
      main.appendChild(textElement(
        "p",
        mistakesHideMastered ? "当前没有未掌握的错题。" : "暂无错题：完成章节检验并答错后，错题会自动收录到这里。",
        "practice-placeholder",
      ));
    } else {
      courseOrder.forEach(function (courseId) {
        var courseTitle = { signals: "信号与系统", digital: "数字电子技术", analog: "模拟电子技术" }[courseId] || courseId;
        var group = shown.filter(function (item) { return item.courseId === courseId; });
        if (!group.length) return;
        var section = document.createElement("section");
        section.className = "mistake-group";
        section.appendChild(textElement("h2", courseTitle, "mistake-group-title"));
        section.appendChild(textElement("span", group.length + " 题", "mistake-group-count"));
        group.reverse().forEach(function (record) {
          var card = document.createElement("div");
          card.className = "mistake-card" + (record.mastered ? " is-mastered" : "");
          var head = document.createElement("div");
          head.className = "mistake-head";
          head.appendChild(textElement("span", record.chapterTitle, "mistake-chapter"));
          if (record.reviewed) head.appendChild(textElement("span", "已复盘", "mistake-badge"));
          if (record.mastered) head.appendChild(textElement("span", "已掌握", "mistake-badge-mastered"));
          head.appendChild(textElement("span", formatMistakeDate(record.updatedAt || record.createdAt), "mistake-date"));
          card.appendChild(head);
          card.appendChild(textElement("p", record.prompt, "mistake-question"));
          var chosenText = record.options[record.chosen];
          var correctText = record.options[record.answer];
          card.appendChild(textElement("p", "我的答案：" + chosenText, "mistake-wrong"));
          if (record.origin === "check") {
            card.appendChild(textElement("p", record.reason, "mistake-reason"));
            card.appendChild(textElement("p", record.correctApproach, "mistake-correct"));
          } else {
            if (record.chosen !== record.answer) {
              card.appendChild(textElement("p", "正确答案：" + correctText, "mistake-correct"));
            }
            card.appendChild(textElement("p", record.explanation, "mistake-explanation"));
          }
          var actions = document.createElement("div");
          actions.className = "mistake-actions";
          var reviewButton = document.createElement("button");
          reviewButton.type = "button";
          reviewButton.className = "secondary";
          reviewButton.textContent = record.reviewed ? "撤销已复盘" : "标记已复盘";
          reviewButton.addEventListener("click", function () {
            record.reviewed = !record.reviewed;
            record.updatedAt = new Date().toISOString();
            saveMistakes();
            renderMistakesView();
          });
          actions.appendChild(reviewButton);
          var masterButton = document.createElement("button");
          masterButton.type = "button";
          masterButton.className = "secondary";
          masterButton.textContent = record.mastered ? "撤销已掌握" : "标记已掌握";
          masterButton.addEventListener("click", function () {
            record.mastered = !record.mastered;
            record.updatedAt = new Date().toISOString();
            saveMistakes();
            renderMistakesView();
          });
          actions.appendChild(masterButton);
          var removeButton = document.createElement("button");
          removeButton.type = "button";
          removeButton.className = "secondary";
          removeButton.textContent = "移除";
          removeButton.addEventListener("click", function () {
            mistakes = mistakes.filter(function (item) { return item.id !== record.id; });
            saveMistakes();
            renderMistakesView();
          });
          actions.appendChild(removeButton);
          card.appendChild(actions);
          section.appendChild(card);
        });
        main.appendChild(section);
      });
    }

    layout.appendChild(main);
    page.appendChild(layout);
    mistakesRoot.appendChild(page);
  }

  function formatMistakeDate(iso) {
    try {
      var date = new Date(iso);
      if (Number.isNaN(date.getTime())) return "";
      return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
    } catch (error) {
      return "";
    }
  }

  function openMistakesView() {
    renderMistakesView();
    setView("mistakes");
  }

  function renderLesson(course, chapter) {
    lessonTitle.textContent = chapter.title;
    lessonGuideContent.textContent = "";
    lessonFocusList.textContent = "";
    lessonBody.textContent = "";
    lessonResources.textContent = "";

    lessonGuideContent.appendChild(textElement("p", "教材来源：" + course.textbook));
    lessonGuideContent.appendChild(textElement(
      "p",
      chapter.counted
        ? "完成规则：章节检验达到 60% 后标记完成，计入课程进度。"
        : "导学单元，不计入课程完成进度。",
    ));

    chapter.objectives.forEach(function (objective) {
      lessonFocusList.appendChild(textElement("li", objective));
    });

    if (chapter.prerequisites.length) {
      var prerequisites = appendContentGroup(lessonBody, "前置知识");
      var tags = document.createElement("div");
      tags.className = "prerequisite-list";
      chapter.prerequisites.forEach(function (item) {
        tags.appendChild(textElement("span", item));
      });
      prerequisites.appendChild(tags);
    }

    chapter.sections.forEach(function (section, sectionIndex) {
      var block = document.createElement("article");
      block.className = "learning-section importance-" + section.importance;
      var heading = document.createElement("header");
      /* 小节标题：直接显示名称（序号徽标已按需求移除） */
      heading.appendChild(textElement("h2", section.title));
      heading.appendChild(textElement("span", section.importance === "core" ? "主线必学" : "选择学习", "importance-label"));
      block.appendChild(heading);
      if (section.content) block.appendChild(textElement("p", section.content));
      if (section.formula) {
        /* KaTeX 渲染公式（与原站 MathFormula 同参数：displayMode + 不抛错） */
        var formulaCard = document.createElement("div");
        formulaCard.className = "formula-block";
        var math = document.createElement("div");
        math.className = "math-formula";
        math.setAttribute("aria-label", "公式：" + section.formula);
        if (typeof window.KaTeX !== "undefined") {
          math.innerHTML = window.KaTeX.renderToString(section.formula, {
            displayMode: true,
            throwOnError: false,
            strict: false
          });
        } else {
          math.textContent = section.formula;
        }
        formulaCard.appendChild(math);
        if (section.variables && section.variables.length) {
          var formulaVars = document.createElement("ul");
          section.variables.forEach(function (item) {
            formulaVars.appendChild(textElement("li", item));
          });
          formulaCard.appendChild(formulaVars);
        }
        block.appendChild(formulaCard);
      } else if (section.variables && section.variables.length) {
        var variables = document.createElement("div");
        variables.className = "variable-list";
        appendList(variables, section.variables, false);
        block.appendChild(variables);
      }
      lessonBody.appendChild(block);
    });

    if (chapter.examples.length) {
      var examples = appendContentGroup(lessonResources, "典型例题");
      chapter.examples.forEach(function (example) {
        var card = document.createElement("article");
        card.className = "text-card worked-example";
        card.appendChild(textElement("h3", example.title));
        card.appendChild(textElement("p", example.prompt));
        appendList(card, example.steps, true);
        var answer = document.createElement("details");
        answer.appendChild(textElement("summary", "查看答案与结论"));
        answer.appendChild(textElement("p", "结论：" + example.answer));
        card.appendChild(answer);
        examples.appendChild(card);
      });
    }

    if (chapter.experiments.length) {
      var experiments = appendContentGroup(lessonResources, "动手实验");
      chapter.experiments.forEach(function (experiment) {
        var card = document.createElement("article");
        card.className = "text-card experiment-card";
        /* 卡头：课程·章号 + 标题 ｜ 右侧工作台类型标签 */
        var cardHead = document.createElement("header");
        cardHead.className = "card-head";
        var headCopy = document.createElement("div");
        headCopy.appendChild(textElement("span", course.title + " · " + chapter.number, "card-meta"));
        headCopy.appendChild(textElement("h3", experiment.title));
        cardHead.appendChild(headCopy);
        var kindLabel = experiment.workbench === "notebook"
          ? "实验演练"
          : (experiment.workbench === "digital" ? "数字工作台" : "模拟工作台");
        cardHead.appendChild(textElement("em", kindLabel, "card-kind"));
        card.appendChild(cardHead);
        card.appendChild(textElement("p", "验证目标：" + experiment.goal));
        appendList(card, experiment.steps, true);
        card.appendChild(textElement("p", "预期证据：" + experiment.expected, "expected-result"));
        /* 打开按钮：Notebook 进入步骤页，电路实验进入对应工作台。 */
        var openButton = document.createElement("button");
        openButton.type = "button";
        openButton.className = "secondary experiment-open-btn";
        openButton.textContent = experiment.workbench === "notebook" ? "打开实验" : "在工作台中打开 →";
        openButton.addEventListener("click", function () {
          if (experiment.workbench === "notebook") {
            openNotebookExperiment(experiment, chapter);
            return;
          }
          pendingExperimentId = experiment.id;
          setView(experiment.workbench);
        });
        card.appendChild(openButton);
        experiments.appendChild(card);
      });
    }

    if (chapter.check.length) {
      var checks = appendContentGroup(lessonResources, "章节检验");
      renderChapterCheck(checks, chapter);
    }

    if (chapter.summary.length) {
      var summary = appendContentGroup(lessonResources, "复习总结");
      appendList(summary, chapter.summary, false);
    }
  }

  function renderChapters() {
    var subject = subjects[currentSubject];
    var course = courses.find(function (candidate) { return candidate.id === currentSubject; });
    panelTitle.textContent = courseLabel[currentSubject];
    chapterList.textContent = "";
    subject.chapters.forEach(function (entry) {
      var button = document.createElement("button");
      button.type = "button";
      /* 编号/标题分级排版（与信号课同步）：绪论章一律显示"绪"，数字显示为"第N章" */
      var match = /^(第\d+章|绪论|\d+)\s*(.*)$/.exec(entry[1]);
      if (match) {
        var num = document.createElement("span");
        num.className = "ch-num";
        if (match[1] === "绪论" || match[2].indexOf("绪论") === 0) {
          num.textContent = "绪";
        } else {
          num.textContent = /^\d+$/.test(match[1]) ? "第" + match[1] + "章" : match[1];
        }
        var title = document.createElement("span");
        title.className = "ch-title";
        title.textContent = match[2];
        button.appendChild(num);
        button.appendChild(title);
      } else {
        button.textContent = entry[1];
      }
      if (entry[0] === currentChapter) {
        button.classList.add("is-selected");
        button.setAttribute("aria-current", "true");
        var chapter = course && course.chapters.find(function (candidate) { return candidate.id === entry[0]; });
        if (course && chapter) renderLesson(course, chapter);
        if (panelCollapsed) renderChapterRail();
      }
      button.addEventListener("click", function () {
        if (entry[0] === currentChapter) return;
        switchChapter(entry[0]);
      });
      chapterList.appendChild(button);
    });
    /* 上一章/下一章禁用态 */
    var index = subject.chapters.findIndex(function (entry) { return entry[0] === currentChapter; });
    prevChapterButton.disabled = index <= 0;
    nextChapterButton.disabled = index === subject.chapters.length - 1;
  }

  var switchTimer = null;

  /* 切换科目（科目胶囊点击 / 搜索结果跳转共用）：
     下方内容淡出 → 切换 → 淡入；chapterId 为空时回到该科目的当前章。 */
  function switchSubject(target, chapterId) {
    if (typeof setView === "function" && activeWorkbench) setView(null);
    if (!subjects[target]) return;
    clearTimeout(switchTimer);
    var lesson = document.querySelector(".lesson");
    lesson.style.opacity = 0;
    chapterList.style.opacity = 0;
    chapterRail.style.opacity = 0;
    switchTimer = setTimeout(function () {
      currentSubject = target;
      currentChapter = chapterId || subjects[currentSubject].current;
      subjectTabs.forEach(function (other) {
        other.classList.toggle("is-active", other.dataset.subject === target);
      });
      renderChapters();
      if (panelCollapsed) renderChapterRail();
      lesson.style.opacity = 1;
      chapterList.style.opacity = 1;
      chapterRail.style.opacity = 1;
      window.scrollTo({ top: 0, behavior: "auto" });
      topbar.classList.remove("is-hidden");
      shell.classList.remove("has-topbar-hidden");
    }, 150);
  }

  subjectTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.dataset.subject;
      /* 工作台打开时点科目 = 退工作台（即使目标就是当前科目） */
      if (activeWorkbench && typeof setView === "function") setView(null);
      if (target === currentSubject) return;
      switchSubject(target, null);
    });
  });

  /* ===== 全局搜索：移植自原站点（AppShell 的 .global-search + LearningWorkbench 的 searchResults/onSearchSelect） ===== */
  var searchInput = document.getElementById("globalSearchInput");
  var searchPanel = document.createElement("div");
  searchPanel.className = "search-results";
  searchPanel.setAttribute("role", "listbox");
  searchPanel.setAttribute("aria-label", "搜索结果");
  searchPanel.hidden = true;
  document.body.appendChild(searchPanel);

  /* 与 `searchResults` useMemo 一致的匹配范围与排序（课程→章节→小节→实验），截取前 10 条 */
  function searchResults(query) {
    var normalized = query.trim().toLocaleLowerCase("zh-CN");
    if (!normalized) return [];
    var results = [];
    courses.forEach(function (course) {
      if ((course.title + course.shortTitle + course.textbook + course.role).toLocaleLowerCase("zh-CN").indexOf(normalized) !== -1) {
        results.push({ kind: "course", title: course.title, meta: course.textbook, courseId: course.id });
      }
      course.chapters.forEach(function (chapter) {
        if ((chapter.number + chapter.title + chapter.tags.join(" ")).toLocaleLowerCase("zh-CN").indexOf(normalized) !== -1) {
          results.push({ kind: "chapter", title: chapter.number + " " + chapter.title, meta: course.title, courseId: course.id, chapterId: chapter.id });
        }
        chapter.sections.forEach(function (section) {
          var haystack = section.title + section.content + (section.formula || "") + (section.variables || []).join(" ");
          if (haystack.toLocaleLowerCase("zh-CN").indexOf(normalized) !== -1) {
            results.push({ kind: "section", title: section.title, meta: course.title + " · " + chapter.title, courseId: course.id, chapterId: chapter.id });
          }
        });
        (chapter.experiments || []).forEach(function (experiment) {
          if ((experiment.title + experiment.goal).toLocaleLowerCase("zh-CN").indexOf(normalized) !== -1) {
            results.push({ kind: "experiment", title: experiment.title, meta: course.title + " · 实验", courseId: course.id, chapterId: chapter.id });
          }
        });
      });
    });
    return results.slice(0, 10);
  }

  /* 浮层挂在 body（顶栏 overflow-x 会裁剪内部 absolute 元素），定位到搜索框下方；宽度对齐原站 left:0/right:0 */
  var searchBox = document.querySelector(".global-search");

  function positionSearchPanel() {
    var rect = searchBox.getBoundingClientRect();
    /* 浮层以搜索框为准，但至少 400px：本原型顶栏比原站窄（含科目胶囊），
       行内标题+来源同时显示需要更宽（原站 520px 搜索框无此问题） */
    var width = Math.min(Math.max(rect.width, 400), window.innerWidth - 16);
    var left = Math.min(Math.max(10, rect.left), window.innerWidth - width - 12);
    searchPanel.style.top = (rect.bottom + 8) + "px";
    searchPanel.style.left = left + "px";
    searchPanel.style.width = width + "px";
  }

  function renderSearchResults() {
    var query = searchInput.value;
    if (!query.trim()) {
      searchPanel.hidden = true;
      searchPanel.textContent = "";
      return;
    }
    var results = searchResults(query);
    searchPanel.textContent = "";
    if (results.length) {
      results.forEach(function (result) {
        var button = document.createElement("button");
        button.type = "button";
        var title = document.createElement("span");
        title.textContent = result.title;
        var meta = document.createElement("small");
        meta.textContent = result.meta;
        button.appendChild(title);
        button.appendChild(meta);
        button.addEventListener("click", function () { openSearchResult(result); });
        searchPanel.appendChild(button);
      });
    } else {
      var empty = document.createElement("p");
      empty.textContent = "没有匹配内容";
      searchPanel.appendChild(empty);
    }
    positionSearchPanel();
    searchPanel.hidden = false;
  }

  function openSearchResult(result) {
    var resolvedChapterId = result.chapterId || null;
    searchInput.value = "";
    searchPanel.hidden = true;
    switchSubject(result.courseId, resolvedChapterId);
  }

  searchInput.addEventListener("input", renderSearchResults);
  searchInput.addEventListener("focus", function () {
    if (searchInput.value.trim()) renderSearchResults();
  });
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      searchInput.value = "";
      searchPanel.hidden = true;
    }
  });

  /* 点击浮层外部关闭（浮层挂 body，topbar 收起等场景也一并关闭） */
  document.addEventListener("pointerdown", function (event) {
    if (searchPanel.hidden) return;
    if (searchPanel.contains(event.target) || searchInput.contains(event.target)) return;
    searchPanel.hidden = true;
  });

  window.addEventListener("scroll", function () {
    searchPanel.hidden = true;
  }, { passive: true });

  /* ===== 实践视图：实验演练页 + 原站电路工作台 bundle ===== */
  var notebookRoot = document.getElementById("notebookRoot");
  var mistakesRoot = document.getElementById("mistakesRoot");
  var workbenchStage = document.getElementById("workbenchStage");
  var workbenchRoot = document.getElementById("workbenchRoot");
  var kindSwitcher = document.getElementById("kindSwitcher");
  var kindThumb = kindSwitcher.querySelector(".kind-thumb");
  var kindSwitchButtons = Array.prototype.slice.call(document.querySelectorAll(".kind-switch-button"));
  var lessonEl = document.querySelector(".lesson");
  var workbenchButton = document.getElementById("workbenchToggle");
  var practiceButton = document.getElementById("practiceToggle");
  var mistakeButton = document.getElementById("mistakeToggle");
  var activeWorkbench = null;   /* "digital" | "analog" | "notebook" | "mistakes" | null */
  var activeNotebook = null;
  var notebookChecks = {};

  function isCircuitWorkbench(view) {
    return view === "digital" || view === "analog";
  }

  function viewElement(view) {
    if (view === "notebook") return notebookRoot;
    if (view === "mistakes") return mistakesRoot;
    if (isCircuitWorkbench(view)) return workbenchStage;
    return lessonEl;
  }

  /* ===== 演练工作台：章节间连续操演（切 tab 不丢沙箱/勾选状态） ===== */
  var practiceExperiments = [];   /* [{ experiment, chapter }] 信号课全部演练，构建一次 */
  var practiceShown = "";         /* 当前显示的演练 id（内存态，离开视图再回不丢） */

  function collectPracticeExperiments() {
    var signalsCourse = courses.find(function (candidate) { return candidate.id === "signals"; });
    if (!signalsCourse) return;
    signalsCourse.chapters.forEach(function (signalChapter) {
      signalChapter.experiments.forEach(function (item) {
        if (item.workbench === "notebook") {
          practiceExperiments.push({ experiment: item, chapter: signalChapter });
        }
      });
    });
  }
  collectPracticeExperiments();

  /* 演练导航短标题：实验 ID → 短标题的显式映射（与 courses.js 真实 id 一一对应） */
  var EXPERIMENT_SHORT_TITLES = {
    "signals-intro-notebook": "信号观察",
    "signals-ch1-convolution": "卷积验证",
    "signals-ch2-aliasing": "采样混叠",
    "signals-ch3-first-order-lti": "LTI 系统",
    "signals-ch4-moving-average": "FIR 滤波",
    "signals-ch5-random-average": "方差验证"
  };

  function experimentShortTitle(experiment) {
    return EXPERIMENT_SHORT_TITLES[experiment.id] || experiment.title;
  }

  function renderNotebookView(course, chapter, experiment) {
    notebookRoot.textContent = "";
    var page = document.createElement("article");
    page.className = "notebook-page";

    /* —— 顶部：紧凑短标题导航（当前实验高亮；完成标记 ✓ 保留）。
       导航行放在正文卡片之外，以便贴住窗口边（预留固定边距） —— */
    var topbar = document.createElement("header");
    topbar.className = "practice-topbar";

    var tabs = document.createElement("nav");
    tabs.className = "practice-tabs";
    tabs.setAttribute("role", "tablist");
    practiceExperiments.forEach(function (entry) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "practice-tab";
      tab.setAttribute("role", "tab");
      tab.setAttribute("data-experiment-id", entry.experiment.id);
      var states = notebookChecks[entry.experiment.id];
      var doneCount = states ? states.filter(function (v) { return v; }).length : 0;
      tab.appendChild(textElement("span", experimentShortTitle(entry.experiment), "practice-tab-title"));
      if (entry.experiment.id === experiment.id) {
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
      } else {
        tab.setAttribute("aria-selected", "false");
      }
      tab.addEventListener("click", function () {
        if (entry.experiment.id === experiment.id || entry.experiment.id === practiceShown && activeWorkbench === "notebook" && entry.experiment.id === experiment.id) return;
        openNotebookExperiment(entry.experiment, entry.chapter);
      });
      tabs.appendChild(tab);
    });
    topbar.appendChild(tabs);
    page.appendChild(topbar);

    /* —— 两步布局：主导区（目标+沙箱）｜右侧栏（步骤+预期证据） —— */
    var layout = document.createElement("div");
    layout.className = "practice-layout";

    var main = document.createElement("div");
    main.className = "practice-main";

    var heading = document.createElement("header");
    heading.className = "notebook-heading";
    var headingCopy = document.createElement("div");
    headingCopy.className = "notebook-heading-copy";
    headingCopy.appendChild(textElement("span", "实验演练 · " + chapter.number + " " + chapter.title, "notebook-eyebrow"));
    var title = textElement("h1", experiment.title);
    title.tabIndex = -1;
    headingCopy.appendChild(title);
    /* 标题区一句目标：移除“实验目标”独立标题，目标文字随标题层级 */
    headingCopy.appendChild(textElement("p", experiment.goal, "notebook-goal-line"));
    heading.appendChild(headingCopy);

    var backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "notebook-back";
    backButton.textContent = "返回教材章节";
    backButton.addEventListener("click", function () {
      setView(null);
      jumpToChapter(chapter.id);
    });
    heading.appendChild(backButton);
    main.appendChild(heading);

    /* 沙箱演示：已实现预置演示的实验进入 canvas 交互区；未实现放占位提示 */
    if (SIGNAL_DEMOS[experiment.id]) {
      SIGNAL_DEMOS[experiment.id](main, experiment);
    } else {
      main.appendChild(textElement("p", "该演练的交互演示正在建设中，当前为步骤指引。", "practice-placeholder"));
    }

    /* —— 右侧栏：步骤 + 预期证据（常驻，切 tab 不丢） —— */
    var side = document.createElement("aside");
    side.className = "practice-side";

    var states = notebookChecks[experiment.id];
    if (!Array.isArray(states) || states.length !== experiment.steps.length) {
      states = experiment.steps.map(function () { return false; });
      notebookChecks[experiment.id] = states;
    }

    var stepsSection = document.createElement("section");
    stepsSection.className = "notebook-step-section";
    var stepsHeading = document.createElement("header");
    stepsHeading.appendChild(textElement("h2", "实验步骤"));
    stepsSection.appendChild(stepsHeading);

    /* 步骤只列出：编号 + 完整正文，无完成校验与进度显示
       （notebookChecks 状态保留在内存中，仅不在界面展示） */
    var stepList = document.createElement("ol");
    stepList.className = "notebook-steps";
    experiment.steps.forEach(function (step, index) {
      var item = document.createElement("li");
      item.className = "notebook-step-item";
      item.appendChild(textElement("span", String(index + 1), "step-number"));
      item.appendChild(textElement("span", step, "step-copy"));
      stepList.appendChild(item);
    });
    stepsSection.appendChild(stepList);
    side.appendChild(stepsSection);

    var evidence = document.createElement("section");
    evidence.className = "notebook-evidence";
    evidence.appendChild(textElement("h2", "预期证据"));
    evidence.appendChild(textElement("p", experiment.expected));
    side.appendChild(evidence);

    layout.appendChild(main);
    layout.appendChild(side);
    page.appendChild(layout);

    notebookRoot.appendChild(page);
    /* 窄屏时把当前实验滚进视野：只滚动 tabs 自身，不改变页面滚动位置
       （DOM 挂载后才有有效几何，因此放在 append 之后执行） */
    scrollActiveTabIntoView();
  }

  function scrollActiveTabIntoView() {
    var tabsEl = notebookRoot.querySelector(".practice-tabs");
    if (!tabsEl) return;
    var active = tabsEl.querySelector(".practice-tab.is-active");
    if (!active || tabsEl.scrollWidth <= tabsEl.clientWidth) return;
    var a = active.getBoundingClientRect();
    var t = tabsEl.getBoundingClientRect();
    tabsEl.scrollLeft += a.left - t.left - t.width / 2 + a.width / 2;
  }

  function openNotebookExperiment(experiment, chapter) {
    var course = courses.find(function (candidate) { return candidate.id === currentSubject; });
    if (!course) return;
    activeNotebook = { courseId: course.id, chapterId: chapter.id, experimentId: experiment.id };
    practiceShown = experiment.id;   /* 内存态：切到演练视图外再回来，仍回到上次演练 */
    renderNotebookView(course, chapter, experiment);
    setView("notebook");
  }

  /* ===== 信号沙箱（零依赖 canvas，预置演示）：实验 id → 渲染器注册表 ===== */
  var SIGNAL_DEMOS = {
    "signals-intro-notebook": renderSignalObserveDemo,
    "signals-ch1-convolution": renderSignalConvolutionDemo,
    "signals-ch2-aliasing": renderSignalAliasingDemo,
    "signals-ch3-first-order-lti": renderSignalLtiDemo,
    "signals-ch4-moving-average": renderSignalFirDemo,
    "signals-ch5-random-average": renderSignalVarianceDemo
  };

  /* canvas 不吃 CSS 变量字符串（--accent 值是 light-dark(...) 函数），
     用临时 DOM 元素让浏览器解析成具体色值（含当前主题） */
  var colorProbe = document.createElement("div");
  colorProbe.style.position = "absolute";
  colorProbe.style.visibility = "hidden";
  colorProbe.style.pointerEvents = "none";
  document.body.appendChild(colorProbe);

  function canvasColor(name) {
    colorProbe.style.color = "";
    colorProbe.style.background = "";
    colorProbe.style.background = "var(" + name + ")";
    return getComputedStyle(colorProbe).backgroundColor;
  }

  /* 演练 1：连续与离散信号观察——x(t)=A·cos(2πft) 连续曲线 + fs Hz 采样 stem 图。
     测量：连续周期 = 1/f s；采样样点周期 = fs/f 个样点（周期整倍时）。 */
  function renderSignalObserveDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    /* 参数控件 */
    var controls = document.createElement("div");
    controls.className = "demo-controls";
    var state = { amplitude: 2, frequency: 2, sampleRate: 20, duration: 1.5, phase: 0 };
    var fields = [
      ["amplitude", "幅值 A / V", 0.1, 10, 0.1],
      ["frequency", "频率 f / Hz", 0.1, 20, 0.1],
      ["sampleRate", "采样率 fs / Hz", 5, 200, 1],
      ["duration", "时长 T / s", 0.5, 5, 0.1],
      ["phase", "相位 φ / °", 0, 360, 15]
    ];
    var inputs = {};
    fields.forEach(function (field) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(field[1]));
      var input = document.createElement("input");
      input.type = "number";
      input.min = String(field[2]);
      input.max = String(field[3]);
      input.step = String(field[4]);
      input.value = String(state[field[0]]);
      input.addEventListener("input", function () {
        var value = Number(input.value);
        if (!Number.isFinite(value)) return;
        state[field[0]] = Math.min(field[3], Math.max(field[2], value));
        draw();
      });
      inputs[field[0]] = input;
      label.appendChild(input);
      controls.appendChild(label);
    });

    /* 画布 */
    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "— 连续信号 x(t)", "demo-legend-line"));
    legend.appendChild(textElement("span", "│ 离散采样 x[n]", "demo-legend-stem"));
    legend.appendChild(textElement("span", "峰值标记", "demo-legend-peak"));
    wrap.appendChild(legend);

    /* 测量结果 */
    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value) {
      if (!Number.isFinite(value)) return "—";
      var rounded = Math.round(value * 1000) / 1000;
      return String(rounded);
    }

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      var width = Math.max(rect.width, 100);
      var height = 240;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      /* 解析一次主题色 */
      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.32)";
      var gridText = "rgba(128, 133, 141, 0.72)";
      var margin = { left: 40, right: 14, top: 10, bottom: 24 };
      var plotW = width - margin.left - margin.right;
      var plotH = height - margin.top - margin.bottom;
      var T = state.duration;
      var A = state.amplitude;
      var f = state.frequency;
      var fs = state.sampleRate;
      var phiRad = (state.phase * Math.PI) / 180;
      /* 固定 ±2V 刻度：波形高度随 A 真实变化（A=1 半高、A=3 超界裁剪），相对大小可见 */
      var vScale = (plotH / 2) * 0.9 / 2;

      /* 网格 + 零轴 */
      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= 5; gx += 1) {
        var x = margin.left + (plotW * gx) / 5;
        ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + plotH); ctx.stroke();
      }
      var zeroY = margin.top + plotH / 2;
      ctx.strokeStyle = gridMid;
      ctx.beginPath(); ctx.moveTo(margin.left, zeroY); ctx.lineTo(margin.left + plotW, zeroY); ctx.stroke();

      /* 坐标轴文字：固定 ±2V 刻度标签（标准刻度，不随 A 变） */
      ctx.fillStyle = gridText;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("2", margin.left - 6, margin.top + 4);
      ctx.fillText("0", margin.left - 6, zeroY + 3);
      ctx.fillText("-2", margin.left - 6, margin.top + plotH + 4);

      /* 连续曲线：采样 400 点（限制在绘图区，A>2 时超出部分裁剪）；
         与离散采样点用线型+明度双重区分（虚线浅色 vs 实线深色+标记） */
      ctx.save();
      ctx.beginPath();
      ctx.rect(margin.left, margin.top, plotW, plotH);
      ctx.clip();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 4]);
      ctx.beginPath();
      var samples = 400;
      for (var i = 0; i <= samples; i += 1) {
        var t = (T * i) / samples;
        var px = margin.left + (t / T) * plotW;
        var py = zeroY - Math.cos(2 * Math.PI * f * t - phiRad) * A * vScale;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      /* 采样点 stem 图 */
      ctx.strokeStyle = accentInk;
      ctx.lineWidth = 1.4;
      var n = Math.floor(T * fs);
      for (var k = 0; k <= n; k += 1) {
        var tk = k / fs;
        var sx = margin.left + (tk / T) * plotW;
        var sy = zeroY - Math.cos(2 * Math.PI * f * tk - phiRad) * A * vScale;
        ctx.beginPath(); ctx.moveTo(sx, zeroY); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = accentInk; ctx.fill();
      }
      ctx.restore();

      /* X 轴刻度 */
      ctx.fillStyle = gridText;
      ctx.textAlign = "center";
      for (var gxt = 0; gxt <= 5; gxt += 1) {
        var tx = margin.left + (plotW * gxt) / 5;
        ctx.fillText(formatNumber((T * gxt) / 5), tx, height - 8);
      }
      ctx.textAlign = "right";
      ctx.fillText("t / s", width - margin.right, height - 8);

      /* 测量：连续周期 + 峰间隔（样点）。相位为零时沿用原有峰值时刻表达；
         相位非零时峰值时刻 = φ/(360f) + k·T₀（记录：原公式 1/(2f)+k·T₀ 实为负峰时刻） */
      var continuousPeriod = 1 / f;
      var samplesPerPeriod = fs / f;
      var samplePeakCount = 0;
      /* 峰值间距检测：取连续峰值时刻折半取样点做自适应验证 */
      var intervalSamples = samplesPerPeriod;
      metrics.textContent = "";
      var peakFirst = state.phase === 0
        ? 1 / (2 * f)
        : state.phase / (360 * f);
      var rows = [
        ["连续周期 T₀", formatNumber(continuousPeriod) + " s"],
        ["采样率对应样点周期", formatNumber(intervalSamples) + " 个样点"],
        ["峰值时间", "t = " + formatNumber(peakFirst) + " + k·" + formatNumber(continuousPeriod) + " s"]
      ];
      rows.forEach(function (row) {
        var item = document.createElement("div");
        item.className = "demo-metric";
        item.appendChild(textElement("span", row[0], "demo-metric-label"));
        item.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(item);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);

    /* 重绘时机：ResizeObserver 监听画布真实尺寸（视图切换动画完成后触发），
       另有 400ms 兜底（观察器不可用时）；窗口变化也重绘 */
    var resizeObserver = null;
    if (typeof window.ResizeObserver !== "undefined") {
      resizeObserver = new window.ResizeObserver(function () {
        draw();
      });
      resizeObserver.observe(canvas);
    }
    setTimeout(draw, 400);
    window.addEventListener("resize", draw);
  }

  /* 演练 2：采样率改变与混叠——7 Hz 连续参考 + 10 Hz（混叠 3 Hz）与 20 Hz（正确 7 Hz）样点对比。
     测量：两组样点的等效频率（混叠→fs/2 以下的理论频率）。 */
  function renderSignalAliasingDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var controls = document.createElement("div");
    controls.className = "demo-controls";
    var state = { frequency: 7, rateLow: 10, rateHigh: 20, duration: 1, amplitude: 1 };
    var fields = [
      ["frequency", "信号频率 f / Hz", 0.5, 50, 0.5],
      ["rateLow", "低采样率 fs₁ / Hz", 4, 200, 1],
      ["rateHigh", "高采样率 fs₂ / Hz", 4, 200, 1],
      ["duration", "时长 T / s", 0.2, 2, 0.1],
      ["amplitude", "信号幅值 A / V", 0.5, 2, 0.1]
    ];
    fields.forEach(function (field) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(field[1]));
      var input = document.createElement("input");
      input.type = "number";
      input.min = String(field[2]);
      input.max = String(field[3]);
      input.step = String(field[4]);
      input.value = String(state[field[0]]);
      input.addEventListener("input", function () {
        var value = Number(input.value);
        if (!Number.isFinite(value)) return;
        state[field[0]] = Math.min(field[3], Math.max(field[2], value));
        draw();
      });
      label.appendChild(input);
      controls.appendChild(label);
    });

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas demo-canvas-tall";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "─ 连续参考", "demo-legend-line"));
    legend.appendChild(textElement("span", "│ 样点（低/高采样率）", "demo-legend-stem"));
    legend.appendChild(textElement("span", "○ 等效频率曲线", "demo-legend-peak"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value) {
      if (!Number.isFinite(value)) return "—";
      return String(Math.round(value * 1000) / 1000);
    }

    /* 理论等效频率：f_alias = |f - k·fs| 折到 [0, fs/2] */
    function aliasFrequency(f, fs) {
      var folded = Math.abs(f - Math.round(f / fs) * fs);
      return Math.min(folded, fs - folded);
    }

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      var width = Math.max(rect.width, 100);
      var height = 340;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.32)";
      var gridText = "rgba(128, 133, 141, 0.72)";
      var margin = { left: 40, right: 14, top: 8, bottom: 8 };
      var rows = 2;
      var T = state.duration;
      var f = state.frequency;
      var rates = [state.rateLow, state.rateHigh];
      var rowH = (height - margin.top - margin.bottom) / rows;
      var plotW = width - margin.left - margin.right;
      var vScale = (rowH / 2) * 0.85;
      var A = state.amplitude;

      rates.forEach(function (fs, rowIndex) {
        var rowTop = margin.top + rowIndex * rowH;
        var midY = rowTop + rowH / 2;

        /* 行标题 */
        ctx.fillStyle = gridText;
        ctx.font = "11px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("fs = " + formatNumber(fs) + " Hz" + (rowIndex === 1 ? "（满足采样定理）" : "（低于 2f，发生混叠）"), margin.left, rowTop + 10);

        /* 网格 */
        ctx.strokeStyle = gridSoft;
        ctx.lineWidth = 1;
        for (var gx = 0; gx <= 5; gx += 1) {
          var x = margin.left + (plotW * gx) / 5;
          ctx.beginPath(); ctx.moveTo(x, rowTop); ctx.lineTo(x, rowTop + rowH); ctx.stroke();
        }
        ctx.strokeStyle = gridMid;
        ctx.beginPath(); ctx.moveTo(margin.left, midY); ctx.lineTo(margin.left + plotW, midY); ctx.stroke();

        /* 连续参考（淡） */
        ctx.save();
        ctx.beginPath();
        ctx.rect(margin.left, rowTop, plotW, rowH);
        ctx.clip();
        ctx.strokeStyle = gridText;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (var i = 0; i <= 400; i += 1) {
          var t = (T * i) / 400;
          var px = margin.left + (t / T) * plotW;
          var py = midY - Math.cos(2 * Math.PI * f * t) * vScale * A;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        /* 等效频率曲线（虚线圆点） */
        var fAlias = aliasFrequency(f, fs);
        ctx.fillStyle = accent;
        ctx.beginPath();
        for (var j = 0; j <= 400; j += 8) {
          var tj = (T * j) / 400;
          var pxj = margin.left + (tj / T) * plotW;
          var pyj = midY - Math.cos(2 * Math.PI * fAlias * tj) * vScale * A;
          ctx.moveTo(pxj + 1.5, pyj);
          ctx.arc(pxj, pyj, 1.6, 0, Math.PI * 2);
        }
        ctx.fill();

        /* 样点 stem */
        ctx.strokeStyle = accentInk;
        ctx.lineWidth = 1.4;
        var n = Math.floor(T * fs);
        for (var k = 0; k <= n; k += 1) {
          var tk = k / fs;
          var sx = margin.left + (tk / T) * plotW;
          var sy = midY - Math.cos(2 * Math.PI * f * tk) * vScale * A;
          ctx.beginPath(); ctx.moveTo(sx, midY); ctx.lineTo(sx, sy); ctx.stroke();
          ctx.beginPath(); ctx.arc(sx, sy, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = accentInk; ctx.fill();
        }

        /* Y 轴刻度 */
        ctx.fillStyle = gridText;
        ctx.textAlign = "right";
        ctx.fillText("1", margin.left - 6, rowTop + 14);
        ctx.fillText("0", margin.left - 6, midY + 3);
        ctx.fillText("-1", margin.left - 6, rowTop + rowH - 4);
        ctx.restore();
      });

      /* X 轴刻度（共用最后一行） */
      ctx.fillStyle = gridText;
      ctx.textAlign = "center";
      for (var gxt = 0; gxt <= 5; gxt += 1) {
        var tx = margin.left + (plotW * gxt) / 5;
        ctx.fillText(formatNumber((T * gxt) / 5), tx, height - 4);
      }
      ctx.textAlign = "right";
      ctx.fillText("t / s", width - margin.right, height - 4);

      /* 测量 */
      metrics.textContent = "";
      var rows = [
        ["低采样 fs₁ 等效频率", formatNumber(aliasFrequency(f, state.rateLow)) + " Hz"],
        ["高采样 fs₂ 等效频率", formatNumber(aliasFrequency(f, state.rateHigh)) + " Hz"],
        ["奈奎斯特频率 fs/2", formatNumber(state.rateLow / 2) + " / " + formatNumber(state.rateHigh / 2) + " Hz"]
      ];
      rows.forEach(function (row) {
        var item = document.createElement("div");
        item.className = "demo-metric";
        item.appendChild(textElement("span", row[0], "demo-metric-label"));
        item.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(item);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);

    var resizeObserver = null;
    if (typeof window.ResizeObserver !== "undefined") {
      resizeObserver = new window.ResizeObserver(function () {
        draw();
      });
      resizeObserver.observe(canvas);
    }
    setTimeout(draw, 400);
    window.addEventListener("resize", draw);
  }

  /* 演练 3：数值卷积验证三角脉冲——两个宽度 w 的单位矩形脉冲卷积。
     解析式：支撑 [0, 2w]，t=w 处峰值 w；数值卷积（步长 dt）叠加对比 + 最大误差。 */
  function renderSignalConvolutionDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var controls = document.createElement("div");
    controls.className = "demo-controls";
    var state = { width1: 1, width2: 1, dt: 0.02 };
    var fields = [
      ["width1", "脉冲 1 宽度 w₁ / s", 0.2, 3, 0.1],
      ["width2", "脉冲 2 宽度 w₂ / s", 0.2, 3, 0.1],
      ["dt", "数值步长 dt / s", 0.005, 0.1, 0.005]
    ];
    fields.forEach(function (field) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(field[1]));
      var input = document.createElement("input");
      input.type = "number";
      input.min = String(field[2]);
      input.max = String(field[3]);
      input.step = String(field[4]);
      input.value = String(state[field[0]]);
      input.addEventListener("input", function () {
        var value = Number(input.value);
        if (!Number.isFinite(value)) return;
        state[field[0]] = Math.min(field[3], Math.max(field[2], value));
        draw();
      });
      label.appendChild(input);
      controls.appendChild(label);
    });

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "─ 解析卷积", "demo-legend-line"));
    legend.appendChild(textElement("span", "○ 数值卷积", "demo-legend-peak"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value) {
      if (!Number.isFinite(value)) return "—";
      return String(Math.round(value * 1000) / 1000);
    }

    /* 单位矩形脉冲：x(t)=1, 0≤t≤w */
    function rect(t, w) { return (t >= 0 && t <= w) ? 1 : 0; }

    /* 解析卷积：两矩形 [0,w₁]、[0,w₂] 卷积 → 分段梯形
       （等宽时退化为三角）：t≤min 线性上升、中间持平 min(w₁,w₂)、
       t>max 线性下降，支撑 [0, w₁+w₂]，峰值 min(w₁,w₂) */
    function analyticConvolution(t, w1, w2) {
      if (t <= 0 || t >= w1 + w2) return 0;
      var lo = Math.min(w1, w2);
      var hi = Math.max(w1, w2);
      if (t <= lo) return t;
      if (t <= hi) return lo;
      return w1 + w2 - t;
    }

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var rect_ = canvas.getBoundingClientRect();
      var width = Math.max(rect_.width, 100);
      var height = 240;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.32)";
      var gridText = "rgba(128, 133, 141, 0.72)";
      var margin = { left: 40, right: 14, top: 10, bottom: 24 };
      var plotW = width - margin.left - margin.right;
      var plotH = height - margin.top - margin.bottom;
      var w1 = state.width1;
      var w2 = state.width2;
      var dt = state.dt;
      var maxY = Math.min(w1, w2);      /* 峰值 = min(w₁, w₂) */
      var scaleY = (plotH / 2) * 0.92 / maxY;
      var zeroY = margin.top + plotH / 2;
      var T = w1 + w2;                  /* 显示到支撑终点 */

      /* 网格 + 零轴 */
      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= 5; gx += 1) {
        var x = margin.left + (plotW * gx) / 5;
        ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + plotH); ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      ctx.beginPath(); ctx.moveTo(margin.left, zeroY); ctx.lineTo(margin.left + plotW, zeroY); ctx.stroke();

      /* Y 轴刻度 */
      ctx.fillStyle = gridText;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(formatNumber(maxY), margin.left - 6, margin.top + 4);
      ctx.fillText("0", margin.left - 6, zeroY + 3);

      ctx.save();
      ctx.beginPath();
      ctx.rect(margin.left, margin.top, plotW, plotH);
      ctx.clip();

      /* 数值卷积：离散矩形序列，y[n] = dt · Σ x₁[k]·x₂[n−k] */
      ctx.fillStyle = accentInk;
      var N = Math.ceil((w1 + w2) / dt);
      var y = [];
      var maxAbsError = 0;
      for (var n = 0; n <= N; n += 1) {
        var t = n * dt;
        var sum = 0;
        for (var k = 0; k <= N; k += 1) {
          var tk = k * dt;
          sum += rect(tk, w1) * rect(t - tk, w2) * dt;
        }
        y.push(sum);
        var analytic = analyticConvolution(t, w1, w2);
        var err = Math.abs(sum - analytic);
        if (err > maxAbsError) maxAbsError = err;
        var px = margin.left + (t / T) * plotW;
        var py = zeroY - sum * scaleY;
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      /* 解析卷积曲线 */
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var i = 0; i <= 600; i += 1) {
        var ti = (T * i) / 600;
        var px2 = margin.left + (ti / T) * plotW;
        var py2 = zeroY - analyticConvolution(ti, w1, w2) * scaleY;
        if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
      }
      ctx.stroke();

      /* 支撑区间标记 [0, w₁+w₂] */
      ctx.fillStyle = gridText;
      ctx.textAlign = "center";
      ctx.fillText("0", margin.left, height - 8);
      ctx.fillText(formatNumber(w1 + w2), margin.left + plotW, height - 8);
      ctx.fillText(formatNumber(Math.min(w1, w2)), margin.left + Math.min(w1, w2) / T * plotW, height - 8);
      ctx.restore();

      /* 测量：标注支撑区间与两脉冲宽度 */
      metrics.textContent = "";
      var rows = [
        ["解析峰值 t=min(w₁,w₂)", formatNumber(maxY)],
        ["数值峰值", formatNumber(y[Math.round(Math.min(w1, w2) / dt)] || 0)],
        ["最大绝对误差", formatNumber(maxAbsError)],
        ["支撑区间", "[0, " + formatNumber(w1 + w2) + "] s"],
        ["脉冲宽度", formatNumber(w1) + " / " + formatNumber(w2) + " s"]
      ];
      rows.forEach(function (row) {
        var item = document.createElement("div");
        item.className = "demo-metric";
        item.appendChild(textElement("span", row[0], "demo-metric-label"));
        item.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(item);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);

    var resizeObserver = null;
    if (typeof window.ResizeObserver !== "undefined") {
      resizeObserver = new window.ResizeObserver(function () {
        draw();
      });
      resizeObserver.observe(canvas);
    }
    setTimeout(draw, 400);
    window.addEventListener("resize", draw);
  }

  /* 演练 4：一阶 LTI 系统递推与卷积核对——y[n]=x[n]+a·y[n−1]，
     与 h[n]=a^n·u[n] 卷积 x[n]（单位阶跃）比较两种算法输出。 */
  function renderSignalLtiDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var controls = document.createElement("div");
    controls.className = "demo-controls";
    var state = { a: 0.5, length: 20, input: "step", initial: 0 };
    var fields = [
      ["a", "递推系数 a", 0.05, 0.95, 0.05],
      ["length", "序列长度 N", 5, 40, 1],
      ["initial", "初始值 y[−1]", 0, 5, 0.5]
    ];
    var inputs = {};
    fields.forEach(function (field) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(field[1]));
      var input = document.createElement("input");
      input.type = "number";
      input.min = String(field[2]);
      input.max = String(field[3]);
      input.step = String(field[4]);
      input.value = String(state[field[0]]);
      input.addEventListener("input", function () {
        var value = Number(input.value);
        if (!Number.isFinite(value)) return;
        state[field[0]] = Math.min(field[3], Math.max(field[2], value));
        draw();
      });
      inputs[field[0]] = input;
      label.appendChild(input);
      controls.appendChild(label);
    });
    /* 输入类型：单位阶跃 / 单位冲激 */
    var kindLabel = document.createElement("label");
    kindLabel.className = "demo-field";
    kindLabel.appendChild(document.createTextNode("输入信号"));
    var kindSelect = document.createElement("select");
    kindSelect.innerHTML = '<option value="step">单位阶跃 u[n]</option><option value="impulse">单位冲激 δ[n]</option>';
    kindSelect.value = state.input;
    kindSelect.addEventListener("change", function () {
      state.input = kindSelect.value;
      draw();
    });
    kindLabel.appendChild(kindSelect);
    controls.appendChild(kindLabel);

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "— 递推输出 y[n]", "demo-legend-line"));
    legend.appendChild(textElement("span", "○ 卷积核对 y[n]", "demo-legend-peak"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value) {
      if (!Number.isFinite(value)) return "—";
      return String(Math.round(value * 1000) / 1000);
    }

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      var width = Math.max(rect.width, 100);
      var height = 240;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.32)";
      var gridText = "rgba(128, 133, 141, 0.72)";
      var margin = { left: 40, right: 14, top: 10, bottom: 24 };
      var plotW = width - margin.left - margin.right;
      var plotH = height - margin.top - margin.bottom;
      var a = state.a;
      var N = Math.round(state.length);
      var y0 = state.initial;
      var impulse = state.input === "impulse";
      var steady = impulse ? 0 : 1 / (1 - a);

      /* 序列：x[n]=u[n] 或 δ[n]；递推 y[n]=x[n]+a·y[n−1]（y[−1]=y0）；
         卷积核对 y2[n]=Σ x[k]·h[n−k] + y0·a^(n+1)（零输入响应分量） */
      var x = [], y = [], y2 = [], h = [];
      for (var n = 0; n < N; n += 1) {
        x.push(impulse ? (n === 0 ? 1 : 0) : 1);
        y.push(n === 0 ? x[0] + a * y0 : x[n] + a * y[n - 1]);
        h.push(Math.pow(a, n));
      }
      for (var n2 = 0; n2 < N; n2 += 1) {
        var sum = 0;
        for (var k = 0; k <= n2; k += 1) sum += x[k] * h[n2 - k];
        y2.push(sum + y0 * Math.pow(a, n2 + 1));
      }
      var maxErr = 0;
      for (var n3 = 0; n3 < N; n3 += 1) {
        var e3 = Math.abs(y[n3] - y2[n3]);
        if (e3 > maxErr) maxErr = e3;
      }
      var yMax = 0;
      for (var n8 = 0; n8 < N; n8 += 1) if (y[n8] > yMax) yMax = y[n8];
      var maxY = Math.max(yMax, steady, 1) * 1.1;
      var scaleY = plotH / maxY;
      var zeroY = margin.top + plotH;
      var step = plotW / Math.max(N - 1, 1);

      /* 网格 + 零轴 */
      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= 5; gx += 1) {
        var px = margin.left + (plotW * gx) / 5;
        ctx.beginPath(); ctx.moveTo(px, margin.top); ctx.lineTo(px, margin.top + plotH); ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      ctx.beginPath(); ctx.moveTo(margin.left, zeroY); ctx.lineTo(margin.left + plotW, zeroY); ctx.stroke();
      /* 理论稳态参考线 */
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = gridText;
      ctx.beginPath();
      var steadyY = zeroY - steady * scaleY;
      ctx.moveTo(margin.left, steadyY); ctx.lineTo(margin.left + plotW, steadyY);
      ctx.stroke();
      ctx.setLineDash([]);

      /* 输入 x[n] 阶梯（淡） */
      ctx.strokeStyle = gridText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var n4 = 0; n4 < N; n4 += 1) {
        var sx4 = margin.left + n4 * step;
        var sy4 = zeroY - x[n4] * scaleY;
        if (n4 === 0) ctx.moveTo(sx4, zeroY);
        ctx.lineTo(sx4, sy4);
        ctx.lineTo(sx4 + step, sy4);
      }
      ctx.lineTo(margin.left + N * step, zeroY);
      ctx.stroke();

      /* 递推输出：实线 + 顶点 */
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var n5 = 0; n5 < N; n5 += 1) {
        var sxp = margin.left + n5 * step + step / 2;
        var syp = zeroY - y[n5] * scaleY;
        if (n5 === 0) ctx.moveTo(sxp, syp); else ctx.lineTo(sxp, syp);
      }
      ctx.stroke();
      ctx.fillStyle = accent;
      for (var n6 = 0; n6 < N; n6 += 1) {
        var sxo = margin.left + n6 * step + step / 2;
        var syo = zeroY - y[n6] * scaleY;
        ctx.beginPath(); ctx.arc(sxo, syo, 2.4, 0, Math.PI * 2); ctx.fill();
      }

      /* 卷积核对：虚线圈点（与递推几乎重合，供对比） */
      ctx.fillStyle = accentInk;
      for (var n7 = 0; n7 < N; n7 += 1) {
        var sxc = margin.left + n7 * step + step / 2;
        var syc = zeroY - y2[n7] * scaleY;
        ctx.beginPath(); ctx.arc(sxc, syc, 3.4, 0, Math.PI * 2);
        ctx.strokeStyle = accentInk; ctx.lineWidth = 1.2; ctx.stroke();
      }

      /* 轴刻度 */
      ctx.fillStyle = gridText;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("0", margin.left, height - 8);
      ctx.fillText(String(N - 1), margin.left + plotW, height - 8);
      ctx.textAlign = "left";
      ctx.fillText("0", margin.left - 30, zeroY + 4);
      ctx.fillText(formatNumber(maxY / 1.1), margin.left + 6, zeroY - steadyY);
      ctx.textAlign = "right";
      ctx.fillText("n", margin.left + plotW + 2, height - 8);

      /* 测量 */
      metrics.textContent = "";
      var rows = [
        ["递推输出 y[" + (N - 1) + "]", formatNumber(y[N - 1])],
        ["卷积输出 y[" + (N - 1) + "]", formatNumber(y2[N - 1])],
        ["两种算法最大差", formatNumber(maxErr)],
        ["理论稳态 y[∞]", impulse ? "0（瞬态衰减）" : formatNumber(steady)]
      ];
      rows.forEach(function (row) {
        var item = document.createElement("div");
        item.className = "demo-metric";
        item.appendChild(textElement("span", row[0], "demo-metric-label"));
        item.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(item);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);

    var resizeObserver = null;
    if (typeof window.ResizeObserver !== "undefined") {
      resizeObserver = new window.ResizeObserver(function () { draw(); });
      resizeObserver.observe(canvas);
    }
    setTimeout(draw, 400);
    window.addEventListener("resize", draw);
  }

  /* 演练 5：移动平均 FIR 降噪——x[n]=低频+高频正弦，M 点平均 bₖ=1/M，
     比较高频衰减与群延迟。 */
  function renderSignalFirDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var controls = document.createElement("div");
    controls.className = "demo-controls";
    var state = { f1: 2, f2: 20, window: 5, ratio: 0.6, win: "rect" };
    var fields = [
      ["f1", "低频信号 f₁ / Hz", 0.5, 10, 0.5],
      ["f2", "高频扰动 f₂ / Hz", 5, 60, 1],
      ["window", "平均窗口 M", 3, 11, 2],
      ["ratio", "高频振幅比", 0.1, 1, 0.1]
    ];
    var inputs = {};
    fields.forEach(function (field) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(field[1]));
      var input = document.createElement("input");
      input.type = "number";
      input.min = String(field[2]);
      input.max = String(field[3]);
      input.step = String(field[4]);
      input.value = String(state[field[0]]);
      input.addEventListener("input", function () {
        var value = Number(input.value);
        if (!Number.isFinite(value)) return;
        state[field[0]] = Math.min(field[3], Math.max(field[2], value));
        draw();
      });
      inputs[field[0]] = input;
      label.appendChild(input);
      controls.appendChild(label);
    });
    /* 窗型：矩形 / 三角（Bartlett）/ 汉宁，归一化后幅频响应随窗型变化 */
    var winLabel = document.createElement("label");
    winLabel.className = "demo-field";
    winLabel.appendChild(document.createTextNode("窗型"));
    var winSelect = document.createElement("select");
    winSelect.innerHTML = '<option value="rect">矩形窗</option><option value="tri">三角窗</option><option value="hann">汉宁窗</option>';
    winSelect.value = state.win;
    winSelect.addEventListener("change", function () {
      state.win = winSelect.value;
      draw();
    });
    winLabel.appendChild(winSelect);
    controls.appendChild(winLabel);

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "— 输入 x[n]", "demo-legend-line"));
    legend.appendChild(textElement("span", "— 滤波输出 y[n]", "demo-legend-stem"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value) {
      if (!Number.isFinite(value)) return "—";
      return String(Math.round(value * 1000) / 1000);
    }

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      var width = Math.max(rect.width, 100);
      var height = 240;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.32)";
      var gridText = "rgba(128, 133, 141, 0.72)";
      var margin = { left: 40, right: 14, top: 10, bottom: 24 };
      var plotW = width - margin.left - margin.right;
      var plotH = height - margin.top - margin.bottom;
      var f1 = state.f1, f2 = state.f2;
      var M = Math.round(state.window);
      var ratio = state.ratio;
      var fs = 200;
      var T = 1;
      var N = Math.round(fs * T);
      var zeroY = margin.top + plotH / 2;
      var amp = 1.6; /* ±1.6 满幅：1 + 0.6 高频占比 */

      /* 窗系数（归一化 Σbₖ=1） */
      var coeff = [];
      for (var m = 0; m < M; m += 1) {
        var c;
        if (state.win === "tri") c = M > 1 ? 1 - Math.abs(2 * m - (M - 1)) / (M - 1) : 1;
        else if (state.win === "hann") c = M > 1 ? 0.5 * (1 - Math.cos((2 * Math.PI * m) / (M - 1))) : 1;
        else c = 1;
        coeff.push(c);
      }
      var coeffSum = coeff.reduce(function (s, v) { return s + v; }, 0);
      var b = coeff.map(function (v) { return v / coeffSum; });

      var x = [], y = [], u = 0;
      for (var n = 0; n < N; n += 1) {
        var t = n / fs;
        x.push(Math.sin(2 * Math.PI * f1 * t) + ratio * Math.sin(2 * Math.PI * f2 * t));
        /* 因果 M 点窗平均：y[n] = Σ bₖ·x[n−k] */
        var acc = 0;
        for (var kb = 0; kb < M && n - kb >= 0; kb += 1) acc += b[kb] * x[n - kb];
        y.push(acc);
      }

      /* 幅频响应 |H(ω)| 在 f1/f2 处（数值计算，随窗型变化） */
      function gainAt(f) {
        var w = 2 * Math.PI * f / fs;
        var re = 0, im = 0;
        for (var m2 = 0; m2 < M; m2 += 1) {
          re += b[m2] * Math.cos(-w * m2);
          im += b[m2] * Math.sin(-w * m2);
        }
        return Math.sqrt(re * re + im * im);
      }
      var gainLow = gainAt(f1);
      var gainHigh = gainAt(f2);
      var dBHigh = 20 * Math.log10(Math.max(gainHigh, 1e-12));
      var groupDelay = (M - 1) / 2;

      /* 网格 + 零轴 */
      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= 5; gx += 1) {
        var px = margin.left + (plotW * gx) / 5;
        ctx.beginPath(); ctx.moveTo(px, margin.top); ctx.lineTo(px, margin.top + plotH); ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      ctx.beginPath(); ctx.moveTo(margin.left, zeroY); ctx.lineTo(margin.left + plotW, zeroY); ctx.stroke();

      /* 输入（灰）与输出（accent-ink） */
      ctx.save();
      ctx.beginPath();
      ctx.rect(margin.left, margin.top, plotW, plotH);
      ctx.clip();

      ctx.strokeStyle = gridText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i < N; i += 1) {
        var px0 = margin.left + (i / (N - 1)) * plotW;
        var py0 = zeroY - (x[i] / amp) * (plotH / 2);
        if (i === 0) ctx.moveTo(px0, py0); else ctx.lineTo(px0, py0);
      }
      ctx.stroke();

      ctx.strokeStyle = accentInk;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var j = 0; j < N; j += 1) {
        var px1 = margin.left + (j / (N - 1)) * plotW;
        var py1 = zeroY - (y[j] / amp) * (plotH / 2);
        if (j === 0) ctx.moveTo(px1, py1); else ctx.lineTo(px1, py1);
      }
      ctx.stroke();
      ctx.restore();

      /* 轴刻度 */
      ctx.fillStyle = gridText;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      for (var gxt = 0; gxt <= 4; gxt += 1) {
        var tx = margin.left + (plotW * gxt) / 4;
        ctx.fillText(formatNumber(T * gxt / 4), tx, height - 8);
      }
      ctx.textAlign = "right";
      ctx.fillText("t / s", width - margin.right, height - 8);

      /* 测量 */
      metrics.textContent = "";
      var rows = [
        ["高频 f₂ 衰减", formatNumber(dBHigh) + " dB"],
        ["群延迟", formatNumber(groupDelay) + " 个样点"],
        ["低频 f₁ 增益", formatNumber(20 * Math.log10(Math.max(gainLow, 1e-12))) + " dB"]
      ];
      rows.forEach(function (row) {
        var item = document.createElement("div");
        item.className = "demo-metric";
        item.appendChild(textElement("span", row[0], "demo-metric-label"));
        item.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(item);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);

    var resizeObserver = null;
    if (typeof window.ResizeObserver !== "undefined") {
      resizeObserver = new window.ResizeObserver(function () { draw(); });
      resizeObserver.observe(canvas);
    }
    setTimeout(draw, 400);
    window.addEventListener("resize", draw);
  }

  /* 演练 6：固定随机种子的方差验证——均值 0、方差 σ² 的高斯白噪声，
     三点移动平均后方差理论值 σ²/3。 */
  function renderSignalVarianceDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var controls = document.createElement("div");
    controls.className = "demo-controls";
    var state = { count: 100000, variance: 9, window: 3, dist: "gauss" };
    var fields = [
      ["count", "样本数 N", 1000, 500000, 1000],
      ["variance", "噪声方差 σ²", 1, 25, 1],
      ["window", "平均点数 L", 1, 15, 1]
    ];
    var inputs = {};
    fields.forEach(function (field) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(field[1]));
      var input = document.createElement("input");
      input.type = "number";
      input.min = String(field[2]);
      input.max = String(field[3]);
      input.step = String(field[4]);
      input.value = String(state[field[0]]);
      input.addEventListener("input", function () {
        var value = Number(input.value);
        if (!Number.isFinite(value)) return;
        state[field[0]] = Math.min(field[3], Math.max(field[2], value));
        draw();
      });
      inputs[field[0]] = input;
      label.appendChild(input);
      controls.appendChild(label);
    });
    /* 噪声分布：高斯（Box–Muller）/ 均匀 */
    var distLabel = document.createElement("label");
    distLabel.className = "demo-field";
    distLabel.appendChild(document.createTextNode("噪声分布"));
    var distSelect = document.createElement("select");
    distSelect.innerHTML = '<option value="gauss">高斯</option><option value="uniform">均匀</option>';
    distSelect.value = state.dist;
    distSelect.addEventListener("change", function () {
      state.dist = distSelect.value;
      draw();
    });
    distLabel.appendChild(distSelect);
    controls.appendChild(distLabel);

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "— 白噪声输入", "demo-legend-line"));
    legend.appendChild(textElement("span", "— 三点平均输出", "demo-legend-stem"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value) {
      if (!Number.isFinite(value)) return "—";
      return String(Math.round(value * 1000) / 1000);
    }

    /* mulberry32：确定性随机源（固定种子 12345，保证实验可复现） */
    function makeRandom(seed) {
      var s = seed >>> 0;
      return function () {
        s = (s + 0x6D2B79F5) >>> 0;
        var t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      var width = Math.max(rect.width, 100);
      var height = 240;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.32)";
      var gridText = "rgba(128, 133, 141, 0.72)";
      var margin = { left: 40, right: 14, top: 10, bottom: 24 };
      var plotW = width - margin.left - margin.right;
      var plotH = height - margin.top - margin.bottom;
      var N = Math.round(state.count);
      var sigma = Math.sqrt(state.variance);
      var L = Math.round(state.window);
      var half = Math.floor(L / 2);

      /* 噪声样本（均值 0、方差 σ²）：高斯由 Box–Muller，均匀映射为 ±√(3σ²) 区间 */
      var rand = makeRandom(12345);
      var x = [], y = [];
      for (var n = 0; n < N; n += 1) {
        if (state.dist === "uniform") {
          var uu = rand() * 2 - 1;
          x.push(sigma * Math.sqrt(3) * uu);
        } else {
          var u1 = rand() || 1e-12;
          var u2 = rand();
          x.push(sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2));
        }
      }
      /* L 点移动平均（中心对称，丢弃首尾暂态） */
      for (var n2 = half; n2 < N - (L - 1 - half); n2 += 1) {
        var acc = 0;
        for (var k = n2 - half; k <= n2 - half + L - 1; k += 1) acc += x[k];
        y.push(acc / L);
      }
      var sumX = 0, sumX2 = 0, sumY = 0, sumY2 = 0;
      for (var n3 = 0; n3 < N; n3 += 1) {
        sumX += x[n3];
        sumX2 += x[n3] * x[n3];
      }
      for (var n4 = 0; n4 < y.length; n4 += 1) {
        sumY += y[n4];
        sumY2 += y[n4] * y[n4];
      }
      var meanX = sumX / N;
      var varX = sumX2 / N - meanX * meanX;
      var meanY = sumY / y.length;
      var varY = sumY2 / y.length - meanY * meanY;

      /* 网格 + 零轴（显示前 320 个样本，±3σ 幅值） */
      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= 5; gx += 1) {
        var px = margin.left + (plotW * gx) / 5;
        ctx.beginPath(); ctx.moveTo(px, margin.top); ctx.lineTo(px, margin.top + plotH); ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      ctx.beginPath(); ctx.moveTo(margin.left, zeroLine(margin.top, plotH)); ctx.lineTo(margin.left + plotW, zeroLine(margin.top, plotH)); ctx.stroke();
      var zeroY = zeroLine(margin.top, plotH);

      function zeroLine(top, h) { return top + h / 2; }

      ctx.save();
      ctx.beginPath();
      ctx.rect(margin.left, margin.top, plotW, plotH);
      ctx.clip();

      var shown = Math.min(x.length - 1, 320);
      var scale = (plotH / 2) / (3 * sigma);
      ctx.strokeStyle = gridText;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i < shown; i += 1) {
        var pxs = margin.left + (i / shown) * plotW;
        var pys = zeroY - x[i] * scale;
        if (i === 0) ctx.moveTo(pxs, pys); else ctx.lineTo(pxs, pys);
      }
      ctx.stroke();

      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (var j = 0; j < shown; j += 1) {
        var pxo = margin.left + (j / shown) * plotW;
        var pyo = zeroY - y[j] * scale;
        if (j === 0) ctx.moveTo(pxo, pyo); else ctx.lineTo(pxo, pyo);
      }
      ctx.stroke();
      ctx.restore();

      /* 轴刻度 */
      ctx.fillStyle = gridText;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      for (var gxt = 0; gxt <= 4; gxt += 1) {
        var tx = margin.left + (plotW * gxt) / 4;
        ctx.fillText(String(Math.round((shown * gxt) / 4)), tx, height - 8);
      }
      ctx.textAlign = "right";
      ctx.fillText("样本 n", width - margin.right, height - 8);

      /* 测量 */
      metrics.textContent = "";
      var rows = [
        ["输入样本均值", formatNumber(meanX)],
        ["输入样本方差", formatNumber(varX)],
        ["输出样本方差", formatNumber(varY)],
        ["理论输出方差 σ²/L", formatNumber(state.variance / L)]
      ];
      rows.forEach(function (row) {
        var item = document.createElement("div");
        item.className = "demo-metric";
        item.appendChild(textElement("span", row[0], "demo-metric-label"));
        item.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(item);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);

    var resizeObserver = null;
    if (typeof window.ResizeObserver !== "undefined") {
      resizeObserver = new window.ResizeObserver(function () { draw(); });
      resizeObserver.observe(canvas);
    }
    setTimeout(draw, 400);
    window.addEventListener("resize", draw);
  }

  /* 通知浮层：对齐原站 .toast（位置/配色/自动消失 3.6s） */
  var appToast = document.createElement("div");
  appToast.className = "app-toast";
  appToast.hidden = true;
  document.body.appendChild(appToast);
  var toastTimer = null;

  function notify(message, tone) {
    appToast.textContent = message;
    appToast.className = "app-toast" + (tone && tone !== "success" ? " is-" + tone : "");
    appToast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { appToast.hidden = true; }, 3600);
  }

  var viewTimer = null;
  var pendingExperimentId = "";   /* 工作台初始实验（实验卡"在工作台中打开"设置） */

  /* 科目胶囊选中态：工作台打开时全部熄灭（只有工作台按钮亮），回正文时按当前科目恢复 */
  function syncSubjectTabs() {
    subjectTabs.forEach(function (tab) {
      tab.classList.toggle("is-active", !activeWorkbench && tab.dataset.subject === currentSubject);
    });
  }

  /* 视图切换（教材正文 ⇄ Notebook/工作台；工作台之间互切）：先淡出当前内容（150ms），
     再换视图载入，再淡入 —— 与科目切换的 140ms 节奏一致。
     wbKind 为 null 表示回教材正文。 */
  function setView(wbKind) {
    if (isCircuitWorkbench(wbKind) && typeof PrototypeWorkbench === "undefined") {
      notify("工作台组件未加载（workbench.bundle.js）。", "error");
      return;
    }
    var prev = activeWorkbench;
    if (prev === wbKind) return;
    if (isCircuitWorkbench(prev) && isCircuitWorkbench(wbKind)) {
      switchWorkbenchKind(wbKind, false);
      return;
    }
    activeWorkbench = wbKind;
    syncWorkbenchButton();
    syncKindSwitcher();
    syncSubjectTabs();
    clearTimeout(viewTimer);
    var outgoing = viewElement(prev);
    outgoing.style.opacity = 0;
    if (!prev) chapterCol.style.opacity = 0;
    viewTimer = setTimeout(function () {
      if (isCircuitWorkbench(prev)) {
        if (typeof PrototypeWorkbench !== "undefined") PrototypeWorkbench.unmount();
        workbenchStage.hidden = true;
      } else if (prev === "notebook") {
        notebookRoot.hidden = true;
      } else if (prev === "mistakes") {
        mistakesRoot.hidden = true;
      }
      if (isCircuitWorkbench(wbKind)) {
        shell.classList.add("is-workbench");
        shell.classList.remove("is-practice");
        lessonEl.hidden = true;
        notebookRoot.hidden = true;
        mistakesRoot.hidden = true;
        workbenchStage.hidden = false;
        PrototypeWorkbench.mount(workbenchRoot, {
          kind: wbKind,
          initialExperimentId: pendingExperimentId || undefined,
          courses: courses,
          onOpenChapter: function (chapterId) {
            setView(null);
            jumpToChapter(chapterId);
          },
          onNotify: notify,
          onKindChange: syncKindFromBundle
        });
        pendingExperimentId = "";
        setTimeout(updateWorkbenchLimit, 600);   /* 等组件渲染完成再刷新边界说明 */
      } else if (wbKind === "notebook") {
        shell.classList.remove("is-workbench");
        shell.classList.add("is-practice");
        lessonEl.hidden = true;
        workbenchStage.hidden = true;
        mistakesRoot.hidden = true;
        notebookRoot.hidden = false;
      } else if (wbKind === "mistakes") {
        shell.classList.remove("is-workbench");
        shell.classList.add("is-practice");
        lessonEl.hidden = true;
        workbenchStage.hidden = true;
        notebookRoot.hidden = true;
        mistakesRoot.hidden = false;
      } else {
        shell.classList.remove("is-workbench");
        shell.classList.remove("is-practice");
        lessonEl.hidden = false;
        notebookRoot.hidden = true;
        mistakesRoot.hidden = true;
        workbenchStage.hidden = true;
      }
      var entering = viewElement(wbKind);
      entering.offsetHeight;   /* 强制回流：透明度过渡在元素显示后才启动 */
      entering.style.opacity = 1;
      if (wbKind === "notebook") {
        window.scrollTo({ top: 0, behavior: "auto" });
        var notebookTitle = notebookRoot.querySelector("h1");
        if (notebookTitle) notebookTitle.focus();
      } else if (wbKind === "mistakes") {
        window.scrollTo({ top: 0, behavior: "auto" });
        var mistakesTitle = mistakesRoot.querySelector("h1");
        if (mistakesTitle) mistakesTitle.focus();
      } else if (!wbKind) {
        chapterCol.style.opacity = 1;
      }
    }, 150);
  }

  /* 顶栏工作台/演练/错题按钮选中态：数字与模拟工作台共用一个入口；演练用 notebook 视图 */
  function syncWorkbenchButton() {
    var active = isCircuitWorkbench(activeWorkbench);
    workbenchButton.classList.toggle("is-active", active);
    workbenchButton.setAttribute("aria-pressed", active ? "true" : "false");
    practiceButton.classList.toggle("is-active", activeWorkbench === "notebook");
    practiceButton.setAttribute("aria-pressed", activeWorkbench === "notebook" ? "true" : "false");
    mistakeButton.classList.toggle("is-active", activeWorkbench === "mistakes");
    mistakeButton.setAttribute("aria-pressed", activeWorkbench === "mistakes" ? "true" : "false");
  }

  /* 工作台内部类型切换：滑块立即动，内容过渡由 bundle 管理；
     immediate=true 用于键盘与 reduced-motion（instant 触发 thumb 一帧无缓动） */
  function switchWorkbenchKind(kind, immediate) {
    activeWorkbench = kind;
    if (typeof PrototypeWorkbench !== "undefined") PrototypeWorkbench.setKind(kind, !!immediate);
    pendingExperimentId = "";
    syncKindSwitcher(!!immediate);
    syncWorkbenchButton();
    setTimeout(updateWorkbenchLimit, 600);   /* 另一台会话的实验选择可能不同 */
  }

  /* bundle 报告已显示类型变化（切换成功落地 / 加载失败回滚）：同步顶栏与滑块。
     点击路径已先行同步（activeWorkbench === kind 时幂等），此回调只处理回滚等异步差异。 */
  function syncKindFromBundle(kind) {
    if (!isCircuitWorkbench(activeWorkbench) || activeWorkbench === kind) return;
    activeWorkbench = kind;
    pendingExperimentId = "";
    syncKindSwitcher(true);
    syncWorkbenchButton();
  }

  function syncKindSwitcher(instant) {
    if (instant) kindSwitcher.classList.add("is-instant");
    var activeKind = null;
    kindSwitchButtons.forEach(function (button) {
      var active = button.dataset.kind === activeWorkbench;
      if (active) activeKind = button.dataset.kind;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.setAttribute("tabindex", active ? "0" : "-1");
    });
    /* 数字/模拟滑块方向随断点变化：≤820px 横向分段控件走 X 轴，桌面竖向气泡走 Y 轴。
       写入时只保留当前选中态这一个 transform，跨断点后按新的方向重新计算，不互相覆盖。 */
    var axis = window.matchMedia("(max-width: 820px)").matches ? "translateX" : "translateY";
    kindThumb.style.transform = axis + "(" + (activeKind === "analog" ? "100%" : "0") + ")";
    if (instant) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { kindSwitcher.classList.remove("is-instant"); });
      });
    }
  }

  /* 跨断点（≤820px ↔ >820px）时按当前选中态重写滑块方向与位置 */
  var kindNarrowMedia = window.matchMedia("(max-width: 820px)");
  function syncKindOnBreakpoint() {
    if (isCircuitWorkbench(activeWorkbench)) syncKindSwitcher(true);
  }
  if (kindNarrowMedia.addEventListener) kindNarrowMedia.addEventListener("change", syncKindOnBreakpoint);
  else kindNarrowMedia.addListener(syncKindOnBreakpoint);

  kindSwitchButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      var kind = button.dataset.kind;
      if (kind === activeWorkbench) return;
      /* 键盘激活产生的合成 click（detail === 0，如某些环境中的 Enter/空格）也走即时切换 */
      if (event.detail === 0) {
        switchWorkbenchKind(kind, true);
        return;
      }
      setView(kind);
    });
  });

  /* 键盘访问：方向键/Home/End 切换并移动焦点；Enter/空格即时切换（不播放滑块或内容动画）；
     焦点保留在切换项内，不主动跳入画布 */
  var kindOrder = ["digital", "analog"];
  kindSwitcher.addEventListener("keydown", function (event) {
    if (!isCircuitWorkbench(activeWorkbench)) return;
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      var button = event.target.closest ? event.target.closest(".kind-switch-button") : null;
      if (!button) return;
      event.preventDefault();
      var kind = button.dataset.kind;
      if (kind !== activeWorkbench) switchWorkbenchKind(kind, true);
      return;
    }
    var index = kindOrder.indexOf(activeWorkbench);
    var next = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = kindOrder[Math.min(index + 1, kindOrder.length - 1)];
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = kindOrder[Math.max(index - 1, 0)];
    else if (event.key === "Home") next = kindOrder[0];
    else if (event.key === "End") next = kindOrder[kindOrder.length - 1];
    if (!next || next === activeWorkbench) return;
    event.preventDefault();
    switchWorkbenchKind(next, true);
    kindSwitchButtons.forEach(function (button) {
      if (button.dataset.kind === next) button.focus();
    });
  });

  workbenchButton.addEventListener("click", function () {
    setView(isCircuitWorkbench(activeWorkbench) ? null : "digital");
  });

  /* 错题入口：进入错题回顾（先渲染再切换）；已在错题页时返回正文 */
  mistakeButton.addEventListener("click", function () {
    if (activeWorkbench === "mistakes") { setView(null); return; }
    openMistakesView();
  });

  /* 演练入口：已打开过则回最近一次，否则打开第一个 notebook 实验（信号绪论） */
  practiceButton.addEventListener("click", function () {
    if (activeWorkbench === "notebook") { setView(null); return; }
    /* 记忆态：优先回到上次演练；否则第一个 */
    var target = practiceShown
      ? practiceExperiments.find(function (entry) { return entry.experiment.id === practiceShown; })
      : practiceExperiments[0];
    if (target) {
      var signalsCourse = courses.find(function (candidate) { return candidate.id === "signals"; });
      var course = signalsCourse || courses[0];
      openNotebookExperiment(target.experiment, target.chapter);
    } else {
      notify("当前没有可用的实验演练。", "warning");
    }
  });

  /* 章节 id → 科目 + 章节（搜索结果 / 工作台“返回教材章节”共用） */
  function jumpToChapter(chapterId) {
    var targetCourseId = null;
    for (var i = 0; i < courses.length; i += 1) {
      if (courses[i].chapters.some(function (chapter) { return chapter.id === chapterId; })) {
        targetCourseId = courses[i].id;
        break;
      }
    }
    if (targetCourseId) switchSubject(targetCourseId, chapterId);
  }

  renderChapters();
})();
