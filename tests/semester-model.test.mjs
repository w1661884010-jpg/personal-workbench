import assert from "node:assert/strict";
import test from "node:test";
import { analogCourse } from "../app/data/courses/analog.ts";
import { digitalCourse } from "../app/data/courses/digital.ts";
import { signalsCourse } from "../app/data/courses/signals.ts";
import {
  completeChapter,
  createLearningBackup,
  createLearningState,
  getChapterStatus,
  getCourseProgress,
  startChapter,
  submitChapterCheck,
  validateLearningBackup,
} from "../app/lib/course-model.ts";

const courses = [signalsCourse, digitalCourse, analogCourse];

test("V2 keeps the confirmed course order and complete textbook chapter order", () => {
  assert.deepEqual(courses.map((course) => course.title), ["信号与系统", "数字电子技术", "模拟电子技术"]);
  assert.deepEqual(signalsCourse.chapters.map(({ number, title, counted }) => [number, title, counted]), [
    ["绪论", "信号分析与处理概览", false],
    ["第1章", "连续信号的分析", true],
    ["第2章", "离散信号的分析", true],
    ["第3章", "信号处理基础", true],
    ["第4章", "滤波器", true],
    ["第5章", "随机信号分析与处理基础（课程范围待确认）", true],
  ]);
  assert.deepEqual(digitalCourse.chapters.map(({ number, title }) => [number, title]), [
    ["1", "数制和码制"], ["2", "逻辑代数基础"], ["3", "门电路"], ["4", "组合逻辑电路"],
    ["5", "半导体存储电路"], ["6", "时序逻辑电路"], ["7", "脉冲波形的产生和整形"], ["8", "数-模和模-数转换"],
  ]);
  assert.deepEqual(analogCourse.chapters.map(({ number, title }) => [number, title]), [
    ["0", "绪论"], ["1", "常用半导体器件"], ["2", "基本放大电路"], ["3", "多级放大电路"],
    ["4", "集成运算放大电路"], ["5", "放大电路的频率响应"], ["6", "放大电路中的反馈"],
    ["7", "信号的运算和处理"], ["8", "波形的发生和信号的转换"], ["9", "功率放大电路"], ["10", "直流电源"],
  ]);
});
test("every chapter has the seven learning stages, an 80/20 split, and explicit source evidence", () => {
  const allowedSources = new Set(["verified_local", "supplemental_local", "insufficient"]);
  const ids = new Set();
  for (const course of courses) {
    assert.ok(course.textbook.length > 5, `${course.id}: textbook`);
    assert.doesNotMatch(course.textbook, /章节顺序依据|本地未找到|第 0-10 章顺序/, `${course.id}: textbook label`);
    for (const chapter of course.chapters) {
      for (const key of ["objectives", "prerequisites", "sections", "examples", "experiments", "check", "summary"]) {
        assert.ok(Array.isArray(chapter[key]) && chapter[key].length > 0, `${chapter.id}: ${key}`);
      }
      assert.ok(chapter.tags.length > 0, `${chapter.id}: tags`);
      assert.ok(allowedSources.has(chapter.sourceStatus), `${chapter.id}: chapter source status`);
      assert.equal(chapter.sections.filter((section) => section.importance === "core").length / chapter.sections.length, 0.8, `${chapter.id}: core ratio`);
      assert.equal(chapter.sections.filter((section) => section.importance === "optional").length / chapter.sections.length, 0.2, `${chapter.id}: optional ratio`);
      assert.ok(chapter.check.length >= 2, `${chapter.id}: at least two check questions`);
      for (const section of chapter.sections) {
        assert.ok(allowedSources.has(section.sourceStatus), `${section.id}: section source status`);
        if (section.sourceStatus === "insufficient") assert.equal(section.content, "", `${section.id}: insufficient content stays blank`);
        else assert.ok(section.content.length > 15, `${section.id}: content`);
        assert.equal(ids.has(section.id), false, `${section.id}: duplicate id`);
        ids.add(section.id);
      }
      for (const example of chapter.examples) assert.ok(example.prompt.length > 8 && example.steps.length > 0 && example.answer.length > 3, `${chapter.id}: worked example`);
      for (const experiment of chapter.experiments) {
        assert.ok(experiment.goal.length > 8 && experiment.steps.length > 0 && experiment.expected.length > 8, `${experiment.id}: experiment`);
        assert.match(experiment.workbench, /^(digital|analog|notebook)$/);
      }
      for (const question of chapter.check) {
        assert.ok(question.options.length >= 2, `${question.id}: options`);
        assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, `${question.id}: answer`);
      }
      if (chapter.sourceStatus === "insufficient") {
        assert.ok(chapter.sections.some((section) => section.sourceStatus === "insufficient"), `${chapter.id}: insufficient section`);
        assert.ok(chapter.sections.filter((section) => section.sourceStatus === "insufficient").every((section) => section.content === ""));
      }
    }
  }
});

