"use client";

import { useMemo, useState } from "react";
import { courseById, courses } from "../../data/semester";
import { formatStudyDate, masteryLabels, masteryLevels, type MasteryLevel, type MistakeRecord, type SemesterState } from "../../lib/semester-model";
import { Icon } from "../Icons";
import { MistakeDialog } from "./MistakeDialog";

interface MistakesViewProps {
  state: SemesterState;
  onSaveMistake: (mistake: MistakeRecord) => void;
  onMarkMastered: (mistakeId: string) => void;
  onOpenTopic: (topicId: string) => void;
}

export function MistakesView({ state, onSaveMistake, onMarkMastered, onOpenTopic }: MistakesViewProps) {
  const [courseFilter, setCourseFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [masteryFilter, setMasteryFilter] = useState<"all" | MasteryLevel>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingMistake, setEditingMistake] = useState<MistakeRecord | null>(null);
  const [newReviewDate, setNewReviewDate] = useState("");

  const chapterOptions = courseFilter === "all"
    ? courses.flatMap((course) => course.chapters)
    : courseById[courseFilter]?.chapters ?? [];

  const filteredMistakes = useMemo(() => state.mistakes.filter((mistake) =>
    (courseFilter === "all" || mistake.courseId === courseFilter)
    && (chapterFilter === "all" || mistake.chapterId === chapterFilter)
    && (masteryFilter === "all" || state.mastery[mistake.topicId] === masteryFilter)
  ), [chapterFilter, courseFilter, masteryFilter, state.mastery, state.mistakes]);

  function openNew() {
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + 3);
    setNewReviewDate(reviewDate.toISOString().slice(0, 10));
    setEditingMistake(null);
    setEditorOpen(true);
  }

  function openEdit(mistake: MistakeRecord) {
    setEditingMistake(mistake);
    setEditorOpen(true);
  }

  return (
    <div className="mistakes-page page-enter">
      <header className="page-heading">
        <div><h1>练习与错题</h1><p>不只保存答案：记录当时为什么错，以及下一次应先做哪一步。</p></div>
        <button className="new-mistake-button" type="button" onClick={openNew}><Icon name="plus" size={18} />新增错题</button>
      </header>

      <div className="mistake-stats" aria-label="错题统计">
        <div><strong>{state.mistakes.length}</strong><span>累计错题</span></div>
        <div><strong>{state.mistakes.filter((item) => !item.mastered).length}</strong><span>仍需处理</span></div>
        <div><strong>{state.mistakes.filter((item) => item.mastered).length}</strong><span>已标掌握</span></div>
        <p>标记错题已掌握时，对应知识点会同步更新为“能应用”。</p>
      </div>

      <div className="filter-row" aria-label="错题筛选">
        <label>课程
          <select value={courseFilter} onChange={(event) => { setCourseFilter(event.target.value); setChapterFilter("all"); }}>
            <option value="all">全部课程</option>
            {courses.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}
          </select>
        </label>
        <label>章节
          <select value={chapterFilter} onChange={(event) => setChapterFilter(event.target.value)}>
            <option value="all">全部章节</option>
            {chapterOptions.map((chapter) => <option value={chapter.id} key={chapter.id}>{chapter.title}</option>)}
          </select>
        </label>
        <label>掌握状态
          <select value={masteryFilter} onChange={(event) => setMasteryFilter(event.target.value as "all" | MasteryLevel)}>
            <option value="all">全部状态</option>
            {masteryLevels.map((level) => <option value={level} key={level}>{masteryLabels[level]}</option>)}
          </select>
        </label>
        <span>显示 {filteredMistakes.length} 条</span>
      </div>

      <div className="mistake-table-wrap">
        <table className="mistake-table">
          <thead><tr><th>题目 / 所属内容</th><th>错误原因</th><th>正确思路</th><th>下次复习</th><th>掌握</th><th><span className="sr-only">操作</span></th></tr></thead>
          <tbody>
            {filteredMistakes.map((mistake) => {
              const course = courseById[mistake.courseId];
              const chapter = course?.chapters.find((item) => item.id === mistake.chapterId);
              return (
                <tr key={mistake.id} className={mistake.mastered ? "is-mastered" : ""}>
                  <td><button type="button" className="mistake-title" onClick={() => onOpenTopic(mistake.topicId)}>{mistake.title}</button><small>{course?.title} · {chapter?.title}</small></td>
                  <td>{mistake.reason}</td>
                  <td>{mistake.correctApproach}</td>
                  <td><time dateTime={mistake.nextReviewDate}>{formatStudyDate(mistake.nextReviewDate)}</time></td>
                  <td><span className={`status-label ${mistake.mastered ? "mastered" : "pending"}`}>{mistake.mastered ? "已掌握" : masteryLabels[state.mastery[mistake.topicId]]}</span></td>
                  <td className="mistake-actions">
                    <button type="button" title="编辑错题" aria-label={`编辑：${mistake.title}`} onClick={() => openEdit(mistake)}><Icon name="edit" size={18} /></button>
                    <button type="button" disabled={mistake.mastered} title="标记已掌握" aria-label={`标记已掌握：${mistake.title}`} onClick={() => onMarkMastered(mistake.id)}><Icon name="check" size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="practice-note">
        <Icon name="info" size={20} />
        <div><strong>复习建议</strong><p>先遮住“正确思路”，只看题目和错误原因重做一遍。能独立走通步骤后再标记已掌握。</p></div>
      </section>

      {editorOpen ? (
        <MistakeDialog
          key={editingMistake?.id ?? "new-mistake"}
          record={editingMistake}
          defaultReviewDate={newReviewDate}
          onClose={() => setEditorOpen(false)}
          onSaveMistake={(mistake) => { onSaveMistake(mistake); setEditorOpen(false); }}
        />
      ) : null}
    </div>
  );
}
