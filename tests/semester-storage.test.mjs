import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let model;
let storage;

before(async () => {
  vite = await createServer({
    appType: "custom",
    configFile: false,
    logLevel: "silent",
    root: process.cwd(),
    server: { middlewareMode: true },
  });
  [model, storage] = await Promise.all([
    vite.ssrLoadModule("/app/lib/semester-model.ts"),
    vite.ssrLoadModule("/app/lib/semester-storage.ts"),
  ]);
});
after(async () => {
  await vite?.close();
});

function memoryStorage(initial) {
  const values = new Map(initial ? [[storage.SEMESTER_STORAGE_KEY, initial]] : []);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

test("semester storage uses a versioned key and ignores damaged data", () => {
  assert.match(storage.SEMESTER_STORAGE_KEY, /:v1$/);
  assert.equal(storage.loadSemesterState(null), null);
  assert.equal(storage.loadSemesterState(memoryStorage("{damaged")), null);
});

test("save and load preserve an independent validated state", () => {
  const state = model.createSemesterState(new Date("2026-08-20T08:00:00.000Z"));
  const local = memoryStorage();
  storage.saveSemesterState(state, local);
  const loaded = storage.loadSemesterState(local);
  assert.deepEqual(loaded, state);
  assert.notEqual(loaded, state);
});

test("JSON export and import round-trip a complete backup", () => {
  const state = model.createSemesterState(new Date("2026-08-20T08:00:00.000Z"));
  const exportedAt = new Date("2026-08-20T10:00:00.000Z");
  const serialized = storage.serializeSemesterBackup(state, exportedAt);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.app, model.SEMESTER_APP_ID);
  assert.equal(parsed.schemaVersion, model.SEMESTER_SCHEMA_VERSION);
  assert.equal(parsed.exportedAt, exportedAt.toISOString());
  assert.deepEqual(storage.restoreSemesterBackup(serialized), state);
  assert.throws(() => storage.restoreSemesterBackup("not-json"), /有效的 JSON/);
});
