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
  var subjectTabsNav = document.getElementById("subjectTabs");
  var subjectThumb = document.getElementById("subjectThumb");
  var viewSwitch = document.getElementById("viewSwitch");
  var viewThumb = document.getElementById("viewThumb");
  var chapterList = document.getElementById("chapterList");
  var panelTitle = document.getElementById("chapterPanelTitle");
  var lessonTitle = document.getElementById("lessonTitle");
  var lessonGuideContent = document.getElementById("lessonGuideContent");
  var lessonGuide = document.querySelector(".lesson-guide");
  var lessonFocusList = document.getElementById("lessonFocusList");
  /* 「本章重点」整块（静态节点，缓存引用后搬进正文）：全章只出现一次，跟在第一节分组条之后 */
  var lessonFocus = document.querySelector(".lesson-focus");
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
      button.dataset.chapter = entry[0];
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
  var mobileTopbar = window.matchMedia("(max-width: 760px)");
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (mobileTopbar.matches) {
      topbar.classList.remove("is-hidden");
      shell.classList.remove("has-topbar-hidden");
      lastY = y;
      return;
    }
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
  /* ===== 选中态先行 =====
     切换章节时正文要淡出 150ms，但"选中了哪一章"是导航反馈，必须立刻可见，
     否则会出现"点了没反应、过一会儿才跳"的慢一拍观感。
     这里只改选中类（不重建 DOM、不换正文），正文仍由定时器负责。 */
  function markCurrentChapter(chapterId) {
    Array.prototype.forEach.call(chapterList.querySelectorAll(".chapter-item"), function (item) {
      var isCurrent = item.dataset.chapter === chapterId;
      item.classList.toggle("is-selected", isCurrent);
      var button = item.querySelector(".chapter-button");
      if (!button) return;
      button.classList.toggle("is-selected", isCurrent);
      if (isCurrent) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    Array.prototype.forEach.call(chapterRail.querySelectorAll(".chapter-rail-item"), function (button) {
      button.classList.toggle("is-selected", button.dataset.chapter === chapterId);
    });
  }

  function switchChapter(chapterId) {
    if (chapterId === currentChapter) return;
    clearTimeout(chapterTimer);
    /* 选中态立刻落位；正文仍在 150ms 后替换 */
    currentChapter = chapterId;
    currentSectionId = null;
    markCurrentChapter(chapterId);
    markCurrentSection();
    var lesson = document.querySelector(".lesson");
    lesson.style.opacity = 0;
    chapterTimer = setTimeout(function () {
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
    /* 只解析课程作者显式写出的数学/代码标记；普通文字始终走文本节点。
       不猜测公式，不把正文当 HTML，也不解释代码里的数学标记。 */
    var source = String(text == null ? "" : text);
    var tokens = /\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]|`([^`]+)`/g;
    var cursor = 0, token;
    while ((token = tokens.exec(source))) {
      element.appendChild(document.createTextNode(source.slice(cursor, token.index)));
      var part = document.createElement(token[3] !== undefined ? "code" : "span");
      if (token[3] !== undefined) {
        part.textContent = token[3];
      } else {
        part.className = token[2] !== undefined ? "math-display" : "math-inline";
        if (window.KaTeX) {
          part.innerHTML = window.KaTeX.renderToString(token[1] || token[2], {
            displayMode: token[2] !== undefined, throwOnError: false, strict: false, trust: false
          });
        } else {
          part.textContent = token[1] || token[2];
        }
      }
      element.appendChild(part);
      cursor = tokens.lastIndex;
    }
    element.appendChild(document.createTextNode(source.slice(cursor)));
    if (className) element.className = className;
    return element;
  }

  function appendList(parent, items, ordered) {
    var list = document.createElement(ordered ? "ol" : "ul");
    items.forEach(function (item) { list.appendChild(textElement("li", item)); });
    parent.appendChild(list);
    return list;
  }

  /* 演练通用「重置」：丢掉这一份演练的内存状态后重渲染，
     控件、画布与数值卡一起回到默认值。默认值只写在各自的 state 初始化里，
     所以这里不需要再抄一份参数表。 */
  function appendResetControl(controls, experiment) {
    var group = document.createElement("div");
    group.className = "demo-field";
    group.appendChild(document.createTextNode("参数重置"));
    var row = document.createElement("div");
    row.className = "demo-button-row";
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = "↺ 重置";
    button.addEventListener("click", function () {
      delete practiceDemoStates[experiment.id];
      for (var i = 0; i < practiceExperiments.length; i += 1) {
        if (practiceExperiments[i].experiment.id === experiment.id) {
          openNotebookExperiment(practiceExperiments[i].experiment, practiceExperiments[i].chapter);
          return;
        }
      }
    });
    row.appendChild(button);
    group.appendChild(row);
    controls.appendChild(group);
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
        /* 选项也要走数学解析：直接放文本节点会把 \(...\) 显示成源码 */
        label.appendChild(textElement("span", option, "check-option"));
        fieldset.appendChild(label);
      });
      /* 提交后回显对错与解析（对齐原站 check-correct / check-wrong） */
      if (result) {
        var answeredRight = result.answers[questionIndex] === question.answer;
        /* 整条信息一次性交给 textElement：先建空节点再赋 textContent 会覆盖掉解析结果 */
        var feedbackText = answeredRight
          ? "回答正确。" + question.explanation
          : "正确答案：" + question.options[question.answer] + "。" + question.explanation;
        var feedback = textElement("p", feedbackText, answeredRight ? "check-correct" : "check-wrong");
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

  /* ===== 章节联系：把 <chapterId> / <sectionId> / <chapterId>#<sectionId> 变成可点击跳转 =====
     小节 id 自带章节前缀，因此直接写小节 id 也能解析出所属章节（跨课程同样适用）。 */
  function findChapterById(chapterId) {
    for (var i = 0; i < courses.length; i += 1) {
      for (var j = 0; j < courses[i].chapters.length; j += 1) {
        if (courses[i].chapters[j].id === chapterId) return { course: courses[i], chapter: courses[i].chapters[j] };
      }
    }
    return null;
  }

  function resolveTarget(target) {
    var parts = String(target || "").split("#");
    var head = parts[0];
    var sectionId = parts[1] || "";
    var found = findChapterById(head);
    if (!found && !sectionId) {
      for (var i = 0; i < courses.length && !found; i += 1) {
        for (var j = 0; j < courses[i].chapters.length && !found; j += 1) {
          var chapter = courses[i].chapters[j];
          if ((chapter.sections || []).some(function (item) { return item.id === head; })) {
            found = { course: courses[i], chapter: chapter };
            sectionId = head;
          }
        }
      }
    }
    return found ? { course: found.course, chapter: found.chapter, sectionId: sectionId } : null;
  }

  /* 目标显示名：小节优先，回落到章；跨课程时补上课程简称 */
  function targetLabel(target) {
    var resolved = resolveTarget(target);
    if (!resolved) return String(target || "");
    var prefix = resolved.course.id === currentSubject ? "" : resolved.course.shortTitle + " · ";
    if (resolved.sectionId) {
      var section = (resolved.chapter.sections || []).find(function (item) { return item.id === resolved.sectionId; });
      if (section) return prefix + resolved.chapter.number + " " + section.title;
    }
    return prefix + resolved.chapter.number + " " + resolved.chapter.title;
  }

  function openTarget(target) {
    var resolved = resolveTarget(target);
    if (!resolved) return;
    jumpToChapter(resolved.chapter.id);
    if (!resolved.sectionId) return;
    /* switchSubject 有 150ms 淡出，等新内容挂载后再滚到锚点 */
    setTimeout(function () { scrollToSection(resolved.sectionId); }, 320);
  }

  function linkButton(link, className) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.appendChild(textElement("strong", targetLabel(link.to)));
    button.appendChild(textElement("span", link.why));
    button.addEventListener("click", function () { openTarget(link.to); });
    return button;
  }

  function renderLesson(course, chapter) {
    lessonTitle.textContent = chapter.title;
    lessonGuideContent.textContent = "";
    lessonFocusList.textContent = "";
    lessonBody.textContent = "";
    lessonResources.textContent = "";

    /* 课程导读（教材版本、完成规则这类参考信息）只在绪论章出现一次；
       其余章节整块收起，避免每章重复同一段版本/规则说明。
       课程若没有绪论章（例如数电），由第一章承担这一次说明。 */
    var isIntro = !!chapter.intro || (course.chapters[0] && course.chapters[0].id === chapter.id);
    if (lessonGuide) lessonGuide.hidden = !isIntro;
    if (isIntro) {
      lessonGuideContent.appendChild(textElement("p", "教材来源：" + course.textbook));
      lessonGuideContent.appendChild(textElement(
        "p",
        chapter.counted
          ? "完成规则：章节检验达到 60% 后标记完成，计入课程进度。"
          : "导学单元，不计入课程完成进度。",
      ));
      lessonGuideContent.appendChild(textElement("p", "本页只给提纲、公式与自测；教材、课件与习题解析见课程资料目录。"));
    }

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

    var lastGroup = null;
    var focusPlaced = false;
    /* 有分组的章：本章重点跟在第一节分组条之后（章标题、前置知识仍留在正文之上）；
       无分组的章（数电、模电等尚未细分）：挂在正文最前。整块只出现这一次。 */
    if (!chapter.sections.some(function (item) { return !!item.group; })) {
      lessonBody.appendChild(lessonFocus);
      focusPlaced = true;
    }

    chapter.sections.forEach(function (section, sectionIndex) {
      /* 节分组条：小节带 group 时，组一变就插一条。
         数据侧保证同组小节连续且不跳回（由 tests/course-content.test.mjs 的分组守卫兜住）。 */
      if (section.group && section.group !== lastGroup) {
        lastGroup = section.group;
        var groupBar = document.createElement("section");
        groupBar.className = "lesson-group";
        groupBar.appendChild(textElement("h2", section.group));
        lessonBody.appendChild(groupBar);
        if (!focusPlaced) {
          lessonBody.appendChild(lessonFocus);
          focusPlaced = true;
        }
      }
      var block = document.createElement("article");
      block.className = "learning-section importance-" + section.importance;
      if (section.id) block.id = "section-" + section.id;   /* 章节联系跳转的锚点 */
      var heading = document.createElement("header");
      /* 小节标题：直接显示名称（序号徽标已按需求移除） */
      heading.appendChild(textElement("h2", section.title));
      /* 只给"选择学习"的小节打标；主线必学是默认状态，不再加字样（省掉每节都出现的冗余提示） */
      if (section.importance !== "core") {
        heading.appendChild(textElement("span", "选择学习", "importance-label"));
      }
      block.appendChild(heading);
      if (section.content) block.appendChild(textElement("p", section.content, "section-lead"));
      /* 展开段（关键关系 / 量级算例 / 边界条件）：内容充实规划里正文的第二段起 */
      (section.detail || []).forEach(function (paragraph) {
        block.appendChild(textElement("p", paragraph, "section-detail"));
      });
      if (section.formula) {
        /* KaTeX 渲染公式（与原站 MathFormula 同参数：displayMode + 不抛错） */
        var formulaCard = document.createElement("div");
        formulaCard.className = "formula-block";
        var math = document.createElement("div");
        math.className = "math-formula";
        math.tabIndex = 0;
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
      if (section.points && section.points.length) {
        var sectionPoints = document.createElement("div");
        sectionPoints.className = "section-points";
        sectionPoints.appendChild(textElement("p", "要点", "section-subhead"));
        appendList(sectionPoints, section.points, false);
        block.appendChild(sectionPoints);
      }
      if (section.pitfalls && section.pitfalls.length) {
        var sectionPitfalls = document.createElement("details");
        sectionPitfalls.className = "section-pitfalls";
        sectionPitfalls.appendChild(textElement("summary", "易混点（" + section.pitfalls.length + " 条）"));
        appendList(sectionPitfalls, section.pitfalls, false);
        block.appendChild(sectionPitfalls);
      }
      if (section.links && section.links.length) {
        var sectionLinks = document.createElement("div");
        sectionLinks.className = "section-links";
        sectionLinks.appendChild(textElement("span", "相关", "section-links-label"));
        section.links.forEach(function (link) {
          sectionLinks.appendChild(linkButton(link, "section-link"));
        });
        block.appendChild(sectionLinks);
      }
      lessonBody.appendChild(block);
    });

    /* 章末「章节联系」：前置 / 后续 / 跨课程 三组，条目可点击跳到目标章或目标小节 */
    if (chapter.connections && chapter.connections.length) {
      var connectionGroup = appendContentGroup(lessonBody, "章节联系");
      [
        { kind: "prereq", label: "前置" },
        { kind: "next", label: "后续" },
        { kind: "cross", label: "跨课程" }
      ].forEach(function (entry) {
        var items = chapter.connections.filter(function (item) { return item.kind === entry.kind; });
        if (!items.length) return;
        var group = document.createElement("div");
        group.className = "connection-group";
        group.appendChild(textElement("span", entry.label, "connection-kind"));
        var list = document.createElement("div");
        list.className = "connection-list";
        items.forEach(function (link) { list.appendChild(linkButton(link, "connection-item")); });
        group.appendChild(list);
        connectionGroup.appendChild(group);
      });
    }

    if (chapter.sourceRef && chapter.sourceRef.length) {
      var sourceNote = document.createElement("details");
      sourceNote.className = "source-note";
      sourceNote.appendChild(textElement("summary", "材料出处"));
      appendList(sourceNote, chapter.sourceRef, false);
      lessonBody.appendChild(sourceNote);
    }

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

  /* ===== 章节目录：一章一行 + 展开箭头（与面板收起按钮同款 .icon-toggle）；
     展开后只列该章的「节」，节以下的小节不在这里铺开 =====
     没有节划分的章（如绪论）不给展开入口。展开态互斥（手风琴），窄屏由样式隐藏入口。 */
  var expandedChapterId = null;
  /* chapterId → [{ label, sectionIds }]，渲染目录时顺手缓存，供"当前节高亮"使用 */
  var chapterPartsByChapter = {};

  /* 章 → 节：按 section.group 归并（同名的组合并成一条，数据侧保证同组连续） */
  function chapterPartsOf(course, chapterId) {
    var chapter = course && course.chapters.find(function (item) { return item.id === chapterId; });
    var parts = [];
    var byLabel = {};
    ((chapter && chapter.sections) || []).forEach(function (section) {
      if (!section.group) return;
      if (!byLabel[section.group]) {
        byLabel[section.group] = { label: section.group, sectionIds: [] };
        parts.push(byLabel[section.group]);
      }
      byLabel[section.group].sectionIds.push(section.id);
    });
    return parts;
  }

  /* 目录里不标注"第几节"，只留节名 */
  function partLabel(group) {
    return String(group).replace(/^第[一二三四五六七八九十百千\d]+节[\s　]*/, "");
  }

  function scrollToSection(sectionId) {
    var node = document.getElementById("section-" + sectionId);
    if (!node) return;
    /* 目录里点了哪一节，选中态就立刻落到哪一节——不等平滑滚动到达，
       否则高亮要等滚动结束才动，看起来就是慢一拍 */
    if (sectionId !== currentSectionId) {
      currentSectionId = sectionId;
      markCurrentSection();
    }
    lockSectionSync();
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* 点小节：先保证章已打开，再滚到小节锚点（switchChapter 有 150ms 淡出） */
  function openSection(chapterId, sectionId) {
    if (chapterId !== currentChapter) {
      switchChapter(chapterId);
      window.setTimeout(function () { scrollToSection(sectionId); }, 320);
      return;
    }
    scrollToSection(sectionId);
  }

  function syncChapterExpansion() {
    Array.prototype.forEach.call(chapterList.querySelectorAll(".chapter-item"), function (item) {
      var isOpen = item.dataset.chapter === expandedChapterId;
      item.classList.toggle("is-expanded", isOpen);
      var toggle = item.querySelector(".chapter-toggle");
      var panel = item.querySelector(".chapter-parts");
      if (toggle) {
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        toggle.setAttribute("aria-label", isOpen ? "收起本章的节" : "展开本章的节");
        toggle.setAttribute("title", isOpen ? "收起节目录" : "展开节目录");
      }
      if (panel) panel.hidden = !isOpen;
    });
  }

  function toggleChapterExpansion(chapterId) {
    expandedChapterId = expandedChapterId === chapterId ? null : chapterId;
    syncChapterExpansion();
  }

  /* ===== 「当前节」高亮：节条目跟着阅读位置点亮 ===== */
  var currentSectionId = null;
  var sectionSyncQueued = false;
  /* 程序化跳转（点目录里的节 / 点正文里的相关链接）期间挂起滚动侦测：
     选中态已经由点击那一刻定好了，滚动途中再让侦测回写会来回闪。 */
  var sectionLockUntil = 0;
  var sectionLockTimer = null;

  function lockSectionSync(duration) {
    var ms = duration || 900;
    sectionLockUntil = Date.now() + ms;
    clearTimeout(sectionLockTimer);
    sectionLockTimer = setTimeout(function () {
      sectionLockUntil = 0;
      syncCurrentSection(true);   /* 解锁后按最终滚动位置校正一次 */
    }, ms + 40);
  }

  function markCurrentSection() {
    var parts = chapterPartsByChapter[currentChapter] || [];
    var activePart = -1;
    for (var i = 0; i < parts.length; i += 1) {
      if (parts[i].sectionIds.indexOf(currentSectionId) !== -1) { activePart = i; break; }
    }
    var scope = chapterList.querySelector('.chapter-item[data-chapter="' + currentChapter + '"]') || chapterList;
    Array.prototype.forEach.call(scope.querySelectorAll(".chapter-part"), function (button) {
      var isCurrent = activePart >= 0 && Number(button.dataset.part) === activePart;
      button.classList.toggle("is-current", isCurrent);
      if (isCurrent) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  }

  function syncCurrentSection(force) {
    var lessonRoot = document.querySelector(".lesson");
    /* 工作台/演练视图下正文不在布局里：全部 rect 会是 0，必须直接清空，否则会误判成最后一节 */
    if (!lessonRoot || lessonRoot.offsetHeight === 0) {
      if (currentSectionId !== null) {
        currentSectionId = null;
        markCurrentSection();
      }
      return;
    }
    var nodes = lessonBody.querySelectorAll(".learning-section[id]");
    if (!nodes.length) return;
    var threshold = 140;   /* 吸顶栏下方的判定线 */
    var active = null;
    for (var i = 0; i < nodes.length; i += 1) {
      if (nodes[i].getBoundingClientRect().top <= threshold) active = nodes[i];
      else break;
    }
    var nextId = active ? active.id.replace(/^section-/, "") : null;
    if (!force && nextId === currentSectionId) return;
    currentSectionId = nextId;
    markCurrentSection();
    /* 目录列表自带滚动：当前节跑出可视区时轻推一下（block:nearest 只在需要时滚动） */
    var current = chapterList.querySelector('.chapter-item[data-chapter="' + currentChapter + '"] .chapter-part.is-current');
    if (current) current.scrollIntoView({ block: "nearest" });
  }

  window.addEventListener("scroll", function () {
    if (sectionSyncQueued) return;
    sectionSyncQueued = true;
    window.requestAnimationFrame(function () {
      sectionSyncQueued = false;
      if (Date.now() < sectionLockUntil) return;   /* 程序化跳转途中不回写高亮 */
      syncCurrentSection();
    });
  }, { passive: true });

  function renderChapters() {
    var subject = subjects[currentSubject];
    var course = courses.find(function (candidate) { return candidate.id === currentSubject; });
    panelTitle.textContent = courseLabel[currentSubject];
    chapterList.textContent = "";
    /* 换科目后旧的展开章可能已不存在：自愈，避免箭头状态与内容对不上 */
    if (expandedChapterId && !subject.chapters.some(function (entry) { return entry[0] === expandedChapterId; })) {
      expandedChapterId = null;
    }
    subject.chapters.forEach(function (entry) {
      var item = document.createElement("div");
      item.className = "chapter-item";
      item.dataset.chapter = entry[0];

      var parts = chapterPartsOf(course, entry[0]);
      chapterPartsByChapter[entry[0]] = parts;

      var row = document.createElement("div");
      row.className = "chapter-row";

      /* 展开箭头在胶囊左侧内部（DOM 顺序也在前，键盘 Tab 与视觉顺序一致）。
         没有节划分的章（如绪论）不给箭头：展开也没有内容可给。 */
      if (parts.length) {
        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "icon-toggle chapter-toggle";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "展开本章的节");
        toggle.setAttribute("title", "展开节目录");
        toggle.innerHTML = '<svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">'
          + '<path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        toggle.addEventListener("click", function () { toggleChapterExpansion(entry[0]); });
        row.appendChild(toggle);
      }

      var button = document.createElement("button");
      button.type = "button";
      button.className = "chapter-button";
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
        item.classList.add("is-selected");
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
      row.appendChild(button);
      item.appendChild(row);

      /* 展开面板：只列「节」，点一条跳到该节的第一个小节（节以下不在目录里铺开） */
      if (parts.length) {
        var panel = document.createElement("div");
        panel.className = "chapter-parts";
        panel.hidden = true;
        parts.forEach(function (part, partIndex) {
          var partButton = document.createElement("button");
          partButton.type = "button";
          partButton.className = "chapter-part";
          partButton.dataset.part = String(partIndex);
          partButton.textContent = partLabel(part.label);
          partButton.addEventListener("click", function () { openSection(entry[0], part.sectionIds[0]); });
          panel.appendChild(partButton);
        });
        item.appendChild(panel);
      }

      chapterList.appendChild(item);
    });
    syncChapterExpansion();
    syncCurrentSection(true);   /* 列表重建后重新点亮当前小节 */
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
        if (other.dataset.subject === target) selectSubjectTab(other);
      });
      syncSubjectThumb();
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
      /* 指示器先行：先落选中态并让滑块起步，正文 150ms 淡出后到位（避免"内容换了滑块才追"） */
      selectSubjectTab(tab);
      syncSubjectThumb();
      switchSubject(target, null);
    });
  });

  /* 选中态只在这里改，滑块与按钮状态始终同源 */
  function selectSubjectTab(tab) {
    if (!tab) return;
    subjectTabs.forEach(function (other) {
      other.classList.toggle("is-active", other === tab);
    });
  }

  /* 科目滑块：只吃 transform 与 width 两件事，位置/宽度全部现场测量。
     因此不依赖 transitionend 之类的动画事件——快速连点或中途打断时，
     下一次测量直接把滑块落到最终位置（轨迹自然接管，不需要清理）。 */
  function syncSubjectThumb(instant) {
    if (!subjectThumb) return;
    var active = null;
    for (var i = 0; i < subjectTabs.length; i += 1) {
      if (subjectTabs[i].classList.contains("is-active")) { active = subjectTabs[i]; break; }
    }
    if (!active) return;
    if (instant) subjectTabsNav.classList.add("is-instant");
    subjectThumb.style.width = active.offsetWidth + "px";
    subjectThumb.style.transform = "translateX(" + active.offsetLeft + "px)";
    if (instant) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { subjectTabsNav.classList.remove("is-instant"); });
      });
    }
  }

  /* 顶栏三个视图入口（工作台 / 演练 / 错题）的滑动指示器：
     与科目滑块同一套做法 —— 位置与尺寸现场测量，不依赖动画事件；
     三个都不选中（退回教材正文）时淡出，选中项变化时滑过去。 */
  function syncViewThumb(instant) {
    if (!viewSwitch || !viewThumb) return;
    var buttons = [workbenchButton, practiceButton, mistakeButton];
    var active = null;
    for (var i = 0; i < buttons.length; i += 1) {
      if (buttons[i] && buttons[i].classList.contains("is-active")) { active = buttons[i]; break; }
    }
    if (!active) {
      viewSwitch.classList.remove("has-active");
      return;
    }
    if (instant) viewSwitch.classList.add("is-instant");
    viewThumb.style.width = active.offsetWidth + "px";
    viewThumb.style.transform = "translateX(" + active.offsetLeft + "px)";
    viewSwitch.classList.add("has-active");
    if (instant) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { viewSwitch.classList.remove("is-instant"); });
      });
    }
  }

  /* 尺寸变化（窗口/断点/字体替换）后，各分段控件都按当前选中项重新落位：
     科目滑块、工作台切换器、视图入口共用这一条通路，不做动画，避免横着飞一段 */
  var segmentThumbRaf = 0;
  function resyncSegmentThumbs() {
    if (segmentThumbRaf) cancelAnimationFrame(segmentThumbRaf);
    segmentThumbRaf = requestAnimationFrame(function () {
      segmentThumbRaf = 0;
      syncSubjectThumb(true);
      syncViewThumb(true);
      /* 工作台未打开时切换器是隐藏的（测量值为 0），此时不落位 */
      if (typeof isCircuitWorkbench === "function" && isCircuitWorkbench(activeWorkbench)) syncKindSwitcher(true);
      /* 演练章节滑块同样按当前选中章节重新落位（未打开演练视图时为空操作）。
         放在既有各滑块之后：不改动它们原有的落位顺序。 */
      syncPracticeChapterThumb(notebookRoot.querySelector(".practice-chapters"), true);
      scheduleCanvasEmptyHint();
    });
  }
  window.addEventListener("resize", resyncSegmentThumbs);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resyncSegmentThumbs);

  /* 画布中心提示：文字内容与显示条件都跟着 bundle 的 .cw-empty-canvas 走
     （空画布时才渲染），但改用固定字号的 HTML 胶囊浮层呈现：不随缩放变小，
     底色/描边把它与网格隔离开。浮层挂在 body 上（不在 React 管理的子树里）。 */
  var canvasEmptyHint = null;
  var canvasHintRaf = 0;
  var observedCanvas = null;
  /* 画布尺寸会随面板、断点、缩放与 bundle 自身的 ResizeObserver 变化：
     盯住画布元素本身，尺寸一变就把浮层重新居中。 */
  var canvasResizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(function () { scheduleCanvasEmptyHint(); })
    : null;

  function syncCanvasEmptyHint() {
    if (!canvasEmptyHint) {
      canvasEmptyHint = document.createElement("p");
      canvasEmptyHint.className = "canvas-empty-hint";
      canvasEmptyHint.setAttribute("role", "status");
      document.body.appendChild(canvasEmptyHint);
    }
    var canvas = document.querySelector(".workbench-stage:not([hidden]) .cw-canvas");
    if (canvasResizeObserver && canvas && canvas !== observedCanvas) {
      if (observedCanvas) canvasResizeObserver.unobserve(observedCanvas);
      canvasResizeObserver.observe(canvas);
      observedCanvas = canvas;
    }
    /* bundle 只在"画布上没有元件"时才渲染 .cw-empty-canvas 这个节点，所以判断它是否存在即可；
       它自身被 CSS 隐藏（display:none），不能再拿它的 display 当条件。 */
    var source = canvas ? canvas.querySelector(".cw-empty-canvas") : null;
    if (!source) {
      canvasEmptyHint.classList.remove("is-visible");
      return;
    }
    if (canvasEmptyHint.textContent !== source.textContent) canvasEmptyHint.textContent = source.textContent;
    var rect = canvas.getBoundingClientRect();
    canvasEmptyHint.style.left = Math.round(rect.left + rect.width / 2) + "px";
    canvasEmptyHint.style.top = Math.round(rect.top + rect.height / 2) + "px";
    canvasEmptyHint.classList.add("is-visible");
  }

  /* 画布元件交互（bundle 里是"双击选中、按下即拖动"，这里补三件事）：
       · 单击 = 选中并保持：抬起时若元件没被真正移动过，就补发一次 dblclick
         （bundle 的选中入口正挂在 dblclick 上）；
       · 按下后 4px 死区：手指抖动不会挪动元件，一旦超过就立即放行 —— 拖动没有任何
         时间门槛，快速拖动同样跟手（真实 pointerdown 已让 bundle 记下锚点，
         放行后是 1:1 跟随，不会跳）；
       · 拖动期间自己判定重叠：bundle 的 ta() 在位置重叠时会做 24 单位环状搜索，
         指针每动一下环序就变，元件于是反复回弹。这里用同一套 AABB + 20 间隔判定，
         只把"不与任何元件重叠"的位置放给它（贴住时沿墙滑动，滑不动就停住），
         ta() 因此永远走 free 分支，环状搜索不再触发。
     只拦 pointermove 的传播，不 preventDefault：焦点、click、端口连线都不受影响。 */
  var DRAG_START_DISTANCE = 4;   /* 超过这个累计位移就认为用户在拖，立刻放行 */
  var CLICK_MAX_DISTANCE = 8;    /* 抬起时位移不超过这里，按"单击选中"处理 */
  var COMPONENT_GAP = 20;        /* 与 bundle 的 ch 常数一致（每个盒各外扩一半） */
  var press = null;

  function componentFromEvent(event) {
    var target = event.target;
    if (!target || typeof target.closest !== "function") return null;
    if (target.closest("[data-port]")) return null;   /* 端口的点击归 bundle（连线） */
    return target.closest(".cw-component");
  }

  function selectComponent(component) {
    component.dispatchEvent(new MouseEvent("dblclick", {
      bubbles: true,
      cancelable: true,
      view: window,
      detail: 2,
    }));
  }

  /* 元件的逻辑坐标盒：rect 的 x/y/width/height 就是 bundle 的 AABB（已含旋转后的宽高互换） */
  function componentBox(element) {
    var rect = element.querySelector(":scope > rect");
    if (!rect) return null;
    return {
      x: rect.x.baseVal.value,
      y: rect.y.baseVal.value,
      width: rect.width.baseVal.value,
      height: rect.height.baseVal.value,
    };
  }

  function toLogicalPoint(svg, clientX, clientY) {
    return new DOMPoint(clientX, clientY).matrixTransform(svg.getScreenCTM().inverse());
  }

  function toClientPoint(svg, x, y) {
    return new DOMPoint(x, y).matrixTransform(svg.getScreenCTM());
  }

  function overlapsOther(cx, cy, size, other, gap) {
    var half = gap / 2;
    var left = cx - size.width / 2 - half;
    var right = cx + size.width / 2 + half;
    var top = cy - size.height / 2 - half;
    var bottom = cy + size.height / 2 + half;
    return left < other.x + other.width + half
      && right > other.x - half
      && top < other.y + other.height + half
      && bottom > other.y - half;
  }

  function positionIsFree(state, x, y) {
    for (var i = 0; i < state.others.length; i += 1) {
      if (overlapsOther(x, y, state.size, state.others[i], COMPONENT_GAP)) return false;
    }
    return true;
  }

  /* 拖动真正开始时采集几何：元件尺寸、按下点的锚点偏移、其他元件的盒 */
  function beginDrag(state) {
    var svg = document.querySelector(".workbench-stage:not([hidden]) .cw-canvas");
    var own = state.component && componentBox(state.component);
    if (!svg || !svg.getScreenCTM || !own) return false;
    var center = { x: own.x + own.width / 2, y: own.y + own.height / 2 };
    var start = toLogicalPoint(svg, state.startX, state.startY);
    state.canvas = svg;
    state.size = { width: own.width, height: own.height };
    state.offset = { x: start.x - center.x, y: start.y - center.y };
    state.last = center;
    state.others = Array.prototype.slice
      .call(svg.querySelectorAll(".cw-component"))
      .filter(function (node) { return node !== state.component; })
      .map(componentBox)
      .filter(Boolean);
    return true;
  }

  /* 沿墙滑动：用合成 pointermove 把元件送到"保持一个轴不动"的位置（合成的只有 move，
     不会碰到 bundle 的 setPointerCapture，所以是安全的） */
  function slideTo(state, position) {
    var client = toClientPoint(state.canvas, position.x + state.offset.x, position.y + state.offset.y);
    state.applying = true;
    state.canvas.dispatchEvent(new PointerEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      pointerId: state.pointerId,
      pointerType: state.pointerType || "mouse",
      isPrimary: true,
      button: -1,
      buttons: 1,
      clientX: client.x,
      clientY: client.y,
    }));
    state.applying = false;
  }

  document.addEventListener("pointerdown", function (event) {
    if (!event.isPrimary || event.button !== 0) return;
    var component = componentFromEvent(event);
    if (!component) return;
    press = {
      component: component,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      moved: 0,
      dragging: false,
      unchecked: false,
    };
  }, true);

  document.addEventListener("pointermove", function (event) {
    if (!press || event.pointerId !== press.pointerId) return;
    if (press.applying) return;                                  /* 自己合成的滑动事件 */
    var distance = Math.abs(event.clientX - press.startX) + Math.abs(event.clientY - press.startY);
    if (distance > press.moved) press.moved = distance;
    if (!press.dragging) {
      if (press.moved <= DRAG_START_DISTANCE) { event.stopPropagation(); return; }
      press.dragging = true;
      /* 量不到几何（理论上不会）就退化为原样放行，绝不因为过滤而卡住拖动 */
      press.unchecked = !beginDrag(press);
    }
    if (press.unchecked) return;

    var pointer = toLogicalPoint(press.canvas, event.clientX, event.clientY);
    var desired = { x: pointer.x - press.offset.x, y: pointer.y - press.offset.y };
    if (positionIsFree(press, desired.x, desired.y)) {
      press.last = desired;
      return;                                                    /* 空位：照常交给 bundle */
    }
    /* 被邻居挡住：先按主要移动方向尝试沿墙滑动，滑不动就停在原地（不喂重叠位置） */
    var dx = desired.x - press.last.x;
    var dy = desired.y - press.last.y;
    var slides = Math.abs(dx) >= Math.abs(dy)
      ? [{ x: desired.x, y: press.last.y }, { x: press.last.x, y: desired.y }]
      : [{ x: press.last.x, y: desired.y }, { x: desired.x, y: press.last.y }];
    for (var i = 0; i < slides.length; i += 1) {
      if (slides[i].x === press.last.x && slides[i].y === press.last.y) continue;
      if (positionIsFree(press, slides[i].x, slides[i].y)) {
        event.stopPropagation();
        slideTo(press, slides[i]);
        press.last = slides[i];
        return;
      }
    }
    event.stopPropagation();
  }, true);

  document.addEventListener("pointerup", function (event) {
    if (!press || event.pointerId !== press.pointerId) return;
    var state = press;
    press = null;
    /* 没有真正移动过（单击，或按下后只抖了几像素）就按单击处理：选中并保持 */
    if (!state.dragging && state.moved <= CLICK_MAX_DISTANCE) selectComponent(state.component);
  }, true);

  document.addEventListener("pointercancel", function (event) {
    if (press && event.pointerId === press.pointerId) press = null;
  }, true);

  /* ===== 画布缩放与平移 =====
     滚轮：bundle 只认 Ctrl/⌘+滚轮（每次 10% 步进）。这里把普通滚轮也接过来 ——
       拦掉页面滚动，然后点它自己的"放大/缩小"按钮（走官方路径，避免被动监听器里
       preventDefault 的告警，也自动尊重缩放的上下限）。
     中键拖动：bundle 的视图矩形是以基准画布为中心的（没有平移量），所以在最外层叠加
       一个平移量：把 viewBox 与"网格矩形"一起平移。网格矩形就是可见有效区域，
       跟着一起走，画布上不会露出没有网格、点不到的空带；
       坐标换算走 getScreenCTM()，所以平移后落点/拖动依然精确。 */
  var pan = { x: 0, y: 0 };
  var panApplied = { svg: null, base: null, viewBox: null };
  var middleDrag = null;
  var wheelAccum = 0;
  var wheelStepAt = 0;
  var WHEEL_STEP_DELTA = 24;   /* 累计滚动量达到这个值走一步（兼容触控板的小 delta） */
  var WHEEL_STEP_MS = 90;

  function activeCanvas() {
    return document.querySelector(".workbench-stage:not([hidden]) .cw-canvas");
  }

  /* 把平移量叠加到 viewBox 与网格矩形上；React 重写基准后（缩放/尺寸变化）会自动重算 */
  function syncPan() {
    var svg = activeCanvas();
    if (!svg) return;
    if (panObserver && svg !== panApplied.svg) {
      if (panApplied.svg) panObserver.disconnect();
      panObserver.observe(svg, { subtree: true, attributes: true, attributeFilter: ["viewBox", "x", "y", "width", "height"] });
      panApplied.svg = svg;
      panApplied.base = null;
      panApplied.viewBox = null;
    }
    var current = svg.getAttribute("viewBox");
    if (!current) return;
    if (current !== panApplied.viewBox) panApplied.base = current.split(/\s+/).map(Number);
    var base = panApplied.base;
    if (!base || base.length !== 4) return;

    var next = (base[0] - pan.x) + " " + (base[1] - pan.y) + " " + base[2] + " " + base[3];
    if (current !== next) {
      panApplied.viewBox = next;
      svg.setAttribute("viewBox", next);
    }
    var grid = svg.querySelector('rect[fill^="url(#cw-grid"]');
    if (grid) {
      var gx = String(base[0] - pan.x);
      var gy = String(base[1] - pan.y);
      if (grid.getAttribute("x") !== gx) grid.setAttribute("x", gx);
      if (grid.getAttribute("y") !== gy) grid.setAttribute("y", gy);
    }
  }

  var panObserver = typeof MutationObserver === "function"
    ? new MutationObserver(function () { syncPan(); })
    : null;

  function unitsPerPixel(svg) {
    var box = svg.getAttribute("viewBox").split(/\s+/).map(Number);
    var width = svg.getBoundingClientRect().width;
    return width > 0 ? box[2] / width : 1;
  }

  document.addEventListener("wheel", function (event) {
    var svg = activeCanvas();
    if (!svg || !event.target || typeof svg.contains !== "function" || !svg.contains(event.target)) return;
    /* 画布上的滚轮统一由这里处理（含 Ctrl/⌘+滚轮这个旧手势）：拦下页面滚动，
       也不让 bundle 自己那条 Ctrl/⌘ 分支再插一手，缩放入口只剩这一个。 */
    event.preventDefault();
    event.stopPropagation();
    var now = Date.now();
    wheelAccum += event.deltaY;
    if (Math.abs(wheelAccum) < WHEEL_STEP_DELTA) return;
    if (now - wheelStepAt < WHEEL_STEP_MS) return;
    var zoomOut = wheelAccum > 0;
    wheelAccum = 0;
    wheelStepAt = now;
    var panel = svg.closest(".cw-canvas-panel");
    var button = panel && panel.querySelector(zoomOut ? '.cw-zoom-controls button[aria-label="缩小"]' : '.cw-zoom-controls button[aria-label="放大"]');
    if (button && !button.disabled) button.click();         /* 走 bundle 自己的缩放入口 */
  }, { capture: true, passive: false });

  document.addEventListener("pointerdown", function (event) {
    if (event.button !== 1) return;
    var svg = activeCanvas();
    if (!svg || !event.target || typeof svg.contains !== "function" || !svg.contains(event.target)) return;
    event.preventDefault();                                /* 阻止中键的自动滚动 */
    middleDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, svg: svg };
    document.body.classList.add("is-canvas-panning");
  }, true);

  document.addEventListener("pointermove", function (event) {
    if (!middleDrag || event.pointerId !== middleDrag.pointerId) return;
    event.preventDefault();
    var scale = unitsPerPixel(middleDrag.svg);
    pan.x += (event.clientX - middleDrag.x) * scale;
    pan.y += (event.clientY - middleDrag.y) * scale;
    /* 限位：最多把基准区域的边推到视图中心，避免一拖就迷失 */
    var base = panApplied.base;
    if (base && base.length === 4) {
      var maxX = base[2] / 2;
      var maxY = base[3] / 2;
      pan.x = Math.max(-maxX, Math.min(maxX, pan.x));
      pan.y = Math.max(-maxY, Math.min(maxY, pan.y));
    }
    middleDrag.x = event.clientX;
    middleDrag.y = event.clientY;
    syncPan();
  }, true);

  document.addEventListener("pointerup", function (event) {
    if (!middleDrag || event.pointerId !== middleDrag.pointerId) return;
    middleDrag = null;
    document.body.classList.remove("is-canvas-panning");
  }, true);

  /* 点"重置缩放"（100%）时把平移也归零，一键回到原点 */
  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || typeof target.closest !== "function") return;
    var button = target.closest('.cw-zoom-controls button[aria-label="重置缩放"]');
    if (!button) return;
    pan.x = 0;
    pan.y = 0;
    syncPan();
  }, true);

  /* bundle 的可访问名写的是"双击选中"，交互改了以后跟着改，避免读屏拿到过期说明 */
  function syncComponentAria() {
    var nodes = document.querySelectorAll('.workbench-stage .cw-component[aria-label*="双击选中"]');
    for (var i = 0; i < nodes.length; i += 1) {
      nodes[i].setAttribute("aria-label", nodes[i].getAttribute("aria-label").replace("双击选中", "单击选中"));
    }
  }

  /* DOM 变动/滚动/尺寸变化后按帧节流统一同步（拖拽元件时会频繁触发，避免反复量布局） */
  function scheduleCanvasEmptyHint() {
    if (canvasHintRaf) return;
    canvasHintRaf = requestAnimationFrame(function () {
      canvasHintRaf = 0;
      syncCanvasEmptyHint();
      syncComponentAria();
    });
  }

  window.addEventListener("scroll", scheduleCanvasEmptyHint, true);
  var canvasHintHost = document.getElementById("workbenchStage");
  if (canvasHintHost && typeof MutationObserver === "function") {
    new MutationObserver(scheduleCanvasEmptyHint).observe(canvasHintHost, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "class", "style"],
    });
  }

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
  /* 演练演示参数的内存态（按实验 id）：tab 切换会重建 DOM，但参数输入与计算结果保持，
     与 practiceShown 同生命周期（页面刷新清零）；仅布局/重绘不触碰它。 */
  var practiceDemoStates = {};

  /* 演练数值计算接口（计算与绘制分离）：纯函数，供 tests/practice-*.test.mjs 直接调用，
     避免测试复制产品算法自证。约定见 docs/round-2026-09-16-practice/context-notes.md D2。 */
  var practiceCalc = {
    /* 单位高度矩形：支撑内为 1，端点取半高——跳变点的标准取样约定，使梯形积分不偏向任一侧 */
    rectValue: function (t, width) {
      if (t < 0 || t > width) return 0;
      if (t === 0 || t === width) return 0.5;
      return 1;
    },
    /* 反折平移后的脉冲响应 h(t−τ)：自变量 u = t−τ */
    hValue: function (u, width) { return practiceCalc.rectValue(u, width); },
    /* 解析卷积：两矩形 [0,w₁]、[0,w₂] 的分段梯形（等宽退化为三角） */
    convolutionAnalytic: function (t, w1, w2) {
      if (!(t > 0) || !(t < w1 + w2)) return 0;
      var lo = Math.min(w1, w2);
      var hi = Math.max(w1, w2);
      if (t <= lo) return t;
      if (t <= hi) return lo;
      return w1 + w2 - t;
    },
    /* 复合梯形数值积分 y(t)=∫x(τ)h(t−τ)dτ，步长 dtau */
    convolutionNumeric: function (t, w1, w2, dtau) {
      var step = (Number.isFinite(dtau) && dtau > 0) ? dtau : 0.005;
      var from = -1;
      var to = w1 + w2 + 1;
      var n = Math.max(1, Math.ceil((to - from) / step));
      var h = (to - from) / n;
      var sum = 0;
      for (var i = 0; i <= n; i += 1) {
        var tau = from + i * h;
        var value = practiceCalc.rectValue(tau, w1) * practiceCalc.rectValue(t - tau, w2);
        sum += ((i === 0 || i === n) ? 0.5 : 1) * value;
      }
      return sum * h;
    },
    sinc: function (u) {
      if (Math.abs(u) < 1e-12) return 1;
      return Math.sin(Math.PI * u) / (Math.PI * u);
    },
    /* 折叠后观测频率：r = f_in mod fs，取 min(r, fs−r) */
    aliasObserved: function (fin, fs) {
      var r = ((fin % fs) + fs) % fs;
      return Math.min(r, fs - r);
    },
    /* 三区间状态文案（等号是临界，依赖相位） */
    aliasStatus: function (fin, fs) {
      if (fs > 2 * fin) return "满足严格条件 fs > 2f_in";
      if (fs === 2 * fin) return "临界：fs = 2f_in，依赖相位，不保证一般恢复";
      return "混叠失真：fs < 2f_in";
    },
    /* 三种重建：sinc 理想低通插值 / 零阶保持 / 线性插值；样点取 n=−32…32 */
    reconstruct: function (mode, fin, fs, t) {
      var n0 = -32;
      var n1 = 32;
      var sample = function (n) { return Math.cos(2 * Math.PI * fin * (n / fs)); };
      if (mode === "zoh") {
        var hold = Math.floor(fs * t);
        return sample(Math.min(n1, Math.max(n0, hold)));
      }
      if (mode === "linear") {
        var kf = fs * t;
        var k0 = Math.floor(kf);
        var frac = kf - k0;
        if (k0 < n0) return sample(n0);
        if (k0 >= n1) return sample(n1);
        return sample(k0) * (1 - frac) + sample(k0 + 1) * frac;
      }
      var sum = 0;
      for (var n = n0; n <= n1; n += 1) sum += sample(n) * practiceCalc.sinc(fs * t - n);
      return sum;
    },
    /* RMSE 按文档规定在 t_i = −0.5 + i/1000（i=0…1000）等权计算 */
    rmse: function (mode, fin, fs) {
      var sum = 0;
      for (var i = 0; i <= 1000; i += 1) {
        var t = -0.5 + i / 1000;
        var diff = practiceCalc.reconstruct(mode, fin, fs, t) - Math.cos(2 * Math.PI * fin * t);
        sum += diff * diff;
      }
      return Math.sqrt(sum / 1001);
    },

    /* —— 模块 5：频谱分析（观察时间 / 窗 / 补零）—— */
    analysisFs: 64,
    /* 窗：矩形恒为 1；对称 Hann w[n]=.5−.5cos(2πn/(L−1)) */
    windowValue: function (kind, n, L) {
      if (kind === "hann") return 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (L - 1));
      return 1;
    },
    /* 场景：三个零相位余弦场景；flat 供窗自身频谱复用同一归一化 */
    sceneValue: function (scene, n) {
      var w = (2 * Math.PI * n) / practiceCalc.analysisFs;
      if (scene === "single10") return Math.cos(10 * w);
      if (scene === "single10.5") return Math.cos(10.5 * w);
      if (scene === "flat") return 1;
      return Math.cos(10 * w) + Math.cos(12 * w);
    },
    /* 预计算基：窗与场景只取决于 (scene, L, win)，与频率无关。
       缓存后每个频点只剩 2 次三角函数，而不是重新求窗值与场景样点。 */
    spectrumBasis: function (scene, L, win) {
      var key = scene + "|" + L + "|" + win;
      var cached = practiceCalc.basisCache[key];
      if (cached) return cached;
      var weighted = [];
      var sumW = 0;
      for (var n = 0; n < L; n += 1) {
        var w = practiceCalc.windowValue(win, n, L);
        sumW += w;
        weighted.push(w * practiceCalc.sceneValue(scene, n));
      }
      var basis = { weighted: weighted, sumW: sumW };
      practiceCalc.basisCache[key] = basis;
      return basis;
    },
    basisCache: {},
    /* 归一化频谱 |Σ w[n]x[n]e^{−j2πfn/fs}| / Σw[n]：不单边翻倍，单位幅度单音谱峰为 0.5 */
    spectrumMagnitude: function (scene, L, win, f) {
      var fs = practiceCalc.analysisFs;
      var basis = practiceCalc.spectrumBasis(scene, L, win);
      var re = 0, im = 0;
      for (var n = 0; n < L; n += 1) {
        var phase = (-2 * Math.PI * f * n) / fs;
        re += basis.weighted[n] * Math.cos(phase);
        im += basis.weighted[n] * Math.sin(phase);
      }
      return Math.sqrt(re * re + im * im) / basis.sumW;
    },
    /* Nfft 点 DFT 的第 k 根谱线，落在 f=k·fs/Nfft；与稠密 DTFT 同一尺度（补零不改同频率的值） */
    dftMagnitude: function (scene, L, win, k, Nfft) {
      return practiceCalc.spectrumMagnitude(scene, L, win, (k * practiceCalc.analysisFs) / Nfft);
    },
    /* [f0,f1] 内以 df 采样的局部极大（相邻三点比较，端点不计） */
    localPeaks: function (scene, L, win, f0, f1, df) {
      var out = [];
      var prev = practiceCalc.spectrumMagnitude(scene, L, win, f0 - df);
      var cur = practiceCalc.spectrumMagnitude(scene, L, win, f0);
      var steps = Math.round((f1 - f0) / df);
      for (var i = 1; i <= steps; i += 1) {
        var f = f0 + i * df;
        var next = practiceCalc.spectrumMagnitude(scene, L, win, f);
        if (cur > prev && cur >= next) out.push([f - df, cur]);
        prev = cur;
        cur = next;
      }
      return out;
    },
    /* 窗自身归一化频谱：首次局部极小=主瓣边界，其后首个局部极大=第一旁瓣 */
    windowLobe: function (win, L, df) {
      var at = function (f) { return practiceCalc.spectrumMagnitude("flat", L, win, f); };
      var prev = at(0);
      var cur = at(df);
      var edge = null, side = null;
      var steps = Math.round((practiceCalc.analysisFs / 2) / df);
      for (var i = 2; i <= steps; i += 1) {
        var f = i * df;
        var next = at(f);
        if (edge === null) {
          if (cur < prev && cur <= next) edge = f - df;
        } else if (cur > prev && cur >= next) { side = f - df; break; }
        prev = cur;
        cur = next;
      }
      return { mainLobeEdge: edge, firstSidelobe: side };
    },
    windowMainLobeEdge: function (win, L, df) {
      return practiceCalc.windowLobe(win, L, df).mainLobeEdge;
    },
    /* 第一旁瓣相对 DC 的 dB（负值，越小越低） */
    windowFirstSidelobeDb: function (win, L, df) {
      var lobe = practiceCalc.windowLobe(win, L, df);
      return 20 * Math.log10(practiceCalc.spectrumMagnitude("flat", L, win, lobe.firstSidelobe));
    },

    /* —— 模块 6：循环卷积（从 0 开始的单位矩形序列）—— */
    /* 线性卷积 y[n]，长度 L=N₁+N₂−1 */
    linearConv: function (n1, n2) {
      var out = [];
      var i, j;
      for (i = 0; i < n1 + n2 - 1; i += 1) out.push(0);
      for (i = 0; i < n1; i += 1) {
        for (j = 0; j < n2; j += 1) out[i + j] += 1;
      }
      return out;
    },
    /* 循环卷积：把线性结果按 n mod N 累加 */
    circularConv: function (n1, n2, n) {
      var lin = practiceCalc.linearConv(n1, n2);
      var out = [];
      var k;
      for (k = 0; k < n; k += 1) out.push(0);
      for (k = 0; k < lin.length; k += 1) out[k % n] += lin[k];
      return out;
    },
    /* 折回样本数 max(0, L−N)：只对当前正值矩形成立 */
    foldedSamples: function (n1, n2, n) {
      return Math.max(0, n1 + n2 - 1 - n);
    },
    /* 受影响的桶数 min(N, max(0, L−N))：与折回样本数是两个不同的量 */
    affectedBins: function (n1, n2, n) {
      return Math.min(n, practiceCalc.foldedSamples(n1, n2, n));
    },
    /* 首 N 点误差 E：超出线性长度的循环值按 0 参与 */
    circError: function (n1, n2, n) {
      var lin = practiceCalc.linearConv(n1, n2);
      var circ = practiceCalc.circularConv(n1, n2, n);
      var sum = 0;
      for (var k = 0; k < n; k += 1) {
        sum += Math.abs(circ[k] - (k < lin.length ? lin[k] : 0));
      }
      return sum;
    },
    /* 把从 0 开始的单位矩形序列按模 N 折叠：x_N[k] = #{ i<N₁ : i ≡ k (mod N) } */
    foldedRect: function (length, n) {
      var out = [];
      var k, i;
      for (k = 0; k < n; k += 1) out.push(0);
      for (i = 0; i < length; i += 1) out[i % n] += 1;
      return out;
    },
    /* DFT 核对路线：两个输入都必须先按模 N 折叠，再做 N 点变换；
       不能用会截断长输入的 N 点变换（截断会得到完全不同的结果）。 */
    circularByDft: function (n1, n2, n) {
      var dft = function (seq) {
        var re = [], im = [];
        for (var k = 0; k < n; k += 1) {
          var sr = 0, si = 0;
          for (var i = 0; i < n; i += 1) {
            var phase = (-2 * Math.PI * k * i) / n;
            sr += seq[i] * Math.cos(phase);
            si += seq[i] * Math.sin(phase);
          }
          re.push(sr);
          im.push(si);
        }
        return { re: re, im: im };
      };
      var fa = dft(practiceCalc.foldedRect(n1, n));
      var fb = dft(practiceCalc.foldedRect(n2, n));
      var pr = [], pi = [];
      for (var k = 0; k < n; k += 1) {
        pr.push(fa.re[k] * fb.re[k] - fa.im[k] * fb.im[k]);
        pi.push(fa.re[k] * fb.im[k] + fa.im[k] * fb.re[k]);
      }
      var out = [];
      for (var m = 0; m < n; m += 1) {
        var sum = 0;
        for (var t = 0; t < n; t += 1) {
          var phase = (2 * Math.PI * t * m) / n;
          sum += pr[t] * Math.cos(phase) - pi[t] * Math.sin(phase);
        }
        var value = sum / n;
        out.push(Math.abs(value) < 1e-9 ? 0 : value);      /* 浮点归零阈值 1e-9 */
      }
      return out;
    },

    /* —— 模块 1：波形变换（梯形 x(τ)，y(t)=x(a·t+b)）—— */
    /* 首版只用这一个梯形：特征点 (0,0)、(1,2)、(2,2)、(3,0) */
    waveformValue: function (tau) {
      if (tau < 0 || tau > 3) return 0;
      if (tau < 1) return 2 * tau;
      if (tau <= 2) return 2;
      return 2 * (3 - tau);
    },
    waveformFeatures: [[0, 0], [1, 2], [2, 2], [3, 0]],
    /* 新时刻 t 到旧波形上取值：y(t)=x(a·t+b) */
    transformValue: function (t, a, b) { return practiceCalc.waveformValue(a * t + b); },
    /* 特征点在新轴上的位置：t=(τ−b)/a */
    transformTime: function (tau, a, b) { return (tau - b) / a; },
    /* 新支撑区间：原支撑 [0,3] 两端映射后取小/大（a<0 时顺序翻转） */
    transformSupport: function (a, b) {
      var end1 = (0 - b) / a;
      var end2 = (3 - b) / a;
      return [Math.min(end1, end2), Math.max(end1, end2)];
    },
    /* 上下轴共用的横坐标范围：同时包含原支撑 [0,3] 与新支撑 */
    viewRange: function (a, b) {
      var support = practiceCalc.transformSupport(a, b);
      return [Math.min(0, support[0]) - 0.5, Math.max(3, support[1]) + 0.5];
    },
    /* 压缩拉伸看 |a|：新支撑宽度 */
    compressionWidth: function (a) { return 3 / Math.abs(a); },
    /* 等价延迟 t₀=−b/a */
    timeShift: function (a, b) { return -b / a; },
    /* 反折只看 a 的符号 */
    reflectionState: function (a) { return a < 0 ? "已反折（a<0）" : "不反折（a>0）"; },

    /* —— 模块 3：傅里叶表示（单位高度、中心对称、脉宽 τ=1 的周期矩形）—— */
    fourierPulseWidth: 1,
    gibbsPeakValue: 1.08949,
    mseSampleCount: 4096,
    /* c_k=(τ/T)sinc(kτ/T) */
    fourierCoefficient: function (k, T) {
      var tau = practiceCalc.fourierPulseWidth;
      return (tau / T) * practiceCalc.sinc((k * tau) / T);
    },
    /* x_N(t)=c₀+2Σ(k=1…N)c_k cos(2πkt/T) */
    fourierPartialSum: function (t, T, N) {
      var sum = practiceCalc.fourierCoefficient(0, T);
      for (var k = 1; k <= N; k += 1) {
        sum += 2 * practiceCalc.fourierCoefficient(k, T) * Math.cos((2 * Math.PI * k * t) / T);
      }
      return sum;
    },
    /* 目标周期矩形：周期内以 0 为中心、|t|<τ/2 时为 1 */
    fourierTarget: function (t, T) {
      var tau = practiceCalc.fourierPulseWidth;
      var u = ((t % T) + T) % T;
      if (u > T / 2) u -= T;
      var d = Math.abs(u);
      if (d < tau / 2) return 1;
      if (d === tau / 2) return 0.5;
      return 0;
    },
    /* |k/T| ≤ fMax 的全部谱点（含零系数）；纵轴取 T·c_k，与连续包络同尺度 */
    spectrumPoints: function (T, fMax) {
      var out = [];
      var kMax = Math.ceil(fMax * T);
      for (var k = -kMax; k <= kMax; k += 1) {
        var f = k / T;
        if (Math.abs(f) > fMax + 1e-12) continue;
        out.push({ k: k, f: f, value: T * practiceCalc.fourierCoefficient(k, T) });
      }
      return out;
    },
    /* 连续包络 τ·sinc(τf) */
    envelopeValue: function (f) {
      return practiceCalc.fourierPulseWidth * practiceCalc.sinc(practiceCalc.fourierPulseWidth * f);
    },
    /* 跳变内侧局部峰值相对跳变幅度 1 的过冲百分数（细扫，只在测试与需要时调用） */
    jumpOvershootPercent: function (T, N) {
      var half = practiceCalc.fourierPulseWidth / 2;
      var steps = 20000;
      var best = -Infinity;
      for (var i = 0; i <= steps; i += 1) {
        var t = (half - 0.5) + (i / steps);
        var value = practiceCalc.fourierPartialSum(t, T, N);
        if (value > best) best = value;
      }
      return (best - 1) * 100;
    },
    /* MSE：一个周期 4096 个中点等权（返回均方根）；结果按 (T,N) 记忆，避免每次重绘重算 */
    mseCache: {},
    fourierMse: function (T, N) {
      var key = T + "|" + N;
      if (practiceCalc.mseCache[key] !== undefined) return practiceCalc.mseCache[key];
      var count = practiceCalc.mseSampleCount;
      var sum = 0;
      for (var i = 0; i < count; i += 1) {
        var t = -T / 2 + (T * (i + 0.5)) / count;
        var diff = practiceCalc.fourierPartialSum(t, T, N) - practiceCalc.fourierTarget(t, T);
        sum += diff * diff;
      }
      var value = Math.sqrt(sum / count);
      practiceCalc.mseCache[key] = value;
      return value;
    },
  };
  window.__practiceCalc = practiceCalc;
  window.__practiceState = function (id) { return practiceDemoStates[id]; };

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

  /* 演练章节分组：同一个章节的实验归到一枚大气泡里。
     顺序沿用课程顺序，不重排；每章给出一枚短标签（章节 number，如「绪论」「第1章」）。 */
  var practiceChapters = [];
  practiceExperiments.forEach(function (entry) {
    var group = null;
    for (var i = 0; i < practiceChapters.length; i += 1) {
      if (practiceChapters[i].chapter.id === entry.chapter.id) { group = practiceChapters[i]; break; }
    }
    if (!group) {
      group = { chapter: entry.chapter, entries: [] };
      practiceChapters.push(group);
    }
    group.entries.push(entry);
  });

  /* 演练导航短标题：实验 ID → 短标题的显式映射（与 courses.js 真实 id 一一对应） */
  var EXPERIMENT_SHORT_TITLES = {
    "signals-intro-notebook": "信号观察",
    "signals-ch1-waveform-transform": "波形变换",
    "signals-ch1-convolution": "动态卷积",
    "signals-ch1-fourier-synthesis": "傅里叶表示",
    "signals-ch2-aliasing": "采样与重建",
    "signals-ch2-spectral-leakage": "频谱分析",
    "signals-ch2-circular-convolution": "循环卷积",
    "signals-ch3-first-order-lti": "LTI 系统",
    "signals-ch4-moving-average": "FIR 滤波",
    "signals-ch5-random-average": "方差验证"
  };

  function experimentShortTitle(experiment) {
    return EXPERIMENT_SHORT_TITLES[experiment.id] || experiment.title;
  }

  /* —— 演练章节气泡（顶部）与实验大气泡（其下）——
     切换逻辑与代码实现对齐科目间气泡切换：
     ① 滑块位置/宽度现场测量，只吃 transform 与 width，不依赖动画事件；
     ② 选中态只在一个地方改，滑块与按钮状态始终同源；
     ③ 指示器先行：先落选中态让滑块起步，正文随后淡出换内容。 */

  /* 章节滑块：与 syncSubjectThumb 同一套做法 */
  function syncPracticeChapterThumb(nav, instant) {
    if (!nav) return;
    var thumb = nav.querySelector(".practice-chapter-thumb");
    var active = nav.querySelector(".practice-chapter.is-active");
    if (!thumb || !active) return;
    if (instant) nav.classList.add("is-instant");
    thumb.style.width = active.offsetWidth + "px";
    thumb.style.transform = "translateX(" + active.offsetLeft + "px)";
    if (instant) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { nav.classList.remove("is-instant"); });
      });
    }
  }

  /* 章节选中态只在这里改：同一时间只有一枚 is-active */
  function selectPracticeChapter(nav, chapterId) {
    if (!nav) return;
    Array.prototype.forEach.call(nav.querySelectorAll(".practice-chapter"), function (button) {
      var on = button.getAttribute("data-chapter-id") === chapterId;
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  /* 内容淡入淡出：沿用章节正文那一套（opacity 过渡 + 150ms 后换内容再淡入）。
     连续点击先清掉上一个计时器——只有最后一次点击真正换内容，不叠加、不闪回。 */
  var practiceFadeTimer = 0;
  function switchPracticeExperiment(experiment, chapter) {
    if (practiceFadeTimer) { clearTimeout(practiceFadeTimer); practiceFadeTimer = 0; }
    notebookRoot.style.opacity = 0;
    practiceFadeTimer = setTimeout(function () {
      practiceFadeTimer = 0;
      openNotebookExperiment(experiment, chapter);
      notebookRoot.style.opacity = 1;
    }, 150);
  }

  function renderNotebookView(course, chapter, experiment) {
    /* 章节气泡行跨渲染复用同一个 DOM 节点：滑块才能在一次切换里连续滑到位，
       而不是每换一次内容就换一枚新滑块、把动画掐断。 */
    var chapterNav = notebookRoot.querySelector(".practice-chapters");
    var reused = Boolean(chapterNav);

    /* 重新渲染前先注销上一份 demo 的监听器与定时器：
       否则每换一次实验就多留一份，resize 时会有多份旧 demo 同时重绘
       （规划文档 §二：离开、重新渲染时注销旧 rAF/监听器）。 */
    var outgoing = notebookRoot.querySelector(".notebook-demo");
    if (outgoing && typeof outgoing.__cleanup === "function") outgoing.__cleanup();

    notebookRoot.textContent = "";
    var page = document.createElement("article");
    page.className = "notebook-page";

    /* —— 顶部：章节气泡行 + 当前章节的实验大气泡 ——
       导航行放在正文卡片之外，以便贴住窗口边（预留固定边距） —— */
    var topbar = document.createElement("header");
    topbar.className = "practice-topbar";

    if (!reused) {
      chapterNav = document.createElement("nav");
      chapterNav.className = "practice-chapters";
      chapterNav.setAttribute("role", "tablist");
      chapterNav.setAttribute("aria-label", "演练章节");
      var chapterThumb = document.createElement("span");
      chapterThumb.className = "practice-chapter-thumb";
      chapterThumb.setAttribute("aria-hidden", "true");
      chapterNav.appendChild(chapterThumb);
      practiceChapters.forEach(function (group) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "practice-chapter";
        button.setAttribute("role", "tab");
        button.setAttribute("data-chapter-id", group.chapter.id);
        button.setAttribute("title", group.chapter.number + " " + group.chapter.title);
        /* 供按 ID 定位用：这一章里有哪些实验（芯片只渲染当前章节，测试需要先点章节） */
        button.setAttribute("data-experiment-ids", group.entries.map(function (entry) {
          return entry.experiment.id;
        }).join(" "));
        button.appendChild(textElement("span", group.chapter.number, "practice-chapter-title"));
        button.addEventListener("click", function () {
          /* 章节气泡跨渲染复用，处理函数不能闭包捕获某一次渲染的 chapter——
             那会在切换过一次之后变成过期状态。当前章节一律从 DOM 上的选中态读。 */
          var current = chapterNav.querySelector(".practice-chapter.is-active");
          if (current && current.getAttribute("data-chapter-id") === group.chapter.id) return;
          /* 指示器先行：先落选中态让滑块起步，正文 150ms 淡出后再换内容 */
          selectPracticeChapter(chapterNav, group.chapter.id);
          syncPracticeChapterThumb(chapterNav);
          switchPracticeExperiment(group.entries[0].experiment, group.chapter);
        });
        chapterNav.appendChild(button);
      });
    } else {
      /* 复用：节点与按钮都在，只要把选中态对齐到当前章节 */
      selectPracticeChapter(chapterNav, chapter.id);
    }
    /* 首次构建也要落选中态：滑块只认 .is-active，缺了它就没有落位依据 */
    selectPracticeChapter(chapterNav, chapter.id);
    topbar.appendChild(chapterNav);

    /* 大气泡：只装当前章节的实验标签 */
    var bubble = document.createElement("div");
    bubble.className = "practice-bubble";
    var tabs = document.createElement("nav");
    tabs.className = "practice-tabs";
    tabs.setAttribute("role", "tablist");
    var activeGroup = null;
    for (var g = 0; g < practiceChapters.length; g += 1) {
      if (practiceChapters[g].chapter.id === chapter.id) { activeGroup = practiceChapters[g]; break; }
    }
    (activeGroup ? activeGroup.entries : []).forEach(function (entry) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "practice-tab";
      tab.setAttribute("role", "tab");
      tab.setAttribute("data-experiment-id", entry.experiment.id);
      tab.appendChild(textElement("span", experimentShortTitle(entry.experiment), "practice-tab-title"));
      if (entry.experiment.id === experiment.id) {
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
      } else {
        tab.setAttribute("aria-selected", "false");
      }
      tab.addEventListener("click", function () {
        if (entry.experiment.id === experiment.id) return;
        switchPracticeExperiment(entry.experiment, entry.chapter);
      });
      tabs.appendChild(tab);
    });
    bubble.appendChild(tabs);
    topbar.appendChild(bubble);
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
    /* 滑块落位（DOM 挂载后才有有效几何）：首次构建即时就位；
       复用同一节点时只做幂等校准，不加 is-instant，避免把还在进行中的滑动动画掐断 */
    syncPracticeChapterThumb(chapterNav, !reused);
    /* 窄屏时把当前实验滚进视野：只滚动 tabs 自身，不改变页面滚动位置
       （DOM 挂载后才有有效几何，因此放在 append 之后执行） */
    scrollActiveTabIntoView();
  }

  function scrollActiveTabIntoView() {
    var strips = [
      notebookRoot.querySelector(".practice-tabs"),
      notebookRoot.querySelector(".practice-chapters")
    ];
    strips.forEach(function (tabsEl) {
      if (!tabsEl) return;
      var active = tabsEl.querySelector(".is-active");
      if (!active || tabsEl.scrollWidth <= tabsEl.clientWidth) return;
      var a = active.getBoundingClientRect();
      var t = tabsEl.getBoundingClientRect();
      tabsEl.scrollLeft += a.left - t.left - t.width / 2 + a.width / 2;
    });
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
    "signals-ch1-waveform-transform": renderSignalWaveformDemo,
    "signals-ch1-convolution": renderSignalConvolutionDemo,
    "signals-ch1-fourier-synthesis": renderSignalFourierDemo,
    "signals-ch2-aliasing": renderSignalAliasingDemo,
    "signals-ch2-spectral-leakage": renderSignalLeakageDemo,
    "signals-ch2-circular-convolution": renderSignalCircularDemo,
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
    var state = practiceDemoStates[experiment.id] || (practiceDemoStates[experiment.id] = { amplitude: 2, frequency: 2, sampleRate: 20, duration: 1.5, phase: 0 });
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
      /* 滑块与数字框共用同一状态（与其它演练一致） */
      var row = document.createElement("div");
      row.className = "demo-range-row";
      var range = document.createElement("input");
      range.type = "range";
      range.min = String(field[2]);
      range.max = String(field[3]);
      range.step = String(field[4]);
      range.value = String(state[field[0]]);
      var input = document.createElement("input");
      input.type = "number";
      input.min = String(field[2]);
      input.max = String(field[3]);
      input.step = String(field[4]);
      input.value = String(state[field[0]]);
      function commit(raw) {
        var value = Number(raw);
        if (!Number.isFinite(value)) {                 /* 拒绝非有限值，不传播 NaN */
          range.value = String(state[field[0]]);
          input.value = String(state[field[0]]);
          return;
        }
        state[field[0]] = Math.min(field[3], Math.max(field[2], value));
        range.value = String(state[field[0]]);
        input.value = String(state[field[0]]);
        draw();
      }
      range.addEventListener("input", function () { commit(range.value); });
      input.addEventListener("input", function () { commit(input.value); });
      inputs[field[0]] = input;
      row.appendChild(range);
      row.appendChild(input);
      label.appendChild(row);
      controls.appendChild(label);
    });

    /* 画布 */
    appendResetControl(controls, experiment);

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

      /* X 轴刻度：按绘图区宽度自适应 —— 窄图隔一格标注；末端（gxt === 5）让位给单位标签，避免重叠 */
      ctx.fillStyle = gridText;
      ctx.textAlign = "center";
      var labelEvery = plotW < 480 ? 2 : 1;
      for (var gxt = 0; gxt < 5; gxt += labelEvery) {
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
        ["峰值时间", "t = " + formatNumber(peakFirst) + " + k·" + formatNumber(continuousPeriod) + " s", "wide"]
      ];
      rows.forEach(function (row) {
        var item = document.createElement("div");
        item.className = row[2] === "wide" ? "demo-metric is-wide" : "demo-metric";
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
    var firstDrawTimer = setTimeout(draw, 400);
    window.addEventListener("resize", draw);
    /* 卸载时注销：监听的画布会被下一次渲染丢弃，留着会多份重绘 */
    demo.__cleanup = function () {
      clearTimeout(firstDrawTimer);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", draw);
    };
  }

  /* 演练 4：采样、混叠与重建——同一组样点可以对应不同连续信号。
     上视口：连续参考、离散样点、选定算法重建出的曲线；
     下视口：基带谱与 ±f_in + k·fs 的周期副本，并标出理想低通的砖墙通带。 */
  function renderSignalAliasingDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var state = practiceDemoStates[experiment.id] ||
      (practiceDemoStates[experiment.id] = { fin: 7, fs: 20, mode: "sinc" });

    var controls = document.createElement("div");
    controls.className = "demo-controls";

    appendNumberField("信号频率 f_in / Hz", "fin", 1, 15, 1);
    appendNumberField("采样率 f_s / Hz", "fs", 2, 30, 1);

    var modeLabel = document.createElement("label");
    modeLabel.className = "demo-field";
    modeLabel.appendChild(document.createTextNode("重建滤波器模式"));
    var modeSelect = document.createElement("select");
    [["sinc", "理想低通（sinc 插值）"], ["zoh", "零阶保持（ZOH 阶梯）"], ["linear", "线性插值（折线）"]]
      .forEach(function (pair) {
        var option = document.createElement("option");
        option.value = pair[0];
        option.textContent = pair[1];
        if (state.mode === pair[0]) option.selected = true;
        modeSelect.appendChild(option);
      });
    modeSelect.addEventListener("change", function () {
      state.mode = modeSelect.value;
      draw();
    });
    modeLabel.appendChild(modeSelect);
    controls.appendChild(modeLabel);

    appendResetControl(controls, experiment);

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas demo-canvas-tall";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "─ 连续参考", "demo-legend-line"));
    legend.appendChild(textElement("span", "│ 采样样点", "demo-legend-stem"));
    legend.appendChild(textElement("span", "┄ 重建输出", "demo-legend-dash"));
    legend.appendChild(textElement("span", "▨ 理想低通通带", "demo-legend-fill"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value, digits) {
      if (!Number.isFinite(value)) return "—";
      var scale = Math.pow(10, digits === undefined ? 3 : digits);
      return String(Math.round(value * scale) / scale);
    }

    function appendNumberField(labelText, key, min, max, step) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(labelText));
      var row = document.createElement("div");
      row.className = "demo-range-row";
      var range = document.createElement("input");
      range.type = "range";
      range.min = String(min);
      range.max = String(max);
      range.step = String(step);
      range.value = String(state[key]);
      var number = document.createElement("input");
      number.type = "number";
      number.min = String(min);
      number.max = String(max);
      number.step = String(step);
      number.value = String(state[key]);
      function commit(raw) {
        var value = Number(raw);
        if (!Number.isFinite(value)) {                       /* 拒绝非有限值，不传播 NaN */
          range.value = String(state[key]);
          number.value = String(state[key]);
          return;
        }
        state[key] = Math.round(Math.min(max, Math.max(min, value)));
        range.value = String(state[key]);
        number.value = String(state[key]);
        draw();
      }
      range.addEventListener("input", function () { commit(range.value); });
      number.addEventListener("input", function () { commit(number.value); });
      row.appendChild(range);
      row.appendChild(number);
      label.appendChild(row);
      controls.appendChild(label);
    }

    var resizeHandler = function () { draw(); };
    window.addEventListener("resize", resizeHandler);
    demo.__cleanup = function () { window.removeEventListener("resize", resizeHandler); };

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var box = canvas.getBoundingClientRect();
      var width = Math.max(box.width, 100);
      var height = 340;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var warm = canvasColor("--warm");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.34)";
      var gridText = "rgba(128, 133, 141, 0.78)";
      var margin = { left: 44, right: 16, top: 18, bottom: 22 };
      var plotW = width - margin.left - margin.right;

      var fin = state.fin;
      var fs = state.fs;
      var t0 = -0.5;
      var t1 = 0.5;
      var toX = function (t) { return margin.left + ((t - t0) / (t1 - t0)) * plotW; };

      var topTop = margin.top;
      var topH = 120;
      var topBase = topTop + topH;
      var botTop = 178;
      var botH = 116;
      var botBase = botTop + botH;

      ctx.font = "11px system-ui, sans-serif";
      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= 5; gx += 1) {
        var gxp = margin.left + (plotW * gx) / 5;
        ctx.beginPath(); ctx.moveTo(gxp, topTop); ctx.lineTo(gxp, topBase); ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      ctx.beginPath(); ctx.moveTo(margin.left, topBase); ctx.lineTo(margin.left + plotW, topBase); ctx.stroke();

      /* 上视口：连续参考 + 重建 + 样点 */
      var yScale = (topH - 16) / 2;
      ctx.strokeStyle = accentInk;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (var i = 0; i <= 400; i += 1) {
        var t = t0 + ((t1 - t0) * i) / 400;
        var y = Math.cos(2 * Math.PI * fin * t);
        var px = toX(t);
        var py = topBase - y * yScale;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (var j = 0; j <= 400; j += 1) {
        var tr = t0 + ((t1 - t0) * j) / 400;
        var yr = practiceCalc.reconstruct(state.mode, fin, fs, tr);
        var pxr = toX(tr);
        var pyr = topBase - yr * yScale;
        if (j === 0) ctx.moveTo(pxr, pyr); else ctx.lineTo(pxr, pyr);
      }
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = warm;
      ctx.lineWidth = 1.2;
      var nFrom = Math.ceil(t0 * fs);
      var nTo = Math.floor(t1 * fs);
      for (var n = nFrom; n <= nTo; n += 1) {
        var tn = n / fs;
        if (tn < t0 || tn > t1) continue;
        var yn = Math.cos(2 * Math.PI * fin * tn);
        ctx.beginPath();
        ctx.moveTo(toX(tn), topBase);
        ctx.lineTo(toX(tn), topBase - yn * yScale);
        ctx.stroke();
        ctx.fillStyle = warm;
        ctx.beginPath();
        ctx.arc(toX(tn), topBase - yn * yScale, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("t / s", margin.left, topTop - 5);
      ctx.textAlign = "right";
      ctx.fillText("+1", margin.left - 6, topTop + 10);
      ctx.fillText("0", margin.left - 6, topBase + 3);
      ctx.fillText("−1", margin.left - 6, topBase - yScale * 2 + 4);

      /* 下视口：基带 ±f_in 与副本 ±f_in + k·fs；砖墙通带 [−fs/2, fs/2] */
      var fMax = Math.max(2 * fs, 2 * fin);
      var toFx = function (f) { return margin.left + ((f + fMax) / (2 * fMax)) * plotW; };
      ctx.strokeStyle = gridMid;
      ctx.beginPath(); ctx.moveTo(margin.left, botBase); ctx.lineTo(margin.left + plotW, botBase); ctx.stroke();

      ctx.save();
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.14;
      ctx.fillRect(toFx(-fs / 2), botTop, toFx(fs / 2) - toFx(-fs / 2), botH);
      ctx.restore();
      ctx.strokeStyle = gridMid;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(toFx(-fs / 2), botTop); ctx.lineTo(toFx(-fs / 2), botBase); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(toFx(fs / 2), botTop); ctx.lineTo(toFx(fs / 2), botBase); ctx.stroke();
      ctx.setLineDash([]);

      var peaks = {};
      var kRange = Math.ceil(fMax / fs) + 1;
      for (var k = -kRange; k <= kRange; k += 1) {
        [fin, -fin].forEach(function (base) {
          var f = base + k * fs;
          if (Math.abs(f) > fMax) return;
          var key = f.toFixed(6);
          peaks[key] = (peaks[key] || 0) + 1;             /* 重合位置合并 */
        });
      }
      Object.keys(peaks).forEach(function (key) {
        var f = Number(key);
        var inside = Math.abs(f) <= fs / 2 + 1e-9;
        ctx.strokeStyle = inside ? warm : accentInk;
        ctx.lineWidth = inside ? 2.4 : 1.4;
        var h = botH * (inside ? 0.82 : 0.5);
        ctx.beginPath();
        ctx.moveTo(toFx(f), botBase);
        ctx.lineTo(toFx(f), botBase - h);
        ctx.stroke();
      });

      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("f / Hz（砖墙通带 = 理想低通 [−f_s/2, f_s/2]）", margin.left, botTop - 6);
      ctx.textAlign = "right";
      ctx.fillText("0", toFx(0) - 4, botBase + 12);

      updateMetrics();
    }

    function updateMetrics() {
      var fin = state.fin;
      var fs = state.fs;
      var observed = practiceCalc.aliasObserved(fin, fs);
      var status = practiceCalc.aliasStatus(fin, fs);
      var aliased = fs < 2 * fin;
      var rows = [
        ["所需采样率临界值 2f_in", formatNumber(2 * fin, 0) + " Hz"],
        ["奈奎斯特频率 f_s/2", formatNumber(fs / 2, 1) + " Hz"],
        ["折叠后观测频率", formatNumber(observed) + " Hz" + (aliased ? "（混叠）" : "")],
        ["混叠状态", status],
        ["重建 RMSE（" + state.mode + "）", formatNumber(practiceCalc.rmse(state.mode, fin, fs), 4)],
      ];
      metrics.textContent = "";
      rows.forEach(function (row) {
        var card = document.createElement("div");
        card.className = "demo-metric" + (row[0] === "混叠状态" ? " is-wide" : "");
        card.appendChild(textElement("span", row[0], "demo-metric-label"));
        card.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(card);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);
    draw();
    /* 首帧可能在布局完成前执行：下一帧再画一次，保证 backing store = CSS 尺寸 × DPR */
    requestAnimationFrame(draw);
  }


  /* 演练 1：波形变换——x(at+b) 读成「新时刻 t 到旧波形上取值」。
     上下两个视口共用同一横坐标比例与同一 toX：上轴看旧时刻 τ 的 x(τ)，
     下轴看新时刻 t 的 y(t)=x(a·t+b)，并用竖直虚线连接四个对应特征点。 */
  function renderSignalWaveformDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var state = practiceDemoStates[experiment.id] ||
      (practiceDemoStates[experiment.id] = { a: 1, b: 0 });

    var controls = document.createElement("div");
    controls.className = "demo-controls";

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas demo-canvas-tall";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "原波形 x(τ)", "demo-legend-line"));
    legend.appendChild(textElement("span", "变换后 y(t)", "demo-legend-stem"));
    legend.appendChild(textElement("span", "对应特征点", "demo-legend-peak"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value, digits) {
      if (!Number.isFinite(value)) return "—";
      var scale = Math.pow(10, digits === undefined ? 3 : digits);
      return String(Math.round(value * scale) / scale);
    }

    /* 滑块与数字框共用状态；按合法步长吸附；a=0 使映射退化，拒绝并保留上一个有效值 */
    function appendNumberField(labelText, key, min, max, step, reject) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(labelText));
      var row = document.createElement("div");
      row.className = "demo-range-row";
      var range = document.createElement("input");
      range.type = "range";
      range.min = String(min);
      range.max = String(max);
      range.step = String(step);
      range.value = String(state[key]);
      var number = document.createElement("input");
      number.type = "number";
      number.min = String(min);
      number.max = String(max);
      number.step = String(step);
      number.value = String(state[key]);
      function commit(raw) {
        var value = Number(raw);
        if (!Number.isFinite(value)) {                        /* 拒绝非有限值，不传播 NaN */
          range.value = String(state[key]);
          number.value = String(state[key]);
          return;
        }
        var snapped = Number((Math.round(value / step) * step).toFixed(6));
        var clamped = Math.min(max, Math.max(min, snapped));
        if (reject && reject(clamped)) {                      /* 退化取值：保留上一个有效值 */
          range.value = String(state[key]);
          number.value = String(state[key]);
          return;
        }
        state[key] = clamped;
        range.value = String(state[key]);
        number.value = String(state[key]);
        draw();
      }
      range.addEventListener("input", function () { commit(range.value); });
      number.addEventListener("input", function () { commit(number.value); });
      row.appendChild(range);
      row.appendChild(number);
      label.appendChild(row);
      controls.appendChild(label);
    }

    appendNumberField("尺度 a", "a", -3, 3, 0.1, function (value) { return value === 0; });
    appendNumberField("平移 b", "b", -4, 4, 0.2);

    appendResetControl(controls, experiment);

    var resizeHandler = function () { draw(); };
    window.addEventListener("resize", resizeHandler);
    demo.__cleanup = function () { window.removeEventListener("resize", resizeHandler); };

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var box = canvas.getBoundingClientRect();
      var width = Math.max(box.width, 100);
      var height = 340;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var warm = canvasColor("--warm");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.34)";
      var gridText = "rgba(128, 133, 141, 0.78)";
      var margin = { left: 40, right: 16, top: 18, bottom: 22 };
      var plotW = Math.max(width - margin.left - margin.right, 40);
      var view = practiceCalc.viewRange(state.a, state.b);
      /* 上下轴共用同一个 toX：横坐标比例相同，两幅图可以直接上下对照 */
      var toX = function (t) { return margin.left + ((t - view[0]) / (view[1] - view[0])) * plotW; };
      var upper = { top: margin.top, h: 128 };
      upper.base = upper.top + upper.h;
      var lower = { top: upper.base + 42, h: 104 };
      lower.base = lower.top + lower.h;
      var scale = 46;                                          /* 幅度 2 对应 46px */

      /* 网格与基线 */
      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gt = Math.ceil(view[0]); gt <= Math.floor(view[1]); gt += 1) {
        ctx.beginPath();
        ctx.moveTo(toX(gt), upper.top);
        ctx.lineTo(toX(gt), upper.base);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(toX(gt), lower.top);
        ctx.lineTo(toX(gt), lower.base);
        ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      [upper.base, lower.base].forEach(function (base) {
        ctx.beginPath();
        ctx.moveTo(margin.left, base);
        ctx.lineTo(margin.left + plotW, base);
        ctx.stroke();
      });

      /* 原支撑 [0,3] 的底色，表明「取值来源」在旧轴上的位置 */
      ctx.save();
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(toX(0), upper.top, toX(3) - toX(0), upper.h);
      ctx.fillRect(toX(0), lower.top, toX(3) - toX(0), lower.h);
      ctx.restore();

      /* 上轴：旧波形 x(τ) */
      var samples = Math.max(Math.round(plotW), 60);
      var trace = function (fn, base) {
        ctx.beginPath();
        for (var i = 0; i <= samples; i += 1) {
          var t = view[0] + ((view[1] - view[0]) * i) / samples;
          var px = toX(t);
          var py = base - fn(t) * scale;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.8;
      trace(function (t) { return practiceCalc.waveformValue(t); }, upper.base);
      ctx.strokeStyle = accentInk;
      trace(function (t) { return practiceCalc.transformValue(t, state.a, state.b); }, lower.base);
      ctx.lineWidth = 1;

      /* 四个对应特征点与连接虚线 */
      var features = practiceCalc.waveformFeatures;
      ctx.strokeStyle = warm;
      ctx.setLineDash([3, 3]);
      features.forEach(function (pair) {
        var tau = pair[0];
        var value = pair[1];
        var newT = practiceCalc.transformTime(tau, state.a, state.b);
        ctx.beginPath();
        ctx.moveTo(toX(tau), upper.base - value * scale);
        ctx.lineTo(toX(newT), lower.base - value * scale);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      features.forEach(function (pair) {
        var tau = pair[0];
        var newT = practiceCalc.transformTime(tau, state.a, state.b);
        ctx.fillStyle = warm;
        ctx.beginPath();
        ctx.arc(toX(tau), upper.base - pair[1] * scale, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(toX(newT), lower.base - pair[1] * scale, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("旧时刻轴 τ", margin.left, upper.top - 5);
      ctx.fillText("新时刻轴 t", margin.left, lower.top - 5);
      ctx.textAlign = "right";
      ctx.fillText("2", margin.left - 6, upper.base - 2 * scale + 4);
      ctx.fillText("0", margin.left - 6, upper.base + 3);
      ctx.fillText("0", margin.left - 6, lower.base + 3);
      ctx.textAlign = "left";
      ctx.fillText("旧支撑 [0, 3]", toX(0) + 4, upper.base + 13);
      ctx.fillText("视野与原/新支撑对齐", margin.left, lower.base + 13);

      updateMetrics();
    }

    function updateMetrics() {
      var support = practiceCalc.transformSupport(state.a, state.b);
      var rows = [
        ["支撑区间", "[" + formatNumber(support[0], 3) + ", " + formatNumber(support[1], 3) + "]"],
        ["支撑宽度 3/|a|", formatNumber(practiceCalc.compressionWidth(state.a), 3) + " s"],
        ["等价延迟 t₀ = −b/a", formatNumber(practiceCalc.timeShift(state.a, state.b), 3) + " s"],
        ["反折状态", practiceCalc.reflectionState(state.a)],
      ];
      metrics.textContent = "";
      rows.forEach(function (row) {
        var card = document.createElement("div");
        card.className = "demo-metric" + (row[0] === "支撑区间" ? " is-wide" : "");
        card.appendChild(textElement("span", row[0], "demo-metric-label"));
        card.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(card);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);
    draw();
    /* 首帧可能在布局完成前执行：下一帧再画一次，保证 backing store = CSS 尺寸 × DPR */
    requestAnimationFrame(draw);
  }

  /* 演练 3：傅里叶表示——「增加谐波阶数 N」与「加长周期 T」是两件事。
     上图：目标周期矩形、x_N(t) 部分和与 1.08949 渐近参考线；
     下图：|k/T|≤4 Hz 的谱点（纵轴 T·c_k，保留符号）与连续包络 τ·sinc(τf)。 */
  function renderSignalFourierDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var state = practiceDemoStates[experiment.id] ||
      (practiceDemoStates[experiment.id] = { T: 2, N: 5 });

    var controls = document.createElement("div");
    controls.className = "demo-controls";

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas demo-canvas-tall";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "目标方波", "demo-legend-stem"));
    legend.appendChild(textElement("span", "部分和 x_N(t)", "demo-legend-line"));
    legend.appendChild(textElement("span", "谱点 T·c_k", "demo-legend-peak"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value, digits) {
      if (!Number.isFinite(value)) return "—";
      var scale = Math.pow(10, digits === undefined ? 3 : digits);
      return String(Math.round(value * scale) / scale);
    }

    function appendNumberField(labelText, key, min, max, step) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(labelText));
      var row = document.createElement("div");
      row.className = "demo-range-row";
      var range = document.createElement("input");
      range.type = "range";
      range.min = String(min);
      range.max = String(max);
      range.step = String(step);
      range.value = String(state[key]);
      var number = document.createElement("input");
      number.type = "number";
      number.min = String(min);
      number.max = String(max);
      number.step = String(step);
      number.value = String(state[key]);
      function commit(raw) {
        var value = Number(raw);
        if (!Number.isFinite(value)) {                        /* 拒绝非有限值，不传播 NaN */
          range.value = String(state[key]);
          number.value = String(state[key]);
          return;
        }
        var snapped = Number((Math.round(value / step) * step).toFixed(6));
        state[key] = Math.min(max, Math.max(min, snapped));
        range.value = String(state[key]);
        number.value = String(state[key]);
        draw();
      }
      range.addEventListener("input", function () { commit(range.value); });
      number.addEventListener("input", function () { commit(number.value); });
      row.appendChild(range);
      row.appendChild(number);
      label.appendChild(row);
      controls.appendChild(label);
    }

    appendNumberField("周期 T / s", "T", 2, 10, 0.5);
    appendNumberField("最高谐波阶数 N", "N", 1, 101, 1);

    appendResetControl(controls, experiment);

    var resizeHandler = function () { draw(); };
    window.addEventListener("resize", resizeHandler);
    demo.__cleanup = function () { window.removeEventListener("resize", resizeHandler); };

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var box = canvas.getBoundingClientRect();
      var width = Math.max(box.width, 100);
      var height = 340;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var warm = canvasColor("--warm");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.34)";
      var gridText = "rgba(128, 133, 141, 0.78)";
      var margin = { left: 42, right: 16, top: 18, bottom: 22 };
      var plotW = Math.max(width - margin.left - margin.right, 40);
      var T = state.T;
      var N = state.N;

      /* —— 上视口：一个周期内的目标与部分和 —— */
      var topH = 150;
      var topTop = margin.top;
      var topBase = topTop + topH;
      var tView = [-T / 2, T / 2];
      var toTx = function (t) { return margin.left + ((t - tView[0]) / T) * plotW; };
      var ampMax = 1.25;
      var toTy = function (v) { return topBase - (Math.max(-0.25, Math.min(ampMax, v)) / ampMax) * topH; };

      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gv = 0; gv <= 1; gv += 0.5) {
        ctx.beginPath();
        ctx.moveTo(margin.left, toTy(gv));
        ctx.lineTo(margin.left + plotW, toTy(gv));
        ctx.stroke();
      }

      /* 渐近参考线：只是极限值，不声称任意有限 N 的峰值都低于它 */
      ctx.strokeStyle = gridMid;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(margin.left, toTy(practiceCalc.gibbsPeakValue));
      ctx.lineTo(margin.left + plotW, toTy(practiceCalc.gibbsPeakValue));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = gridText;
      ctx.textAlign = "right";
      ctx.fillText("1.08949", margin.left - 4, toTy(practiceCalc.gibbsPeakValue) + 3);
      ctx.textAlign = "left";

      /* 目标方波 */
      var steps = Math.max(Math.round(plotW), 60);
      ctx.strokeStyle = accentInk;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (var i = 0; i <= steps; i += 1) {
        var t = tView[0] + (T * i) / steps;
        var px = toTx(t);
        var py = toTy(practiceCalc.fourierTarget(t, T));
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      /* 部分和 */
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (var j = 0; j <= steps; j += 1) {
        var t2 = tView[0] + (T * j) / steps;
        var px2 = toTx(t2);
        var py2 = toTy(practiceCalc.fourierPartialSum(t2, T, N));
        if (j === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
      }
      ctx.stroke();
      ctx.lineWidth = 1;

      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("一个周期内的目标方波与部分和 x_N(t)（t / s）", margin.left, topTop - 5);
      ctx.textAlign = "right";
      ctx.fillText("1", margin.left - 6, toTy(1) + 3);
      ctx.fillText("0", margin.left - 6, toTy(0) + 3);

      /* —— 下视口：谱点与连续包络（固定 [−4,4] Hz） —— */
      var botTop = topBase + 34;
      var botH = Math.max(340 - margin.bottom - botTop, 40);
      var botBase = botTop + botH;
      var fMax = 4;
      var toFx = function (f) { return margin.left + ((f + fMax) / (2 * fMax)) * plotW; };
      var envMax = 1.1;
      var toFy = function (v) { return botBase - ((v + 0.35) / (envMax + 0.35)) * botH; };

      ctx.strokeStyle = gridSoft;
      for (var gf = -4; gf <= 4; gf += 2) {
        ctx.beginPath();
        ctx.moveTo(toFx(gf), botTop);
        ctx.lineTo(toFx(gf), botBase);
        ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      ctx.beginPath();
      ctx.moveTo(margin.left, toFy(0));
      ctx.lineTo(margin.left + plotW, toFy(0));
      ctx.stroke();

      /* 连续包络 τ·sinc(τf) */
      ctx.strokeStyle = warm;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      var envSteps = Math.max(Math.round(plotW), 60);
      for (var m = 0; m <= envSteps; m += 1) {
        var fv = -fMax + (2 * fMax * m) / envSteps;
        var ex = toFx(fv);
        var ey = toFy(practiceCalc.envelopeValue(fv));
        if (m === 0) ctx.moveTo(ex, ey); else ctx.lineTo(ex, ey);
      }
      ctx.stroke();

      /* 谱点：保留符号（负值向下画），与包络同尺度 */
      var points = practiceCalc.spectrumPoints(T, fMax);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.6;
      points.forEach(function (point) {
        ctx.beginPath();
        ctx.moveTo(toFx(point.f), toFy(0));
        ctx.lineTo(toFx(point.f), toFy(point.value));
        ctx.stroke();
      });
      ctx.lineWidth = 1;

      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("谱点 T·c_k 与连续包络 τ·sinc(τf)，f / Hz（范围由 T 决定，与 N 无关）", margin.left, botTop - 5);
      ctx.textAlign = "right";
      ctx.fillText("0", toFx(0) - 4, botBase + 12);

      updateMetrics(points);
    }

    function updateMetrics(points) {
      var rows = [
        ["周期 T", formatNumber(state.T, 2) + " s"],
        ["基频 f₀ = 1/T", formatNumber(1 / state.T, 4) + " Hz"],
        ["谐波阶数 N", String(state.N)],
        ["谱点数（|f| ≤ 4 Hz，含零系数）", String(points.length) + " 个（与 N 无关）"],
        ["RMSE（一个周期 4096 中点）", formatNumber(practiceCalc.fourierMse(state.T, state.N), 4)],
      ];
      metrics.textContent = "";
      rows.forEach(function (row) {
        var wide = row[0].indexOf("谱点数") === 0;
        var card = document.createElement("div");
        card.className = "demo-metric" + (wide ? " is-wide" : "");
        card.appendChild(textElement("span", row[0], "demo-metric-label"));
        card.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(card);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);
    draw();
    /* 首帧可能在布局完成前执行：下一帧再画一次，保证 backing store = CSS 尺寸 × DPR */
    requestAnimationFrame(draw);
  }

  /* 演练 5：频谱分析——观察长度 L、窗形与补零 M 各自改变什么（f_s 固定 64 Hz）。
     上图：稠密 DTFT 曲线与 N_fft 点 DFT 谱线，统一归一化（不作单边翻倍）；
     下图：窗自身归一化频谱（dB），标出首次局部极小（主瓣边界）与其后首个局部极大（第一旁瓣）。 */
  function renderSignalLeakageDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var state = practiceDemoStates[experiment.id] ||
      (practiceDemoStates[experiment.id] = { scene: "dual", win: "rect", L: 32, M: 0 });

    var controls = document.createElement("div");
    controls.className = "demo-controls";

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas demo-canvas-tall";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "稠密 DTFT", "demo-legend-line"));
    legend.appendChild(textElement("span", "DFT 谱线", "demo-legend-stem"));
    legend.appendChild(textElement("span", "第一旁瓣", "demo-legend-peak"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value, digits) {
      if (!Number.isFinite(value)) return "—";
      var scale = Math.pow(10, digits === undefined ? 3 : digits);
      return String(Math.round(value * scale) / scale);
    }

    function appendSelectField(labelText, key, pairs) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(labelText));
      var select = document.createElement("select");
      pairs.forEach(function (pair) {
        var option = document.createElement("option");
        option.value = pair[0];
        option.textContent = pair[1];
        if (state[key] === pair[0]) option.selected = true;
        select.appendChild(option);
      });
      select.addEventListener("change", function () {
        state[key] = select.value;
        draw();
      });
      label.appendChild(select);
      controls.appendChild(label);
    }

    function appendNumberField(labelText, key, min, max, step) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(labelText));
      var row = document.createElement("div");
      row.className = "demo-range-row";
      var range = document.createElement("input");
      range.type = "range";
      range.min = String(min);
      range.max = String(max);
      range.step = String(step);
      range.value = String(state[key]);
      var number = document.createElement("input");
      number.type = "number";
      number.min = String(min);
      number.max = String(max);
      number.step = String(step);
      number.value = String(state[key]);
      function commit(raw) {
        var value = Number(raw);
        if (!Number.isFinite(value)) {                        /* 拒绝非有限值，不传播 NaN */
          range.value = String(state[key]);
          number.value = String(state[key]);
          return;
        }
        state[key] = Math.round(Math.min(max, Math.max(min, value)));
        range.value = String(state[key]);
        number.value = String(state[key]);
        draw();
      }
      range.addEventListener("input", function () { commit(range.value); });
      number.addEventListener("input", function () { commit(number.value); });
      row.appendChild(range);
      row.appendChild(number);
      label.appendChild(row);
      controls.appendChild(label);
    }

    appendSelectField("信号场景", "scene", [
      ["dual", "10 + 12 Hz 等幅双音"],
      ["single10", "10 Hz 单音"],
      ["single10.5", "10.5 Hz 单音"]
    ]);
    appendSelectField("窗类型", "win", [["rect", "矩形窗"], ["hann", "对称 Hann 窗"]]);
    appendNumberField("观察长度 L / 样点", "L", 16, 128, 8);
    appendNumberField("补零 M / 样点", "M", 0, 224, 16);

    appendResetControl(controls, experiment);

    var resizeHandler = function () { draw(); };
    window.addEventListener("resize", resizeHandler);
    demo.__cleanup = function () { window.removeEventListener("resize", resizeHandler); };

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var box = canvas.getBoundingClientRect();
      var width = Math.max(box.width, 100);
      var height = 340;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var warm = canvasColor("--warm");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.34)";
      var gridText = "rgba(128, 133, 141, 0.78)";
      var margin = { left: 44, right: 16, top: 16, bottom: 22 };
      var plotW = Math.max(width - margin.left - margin.right, 40);
      var fs = practiceCalc.analysisFs;
      var L = state.L;
      var Nfft = L + state.M;
      var scene = state.scene;
      var win = state.win;
      var fMax = fs / 2;
      var toX = function (f) { return margin.left + (f / fMax) * plotW; };

      /* —— 上视口：幅度谱 0…f_s/2 —— */
      var topH = 132;
      var topTop = margin.top;
      var topBase = topTop + topH;
      var yMax = 0.8;
      var toY = function (v) { return topBase - (Math.min(v, yMax) / yMax) * topH; };

      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gf = 0; gf <= fMax; gf += 8) {
        ctx.beginPath();
        ctx.moveTo(toX(gf), topTop);
        ctx.lineTo(toX(gf), topBase);
        ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      ctx.beginPath();
      ctx.moveTo(margin.left, topBase);
      ctx.lineTo(margin.left + plotW, topBase);
      ctx.stroke();

      /* DFT 谱线（0…f_s/2 的谱点）：与稠密曲线同一归一化尺度 */
      var bins = Math.floor(Nfft / 2);
      ctx.strokeStyle = accentInk;
      ctx.lineWidth = 1;
      for (var k = 0; k <= bins; k += 1) {
        var fk = (k * fs) / Nfft;
        ctx.beginPath();
        ctx.moveTo(toX(fk), topBase);
        ctx.lineTo(toX(fk), toY(practiceCalc.dftMagnitude(scene, L, win, k, Nfft)));
        ctx.stroke();
      }

      /* 稠密 DTFT 曲线 */
      var denseStep = 0.05;
      var denseCount = Math.round(fMax / denseStep);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (var i = 0; i <= denseCount; i += 1) {
        var fq = i * denseStep;
        var px = toX(fq);
        var py = toY(practiceCalc.spectrumMagnitude(scene, L, win, fq));
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("|X(f)| 归一化（f_s/2 = 32 Hz）", margin.left, topTop - 5);
      ctx.textAlign = "right";
      ctx.fillText(String(yMax), margin.left - 6, topTop + 9);
      ctx.fillText("0", margin.left - 6, topBase + 3);

      /* —— 下视口：窗自身归一化频谱（dB） —— */
      var botTop = topBase + 34;
      var botH = Math.max(340 - margin.bottom - botTop, 40);
      var botBase = botTop + botH;
      var lobe = practiceCalc.windowLobe(win, L, 0.01);
      var fwMax = Math.min(fs / 2, Math.max(8, (lobe.firstSidelobe || 0) * 1.25));
      var dbMin = -40;
      var toWx = function (f) { return margin.left + (f / fwMax) * plotW; };
      var toWy = function (db) {
        var clamped = Math.max(dbMin, Math.min(0, db));
        return botBase - ((clamped - dbMin) / (0 - dbMin)) * botH;
      };

      ctx.strokeStyle = gridSoft;
      for (var gdb = dbMin; gdb <= 0; gdb += 10) {
        ctx.beginPath();
        ctx.moveTo(margin.left, toWy(gdb));
        ctx.lineTo(margin.left + plotW, toWy(gdb));
        ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      ctx.beginPath();
      ctx.moveTo(margin.left, botBase);
      ctx.lineTo(margin.left + plotW, botBase);
      ctx.stroke();

      var dbAt = function (f) {
        return 20 * Math.log10(Math.max(practiceCalc.spectrumMagnitude("flat", L, win, f), 1e-6));
      };
      var wStep = 0.02;
      var wCount = Math.round(fwMax / wStep);
      ctx.strokeStyle = warm;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (var j = 0; j <= wCount; j += 1) {
        var fw = j * wStep;
        var wx = toWx(fw);
        var wy = toWy(dbAt(fw));
        if (j === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
      }
      ctx.stroke();

      var peaks = practiceCalc.localPeaks(scene, L, win, 9, 13, 0.01);

      if (lobe.mainLobeEdge !== null) {
        ctx.strokeStyle = gridMid;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(toWx(lobe.mainLobeEdge), botTop);
        ctx.lineTo(toWx(lobe.mainLobeEdge), botBase);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (lobe.firstSidelobe !== null) {
        ctx.fillStyle = warm;
        ctx.beginPath();
        ctx.arc(toWx(lobe.firstSidelobe), toWy(dbAt(lobe.firstSidelobe)), 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("窗自身频谱 / dB（0…" + formatNumber(fwMax, 1) + " Hz）", margin.left, botTop - 5);
      ctx.textAlign = "right";
      ctx.fillText("−40", margin.left - 6, botBase + 3);
      ctx.fillText("0", margin.left - 6, botTop + 9);

      updateMetrics(peaks, lobe);
    }

    function updateMetrics(peaks, lobe) {
      var fs = practiceCalc.analysisFs;
      var Nfft = state.L + state.M;
      var sideDb = lobe.firstSidelobe === null
        ? "—"
        : formatNumber(20 * Math.log10(Math.max(practiceCalc.spectrumMagnitude("flat", state.L, state.win, lobe.firstSidelobe), 1e-6)), 1) + " dB";
      var rows = [
        ["观察时间 L/f_s", formatNumber(state.L / fs, 3) + " s"],
        ["频率尺度 f_s/L", formatNumber(fs / state.L, 2) + " Hz"],
        ["补零后网格 f_s/N_fft", formatNumber(fs / Nfft, 4) + " Hz（N_fft=" + Nfft + "）"],
        ["谱峰位置（[9,13] Hz）", peaks.length
          ? peaks.map(function (p) { return formatNumber(p[0], 2); }).join(" / ") + " Hz"
          : "无局部峰"],
        ["窗主瓣边界 / 第一旁瓣",
          (lobe.mainLobeEdge === null ? "—" : formatNumber(lobe.mainLobeEdge, 2) + " Hz") + " / " + sideDb],
      ];
      metrics.textContent = "";
      rows.forEach(function (row) {
        var wide = row[0] === "谱峰位置（[9,13] Hz）" || row[0] === "窗主瓣边界 / 第一旁瓣";
        var card = document.createElement("div");
        card.className = "demo-metric" + (wide ? " is-wide" : "");
        card.appendChild(textElement("span", row[0], "demo-metric-label"));
        card.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(card);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);
    draw();
    /* 首帧可能在布局完成前执行：下一帧再画一次，保证 backing store = CSS 尺寸 × DPR */
    requestAnimationFrame(draw);
  }

  /* 演练 6：循环卷积——线性卷积结果按 n mod N 折回叠加。
     左：线性结果 y_lin 与折回箭头；右：N 刻度上的 x_N[k]·h_N[(m−k) mod N] 及贡献和。
     宽屏左右并排，窄屏纵排（不把整块内容缩小）。 */
  function renderSignalCircularDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var state = practiceDemoStates[experiment.id] ||
      (practiceDemoStates[experiment.id] = { n1: 4, n2: 4, n: 4, m: 0 });

    var controls = document.createElement("div");
    controls.className = "demo-controls";

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas demo-canvas-tall";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "线性结果 y_lin", "demo-legend-stem"));
    legend.appendChild(textElement("span", "折回 n mod N", "demo-legend-peak"));
    legend.appendChild(textElement("span", "循环结果 y_circ", "demo-legend-line"));
    wrap.appendChild(legend);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    var mRange = null;
    var mNumber = null;

    function formatNumber(value, digits) {
      if (!Number.isFinite(value)) return "—";
      var scale = Math.pow(10, digits === undefined ? 3 : digits);
      return String(Math.round(value * scale) / scale);
    }

    function syncM() {
      if (!mRange) return;
      mRange.max = String(state.n - 1);
      mNumber.max = String(state.n - 1);
      mRange.value = String(state.m);
      mNumber.value = String(state.m);
    }

    function appendNumberField(labelText, key, min, max, step) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(labelText));
      var row = document.createElement("div");
      row.className = "demo-range-row";
      var range = document.createElement("input");
      range.type = "range";
      range.min = String(min);
      range.max = String(max);
      range.step = String(step);
      range.value = String(state[key]);
      var number = document.createElement("input");
      number.type = "number";
      number.min = String(min);
      number.max = String(max);
      number.step = String(step);
      number.value = String(state[key]);
      function commit(raw) {
        var value = Number(raw);
        if (!Number.isFinite(value)) {                        /* 拒绝非有限值，不传播 NaN */
          range.value = String(state[key]);
          number.value = String(state[key]);
          return;
        }
        state[key] = Math.round(Math.min(max, Math.max(min, value)));
        if (key === "n") state.m = Math.min(state.m, state.n - 1);   /* 改 N 后夹紧 m */
        range.value = String(state[key]);
        number.value = String(state[key]);
        if (key === "n") syncM();
        draw();
      }
      range.addEventListener("input", function () { commit(range.value); });
      number.addEventListener("input", function () { commit(number.value); });
      row.appendChild(range);
      row.appendChild(number);
      label.appendChild(row);
      controls.appendChild(label);
      if (key === "m") { mRange = range; mNumber = number; }
    }

    appendNumberField("N₁ / 样点", "n1", 2, 8, 1);
    appendNumberField("N₂ / 样点", "n2", 2, 8, 1);
    appendNumberField("循环长度 N / 点", "n", 2, 16, 1);
    appendNumberField("观察 m（0…N−1）", "m", 0, 15, 1);

    var stepGroup = document.createElement("div");
    stepGroup.className = "demo-field";
    stepGroup.appendChild(document.createTextNode("观察步进"));
    var stepRow = document.createElement("div");
    stepRow.className = "demo-button-row";
    var stepButton = document.createElement("button");
    stepButton.type = "button";
    stepButton.textContent = "▶ 单步";
    stepButton.addEventListener("click", function () {
      if (state.m < state.n - 1) state.m += 1;                 /* 到 N−1 停住，不回绕 */
      syncM();
      draw();
    });
    var resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.textContent = "↺ 复位";
    resetButton.addEventListener("click", function () {
      state.m = 0;
      syncM();
      draw();
    });
    stepRow.appendChild(stepButton);
    stepRow.appendChild(resetButton);
    stepGroup.appendChild(stepRow);
    controls.appendChild(stepGroup);

    var resizeHandler = function () { draw(); };
    window.addEventListener("resize", resizeHandler);
    demo.__cleanup = function () { window.removeEventListener("resize", resizeHandler); };

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var box = canvas.getBoundingClientRect();
      var width = Math.max(box.width, 100);
      var height = 340;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var warm = canvasColor("--warm");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.34)";
      var gridText = "rgba(128, 133, 141, 0.78)";
      var margin = { left: 40, right: 16, top: 20, bottom: 24 };
      var plotW = Math.max(width - margin.left - margin.right, 40);
      var viewH = 340 - margin.top - margin.bottom;
      var gap = 20;

      var lin = practiceCalc.linearConv(state.n1, state.n2);
      var circ = practiceCalc.circularConv(state.n1, state.n2, state.n);
      var maxV = Math.max.apply(null, lin.concat(circ, [1]));

      /* 宽屏左右并排（文档「左图/右图」）；窄屏纵排，不缩小内容 */
      var sideBySide = width >= 620;
      var boxW = sideBySide ? (plotW - gap) / 2 : plotW;
      var boxH = sideBySide ? viewH : (viewH - gap) / 2;
      var leftBox = { x: margin.left, y: margin.top, w: boxW, h: boxH };
      var rightBox = sideBySide
        ? { x: margin.left + boxW + gap, y: margin.top, w: boxW, h: boxH }
        : { x: margin.left, y: margin.top + boxH + gap, w: boxW, h: boxH };

      /* —— 左：线性结果与折回箭头 —— */
      var lStep = leftBox.w / Math.max(lin.length, 1);
      var lBase = leftBox.y + leftBox.h - 16;
      var lScale = (leftBox.h - 34) / maxV;
      ctx.strokeStyle = gridMid;
      ctx.beginPath();
      ctx.moveTo(leftBox.x, lBase);
      ctx.lineTo(leftBox.x + leftBox.w, lBase);
      ctx.stroke();

      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.75;
      lin.forEach(function (value, n) {
        var bx = leftBox.x + n * lStep + lStep * 0.18;
        var bw = Math.max(lStep * 0.64, 2);
        ctx.fillRect(bx, lBase - value * lScale, bw, value * lScale);
      });
      ctx.globalAlpha = 1;

      /* 折回箭头：n ≥ N 的样本回到 n mod N */
      ctx.strokeStyle = warm;
      ctx.lineWidth = 1.2;
      for (var n2 = state.n; n2 < lin.length; n2 += 1) {
        var fromX = leftBox.x + n2 * lStep + lStep / 2;
        var toX2 = leftBox.x + (n2 % state.n) * lStep + lStep / 2;
        var arcY = lBase - lin[n2] * lScale - 10;
        ctx.beginPath();
        ctx.moveTo(fromX, arcY);
        ctx.quadraticCurveTo((fromX + toX2) / 2, arcY - 26, toX2, lBase - lin[n2 % state.n] * lScale - 6);
        ctx.stroke();
      }
      ctx.lineWidth = 1;

      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("线性结果 y_lin（N−1 之后折回）", leftBox.x, leftBox.y - 6);
      ctx.textAlign = "center";
      for (var t = 0; t < lin.length; t += 1) {
        if (lStep < 16 && t % 2 === 1) continue;
        ctx.fillText(String(t), leftBox.x + t * lStep + lStep / 2, lBase + 13);
      }
      ctx.textAlign = "right";
      ctx.fillText("n", leftBox.x - 6, lBase + 3);

      /* —— 右：x_N[k]·h_N[(m−k) mod N] 与贡献和 —— */
      var a = practiceCalc.foldedRect(state.n1, state.n);
      var b = practiceCalc.foldedRect(state.n2, state.n);
      var products = [];
      for (var k2 = 0; k2 < state.n; k2 += 1) {
        products.push(a[k2] * b[((state.m - k2) % state.n + state.n) % state.n]);
      }
      var sum = products.reduce(function (acc, v) { return acc + v; }, 0);
      var rStep = rightBox.w / state.n;
      var rBase = rightBox.y + rightBox.h - 16;
      var rScale = (rightBox.h - 34) / maxV;

      ctx.strokeStyle = gridMid;
      ctx.beginPath();
      ctx.moveTo(rightBox.x, rBase);
      ctx.lineTo(rightBox.x + rightBox.w, rBase);
      ctx.stroke();

      ctx.fillStyle = accentInk;
      ctx.globalAlpha = 0.7;
      products.forEach(function (value, k) {
        var bx = rightBox.x + k * rStep + rStep * 0.18;
        var bw = Math.max(rStep * 0.64, 2);
        ctx.fillRect(bx, rBase - value * rScale, bw, value * rScale);
      });
      ctx.globalAlpha = 1;

      /* 循环结果（虚线参考）：与贡献和逐点对应 */
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      circ.forEach(function (value, k) {
        var px = rightBox.x + k * rStep + rStep / 2;
        var py = rBase - value * rScale;
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = 1;

      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("x_N[k]·h_N[(m−k) mod N]，Σ = " + formatNumber(sum, 3), rightBox.x, rightBox.y - 6);
      ctx.textAlign = "center";
      for (var k3 = 0; k3 < state.n; k3 += 1) {
        if (rStep < 16 && k3 % 2 === 1) continue;
        ctx.fillText(String(k3), rightBox.x + k3 * rStep + rStep / 2, rBase + 13);
      }
      ctx.textAlign = "right";
      ctx.fillText("k", rightBox.x - 6, rBase + 3);
      if (rStep >= 16) {
        ctx.textAlign = "center";
        ctx.fillStyle = warm;
        ctx.fillText("m=" + state.m, rightBox.x + state.m * rStep + rStep / 2, rightBox.y + 12);
      }

      updateMetrics(circ);
    }

    function updateMetrics(circ) {
      var folded = practiceCalc.foldedSamples(state.n1, state.n2, state.n);
      var affected = practiceCalc.affectedBins(state.n1, state.n2, state.n);
      var dft = practiceCalc.circularByDft(state.n1, state.n2, state.n);
      var agree = dft.every(function (value, i) { return Math.abs(value - circ[i]) < 1e-9; });
      var rows = [
        ["线性卷积长度 L", String(state.n1 + state.n2 - 1) + " 点"],
        ["循环结果 y_circ[" + state.m + "]", formatNumber(circ[state.m], 3)],
        ["首 N 点误差 E", formatNumber(practiceCalc.circError(state.n1, state.n2, state.n), 3)],
        ["折回样本 max(0, L−N)", String(folded)],
        ["受影响桶 min(N, max(0, L−N))", String(affected)],
        ["DFT 核对（按模 N 折叠）", agree ? "与直接路线一致" : "不一致"],
      ];
      metrics.textContent = "";
      rows.forEach(function (row) {
        var wide = row[0].indexOf("受影响桶") === 0 || row[0].indexOf("DFT 核对") === 0;
        var card = document.createElement("div");
        card.className = "demo-metric" + (wide ? " is-wide" : "");
        card.appendChild(textElement("span", row[0], "demo-metric-label"));
        card.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(card);
      });
    }

    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);
    syncM();
    draw();
    /* 首帧可能在布局完成前执行：下一帧再画一次，保证 backing store = CSS 尺寸 × DPR */
    requestAnimationFrame(draw);
  }

  /* 演练 2：动态卷积——单位高度矩形 x、h，支撑分别 [0,w₁]、[0,w₂]。
     上图（τ 积分轴）：x(τ)、翻转平移后的 h(t−τ)、两者乘积的重叠阴影；
     下图（t 结果轴）：完整 y(t) 与当前时刻游标。
     历史贡献的解释以 LTI 零状态响应为前提：y(t)=∫x(τ)h(t−τ)dτ。 */
  function renderSignalConvolutionDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var state = practiceDemoStates[experiment.id] ||
      (practiceDemoStates[experiment.id] = { preset: "1,1", width1: 1, width2: 1, timeT: -1, playing: false });

    var controls = document.createElement("div");
    controls.className = "demo-controls";

    /* 信号对预设：仅两类单位高度矩形（指数与冲激按规划留在范围外） */
    var presetLabel = document.createElement("label");
    presetLabel.className = "demo-field";
    presetLabel.appendChild(document.createTextNode("信号对预设"));
    var presetSelect = document.createElement("select");
    [["1,1", "等宽矩形 (1, 1)"], ["1,2", "不等宽矩形 (1, 2)"]].forEach(function (pair) {
      var option = document.createElement("option");
      option.value = pair[0];
      option.textContent = pair[1];
      if (state.preset === pair[0]) option.selected = true;
      presetSelect.appendChild(option);
    });
    presetSelect.addEventListener("change", function () {
      state.preset = presetSelect.value;
      var parts = state.preset.split(",");
      state.width1 = Number(parts[0]);
      state.width2 = Number(parts[1]);
      clampTime();
      syncTimeInputs();
      draw();
    });
    presetLabel.appendChild(presetSelect);
    controls.appendChild(presetLabel);

    /* 宽度与观察时刻：滑块与数字框共用同一状态 */
    var w1Range = appendRangeField("脉冲 1 宽度 w₁ / s", "width1", 0.5, 3, 0.1);
    var w2Range = appendRangeField("脉冲 2 宽度 w₂ / s", "width2", 0.5, 3, 0.1);
    var tRange = appendRangeField("观察时刻 t / s", "timeT", -1, 4, 0.02);

    /* 播放 / 暂停 / 复位（复位只回到 t=-1 并暂停） */
    var playGroup = document.createElement("div");
    playGroup.className = "demo-field";
    playGroup.appendChild(document.createTextNode("播放控制"));
    var playRow = document.createElement("div");
    playRow.className = "demo-button-row";
    var playButton = document.createElement("button");
    playButton.type = "button";
    playButton.textContent = "▶ 播放";
    var resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.textContent = "↺ 复位";
    playRow.appendChild(playButton);
    playRow.appendChild(resetButton);
    playGroup.appendChild(playRow);
    controls.appendChild(playGroup);

    var canvas = document.createElement("canvas");
    canvas.className = "demo-canvas demo-canvas-tall";
    var wrap = document.createElement("div");
    wrap.className = "demo-canvas-wrap";
    wrap.appendChild(canvas);
    var legend = document.createElement("div");
    legend.className = "demo-legend";
    legend.appendChild(textElement("span", "─ 输入 x(τ)", "demo-legend-line"));
    legend.appendChild(textElement("span", "┄ 翻转平移 h(t−τ)", "demo-legend-dash"));
    legend.appendChild(textElement("span", "▨ 乘积（重叠面积）", "demo-legend-fill"));
    legend.appendChild(textElement("span", "─ 输出 y(t)", "demo-legend-line"));
    wrap.appendChild(legend);

    var history = document.createElement("p");
    history.className = "demo-history";
    wrap.appendChild(history);

    var metrics = document.createElement("div");
    metrics.className = "demo-metrics";

    function formatNumber(value) {
      if (!Number.isFinite(value)) return "—";
      return String(Math.round(value * 1000) / 1000);
    }

    function appendRangeField(labelText, key, min, max, step) {
      var label = document.createElement("label");
      label.className = "demo-field";
      label.appendChild(document.createTextNode(labelText));
      var row = document.createElement("div");
      row.className = "demo-range-row";
      var range = document.createElement("input");
      range.type = "range";
      range.min = String(min);
      range.max = String(max);
      range.step = String(step);
      range.value = String(state[key]);
      var number = document.createElement("input");
      number.type = "number";
      number.min = String(min);
      number.max = String(max);
      number.step = String(step);
      number.value = String(state[key]);
      function commit(raw) {
        var value = Number(raw);
        if (!Number.isFinite(value)) { syncTimeInputs(); return; }   /* 拒绝非有限值，不传播 NaN */
        var upper = key === "timeT" ? state.width1 + state.width2 + 1 : max;
        state[key] = Math.min(upper, Math.max(min, value));
        if (key === "width1" || key === "width2") clampTime();
        syncTimeInputs();
        draw();
      }
      range.addEventListener("input", function () { commit(range.value); });
      number.addEventListener("input", function () { commit(number.value); });
      row.appendChild(range);
      row.appendChild(number);
      label.appendChild(row);
      controls.appendChild(label);
      if (key === "width1") w1Range = range;
      if (key === "width2") w2Range = range;
      if (key === "timeT") tRange = range;
      return range;
    }

    /* 改宽度后把 t 夹紧到 [-1, w₁+w₂+1] */
    function clampTime() {
      var maxT = state.width1 + state.width2 + 1;
      state.timeT = Math.min(maxT, Math.max(-1, state.timeT));
    }

    function syncTimeInputs() {
      tRange.max = String(state.width1 + state.width2 + 1);
      [[tRange, state.timeT], [w1Range, state.width1], [w2Range, state.width2]].forEach(function (pair) {
        var range = pair[0];
        range.value = String(pair[1]);
        var number = range.nextSibling;
        if (number && number.tagName === "INPUT") {
          number.value = String(pair[1]);
          number.max = range.max;
        }
      });
    }

    var frameHandle = 0;
    var lastStamp = 0;

    function stopPlayback() {
      state.playing = false;
      if (frameHandle) { cancelAnimationFrame(frameHandle); frameHandle = 0; }
      playButton.textContent = "▶ 播放";
    }

    function tick(stamp) {
      if (!state.playing) return;
      var maxT = state.width1 + state.width2 + 1;
      var dtSeconds = lastStamp ? Math.min((stamp - lastStamp) / 1000, 0.1) : 0.016;
      lastStamp = stamp;
      state.timeT += dtSeconds * (maxT + 1) / 4;      /* 约 4 秒扫完一遍 */
      if (state.timeT >= maxT) { state.timeT = maxT; stopPlayback(); }
      syncTimeInputs();
      draw();
      if (state.playing) frameHandle = requestAnimationFrame(tick);
    }

    playButton.addEventListener("click", function () {
      if (state.playing) { stopPlayback(); return; }
      if (state.timeT >= state.width1 + state.width2 + 1) state.timeT = -1;
      state.playing = true;
      lastStamp = 0;
      playButton.textContent = "⏸ 暂停";
      frameHandle = requestAnimationFrame(tick);
    });

    resetButton.addEventListener("click", function () {
      stopPlayback();
      state.timeT = -1;
      syncTimeInputs();
      draw();
    });

    /* 点击上图选取历史位置：显示 τ 与它已经历的时间 t−τ */
    canvas.addEventListener("click", function (event) {
      var rect = canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      if (y > 170) return;                              /* 只在上视口（τ 轴）有效 */
      var span = state.width1 + Math.max(state.width2, state.width1) + 2;
      var plotW = Math.max(rect.width, 100) - 44 - 16;
      var tau = ((x - 44) / plotW) * span - 1;          /* 与 toX 的 baseline=−1 对应 */
      if (tau < 0 || tau > state.width1) {
        history.textContent = "τ=" + formatNumber(tau) + " s 不在输入支撑 [0, " + formatNumber(state.width1) + "] 内。";
      } else {
        history.textContent = "历史位置 τ=" + formatNumber(tau) + " s：已历经 " + formatNumber(state.timeT - tau) +
          " s，h(t−τ)=" + formatNumber(practiceCalc.hValue(state.timeT - tau, state.width2)) +
          "，该点按 x(τ)·h(t−τ)·dτ 计入当前输出。";
      }
      draw();
    });

    var resizeHandler = function () { draw(); };
    window.addEventListener("resize", resizeHandler);
    demo.__cleanup = function () {
      stopPlayback();
      window.removeEventListener("resize", resizeHandler);
    };

    function draw() {
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var box = canvas.getBoundingClientRect();
      var width = Math.max(box.width, 100);
      var height = 340;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var accent = canvasColor("--accent");
      var accentInk = canvasColor("--accent-ink");
      var warm = canvasColor("--warm");
      var gridSoft = "rgba(128, 133, 141, 0.14)";
      var gridMid = "rgba(128, 133, 141, 0.34)";
      var gridText = "rgba(128, 133, 141, 0.78)";
      var margin = { left: 44, right: 16, top: 16, bottom: 22 };
      var plotW = width - margin.left - margin.right;
      var w1 = state.width1;
      var w2 = state.width2;
      var t = state.timeT;
      var span = w1 + Math.max(w2, w1) + 2;
      var baseline = -1;
      var toX = function (tau) { return margin.left + ((tau - baseline) / span) * plotW; };

      var topTop = margin.top;
      var topH = 128;
      var topBase = topTop + topH;
      var botTop = 186;
      var botH = 108;
      var botBase = botTop + botH;

      ctx.font = "11px system-ui, sans-serif";
      ctx.strokeStyle = gridSoft;
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= 6; gx += 1) {
        var gxp = margin.left + (plotW * gx) / 6;
        ctx.beginPath(); ctx.moveTo(gxp, topTop); ctx.lineTo(gxp, topBase); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gxp, botTop); ctx.lineTo(gxp, botBase); ctx.stroke();
      }
      ctx.strokeStyle = gridMid;
      ctx.beginPath(); ctx.moveTo(margin.left, topBase); ctx.lineTo(margin.left + plotW, topBase); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(margin.left, botBase); ctx.lineTo(margin.left + plotW, botBase); ctx.stroke();

      /* 上图：x(τ) 与 h(t−τ)，重叠区填充 */
      var peak = Math.min(w1, w2);
      var yUnit = topH - 18;    /* 输入脉冲恒为单位高度，与输出峰值无关 */
      ctx.strokeStyle = accentInk;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(toX(0), topBase);
      ctx.lineTo(toX(0), topBase - yUnit);
      ctx.lineTo(toX(w1), topBase - yUnit);
      ctx.lineTo(toX(w1), topBase);
      ctx.stroke();

      var lo = Math.max(0, t - w2);
      var hi = Math.min(w1, t);
      if (hi > lo) {
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.rect(toX(lo), topBase - yUnit, toX(hi) - toX(lo), yUnit);
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(toX(t - w2), topBase);
      ctx.lineTo(toX(t - w2), topBase - yUnit);
      ctx.lineTo(toX(t), topBase - yUnit);
      ctx.lineTo(toX(t), topBase);
      ctx.stroke();
      ctx.restore();

      /* 下图：y(t) 全曲线 + 游标 */
      var yScale = (botH - 16) / Math.max(peak, 1e-6);
      var end = w1 + w2;
      ctx.strokeStyle = accentInk;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var i = 0; i <= 240; i += 1) {
        var tv = (i / 240) * end;
        var yv = practiceCalc.convolutionAnalytic(tv, w1, w2);
        var px = toX(tv);
        var py = botBase - yv * yScale;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      var cursorY = botBase - practiceCalc.convolutionAnalytic(t, w1, w2) * yScale;
      ctx.strokeStyle = warm;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(toX(t), botTop);
      ctx.lineTo(toX(t), botBase);
      ctx.stroke();
      ctx.fillStyle = warm;
      ctx.beginPath();
      ctx.arc(toX(t), cursorY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      /* 轴标签 */
      ctx.fillStyle = gridText;
      ctx.textAlign = "left";
      ctx.fillText("τ / s（积分变量）", margin.left, topTop - 4);
      ctx.fillText("t / s（观察时刻）  阴影宽度 = 重叠区间", margin.left, botTop - 6);
      ctx.textAlign = "right";
      ctx.fillText("1", margin.left - 6, topTop + 10);
      ctx.fillText("0", margin.left - 6, topBase + 3);
      ctx.fillText(formatNumber(peak), margin.left - 6, botTop + 10);

      updateMetrics();
    }

    function updateMetrics() {
      var w1 = state.width1;
      var w2 = state.width2;
      var t = state.timeT;
      var lo = Math.max(0, t - w2);
      var hi = Math.min(w1, t);
      var rows = [
        ["当前观察时刻 t", formatNumber(t) + " s", false],
        ["瞬时重叠区间", hi > lo ? "[" + formatNumber(lo) + ", " + formatNumber(hi) + "] s" : "无交集", false],
        ["瞬时输出 y(t)", formatNumber(practiceCalc.convolutionAnalytic(t, w1, w2)), false],
        ["输出支撑区间", "[0, " + formatNumber(w1 + w2) + "] s", true],
        ["理论峰值 min(w₁,w₂)", formatNumber(Math.min(w1, w2)), false],
      ];
      metrics.textContent = "";
      rows.forEach(function (row) {
        var card = document.createElement("div");
        card.className = "demo-metric" + (row[2] ? " is-wide" : "");
        card.appendChild(textElement("span", row[0], "demo-metric-label"));
        card.appendChild(textElement("strong", row[1], "demo-metric-value"));
        metrics.appendChild(card);
      });
    }

    syncTimeInputs();
    demo.appendChild(controls);
    demo.appendChild(wrap);
    demo.appendChild(metrics);
    container.appendChild(demo);
    draw();
    /* 首帧可能在布局完成前执行：下一帧再画一次，保证 backing store = CSS 尺寸 × DPR */
    requestAnimationFrame(draw);
  }


  /* 演练 4：一阶 LTI 系统递推与卷积核对——y[n]=x[n]+a·y[n−1]，
     与 h[n]=a^n·u[n] 卷积 x[n]（单位阶跃）比较两种算法输出。 */
  function renderSignalLtiDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var controls = document.createElement("div");
    controls.className = "demo-controls";
    var state = practiceDemoStates[experiment.id] || (practiceDemoStates[experiment.id] = { a: 0.5, length: 20, input: "step", initial: 0 });
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

    appendResetControl(controls, experiment);

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
        item.className = row[2] === "wide" ? "demo-metric is-wide" : "demo-metric";
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
    var firstDrawTimer = setTimeout(draw, 400);
    window.addEventListener("resize", draw);
    /* 卸载时注销：监听的画布会被下一次渲染丢弃，留着会多份重绘 */
    demo.__cleanup = function () {
      clearTimeout(firstDrawTimer);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", draw);
    };
  }

  /* 演练 5：移动平均 FIR 降噪——x[n]=低频+高频正弦，M 点平均 bₖ=1/M，
     比较高频衰减与群延迟。 */
  function renderSignalFirDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var controls = document.createElement("div");
    controls.className = "demo-controls";
    var state = practiceDemoStates[experiment.id] || (practiceDemoStates[experiment.id] = { f1: 2, f2: 20, window: 5, ratio: 0.6, win: "rect" });
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

    appendResetControl(controls, experiment);

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

      /* 轴刻度：按绘图区宽度自适应，末端让位给单位标签，避免重叠 */
      ctx.fillStyle = gridText;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      var labelEvery = plotW < 480 ? 2 : 1;
      for (var gxt = 0; gxt < 4; gxt += labelEvery) {
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
        item.className = row[2] === "wide" ? "demo-metric is-wide" : "demo-metric";
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
    var firstDrawTimer = setTimeout(draw, 400);
    window.addEventListener("resize", draw);
    /* 卸载时注销：监听的画布会被下一次渲染丢弃，留着会多份重绘 */
    demo.__cleanup = function () {
      clearTimeout(firstDrawTimer);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", draw);
    };
  }

  /* 演练 6：固定随机种子的方差验证——均值 0、方差 σ² 的高斯白噪声，
     三点移动平均后方差理论值 σ²/3。 */
  function renderSignalVarianceDemo(container, experiment) {
    var demo = document.createElement("section");
    demo.className = "notebook-demo";

    var controls = document.createElement("div");
    controls.className = "demo-controls";
    var state = practiceDemoStates[experiment.id] || (practiceDemoStates[experiment.id] = { count: 100000, variance: 9, window: 3, dist: "gauss" });
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

    appendResetControl(controls, experiment);

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

      /* 轴刻度：按绘图区宽度自适应，末端让位给单位标签，避免重叠 */
      ctx.fillStyle = gridText;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      var labelEvery = plotW < 480 ? 2 : 1;
      for (var gxt = 0; gxt < 4; gxt += labelEvery) {
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
        item.className = row[2] === "wide" ? "demo-metric is-wide" : "demo-metric";
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
    var firstDrawTimer = setTimeout(draw, 400);
    window.addEventListener("resize", draw);
    /* 卸载时注销：监听的画布会被下一次渲染丢弃，留着会多份重绘 */
    demo.__cleanup = function () {
      clearTimeout(firstDrawTimer);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", draw);
    };
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
    if (prev === "notebook") {
      var outgoingDemo = notebookRoot.querySelector(".notebook-demo");
      if (outgoingDemo && typeof outgoingDemo.__cleanup === "function") outgoingDemo.__cleanup();
    }
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
      /* 舞台此刻才真正参与布局：在这里再落一次工作台滑块（此前 hidden 状态下测量值全是 0），
         并同步画布中心提示的位置 */
      if (isCircuitWorkbench(wbKind)) syncKindSwitcher(true);
      scheduleCanvasEmptyHint();
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

  /* 顶栏工作台/演练/错题按钮选中态：数字与模拟工作台共用一个入口；演练用 notebook 视图。
     选中态一变，三个入口共用的滑动指示器就跟着滑动（三个都不选中时淡出）。 */
  function syncWorkbenchButton() {
    var active = isCircuitWorkbench(activeWorkbench);
    workbenchButton.classList.toggle("is-active", active);
    workbenchButton.setAttribute("aria-pressed", active ? "true" : "false");
    practiceButton.classList.toggle("is-active", activeWorkbench === "notebook");
    practiceButton.setAttribute("aria-pressed", activeWorkbench === "notebook" ? "true" : "false");
    mistakeButton.classList.toggle("is-active", activeWorkbench === "mistakes");
    mistakeButton.setAttribute("aria-pressed", activeWorkbench === "mistakes" ? "true" : "false");
    syncViewThumb();
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
    var activeButton = null;
    kindSwitchButtons.forEach(function (button) {
      var active = button.dataset.kind === activeWorkbench;
      if (active) activeButton = button;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.setAttribute("tabindex", active ? "0" : "-1");
    });
    /* 与顶栏科目滑块同一套做法：位置与尺寸全部现场测量（不再假设"位移 = 滑块自身尺寸的 100%"）。
       基准取首个分段的左上角，所以数字态依旧是 translate(0, 0)；切换器在断点间从竖向变横向时，
       同一份代码按新几何重新落位，不需要按轴分支，也不互相覆盖。 */
    var first = kindSwitchButtons[0];
    var baseX = first ? first.offsetLeft : 0;
    var baseY = first ? first.offsetTop : 0;
    /* 切换器还没参与布局（在 hidden 的 stage 里）时测量值全是 0：这时不写死尺寸，
       交回 CSS 兜底，等舞台显示后由 setView 再同步一次真正落位 */
    var rendered = kindSwitcher.offsetParent !== null;
    if (!rendered) {
      kindThumb.style.removeProperty("width");
      kindThumb.style.removeProperty("height");
      kindThumb.style.removeProperty("transform");
    } else if (activeButton) {
      kindThumb.style.width = activeButton.offsetWidth + "px";
      kindThumb.style.height = activeButton.offsetHeight + "px";
      kindThumb.style.transform = "translate(" + (activeButton.offsetLeft - baseX) + "px, " + (activeButton.offsetTop - baseY) + "px)";
    }
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

  syncSubjectThumb(true);   /* 首帧就按当前科目落位，不从 0 位置飞入 */
  syncViewThumb(true);      /* 视图入口指示器同理（首帧无选中项则保持隐藏） */
  renderChapters();
})();
