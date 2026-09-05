# Course Body Migration Without Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3010 copy's placeholder lesson body with the original site's current course text while omitting instructional diagrams.

**Architecture:** Keep `courses.js` as the read-only browser data bundle generated from the original site's three course definitions. Extend the existing vanilla JavaScript renderer so one chapter object drives the guide, objectives, prerequisites, learning sections, formulas, worked examples, experiments, checks, and summary. Render trusted course text with DOM nodes and `textContent`; do not copy `StudyDiagram`, canvas, image, or figure output into the copy.

**Tech Stack:** Static HTML, CSS, browser JavaScript, esbuild-generated IIFE data bundle, Node.js built-in test runner, Playwright browser validation.

## Global Constraints

- Modify only `C:\Users\Lenovo\Documents\codex_projects\personal-workbench-shell`.
- Treat `C:\Users\Lenovo\Documents\codex_projects\personal-workbench-sites\app\data\courses` as the source of truth.
- Keep the 3010 navigation, theme controls, workbench bundle, and overall layout unchanged.
- Remove only instructional diagram content; keep UI icons and the separate circuit workbench.
- Do not publish or push.

---

### Task 1: Lock the migration contract

**Files:**
- Create: `tests/course-content-migration.test.mjs`

**Interfaces:**
- Consumes: `courses.js`, `index.html`, and `app.js`.
- Produces: executable assertions for current source data, dynamic chapter rendering, and absence of instructional figures.

- [x] **Step 1: Write a failing Node test**

  Assert that the bundled analog course uses the sixth-edition lesson-plan wording and 10 counted chapters; assert that the HTML has dynamic content mount points; assert that `app.js` renders every textual chapter collection; assert that neither page nor renderer contains instructional `canvas`, `figure`, image, or `StudyDiagram` markup.

- [x] **Step 2: Run the test and capture the expected failure**

  Run: `node --test tests/course-content-migration.test.mjs`

  Expected: FAIL because `courses.js` is stale and the lesson body is still hard-coded.

### Task 2: Refresh the source data bundle

**Files:**
- Regenerate: `courses.js`

**Interfaces:**
- Consumes: original `app/data/courses/index.ts` export `courses`.
- Produces: global browser object `CoursesData` with the corrected three-course content.

- [x] **Step 1: Bundle the original course index**

  Use the original repository's installed `esbuild` to bundle `app/data/courses/index.ts` as an IIFE named `CoursesData`, targeting the browser and writing `courses.js`.

- [x] **Step 2: Verify the bundle contract**

  Run the Node migration test and confirm the data assertions pass while renderer assertions still fail.

### Task 3: Render the full textual chapter content

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `CourseDefinition` and `ChapterDefinition`-shaped plain objects from `CoursesData.courses`.
- Produces: `renderLesson(course, chapter)`, which fills `lessonGuide`, `lessonFocus`, `lessonBody`, and `lessonResources` without drawing instructional graphics.

- [x] **Step 1: Replace fixed lesson copy with empty mount points**

  Keep the existing article structure and add stable IDs for the guide, focus list, body, and resource/content continuation region.

- [x] **Step 2: Implement the minimal DOM renderer**

  Render the textbook/source note, counted status, objectives, prerequisites, every learning section and its formula/variables, every worked example, experiment, check question, and summary. Create content with `textContent` and ordinary lists/details only.

- [x] **Step 3: Add styles only for the migrated text structures**

  Reuse existing colors and spacing; add readable formula, tag, example, experiment, check, and summary blocks without changing the shell layout.

- [x] **Step 4: Run the focused test**

  Run: `node --test tests/course-content-migration.test.mjs`

  Expected: PASS.

### Task 4: Validate the static copy and rendered flow

**Files:**
- Update: `checklist.md`
- Update: `context-notes.md`

**Interfaces:**
- Consumes: served page at `http://localhost:3010/`.
- Produces: evidence that course switching and chapter switching update the real body without diagrams or runtime errors.

- [x] **Step 1: Run deterministic checks**

  Run: `node --test tests/*.test.mjs` and a whitespace/content scan over the changed files.

- [x] **Step 2: Exercise the browser flow**

  The flow under test is: open `http://localhost:3010/` -> select 模拟电子技术 -> select chapter 2 -> corrected h-parameter body renders -> select chapter 10 -> supplemental text renders while no instructional diagram is present.

- [x] **Step 3: Record the final checkpoint**

  Mark completed checklist items, record commands/results and any remaining limitations, and report that no publish/push occurred.
