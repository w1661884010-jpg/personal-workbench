import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createServer } from "vite";

let vite;
let model;
let storageModule;
let markdownModule;

before(async () => {
  vite = await createServer({
    appType: "custom",
    configFile: false,
    logLevel: "silent",
    root: process.cwd(),
    server: {
      middlewareMode: true,
    },
  });

  [model, storageModule, markdownModule] = await Promise.all([
    vite.ssrLoadModule("/app/lib/model.ts"),
    vite.ssrLoadModule("/app/lib/storage.ts"),
    vite.ssrLoadModule("/app/lib/markdown.ts"),
  ]);
});

after(async () => {
  await vite?.close();
});

function createMemoryStorage(initialValue) {
  const values = new Map();
  if (initialValue !== undefined) {
    values.set(storageModule.STORAGE_KEY, initialValue);
  }

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

test("loadState falls back to null when storage is missing or damaged", () => {
  assert.equal(storageModule.loadState(null), null);
  assert.equal(storageModule.loadState(createMemoryStorage("{damaged")), null);

  const unsupported = model.createDefaultState(
    new Date(2026, 6, 30, 8, 0, 0),
  );
  unsupported.schemaVersion = 99;
  assert.equal(
    storageModule.loadState(
      createMemoryStorage(JSON.stringify(unsupported)),
    ),
    null,
  );
});

test("saveState and loadState preserve one validated local copy", () => {
  const state = model.createDefaultState(new Date(2026, 6, 30, 8, 0, 0));
  state.today.tasks[0].completed = true;
  const memoryStorage = createMemoryStorage();

  storageModule.saveState(state, memoryStorage);
  const loaded = storageModule.loadState(memoryStorage);

  assert.deepEqual(loaded, state);
  assert.notEqual(loaded, state);
  loaded.today.tasks[0].completed = false;
  assert.equal(state.today.tasks[0].completed, true);
});

test("JSON backup round-trips through a complete versioned envelope", () => {
  const exportedAt = new Date("2026-07-30T08:15:00.000Z");
  const state = model.createDefaultState(new Date(2026, 6, 30, 8, 0, 0));
  const serialized = storageModule.serializeBackup(state, exportedAt);
  const envelope = JSON.parse(serialized);

  assert.equal(envelope.app, model.BACKUP_APP_ID);
  assert.equal(envelope.schemaVersion, model.SCHEMA_VERSION);
  assert.equal(envelope.exportedAt, exportedAt.toISOString());
  assert.deepEqual(envelope.state, state);
  assert.ok(serialized.endsWith("\n"));

  const restored = storageModule.restoreBackup(serialized);
  assert.deepEqual(restored, state);
  assert.notEqual(restored, state);
});

test("restoreBackup rejects malformed JSON and invalid foreign keys", () => {
  assert.throws(
    () => storageModule.restoreBackup("{not-json"),
    /不是有效的 JSON/,
  );

  const state = model.createDefaultState(new Date(2026, 6, 30, 8, 0, 0));
  const envelope = storageModule.createBackupEnvelope(
    state,
    new Date("2026-07-30T08:15:00.000Z"),
  );
  envelope.state.currentTopicId = "missing-topic";

  assert.throws(
    () => storageModule.restoreBackup(JSON.stringify(envelope)),
    /currentTopicId/,
  );
});

test("readTextFile strips a UTF-8 BOM without changing Chinese content", async () => {
  const content = await storageModule.readTextFile(
    new Blob(["\uFEFF今日学习：GPIO"], {
      type: "text/plain;charset=utf-8",
    }),
  );

  assert.equal(content, "今日学习：GPIO");
  assert.match(storageModule.JSON_MIME_TYPE, /charset=utf-8/i);
  assert.match(markdownModule.MARKDOWN_MIME_TYPE, /charset=utf-8/i);
});

test("local date and YAML helpers avoid UTC date drift and invalid frontmatter", () => {
  const localDate = new Date(2026, 0, 2, 0, 5, 0);

  assert.equal(markdownModule.formatLocalDate(localDate), "2026-01-02");
  assert.equal(
    markdownModule.getDailyMarkdownFilename(localDate),
    "2026-01-02.md",
  );
  assert.equal(
    markdownModule.escapeYamlString('CCS: "入口"\n路径\\main'),
    '"CCS: \\"入口\\"\\n路径\\\\main"',
  );
  assert.throws(
    () => markdownModule.getDailyMarkdownFilename("2026/01/02"),
    /YYYY-MM-DD/,
  );
});

test("daily Markdown keeps fixed sections and includes today's evidence", () => {
  const now = new Date(2026, 6, 30, 9, 0, 0);
  const state = model.createDefaultState(now);
  const topicId = state.currentTopicId;
  const evidenceId = "evidence-first-build";
  const createdAt = new Date(2026, 6, 30, 9, 20, 0).toISOString();

  state.today.tasks[0].completed = true;
  state.today.nextStep = "核对工程器件和链接配置。";
  state.evidence.push({
    id: evidenceId,
    topicId,
    kind: "build-debug",
    description: "Clean Build 为 0 errors，并在 main() 命中断点。",
    createdAt,
  });
  state.mastery[topicId] = {
    level: "apply",
    evidenceIds: [evidenceId],
  };
  state.records.push({
    id: "record-2026-07-30",
    date: state.today.date,
    topicId,
    masteryLevel: "apply",
    completion: "completed",
    summary: "确认了入口文件与链接命令文件的职责。",
    evidenceIds: [evidenceId],
    errors: "旧教程中的菜单位置与 CCS 12.3 不同。",
    questions: "目标配置文件何时参与连接？",
    reviewItems: "复习链接阶段的输入与输出。",
    relatedResources: "app/main.c\nClean Build Project",
    nextStep: "核对工程器件和链接配置。",
    updatedAt: createdAt,
  });

  const markdown = markdownModule.buildDailyMarkdown(state);
  const sectionHeadings = markdown.match(/^## .+$/gm);

  assert.match(markdown, /^---\ndate: 2026-07-30\n/);
  assert.match(markdown, /topic: "CCS 与工程结构"/);
  assert.match(markdown, /topic_id: "ccs-project-structure"/);
  assert.deepEqual(sectionHeadings, [
    "## 当前主题",
    "## 今日主问题",
    "## 任务结果",
    "## 掌握证据",
    "## 错误或疑问",
    "## 相关文件或命令",
    "## 下次第一件事",
  ]);
  assert.match(markdown, /- \[x\] 打开最小工程并完成一次编译/);
  assert.match(markdown, /学习总结：确认了入口文件与链接命令文件的职责/);
  assert.match(markdown, /\*\*编译、下载或调试\*\*：Clean Build 为 0 errors/);
  assert.match(markdown, /错误：旧教程中的菜单位置与 CCS 12\.3 不同/);
  assert.match(markdown, /疑问：目标配置文件何时参与连接/);
  assert.match(markdown, /- app\/main\.c/);
  assert.match(markdown, /- Clean Build Project/);
  assert.match(markdown, /核对工程器件和链接配置/);
  assert.ok(markdown.endsWith("\n"));
});
