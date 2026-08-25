"use client";

import { useMemo, useState } from "react";
import type { ChapterDefinition, CourseDefinition, LearningState } from "../../lib/course-model";
import { getChapterStatus } from "../../lib/course-model";
import { Icon } from "../Icons";

interface ChapterStudyViewProps {
  course: CourseDefinition;
  chapter: ChapterDefinition;
  state: LearningState;
  onBack: () => void;
  onSelectChapter: (chapterId: string) => void;
  onSubmitCheck: (chapter: ChapterDefinition, answers: readonly number[]) => void;
  onComplete: (chapterId: string) => void;
  onOpenExperiment: (chapter: ChapterDefinition, experimentId: string) => void;
}

const sourceLabel = { verified_local: "本地资料已核对", supplemental_local: "本地补充资料", insufficient: "资料不足" } as const;

export function ChapterStudyView({ course, chapter, state, onBack, onSelectChapter, onSubmitCheck, onComplete, onOpenExperiment }: ChapterStudyViewProps) {
  const saved = state.checkSubmissions[chapter.id];
  const [answers, setAnswers] = useState<number[]>(() => saved ? [...saved.answers] : Array(chapter.check.length).fill(-1));
  const submitted = state.checkSubmissions[chapter.id];
  const index = course.chapters.findIndex((item) => item.id === chapter.id);
  const allAnswered = answers.length === chapter.check.length && answers.every((answer) => answer >= 0);
  const sectionCounts = useMemo(() => ({ core: chapter.sections.filter((section) => section.importance === "core").length, optional: chapter.sections.filter((section) => section.importance === "optional").length }), [chapter]);

  return <div className="chapter-study page-enter">
    <aside className="chapter-study-nav">
      <button className="text-action" type="button" onClick={onBack}><Icon name="arrow" className="flip-icon" size={16} />返回课程</button>
      <p>{course.title}</p>
      <nav>{course.chapters.map((item) => <button type="button" key={item.id} className={item.id === chapter.id ? "is-current" : ""} onClick={() => onSelectChapter(item.id)}><span>{item.number}</span>{item.title}<em>{getChapterStatus(state, item.id) === "completed" ? "✓" : ""}</em></button>)}</nav>
    </aside>
    <article className="chapter-article">
      <header className="chapter-hero" style={{ borderColor: course.accent }}>
        <div><span className="eyebrow">{course.textbook} · {chapter.number}</span><h1>{chapter.title}</h1><p>{sourceLabel[chapter.sourceStatus]} · {sectionCounts.core} 项主线必学 / {sectionCounts.optional} 项选择学习</p></div>
        <span className={`chapter-status status-${getChapterStatus(state, chapter.id)}`}>{getChapterStatus(state, chapter.id) === "completed" ? "已完成" : "学习中"}</span>
      </header>
      <StudySection number="01" title="学习目标" id="objectives"><ul>{chapter.objectives.map((item) => <li key={item}>{item}</li>)}</ul></StudySection>
      <StudySection number="02" title="前置知识" id="prerequisites" compact><div className="tag-list">{chapter.prerequisites.map((item) => <span key={item}>{item}</span>)}</div></StudySection>
      <StudySection number="03" title="知识讲解" id="knowledge"><div className="learning-sections">{chapter.sections.map((section) => <section key={section.id} className={`learning-block importance-${section.importance}`}><header><strong>{section.title}</strong><span>{section.importance === "core" ? "主线必学" : "选择学习"}</span><small>{sourceLabel[section.sourceStatus]}</small></header>{section.content ? <p>{section.content}</p> : null}{section.formula ? <div className="formula-block"><code>{section.formula}</code>{section.variables?.length ? <ul>{section.variables.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div> : null}</section>)}</div></StudySection>
      <StudySection number="04" title="典型例题" id="examples">{chapter.examples.map((example) => <article className="worked-example" key={example.title}><h3>{example.title}</h3><p>{example.prompt}</p><ol>{example.steps.map((step) => <li key={step}>{step}</li>)}</ol><strong>结论：{example.answer}</strong></article>)}</StudySection>
      <StudySection number="05" title="动手实验" id="experiments">{chapter.experiments.map((experiment) => <article className="experiment-card" key={experiment.id}><header><div><span>{course.title} · {chapter.number}</span><h3>{experiment.title}</h3></div><em>{experiment.workbench === "notebook" ? "开放讲义补充实验" : `${experiment.workbench === "digital" ? "数字" : "模拟"}工作台`}</em></header><p><strong>验证目标：</strong>{experiment.goal}</p><ol>{experiment.steps.map((step) => <li key={step}>{step}</li>)}</ol><p className="expected-result">预期证据：{experiment.expected}</p>{experiment.limitation ? <p className="limit-note"><Icon name="warning" size={16} />{experiment.limitation}</p> : null}<button type="button" className="secondary-button" onClick={() => onOpenExperiment(chapter, experiment.id)}>{experiment.workbench === "notebook" ? "查看验证说明" : "在工作台中打开"}<Icon name="arrow" size={16} /></button></article>)}</StudySection>
      <StudySection number="06" title="章节检验" id="check"><p>提交全部题目后即可标记完成；分数只用于反馈，不设置额外及格线。</p><div className="chapter-check">{chapter.check.map((question, questionIndex) => <fieldset key={question.id}><legend>{questionIndex + 1}. {question.prompt}</legend>{question.options.map((option, optionIndex) => <label key={option}><input type="radio" name={`${chapter.id}-${question.id}`} checked={answers[questionIndex] === optionIndex} onChange={() => setAnswers((current) => current.map((answer, index_) => index_ === questionIndex ? optionIndex : answer))} />{option}</label>)}{submitted ? <p className={submitted.answers[questionIndex] === question.answer ? "check-correct" : "check-wrong"}>{submitted.answers[questionIndex] === question.answer ? "回答正确。" : `正确答案：${question.options[question.answer]}。`} {question.explanation}</p> : null}</fieldset>)}</div><div className="check-actions"><button className="secondary-button" type="button" disabled={!allAnswered} onClick={() => onSubmitCheck(chapter, answers)}>提交章节检验</button><button className="primary-action inline-action" type="button" disabled={!submitted || getChapterStatus(state, chapter.id) === "completed"} onClick={() => onComplete(chapter.id)}>{getChapterStatus(state, chapter.id) === "completed" ? "本章已完成" : "标记本章已完成"}<Icon name="check" size={18} /></button>{submitted ? <strong>本次得分 {submitted.score}%</strong> : null}</div></StudySection>
      <StudySection number="07" title="复习总结" id="summary"><ul>{chapter.summary.map((item) => <li key={item}>{item}</li>)}</ul></StudySection>
      <footer className="chapter-pager"><button type="button" disabled={index <= 0} onClick={() => onSelectChapter(course.chapters[index - 1]?.id)}>上一章</button><button type="button" disabled={index >= course.chapters.length - 1} onClick={() => onSelectChapter(course.chapters[index + 1]?.id)}>下一章</button></footer>
    </article>
  </div>;
}

function StudySection({ number, title, id, compact = false, children }: { number: string; title: string; id: string; compact?: boolean; children: React.ReactNode }) {
  return <section className={compact ? "study-section compact-section" : "study-section"} id={id}><span className="section-number">{number}</span><div><h2>{title}</h2>{children}</div></section>;
}
