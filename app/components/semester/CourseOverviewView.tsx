import type { CourseDefinition, LearningState, WorkbenchKind } from "../../lib/course-model";
import { getChapterStatus, getCourseProgress, getCurrentChapter } from "../../lib/course-model";
import { Icon } from "../Icons";

interface CourseOverviewViewProps {
  course: CourseDefinition;
  state: LearningState;
  onOpenChapter: (course: CourseDefinition, chapterId: string) => void;
  onOpenWorkbench: (kind: Exclude<WorkbenchKind, "notebook">) => void;
}

const statusLabel = { not_started: "未学习", in_progress: "学习中", completed: "已完成" } as const;

export function CourseOverviewView({ course, state, onOpenChapter, onOpenWorkbench }: CourseOverviewViewProps) {
  const current = getCurrentChapter(state, course);
  const progress = getCourseProgress(state, course);
  const coreCount = course.chapters.reduce((sum, chapter) => sum + chapter.sections.filter((section) => section.importance === "core").length, 0);
  const optionalCount = course.chapters.reduce((sum, chapter) => sum + chapter.sections.filter((section) => section.importance === "optional").length, 0);
  return (
    <div className="course-page page-enter">
      <header className="page-heading course-page-heading">
        <div><span className="eyebrow">{course.textbook}</span><h1>{course.title}</h1><p>{course.role}</p></div>
        {course.id !== "signals" ? <button className="secondary-button" type="button" onClick={() => onOpenWorkbench(course.id as "digital" | "analog")}><Icon name={course.id === "digital" ? "chip" : "wave"} size={18} />打开{course.shortTitle}工作台</button> : null}
      </header>
      <div className="course-overview-grid">
        <aside className="chapter-directory">
          <div className="section-title"><h2>教材章节</h2><span>{progress.total} 章计入进度</span></div>
          <p className="current-note">当前章节：<strong>{current.number} {current.title}</strong></p>
          <nav aria-label={`${course.title}章节目录`}>
            {course.chapters.map((chapter) => {
              const status = getChapterStatus(state, chapter.id);
              return <button type="button" key={chapter.id} className={chapter.id === current.id ? "chapter-link is-current" : "chapter-link"} onClick={() => onOpenChapter(course, chapter.id)}>
                <span>{chapter.number}</span><span><strong>{chapter.title}</strong><small>{chapter.counted ? statusLabel[status] : "导学 · 不计进度"}</small></span><em className={`status-dot status-${status}`} />
              </button>;
            })}
          </nav>
        </aside>
        <main className="course-route-panel">
          <div className="course-summary-line">
            <div><span>按章节完成度</span><strong>{progress.percent}%</strong></div>
            <div className="progress-track"><span style={{ width: `${progress.percent}%`, background: course.accent }} /></div>
            <p>{progress.completed} / {progress.total} 个计入进度的章节已通过检验并标记完成。</p>
          </div>
          <section className="route-section">
            <div className="section-title"><h2>教材学习路线</h2><span>可自由切换，状态独立保存</span></div>
            <ol className="route-list">
              {course.chapters.map((chapter) => <li key={chapter.id} className={chapter.id === current.id ? "is-current" : ""}>
                <span className="route-index">{chapter.number}</span>
                <button type="button" onClick={() => onOpenChapter(course, chapter.id)}><strong>{chapter.title}</strong><span>{chapter.objectives[0]}</span></button>
                <span className="route-status">{statusLabel[getChapterStatus(state, chapter.id)]}</span>
              </li>)}
            </ol>
          </section>
        </main>
        <aside className="course-assist">
          <section><div className="section-title"><h2>当前章重点</h2><Icon name="book" size={19} /></div><ul className="course-focus-list">{current.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></section>
          <section><div className="section-title"><h2>内容结构</h2><Icon name="route" size={19} /></div><p><strong>{coreCount}</strong> 项主线必学，<strong>{optionalCount}</strong> 项选择学习；先完成主线，再按需要进入拓展。</p></section>
        </aside>
      </div>
    </div>
  );
}
