import assert from "node:assert/strict";
import test from "node:test";

import {
  BACKUP_APP_ID,
  BackupValidationError,
  SCHEMA_VERSION,
  createDefaultState,
  rolloverDailyState,
  setMastery,
  validateBackup,
} from "../app/lib/model.ts";
import { signalPaths } from "../app/data/board.ts";
import { deferredGroups } from "../app/data/deferred.ts";
import { roadmapTopics } from "../app/data/roadmap.ts";

function validEnvelope(state = createDefaultState(new Date("2026-07-30T08:00:00Z"))) {
  return {
    app: BACKUP_APP_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: "2026-07-30T08:00:00.000Z",
    state,
  };
}

test("default state contains one question and no more than three actionable tasks", () => {
  const state = createDefaultState(new Date("2026-07-30T08:00:00Z"));

  assert.equal(state.schemaVersion, SCHEMA_VERSION);
  assert.ok(state.today.mainQuestion.trim());
  assert.ok(state.today.tasks.length > 0);
  assert.ok(state.today.tasks.length <= 3);
  assert.ok(state.today.tasks.every((task) => task.id && task.title.trim()));
  assert.equal(new Set(state.today.tasks.map((task) => task.id)).size, state.today.tasks.length);
});

test("daily rollover uses the local date, resets daily work, and preserves long-term state", () => {
  const previousDay = new Date(2026, 6, 30, 23, 30);
  const nextDay = new Date(2026, 6, 31, 0, 15);
  const state = createDefaultState(previousDay);
  const topicId = roadmapTopics[1].id;
  const evidence = {
    id: "evidence-gpio-path",
    topicId,
    kind: "trace-signal",
    description: "从程序、输出寄存器和 GPIO 追踪到限流电阻与 LED，并核对有效电平。",
    createdAt: previousDay.toISOString(),
  };
  const record = {
    id: `record-${state.today.date}-${topicId}`,
    date: state.today.date,
    topicId,
    masteryLevel: "apply",
    completion: "completed",
    summary: "完成数字输出信号路径验证。",
    evidenceIds: [evidence.id],
    errors: "",
    questions: "按键输入限定应怎样选择？",
    reviewItems: "复习 GPIO QSEL",
    relatedResources: "Gpio.c；GPxQSEL",
    nextStep: "确认按键输入的有效电平",
    updatedAt: previousDay.toISOString(),
  };

  state.currentTopicId = topicId;
  state.today = {
    ...state.today,
    mainQuestion: roadmapTopics[1].question,
    tasks: roadmapTopics[1].tasks.map((task) => ({
      id: `today-${topicId}-${task.id}`,
      title: task.title,
      completed: true,
      target: task.targetSignalPathId
        ? { kind: "signalPath", id: task.targetSignalPathId }
        : { kind: "topic", id: topicId },
    })),
    carryOver: record.questions,
    nextStep: record.nextStep,
  };
  state.evidence = [evidence];
  state.records = [record];
  state.mastery[topicId] = {
    level: "apply",
    evidenceIds: [evidence.id],
  };
  state.deferredReasons = {
    can: "先完成当前 GPIO 和中断主线。",
  };

  const rolled = rolloverDailyState(state, nextDay);

  assert.equal(rolled.today.date, "2026-07-31");
  assert.equal(rolled.currentTopicId, topicId);
  assert.equal(rolled.today.mainQuestion, state.today.mainQuestion);
  assert.equal(rolled.today.carryOver, state.today.carryOver);
  assert.equal(rolled.today.nextStep, state.today.nextStep);
  assert.ok(rolled.today.tasks.every((task) => task.completed === false));
  assert.deepEqual(rolled.mastery, state.mastery);
  assert.deepEqual(rolled.evidence, state.evidence);
  assert.deepEqual(rolled.records, state.records);
  assert.deepEqual(rolled.deferredReasons, state.deferredReasons);
  assert.equal(rolled.mastery, state.mastery);
  assert.equal(rolled.evidence, state.evidence);
  assert.equal(rolled.records, state.records);
  assert.equal(rolled.deferredReasons, state.deferredReasons);
  assert.notEqual(rolled, state);
  assert.notEqual(rolled.today, state.today);
  assert.notEqual(rolled.today.tasks, state.today.tasks);
  assert.ok(state.today.tasks.every((task) => task.completed === true));
  assert.equal(rolled.updatedAt, nextDay.toISOString());
});

test("daily rollover is a no-op when the saved local date is already current", () => {
  const now = new Date(2026, 6, 31, 18, 45);
  const state = createDefaultState(now);

  assert.equal(rolloverDailyState(state, now), state);
});

test("static content has six ordered topics, five signal paths, and stable unique ids", () => {
  assert.equal(roadmapTopics.length, 6);
  assert.deepEqual(
    roadmapTopics.map((topic) => topic.order),
    [1, 2, 3, 4, 5, 6],
  );
  assert.equal(signalPaths.length, 5);

  for (const collection of [roadmapTopics, signalPaths]) {
    const ids = collection.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.every((id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)));
  }

  const signalNodeIds = signalPaths.flatMap((path) => path.nodes.map((node) => node.id));
  assert.equal(new Set(signalNodeIds).size, signalNodeIds.length);
  assert.ok(signalPaths.every((path) => path.nodes.length >= 4));
});