test("a chapter only contributes to progress after its complete check is submitted", () => {
  const now = new Date("2026-08-24T00:00:00.000Z");
  const chapter = digitalCourse.chapters[0];
  const initial = createLearningState(courses, now);
  assert.deepEqual(getCourseProgress(initial, digitalCourse), { completed: 0, total: 8, percent: 0 });
  const started = startChapter(initial, digitalCourse.id, chapter.id, now);
  assert.equal(getChapterStatus(started, chapter.id), "in_progress");
  assert.deepEqual(getCourseProgress(started, digitalCourse), { completed: 0, total: 8, percent: 0 });
  assert.throws(() => completeChapter(started, chapter.id, now), /完成章节检验后/);
  assert.throws(() => submitChapterCheck(started, chapter, [-1], now), /回答本章全部检验题/);
  const deliberatelyWrong = chapter.check.map((question) => (question.answer + 1) % question.options.length);
  const submitted = submitChapterCheck(started, chapter, deliberatelyWrong, now);
  assert.equal(submitted.checkSubmissions[chapter.id].score, 0);
  assert.equal(getChapterStatus(submitted, chapter.id), "in_progress");
  assert.deepEqual(getCourseProgress(submitted, digitalCourse), { completed: 0, total: 8, percent: 0 });
  const completed = completeChapter(submitted, chapter.id, now);
  assert.equal(getChapterStatus(completed, chapter.id), "completed");
  assert.deepEqual(getCourseProgress(completed, digitalCourse), { completed: 1, total: 8, percent: 13 });
  assert.equal(initial.chapterStatus[chapter.id], undefined, "updates stay immutable");
});

test("course progress counts textbook chapters rather than time or uncounted introductions", () => {
  const now = new Date("2026-08-24T00:00:00.000Z");
  const intro = signalsCourse.chapters[0];
  const firstCounted = signalsCourse.chapters.find((chapter) => chapter.counted);
  let state = createLearningState(courses, now);
  assert.deepEqual(getCourseProgress(state, signalsCourse), { completed: 0, total: 5, percent: 0 });
  state = submitChapterCheck(startChapter(state, signalsCourse.id, intro.id, now), intro, intro.check.map((question) => question.answer), now);
  state = completeChapter(state, intro.id, now);
  assert.deepEqual(getCourseProgress(state, signalsCourse), { completed: 0, total: 5, percent: 0 });
  state = submitChapterCheck(startChapter(state, signalsCourse.id, firstCounted.id, now), firstCounted, firstCounted.check.map((question) => question.answer), now);
  state = completeChapter(state, firstCounted.id, now);
  assert.deepEqual(getCourseProgress(state, signalsCourse), { completed: 1, total: 5, percent: 20 });
  assert.equal("todayTasks" in state, false);
  assert.equal("currentWeek" in state, false);
  assert.equal("studyMinutes" in state, false);
});

test("V2 backups validate exact chapter references and reject foreign schemas", () => {
  const state = createLearningState(courses, new Date("2026-08-24T00:00:00.000Z"));
  const backup = createLearningBackup(state, new Date("2026-08-24T01:00:00.000Z"));
  assert.deepEqual(validateLearningBackup(backup, courses), state);
  assert.throws(() => validateLearningBackup({ ...backup, app: "foreign-app" }, courses), /不是本学习站点导出的 v2 记录/);
  const damaged = structuredClone(backup);
  damaged.state.currentChapterByCourse.digital = "missing-chapter";
  assert.throws(() => validateLearningBackup(damaged, courses), /结构损坏/);
});

test("initial mistake records include an actionable next review date", () => {
  const state = createLearningState(courses, new Date("2026-08-24T00:00:00.000Z"));
  assert.deepEqual(state.mistakes.map((mistake) => mistake.nextReviewDate), ["2026-08-25", "2026-08-26", "2026-08-27"]);
});
