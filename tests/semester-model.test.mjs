import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let data;
let model;

before(async () => {
  vite = await createServer({
    appType: "custom",
    configFile: false,
    logLevel: "silent",
    root: process.cwd(),
    server: { middlewareMode: true },
  });
  [data, model] = await Promise.all([
    vite.ssrLoadModule("/app/data/semester.ts"),
    vite.ssrLoadModule("/app/lib/semester-model.ts"),
  ]);
});
after(async () => {
  await vite?.close();
});

test("the semester starts with the exact three-course chapter map and complete knowledge cards", () => {
  assert.deepEqual(
    data.courses.map((course) => ({
      title: course.title,
      chapters: course.chapters.map((chapter) => chapter.title),
    })),
    [
      {
        title: "数字电子技术",
        chapters: ["数制与逻辑门", "布尔代数与卡诺图", "组合逻辑电路", "触发器", "时序逻辑电路", "计数器与寄存器"],
      },
      {
        title: "模拟电子技术",
        chapters: ["二极管", "三极管", "静态工作点", "基本放大电路", "小信号模型", "运算放大器", "反馈", "频率响应"],
      },
      {
        title: "信号与系统",
        chapters: ["连续与离散信号", "系统性质", "LTI 系统", "卷积", "傅里叶级数", "傅里叶变换", "拉普拉斯变换", "采样"],
      },
    ],
  );

  const topics = data.courses.flatMap((course) => course.chapters.map((chapter) => chapter.topic));
  assert.equal(topics.length, 22);
  for (const topic of topics) {
    assert.ok(topic.problem.length > 8, `${topic.id}: problem`);
    assert.ok(topic.prerequisites.length > 0, `${topic.id}: prerequisites`);
    assert.ok(topic.coreConcept.length > 20, `${topic.id}: core concept`);
    assert.ok(topic.formula.expression.length > 2, `${topic.id}: formula`);
    assert.ok(topic.formula.variables.length > 0, `${topic.id}: variables`);
    assert.ok(topic.minimalExample.length > 15, `${topic.id}: example`);
    assert.ok(topic.commonErrors.length >= 2, `${topic.id}: errors`);
    assert.ok(topic.selfTest.length >= 2, `${topic.id}: self-test`);
    assert.ok(topic.evidencePrompt.length > 10, `${topic.id}: evidence`);
    assert.ok(topic.tags.length > 0, `${topic.id}: tags`);
    assert.match(topic.diagram, /^(logic|circuit|wave|system|spectrum|sampling)$/);
  }
});

test("default state is usable and progress is derived from mastery", () => {
  const state = model.createSemesterState(new Date("2026-08-20T08:00:00.000Z"));
  assert.equal(state.todayTasks.length, 3);
  assert.ok(state.mistakes.length >= 3);
  assert.ok(state.reviews.length >= 3);
  assert.ok(state.learningLogs.length >= 3);

  const course = data.courses[0];
  const topicId = course.chapters.at(-1).topic.id;
  const before = model.getCourseProgress(state, course.id);
  const updated = model.updateMastery(state, topicId, "apply");
  const afterProgress = model.getCourseProgress(updated, course.id);

  assert.ok(afterProgress > before);
  assert.equal(model.getOverallProgress(updated) >= model.getOverallProgress(state), true);
  assert.equal(state.mastery[topicId], "recognize");
});

test("tasks, review scheduling, evidence, and mistakes update immutably", () => {
  const state = model.createSemesterState(new Date("2026-08-20T08:00:00.000Z"));
  const taskId = state.todayTasks[0].id;
  const topicId = state.todayTasks[0].topicId;

  const toggled = model.toggleTask(state, taskId);
  assert.equal(toggled.todayTasks[0].completed, !state.todayTasks[0].completed);
  assert.notEqual(toggled.todayTasks, state.todayTasks);

  const withEvidence = model.updateEvidence(state, topicId, "我能独立写出卷积积分并画出翻转、平移和重叠区间。");
  assert.match(withEvidence.evidence[topicId], /卷积积分/);

  const reviewed = model.markTopicReviewed(state, topicId, new Date("2026-08-20T10:00:00.000Z"));
  const review = reviewed.reviews.find((item) => item.topicId === topicId);
  assert.equal(review.lastReviewedAt, "2026-08-20T10:00:00.000Z");
  assert.equal(review.dueDate, "2026-08-27");

  const added = model.upsertMistake(state, {
    id: "mistake-new",
    title: "卷积积分分段边界写错",
    courseId: "signals",
    chapterId: "signals-convolution",
    topicId: "signals-convolution-topic",
    reason: "没有先画出两个信号的重叠区间。",
    correctApproach: "先固定 t，再按重叠端点变化分段写积分上下限。",
    nextReviewDate: "2026-08-24",
    mastered: false,
    updatedAt: "2026-08-20T10:00:00.000Z",
  });
  assert.equal(added.mistakes.at(-1).id, "mistake-new");
  assert.equal(state.mistakes.some((item) => item.id === "mistake-new"), false);
});

test("backup validation rejects foreign schemas and damaged references", () => {
  const state = model.createSemesterState(new Date("2026-08-20T08:00:00.000Z"));
  const envelope = model.createSemesterBackupEnvelope(state, new Date("2026-08-20T10:00:00.000Z"));
  assert.deepEqual(model.validateSemesterBackup(envelope), state);

  assert.throws(
    () => model.validateSemesterBackup({ ...envelope, app: "foreign-app" }),
    /不是本学习站点导出的/,
  );
  const damaged = structuredClone(envelope);
  damaged.state.todayTasks[0].topicId = "missing-topic";
  assert.throws(() => model.validateSemesterBackup(damaged), /topicId/);
});
