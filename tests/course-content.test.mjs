import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);

/**
 * 课程内容守卫。
 *
 * 两层：
 *  1. 全局不变量——所有章节、任何时刻都必须成立（引用不悬空、字段长度合理、无占位符）。
 *  2. 达标清单（棘轮）——只有已按"充实规划"改写过的章节才检查深度指标。
 *     每完成一批扩写，把章节 id 加进 ENRICHED_CHAPTER_IDS；这个清单只增不减，
 *     于是内容质量不会随之后续改动悄悄退化。
 */

/** 已按《课程内容充实规划》扩写的章节（doc: docs/course-content-plan.md） */
const ENRICHED_CHAPTER_IDS = ["signals-ch1", "signals-ch2", "signals-ch3", "signals-ch4", "signals-ch5"];

/** 每小节正文（content + detail）最低字数 */
const MIN_SECTION_CHARS = 260;

const PLACEHOLDER_PATTERN = /TODO|待补|待填|占位|xxx|XXX/;

async function loadCourses() {
  const source = await readFile(new URL("courses.js", root), "utf8");
  const context = vm.createContext({});
  vm.runInContext(source, context, { filename: "courses.js" });
  return context.CoursesData.courses;
}

function index(courses) {
  const chapters = new Map();
  const sections = new Map();
  for (const course of courses) {
    for (const chapter of course.chapters) {
      chapters.set(chapter.id, { course, chapter });
      for (const section of chapter.sections ?? []) {
        assert.ok(section.id, `小节缺少 id：${chapter.id} / ${section.title}`);
        assert.ok(!sections.has(section.id), `小节 id 重复：${section.id}`);
        sections.set(section.id, { chapterId: chapter.id, section });
      }
    }
  }
  return { chapters, sections };
}

/** 引用写法：`<chapterId>`、`<chapterId>#<sectionId>`，或直接写 `<sectionId>`（自动补出所属章节） */
function resolveTarget(target, { chapters, sections }) {
  assert.equal(typeof target, "string", `引用必须是字符串：${JSON.stringify(target)}`);
  const [head, sectionPart] = String(target).split("#");
  if (sectionPart) {
    assert.ok(chapters.has(head), `引用了不存在的章节：${target}`);
    assert.ok(sections.has(sectionPart), `引用了不存在的小节：${target}`);
    assert.equal(sections.get(sectionPart).chapterId, head, `小节与章节不匹配：${target}`);
    return { chapterId: head, sectionId: sectionPart };
  }
  if (chapters.has(head)) return { chapterId: head, sectionId: "" };
  assert.ok(sections.has(head), `引用了不存在的章节或小节：${target}`);
  return { chapterId: sections.get(head).chapterId, sectionId: head };
}

function sectionChars(section) {
  const detail = (section.detail ?? []).join("");
  return (section.content ?? "").length + detail.length;
}

test("课程内容：全局不变量（引用、字段长度、占位符）", async () => {
  const courses = await loadCourses();
  const maps = index(courses);

  for (const course of courses) {
    for (const chapter of course.chapters) {
      assert.ok(chapter.sections.length >= 5, `${chapter.id} 小节数少于 5`);
      assert.ok(chapter.objectives.length >= 1, `${chapter.id} 缺少学习目标`);
      assert.ok(chapter.summary.length >= 1, `${chapter.id} 缺少复习总结`);
      assert.ok(!PLACEHOLDER_PATTERN.test(JSON.stringify(chapter)), `${chapter.id} 含占位符`);

      for (const section of chapter.sections) {
        assert.ok(section.content && section.content.length >= 20, `${section.id} 正文为空或过短`);
        for (const paragraph of section.detail ?? []) {
          assert.ok(paragraph.length >= 30, `${section.id} 展开段过短：${paragraph.slice(0, 20)}…`);
        }
        if (section.points) assert.ok(section.points.length >= 3 && section.points.length <= 6, `${section.id} 要点条数应在 3–6`);
        if (section.pitfalls) assert.ok(section.pitfalls.length >= 1 && section.pitfalls.length <= 4, `${section.id} 易混点条数应在 1–4`);
        if (section.links) assert.ok(section.links.length <= 4, `${section.id} 相关链接过多`);

        for (const link of section.links ?? []) {
          const resolved = resolveTarget(link.to, maps);
          assert.ok(link.why && link.why.length >= 8, `${section.id} 的相关链接缺少说明：${link.to}`);
          assert.ok(
            !(resolved.chapterId === chapter.id && resolved.sectionId === section.id),
            `${section.id} 的相关链接指向自己`,
          );
        }
      }

      const seen = new Set();
      for (const connection of chapter.connections ?? []) {
        const { chapterId } = resolveTarget(connection.to, maps);
        assert.ok(["prereq", "next", "cross"].includes(connection.kind), `${chapter.id} 联系类型非法：${connection.kind}`);
        assert.ok(connection.why && connection.why.length >= 8, `${chapter.id} 的联系缺少说明：${connection.to}`);
        assert.notEqual(chapterId, chapter.id, `${chapter.id} 的联系指向自己`);
        assert.ok(!seen.has(connection.to), `${chapter.id} 的联系重复：${connection.to}`);
        seen.add(connection.to);
      }
    }
  }
});

