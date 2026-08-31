"use client";

import { useEffect, useRef } from "react";
import { getCircuitPreset } from "../../data/circuit-presets";
import type { ChapterDefinition, CourseDefinition, LearningState, WorkbenchKind } from "../../lib/course-model";
import { CHECK_PASS_SCORE, getChapterStatus, getCourseProgress, getCurrentChapter } from "../../lib/course-model";
import { Icon } from "../Icons";
import { MathFormula } from "./MathFormula";

interface CourseOverviewViewProps {
  course: CourseDefinition;
  state: LearningState;
  selectedChapterId: string | null;
  onPreviewChapter: (chapterId: string) => void;
  onContinueChapter: (chapterId: string) => void;
  onOpenWorkbench: (kind: Exclude<WorkbenchKind, "notebook">) => void;
}

const statusLabel = {
  not_started: "○ 未开始",
  in_progress: "▶ 学习中",
  completed: "✓ 已完成",
} as const;

type ChapterExperiment = ChapterDefinition["experiments"][number];

function experimentCapability(experiment: ChapterExperiment): string {
  if (experiment.workbench === "notebook") return "步骤验证";
  if (experiment.presetId && getCircuitPreset(experiment.presetId)) return "预设可载入并运行";
  return "自由搭建 · 拓扑与手算核对";
}

