import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { analogCourse } from "../app/data/courses/analog.ts";
import { digitalCourse } from "../app/data/courses/digital.ts";
import { signalsCourse } from "../app/data/courses/signals.ts";
import { createLearningBackup, createLearningState, isLearningState, migrateV2State, migrateV3State, validateLearningBackup } from "../app/lib/course-model.ts";

const courses = [signalsCourse, digitalCourse, analogCourse];
const storageUrl = new URL("../app/lib/course-storage.ts", import.meta.url);

test("learning persistence uses a V4 key while retaining V3, V2, and V1 migration keys", async () => {
  const source = await readFile(storageUrl, "utf8");
  assert.match(source, /LEARNING_STORAGE_KEY\s*=\s*"personal-electronics-workbench:state:v4"/);
  assert.match(source, /PREVIOUS_STORAGE_KEY\s*=\s*"personal-electronics-workbench:state:v3"/);
  assert.match(source, /VERSION_TWO_STORAGE_KEY\s*=\s*"personal-electronics-workbench:state:v2"/);
  assert.match(source, /LEGACY_STORAGE_KEY\s*=\s*"semester-electronics-learning-site:state:v1"/);
  assert.match(source, /storage\.getItem\(LEARNING_STORAGE_KEY\)/);
  assert.match(source, /storage\.getItem\(PREVIOUS_STORAGE_KEY\)/);
  assert.match(source, /storage\.getItem\(VERSION_TWO_STORAGE_KEY\)/);
  assert.match(source, /storage\.getItem\(LEGACY_STORAGE_KEY\)/);
  assert.match(source, /isLearningState\(parsed,\s*courses\)/);
  assert.match(source, /storage\.setItem\(LEARNING_STORAGE_KEY,\s*JSON\.stringify\(state\)\)/);
});

test("V2 multistage progress migrates into the merged chapter without false completion", () => {
  const now = new Date("2026-08-30T00:00:00.000Z");
  const current = createLearningState(courses, now);
  const v2 = {
    ...current,
    schemaVersion: 2,
    currentChapterByCourse: { ...current.currentChapterByCourse, analog: "analog-03" },
    chapterStatus: { ...current.chapterStatus, "analog-03": "completed", "analog-04": "completed" },
    checkSubmissions: {
      ...current.checkSubmissions,
      "analog-03": { answers: [0, 1], submittedAt: now.toISOString(), score: 100 },
      "analog-04": { answers: [1, 0], submittedAt: now.toISOString(), score: 100 },
    },
    mistakes: current.mistakes.map((mistake) => mistake.courseId === "analog" ? { ...mistake, chapterId: "analog-03" } : mistake),
  };
  const migrated = migrateV2State(v2, courses, new Date("2026-08-30T01:00:00.000Z"));
  assert.ok(migrated);
  assert.equal(migrated.schemaVersion, 4);
  assert.equal(migrated.currentChapterByCourse.analog, "analog-04");
  assert.equal(migrated.chapterStatus["analog-04"], "in_progress");
  assert.equal("analog-03" in migrated.chapterStatus, false);
  assert.equal("analog-03" in migrated.checkSubmissions, false);
  assert.equal("analog-04" in migrated.checkSubmissions, false);
  assert.equal(migrated.mistakes.find((mistake) => mistake.courseId === "analog").chapterId, "analog-04");
  assert.equal(isLearningState(migrated, courses), true);
});

test("legacy V1 migration starts one mapped chapter but never marks it completed", async () => {
  const source = await readFile(storageUrl, "utf8");
  const migration = source.match(/function migrateLegacyState[\s\S]*?(?=\nexport function loadLearningState)/)?.[0];
  assert.ok(migration, "migrateLegacyState must remain explicit and reviewable");
  assert.match(migration, /currentTopicId/);
  assert.match(migration, /currentChapterByCourse/);
  assert.match(migration, /chapterStatus:\s*\{\s*\[chapter\.id\]:\s*"in_progress"\s*\}/);
  assert.doesNotMatch(migration, /"completed"/);
  assert.doesNotMatch(migration, /checkSubmissions:\s*\{[^}]+\}/s);
});

test("V4 JSON backup round-trips and older backups migrate before validation", async () => {
  const source = await readFile(storageUrl, "utf8");
  assert.match(source, /serializeLearningBackup/);
  assert.match(source, /createLearningBackup\(state,\s*exportedAt\)/);
  assert.match(source, /restoreLearningBackup/);
  assert.match(source, /validateLearningBackup\(/);
  assert.match(source, /JSON\.parse\([\s\S]*?,\s*courses\)/);
  assert.match(source, /replace\(\/\^\\uFEFF\//);
  assert.match(source, /导入文件不是有效的 JSON/);
  const state = createLearningState(courses, new Date("2026-08-24T00:00:00.000Z"));
  const backup = createLearningBackup(state, new Date("2026-08-24T02:00:00.000Z"));
  const serialized = `${JSON.stringify(backup, null, 2)}\n`;
  assert.deepEqual(validateLearningBackup(JSON.parse(serialized), courses), state);
  const damaged = JSON.parse(serialized);
  damaged.state.currentChapterByCourse.analog = "missing";
  assert.throws(() => validateLearningBackup(damaged, courses), /结构损坏/);

  const v2 = { ...state, schemaVersion: 2 };
  const migrated = migrateV2State(v2, courses);
  assert.equal(migrated.schemaVersion, 4);
  assert.equal(isLearningState(migrated, courses), true);

  const v3 = {
    ...state,
    schemaVersion: 3,
    mistakes: state.mistakes.map((mistake) => {
      const legacyMistake = { ...mistake };
      delete legacyMistake.origin;
      return { ...legacyMistake, chapterId: mistake.courseId === "digital" ? "digital-01" : mistake.chapterId };
    }),
  };
  const migratedV3 = migrateV3State(v3, courses);
  assert.equal(migratedV3.schemaVersion, 4);
  assert.equal(migratedV3.mistakes.find((mistake) => mistake.courseId === "digital").chapterId, "digital-02");
  assert.ok(migratedV3.mistakes.every((mistake) => mistake.origin === "example"));
  assert.equal(isLearningState(migratedV3, courses), true);
});

test("browser download and import are real file operations rather than decorative buttons", async () => {
  const source = await readFile(storageUrl, "utf8");
  assert.match(source, /URL\.createObjectURL\(new Blob/);
  assert.match(source, /anchor\.click\(\)/);
  assert.match(source, /URL\.revokeObjectURL/);
  assert.match(source, /readLearningBackupFile/);
  assert.match(source, /await file\.text\(\)/);
});