test("课程内容：达标清单（棘轮）已满足充实指标", async () => {
  const courses = await loadCourses();
  const maps = index(courses);

  for (const chapterId of ENRICHED_CHAPTER_IDS) {
    const entry = maps.chapters.get(chapterId);
    assert.ok(entry, `达标清单里的章节不存在：${chapterId}`);
    const { chapter } = entry;

    for (const section of chapter.sections) {
      const chars = sectionChars(section);
      assert.ok(
        chars >= MIN_SECTION_CHARS,
        `${section.id} 正文 ${chars} 字，未达 ${MIN_SECTION_CHARS} 字`,
      );
      assert.ok((section.points ?? []).length >= 3, `${section.id} 缺少要点（至少 3 条）`);
      assert.ok((section.pitfalls ?? []).length >= 1, `${section.id} 缺少易混点`);
      assert.ok((section.links ?? []).length >= 1, `${section.id} 缺少与其它章节的联系`);
    }

    const kinds = new Set((chapter.connections ?? []).map((connection) => connection.kind));
    assert.ok((chapter.connections ?? []).length >= 3, `${chapterId} 章节联系少于 3 条`);
    for (const kind of ["prereq", "next", "cross"]) {
      assert.ok(kinds.has(kind), `${chapterId} 缺少 ${kind} 类联系`);
    }
    assert.ok(chapter.examples.length >= 3, `${chapterId} 例题少于 3 道`);
    assert.ok(chapter.check.length >= 5, `${chapterId} 检验题少于 5 道`);
    assert.ok((chapter.sourceRef ?? []).length >= 1, `${chapterId} 未标注材料出处`);
  }
});

test("课程内容：节分组同组连续、不跳回", async () => {
  const courses = await loadCourses();

  for (const course of courses) {
    for (const chapter of course.chapters) {
      const closed = new Set();
      let current = null;
      for (const section of chapter.sections) {
        const group = section.group ?? null;
        if (group === current) continue;
        if (current !== null) closed.add(current);
        if (group !== null) {
          assert.equal(typeof group, "string", `${section.id} 的 group 必须是字符串`);
          assert.ok(group.length >= 4, `${section.id} 的 group 过短：${group}`);
          assert.ok(
            !closed.has(group),
            `${section.id}：节「${group}」中断后再次出现，同组小节必须连续`,
          );
        }
        current = group;
      }
    }
  }
});

test("课程内容：章节联系双向一致（next ↔ prereq）", async () => {
  const courses = await loadCourses();
  const maps = index(courses);
  const problems = [];

  for (const course of courses) {
    for (const chapter of course.chapters) {
      for (const connection of chapter.connections ?? []) {
        const { chapterId: target } = resolveTarget(connection.to, maps);
        const back = maps.chapters.get(target).chapter.connections ?? [];
        const reciprocal = connection.kind === "next" ? "prereq" : connection.kind === "prereq" ? "next" : null;
        if (!reciprocal) continue;
        if (!back.some((item) => item.kind === reciprocal && resolveTarget(item.to, maps).chapterId === chapter.id)) {
          problems.push(`${chapter.id} --${connection.kind}--> ${target}，但 ${target} 没有回指`);
        }
      }
    }
  }

  /* 反向链接由对方章节负责，未扩写的章节还没有 connections，因此只要求"两端都已扩写"的联系成对 */
  const blocking = problems.filter((problem) =>
    ENRICHED_CHAPTER_IDS.some((id) => problem.startsWith(id))
    && ENRICHED_CHAPTER_IDS.some((id) => problem.includes(`--> ${id}，`)),
  );
  assert.deepEqual(blocking, [], `联系不成对：\n${blocking.join("\n")}`);
});