export function CourseOverviewView({
  course,
  state,
  selectedChapterId,
  onPreviewChapter,
  onContinueChapter,
  onOpenWorkbench,
}: CourseOverviewViewProps) {
  const current = getCurrentChapter(state, course);
  const selected = course.chapters.find((chapter) => chapter.id === selectedChapterId) ?? current;
  const selectedStatus = getChapterStatus(state, selected.id);
  const progress = getCourseProgress(state, course);
  const coreSections = selected.sections.filter((section) => section.importance === "core");
  const optionalSections = selected.sections.filter((section) => section.importance === "optional");
  const coreCount = course.chapters.reduce((sum, chapter) => sum + chapter.sections.filter((section) => section.importance === "core").length, 0);
  const optionalCount = course.chapters.reduce((sum, chapter) => sum + chapter.sections.filter((section) => section.importance === "optional").length, 0);
  const uncountedCount = course.chapters.filter((chapter) => !chapter.counted).length;
  const submission = state.checkSubmissions[selected.id];
  const guideHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusAfterPreviewRef = useRef(false);

  useEffect(() => {
    if (!focusAfterPreviewRef.current) return;
    focusAfterPreviewRef.current = false;
    guideHeadingRef.current?.focus({ preventScroll: true });
    guideHeadingRef.current?.scrollIntoView({
      block: "start",
      behavior: globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [selected.id]);

  function previewChapter(chapterId: string) {
    focusAfterPreviewRef.current = true;
    onPreviewChapter(chapterId);
  }

  return (
    <div className="course-page page-enter">
      <header className="page-heading course-page-heading">
        <div><span className="eyebrow">{course.textbook}</span><h1>{course.title}</h1><p>{course.role}</p></div>
        {course.id !== "signals" ? <button className="secondary-button" type="button" onClick={() => onOpenWorkbench(course.id as "digital" | "analog")}><Icon name={course.id === "digital" ? "chip" : "wave"} size={18} />打开{course.shortTitle}工作台</button> : null}
      </header>

      <div className="course-overview-grid">
        <aside className="chapter-directory">
          <div className="section-title"><h2>章节目录</h2><span>{course.chapters.length} 个单元</span></div>
          <nav aria-label={`${course.title}章节目录`}>
            {course.chapters.map((chapter) => {
              const status = getChapterStatus(state, chapter.id);
              const isSelected = chapter.id === selected.id;
              const isCurrent = chapter.id === current.id;
              return <button type="button" key={chapter.id} className={`chapter-link${isSelected ? " is-selected" : ""}${isCurrent ? " is-learning" : ""}`} aria-current={isSelected ? "true" : undefined} onClick={() => previewChapter(chapter.id)}>
                <span className="chapter-link-number">{chapter.number}</span>
                <span className="chapter-link-title">{chapter.title}{isCurrent ? <em>当前学习</em> : null}</span>
                <span className={`chapter-link-status status-${status}`}>{statusLabel[status]}</span>
              </button>;
            })}
          </nav>
        </aside>

        <main className="course-guide-panel">
          <header className="course-guide-heading">
            <div>
              <span className="eyebrow">{selected.number}{selected.id === current.id ? " · 当前学习" : " · 章节预览"}</span>
              <h2 ref={guideHeadingRef} tabIndex={-1}>{selected.title}</h2>
              {!selected.counted ? <p className="uncounted-note">导学单元，不计入课程完成进度。</p> : null}
            </div>
            <span className={`chapter-status status-${selectedStatus}`}>{statusLabel[selectedStatus]}</span>
          </header>

          <section className="course-guide-focus" aria-labelledby="course-guide-focus-title">
            <h3 id="course-guide-focus-title">本章重点</h3>
            <ul>{selected.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
          </section>

          <section className="course-knowledge-chain" aria-labelledby="course-knowledge-chain-title">
            <div className="section-title"><h3 id="course-knowledge-chain-title">知识链</h3><span>{coreSections.length} 项主线必学</span></div>
            <ol>{coreSections.map((section, index) => <li key={section.id}><span>{section.title}</span>{index < coreSections.length - 1 ? <Icon name="arrow" size={15} aria-hidden="true" /> : null}</li>)}</ol>
          </section>

          <section className="course-core-sections" aria-label="核心知识导读">
            {coreSections.map((section, index) => <article key={section.id}>
              <header><span>{String(index + 1).padStart(2, "0")}</span><h3>{section.title}</h3></header>
              {section.content ? <p>{section.content}</p> : null}
              {section.formula ? <div className="formula-block"><MathFormula expression={section.formula} />{section.variables?.length ? <ul>{section.variables.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div> : null}
            </article>)}
          </section>

          {optionalSections.length ? <details className="course-optional-sections">
            <summary>选择学习 · {optionalSections.length} 项</summary>
            <div>{optionalSections.map((section) => <article key={section.id}><h3>{section.title}</h3>{section.content ? <p>{section.content}</p> : null}{section.formula ? <div className="formula-block"><MathFormula expression={section.formula} />{section.variables?.length ? <ul>{section.variables.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div> : null}</article>)}</div>
          </details> : null}

          <section className="course-resource-summary" aria-label="本章学习资源状态">
            <div><span>典型例题</span><strong>{selected.examples.length} 道</strong></div>
            <div><span>章节检验</span><strong>{selected.check.length} 题</strong></div>
            <div><span>检验状态</span><strong>{submission ? `得分 ${submission.score}%` : "尚未检验"}</strong></div>
            {selected.experiments.map((experiment) => <div className="course-experiment-capability" key={experiment.id}><span>{experiment.title}</span><strong>{experimentCapability(experiment)}</strong></div>)}
          </section>

          <button className="primary-action course-continue-action" type="button" onClick={() => onContinueChapter(selected.id)}>{selected.id === current.id ? "继续学习本章" : "开始学习本章"}<Icon name="arrow" size={18} /></button>
        </main>

        <aside className="course-assist">
          <section>
            <div className="section-title"><h2>课程进度</h2><strong>{progress.completed}/{progress.total}</strong></div>
            <div className="progress-track"><span style={{ width: `${progress.percent}%`, background: course.accent }} /></div>
            <p>{progress.percent}% 已完成。每个计入进度的章节须完成检验、得分不低于 {CHECK_PASS_SCORE}% 并标记完成。</p>
            {uncountedCount ? <p>{course.chapters.length} 个学习单元中有 {uncountedCount} 个导学单元不计进度，因此课程进度按 {progress.total} 章计算。</p> : null}
          </section>
          <section><div className="section-title"><h2>教材来源</h2><Icon name="info" size={19} /></div><p>{course.sourceNote}</p></section>
          <section><div className="section-title"><h2>内容划分</h2><Icon name="route" size={19} /></div><p><strong>{coreCount}</strong> 项主线必学承担后续知识依赖与主要应用，<strong>{optionalCount}</strong> 项选择学习用于拓展推导、器件类型和工程细节。</p></section>
          <section><div className="section-title"><h2>完成规则</h2><Icon name="check" size={19} /></div><p>阅读不会自动完成章节；只有章节检验达到 {CHECK_PASS_SCORE}% 后，用户主动标记完成，才计入课程总体进度。</p></section>
        </aside>
      </div>
    </div>
  );
}
