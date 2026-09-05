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

test("3010 bundles the corrected original course content", async () => {
  const courses = await loadCourses();
  const analog = courses.find((course) => course.id === "analog");

  assert.ok(analog, "analog course must be present");
  assert.match(analog.textbook, /第六版（官方电子教案章序）/);
  assert.doesNotMatch(JSON.stringify(analog), /第四版/);
  assert.equal(analog.chapters.filter((chapter) => chapter.counted).length, 10);
  assert.equal(analog.chapters.find((chapter) => chapter.id === "analog-11")?.counted, false);
  assert.equal(
    analog.chapters.find((chapter) => chapter.id === "analog-02")?.sections.find((section) => section.id === "analog-02-s4")?.title,
    "h 参数等效模型与三种接法",
  );
});

test("3010 mounts real chapter text instead of fixed placeholder copy", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);

  for (const id of ["lessonGuideContent", "lessonFocusList", "lessonBody", "lessonResources"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing dynamic mount #${id}`);
  }
  assert.doesNotMatch(html, /正文占位|用于观察行宽边界/);
  assert.match(app, /function renderLesson\(course, chapter\)/);
  assert.match(app, /chapter\.sections\.forEach/);
  assert.match(app, /section\.content/);
  assert.match(app, /section\.formula/);
  assert.match(app, /section\.variables/);
  assert.match(app, /chapter\.examples\.forEach/);
  assert.match(app, /chapter\.experiments\.forEach/);
  assert.match(app, /chapter\.check\.forEach/);
  assert.match(app, /appendList\(summary, chapter\.summary/);
  assert.match(app, /renderLesson\(course, chapter\)/);
});

test("the migrated lesson surface omits instructional figures", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  const lessonSurface = `${html}\n${app}`;

  assert.doesNotMatch(lessonSurface, /StudyDiagram|study-diagram|图示内容/);
  assert.doesNotMatch(html, /<(?:canvas|figure|img)\b/i);
  assert.doesNotMatch(app, /createElement\(["'](?:canvas|figure|img)["']\)/i);
});
