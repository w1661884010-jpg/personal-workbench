import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

async function loadCourses() {
  const source = await read("courses.js");
  const context = vm.createContext({});
  vm.runInContext(source, context, { filename: "courses.js" });
  return context.CoursesData.courses;
}

test("all six signal experiments contain enough evidence for a notebook practice page", async () => {
  const courses = await loadCourses();
  const signals = courses.find((course) => course.id === "signals");
  const experiments = signals.chapters.flatMap((chapter) => chapter.experiments);

  assert.equal(experiments.length, 6);
  assert.ok(experiments.every((experiment) => experiment.workbench === "notebook"));
  assert.ok(experiments.every((experiment) => experiment.goal && experiment.steps.length && experiment.expected));
});

test("notebook experiment cards open a dedicated practice view instead of a toast", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);

  assert.match(html, /id=["']notebookRoot["']/);
  assert.match(app, /function openNotebookExperiment\(experiment, chapter\)/);
  assert.match(app, /function renderNotebookView\(course, chapter, experiment\)/);
  assert.match(app, /openNotebookExperiment\(experiment, chapter\)/);
  assert.match(app, /openButton\.textContent\s*=\s*experiment\.workbench\s*===\s*["']notebook["']\s*\?\s*["']打开实验["']/);
  assert.doesNotMatch(app, /实验步骤已在本页列出|查看使用方式/);
});

test("notebook steps are listed plainly while the page-memory state stays intact", async () => {
  const app = await read("app.js");

  assert.match(app, /var notebookChecks\s*=\s*\{\}/);
  assert.match(app, /notebookChecks\[experiment\.id\]/);
  /* 意图修正：步骤区只列出（编号+全文），去掉完成/进度 UI 与勾选；
     底层状态仍保留在内存，返回章节链不变 */
  assert.match(app, /textElement\("span", step, "step-copy"\)/);
  assert.doesNotMatch(app, /step-check[\s\S]{0,120}addEventListener\("click"/, "no check-toggling click handlers");
  assert.doesNotMatch(app, /notebook-progress|"已完成 " \+/);
  assert.match(app, /setView\(["']notebook["']\)/);
  assert.match(app, /jumpToChapter\(chapter\.id\)/);
  assert.doesNotMatch(app, /localStorage\.(?:getItem|setItem)\([^\n]*notebook/i);
});
