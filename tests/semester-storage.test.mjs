import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { analogCourse } from "../app/data/courses/analog.ts";
import { digitalCourse } from "../app/data/courses/digital.ts";
import { signalsCourse } from "../app/data/courses/signals.ts";
import { createLearningBackup, createLearningState, validateLearningBackup } from "../app/lib/course-model.ts";

const courses = [signalsCourse, digitalCourse, analogCourse];
const storageUrl = new URL("../app/lib/course-storage.ts", import.meta.url);

test("learning persistence uses a dedicated V2 key while retaining a V1 migration key", async () => {
  const source = await readFile(storageUrl, "utf8");
  assert.match(source, /LEARNING_STORAGE_KEY\s*=\s*"personal-electronics-workbench:state:v2"/);
  assert.match(source, /LEGACY_STORAGE_KEY\s*=\s*"semester-electronics-learning-site:state:v1"/);
  assert.match(source, /storage\.getItem\(LEARNING_STORAGE_KEY\)/);
  assert.match(source, /storage\.getItem\(LEGACY_STORAGE_KEY\)/);
  assert.match(source, /isLearningState\(parsed,\s*courses\)/);
  assert.match(source, /storage\.setItem\(LEARNING_STORAGE_KEY,\s*JSON\.stringify\(state\)\)/);
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

test("V2 JSON backup contract is round-trippable and rejects damaged references", async () => {
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
});

test("browser download and import are real file operations rather than decorative buttons", async () => {
  const source = await readFile(storageUrl, "utf8");
  assert.match(source, /URL\.createObjectURL\(new Blob/);
  assert.match(source, /anchor\.click\(\)/);
  assert.match(source, /URL\.revokeObjectURL/);
  assert.match(source, /readLearningBackupFile/);
  assert.match(source, /await file\.text\(\)/);
});
