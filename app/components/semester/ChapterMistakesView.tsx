"use client";

import { useMemo, useState } from "react";
import type { CourseDefinition, LearningState, MistakeRecord } from "../../lib/course-model";
import { Icon } from "../Icons";

interface Props {
  courses: readonly CourseDefinition[];
  state: LearningState;
  onSave: (record: MistakeRecord) => void;
  onReviewed: (id: string) => void;
  onOpenChapter: (course: CourseDefinition, chapterId: string) => void;
}

export function ChapterMistakesView({ courses, state, onSave, onReviewed, onOpenChapter }: Props) {
  const [courseFilter, setCourseFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [editing, setEditing] = useState<MistakeRecord | null | undefined>(undefined);
  const chapterOptions = courseFilter === "all" ? courses.flatMap((course) => course.chapters) : courses.find((course) => course.id === courseFilter)?.chapters ?? [];
  const filtered = useMemo(() => state.mistakes.filter((item) => (courseFilter === "all" || item.courseId === courseFilter) && (chapterFilter === "all" || item.chapterId === chapterFilter) && (reviewFilter === "all" || String(item.reviewed) === reviewFilter)), [chapterFilter, courseFilter, reviewFilter, state.mistakes]);
  return <div className="mistakes-page page-enter">
    <header className="page-heading"><div><h1>练习与错题</h1><p>检验答错会自动收录；示例记录用于演示格式，错题本不直接改变章节完成度。</p></div><button className="new-mistake-button" type="button" onClick={() => setEditing(null)}><Icon name="plus" size={18} />新增错题</button></header>
    <div className="filter-row"><label>课程<select value={courseFilter} onChange={(event) => { setCourseFilter(event.target.value); setChapterFilter("all"); }}><option value="all">全部课程</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label><label>章节<select value={chapterFilter} onChange={(event) => setChapterFilter(event.target.value)}><option value="all">全部章节</option>{chapterOptions.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.number} {chapter.title}</option>)}</select></label><label>复盘状态<select value={reviewFilter} onChange={(event) => setReviewFilter(event.target.value)}><option value="all">全部状态</option><option value="false">待复盘</option><option value="true">已复盘</option></select></label><span>显示 {filtered.length} 条</span></div>
    <div className="mistake-table-wrap"><table className="mistake-table"><thead><tr><th>题目 / 章节</th><th>错误原因</th><th>正确思路</th><th>下次复习</th><th>状态</th><th><span className="sr-only">操作</span></th></tr></thead><tbody>{filtered.map((mistake) => { const course = courses.find((item) => item.id === mistake.courseId)!; const chapter = course.chapters.find((item) => item.id === mistake.chapterId)!; return <tr key={mistake.id} className={mistake.reviewed ? "is-mastered" : ""}><td><div className="mistake-title-row"><button type="button" className="mistake-title" onClick={() => onOpenChapter(course, chapter.id)}>{mistake.title}</button><span className={`mistake-origin origin-${mistake.origin}`}>{mistake.origin === "example" ? "示例" : mistake.origin === "check" ? "检验自动收录" : "手动记录"}</span></div><small>{course.title} · {chapter.number} {chapter.title}</small></td><td>{mistake.reason}</td><td>{mistake.correctApproach}</td><td>{mistake.nextReviewDate ? <time dateTime={mistake.nextReviewDate}>{mistake.nextReviewDate}</time> : "未安排"}</td><td><span className={`status-label ${mistake.reviewed ? "mastered" : "pending"}`}>{mistake.reviewed ? "已复盘" : "待复盘"}</span></td><td className="mistake-actions"><button type="button" aria-label={`编辑：${mistake.title}`} onClick={() => setEditing(mistake)}><Icon name="edit" size={18} /></button><button type="button" disabled={mistake.reviewed} aria-label={`标记已复盘：${mistake.title}`} onClick={() => onReviewed(mistake.id)}><Icon name="check" size={18} /></button></td></tr>; })}</tbody></table></div>
    {editing !== undefined ? <MistakeEditor courses={courses} record={editing} onClose={() => setEditing(undefined)} onSave={(record) => { onSave(record); setEditing(undefined); }} /> : null}
  </div>;
}

function MistakeEditor({ courses, record, onClose, onSave }: { courses: readonly CourseDefinition[]; record: MistakeRecord | null; onClose: () => void; onSave: (record: MistakeRecord) => void }) {
  const initialCourse = courses.find((course) => course.id === record?.courseId) ?? courses[0];
  const [courseId, setCourseId] = useState(initialCourse.id);
  const [chapterId, setChapterId] = useState(record?.chapterId ?? initialCourse.chapters[0].id);
  const [title, setTitle] = useState(record?.title ?? "");
  const [reason, setReason] = useState(record?.reason ?? "");
  const [correctApproach, setCorrectApproach] = useState(record?.correctApproach ?? "");
  const [nextReviewDate, setNextReviewDate] = useState(record?.nextReviewDate ?? defaultReviewDate());
  const [error, setError] = useState("");
  const course = courses.find((item) => item.id === courseId) ?? courses[0];
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="mistake-dialog" role="dialog" aria-modal="true" aria-labelledby="mistake-editor-title"><header><div><h2 id="mistake-editor-title">{record ? "编辑错题" : "新增错题"}</h2><p>写下下次可以直接执行的纠错步骤。</p></div><button type="button" aria-label="关闭" onClick={onClose}><Icon name="close" size={20} /></button></header><form onSubmit={(event) => { event.preventDefault(); if ([title, reason, correctApproach].some((value) => value.trim().length < 4)) { setError("题目、错误原因和正确思路都至少写 4 个字。"); return; } onSave({ id: record?.id ?? `mistake-${Date.now()}`, title: title.trim(), courseId, chapterId, reason: reason.trim(), correctApproach: correctApproach.trim(), nextReviewDate, reviewed: record?.reviewed ?? false, origin: record?.origin ?? "manual", updatedAt: new Date().toISOString() }); }}><div className="form-grid-two"><label>所属课程<select value={courseId} onChange={(event) => { const next = courses.find((item) => item.id === event.target.value) ?? courses[0]; setCourseId(next.id); setChapterId(next.chapters[0].id); }}>{courses.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label>所属章节<select value={chapterId} onChange={(event) => setChapterId(event.target.value)}>{course.chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.number} {chapter.title}</option>)}</select></label></div><label>题目<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>错误原因<textarea value={reason} onChange={(event) => setReason(event.target.value)} /></label><label>正确思路<textarea value={correctApproach} onChange={(event) => setCorrectApproach(event.target.value)} /></label><label>下次复习时间<input type="date" required value={nextReviewDate} onChange={(event) => setNextReviewDate(event.target.value)} /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<footer><button type="button" className="secondary-button" onClick={onClose}>取消</button><button type="submit" className="dialog-save">保存错题</button></footer></form></section></div>;
}

function defaultReviewDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}
