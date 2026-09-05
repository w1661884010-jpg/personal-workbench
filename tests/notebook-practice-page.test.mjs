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

test("notebook steps use page-memory completion state and can return to their chapter", async () => {
  const app = await read("app.js");

  assert.match(app, /var notebookChecks\s*=\s*\{\}/);
  assert.match(app, /notebookChecks\[experiment\.id\]/);
  assert.match(app, /classList\.toggle\(["']is-done["']/);
  assert.match(app, /setAttribute\(["']aria-pressed["']/);
  assert.match(app, /setView\(["']notebook["']\)/);
  assert.match(app, /jumpToChapter\(chapter\.id\)/);
  assert.doesNotMatch(app, /localStorage\.(?:getItem|setItem)\([^\n]*notebook/i);
});
