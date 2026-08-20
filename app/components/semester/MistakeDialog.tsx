"use client";

import { useState } from "react";
import { courseById, courses } from "../../data/semester";
import type { MistakeRecord } from "../../lib/semester-model";
import { Icon } from "../Icons";

interface MistakeDialogProps {
  record: MistakeRecord | null;
  defaultReviewDate: string;
  onClose: () => void;
  onSaveMistake: (record: MistakeRecord) => void;
}

export function MistakeDialog({ record, defaultReviewDate, onClose, onSaveMistake }: MistakeDialogProps) {
  const initialCourseId = record?.courseId ?? "signals";
  const initialCourse = courseById[initialCourseId] ?? courses[0];
  const [courseId, setCourseId] = useState(initialCourse.id);
  const [chapterId, setChapterId] = useState(record?.chapterId ?? initialCourse.chapters[0].id);
  const [title, setTitle] = useState(record?.title ?? "");
  const [reason, setReason] = useState(record?.reason ?? "");
  const [correctApproach, setCorrectApproach] = useState(record?.correctApproach ?? "");
  const [nextReviewDate, setNextReviewDate] = useState(record?.nextReviewDate ?? defaultReviewDate);
  const [error, setError] = useState("");
  const selectedCourse = courseById[courseId] ?? courses[0];
  const selectedChapter = selectedCourse.chapters.find((chapter) => chapter.id === chapterId) ?? selectedCourse.chapters[0];

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="mistake-dialog" role="dialog" aria-modal="true" aria-labelledby="mistake-dialog-title">
        <header><div><h2 id="mistake-dialog-title">{record ? "编辑错题" : "新增错题"}</h2><p>把错误原因和下次动作写具体，复习时才有用。</p></div><button type="button" aria-label="关闭" onClick={onClose}><Icon name="close" size={20} /></button></header>
        <form onSubmit={(event) => {
          event.preventDefault();
          if ([title, reason, correctApproach].some((value) => value.trim().length < 4)) {
            setError("题目、错误原因和正确思路都需要至少写 4 个字。");
            return;
          }
          onSaveMistake({
            id: record?.id ?? `mistake-${Date.now()}`,
            title: title.trim(),
            courseId,
            chapterId: selectedChapter.id,
            topicId: selectedChapter.topic.id,
            reason: reason.trim(),
            correctApproach: correctApproach.trim(),
            nextReviewDate,
            mastered: record?.mastered ?? false,
            updatedAt: new Date().toISOString(),
          });
        }}>
          <div className="form-grid-two">
            <label>所属课程
              <select value={courseId} onChange={(event) => { const nextCourse = courseById[event.target.value] ?? courses[0]; setCourseId(nextCourse.id); setChapterId(nextCourse.chapters[0].id); }}>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </label>
            <label>所属章节
              <select value={selectedChapter.id} onChange={(event) => setChapterId(event.target.value)}>
                {selectedCourse.chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}
              </select>
            </label>
          </div>
          <label>题目<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：卷积积分分段边界写错" /></label>
          <label>错误原因<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="说明当时哪里判断错了" /></label>
          <label>正确思路<textarea value={correctApproach} onChange={(event) => setCorrectApproach(event.target.value)} placeholder="写下下次可直接执行的解题步骤" /></label>
          <label>下次复习时间<input type="date" value={nextReviewDate} onChange={(event) => setNextReviewDate(event.target.value)} /></label>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <footer><button type="button" className="secondary-button" onClick={onClose}>取消</button><button type="submit" className="dialog-save">保存错题</button></footer>
        </form>
      </section>
    </div>
  );
}