test("roadmap keeps the requested main line and does not add a C-language stage", () => {
  assert.deepEqual(
    roadmapTopics.map((topic) => topic.title),
    [
      "CCS 与工程结构",
      "F28335 时钟、GPIO、LED 和按键",
      "轮询、中断与 CPU Timer",
      "ePWM",
      "ADC 与采样",
      "基础例程综合验证",
    ],
  );
  assert.equal(
    roadmapTopics.some((topic) => /C\s*语言/i.test(topic.title)),
    false,
  );
  assert.ok(roadmapTopics.every((topic) => topic.tasks.length > 0 && topic.tasks.length <= 3));
});

test("deferred content is grouped and includes every explicitly deferred topic", () => {
  const titles = deferredGroups.flatMap((group) => group.items.map((item) => item.title));

  for (const title of [
    "STM32",
    "PLC",
    "CAN",
    "DMA",
    "eCAP/eQEP",
    "电机控制",
    "SVPWM",
    "PMSM",
    "BLDC",
    "操作系统",
    "高级 DSP",
    "完整 FFT 与数字滤波",
  ]) {
    assert.ok(titles.includes(title), `missing deferred topic: ${title}`);
  }

  const ids = deferredGroups.flatMap((group) => [
    group.id,
    ...group.items.map((item) => item.id),
  ]);
  assert.equal(new Set(ids).size, ids.length);
});

test("apply mastery is rejected until a complete evidence record is linked", () => {
  const state = createDefaultState(new Date("2026-07-30T08:00:00Z"));

  assert.throws(
    () => setMastery(state, state.currentTopicId, "apply"),
    /能应用.*证据/,
  );

  const withEvidence = {
    ...state,
    evidence: [
      {
        id: "evidence-ccs-first-build",
        topicId: state.currentTopicId,
        kind: "build-debug",
        description:
          "Clean Build 为 0 errors；下载后在 main() 命中断点，并记录入口文件与链接命令文件的作用。",
        createdAt: "2026-07-30T08:15:00.000Z",
      },
    ],
  };
  const promoted = setMastery(
    withEvidence,
    state.currentTopicId,
    "apply",
    ["evidence-ccs-first-build"],
  );

  assert.equal(promoted.mastery[state.currentTopicId].level, "apply");
  assert.deepEqual(promoted.mastery[state.currentTopicId].evidenceIds, [
    "evidence-ccs-first-build",
  ]);
  assert.equal(state.mastery[state.currentTopicId].level, "untouched");
});

test("apply evidence must be complete and belong to the same topic", () => {
  const state = createDefaultState(new Date("2026-07-30T08:00:00Z"));
  const otherTopicId = roadmapTopics[1].id;
  const damagedEvidenceState = {
    ...state,
    evidence: [
      {
        id: "evidence-empty",
        topicId: state.currentTopicId,
        kind: "explain",
        description: "   ",
        createdAt: "2026-07-30T08:15:00.000Z",
      },
      {
        id: "evidence-other-topic",
        topicId: otherTopicId,
        kind: "trace-signal",
        description: "从按键和上拉电阻追踪至 GPIO 输入寄存器并解释读到的电平。",
        createdAt: "2026-07-30T08:20:00.000Z",
      },
    ],
  };

  assert.throws(
    () =>
      setMastery(damagedEvidenceState, state.currentTopicId, "apply", [
        "evidence-empty",
      ]),
    /证据.*完整/,
  );
  assert.throws(
    () =>
      setMastery(damagedEvidenceState, state.currentTopicId, "apply", [
        "evidence-other-topic",
      ]),
    /不属于当前主题/,
  );
});

test("validateBackup accepts a complete envelope without sharing mutable references", () => {
  const envelope = validEnvelope();
  const restored = validateBackup(envelope);

  assert.deepEqual(restored, envelope.state);
  assert.notEqual(restored, envelope.state);
  restored.today.tasks[0].completed = true;
  assert.equal(envelope.state.today.tasks[0].completed, false);
});

test("validateBackup rejects unsupported schemas and does not mutate the input", () => {
  const envelope = validEnvelope();
  const before = structuredClone(envelope);
  envelope.schemaVersion = 99;

  assert.throws(
    () => validateBackup(envelope),
    (error) =>
      error instanceof BackupValidationError &&
      error.issues.some((issue) => issue.includes("schemaVersion")),
  );
  envelope.schemaVersion = before.schemaVersion;
  assert.deepEqual(envelope, before);
});

test("validateBackup rejects damaged foreign keys", () => {
  const envelope = validEnvelope();
  envelope.state.currentTopicId = "topic-that-does-not-exist";

  assert.throws(
    () => validateBackup(envelope),
    (error) =>
      error instanceof BackupValidationError &&
      error.issues.some((issue) => issue.includes("currentTopicId")),
  );
});

test("validateBackup rejects more than three daily tasks and apply without evidence", () => {
  const tooManyTasks = validEnvelope();
  tooManyTasks.state.today.tasks.push({
    id: "today-fourth-task",
    title: "不应被接受的第四项任务",
    completed: false,
    target: {
      kind: "topic",
      id: tooManyTasks.state.currentTopicId,
    },
  });
  assert.throws(() => validateBackup(tooManyTasks), /today\.tasks.*3/);

  const unsupportedApply = validEnvelope();
  unsupportedApply.state.mastery[unsupportedApply.state.currentTopicId] = {
    level: "apply",
    evidenceIds: [],
  };
  assert.throws(() => validateBackup(unsupportedApply), /能应用.*证据/);
});
