import type { CSSProperties } from "react";
import type { CourseDefinition, LearningState } from "../../lib/course-model";
import { getChapterStatus, getCourseProgress, getCurrentChapter } from "../../lib/course-model";
import { Icon } from "../Icons";

interface DashboardViewProps {
  courses: readonly CourseDefinition[];
  state: LearningState;
  onOpenCourse: (courseId: CourseDefinition["id"]) => void;
  onOpenWorkbench: (kind: "digital" | "analog") => void;
}

const statusLabel = { not_started: "未学习", in_progress: "学习中", completed: "已完成" } as const;

export function DashboardView({ courses, state, onOpenCourse, onOpenWorkbench }: DashboardViewProps) {
  return (
    <div className="chapter-dashboard page-enter">
      <header className="page-heading">
        <div><h1>本学期电子课程</h1><p>按教材章节推进；只有完成章节检验后，章节才计入进度。</p></div>
      </header>
      <section className="course-entry-grid" aria-label="三门课程">
        {courses.map((course, index) => {
          const current = getCurrentChapter(state, course);
          const progress = getCourseProgress(state, course);
          const status = getChapterStatus(state, current.id);
          return (
            <button className="course-entry" type="button" key={course.id} onClick={() => onOpenCourse(course.id)} style={{ "--course-accent": course.accent } as CSSProperties}>
              <span className="course-entry-index">0{index + 1}</span>
              <span className="course-entry-mark">{course.shortTitle.slice(0, 1)}</span>
              <span className="course-entry-copy">
                <strong>{course.title}</strong>
                <small>{course.textbook}</small>
                <em>当前章节 · {current.number} {current.title}</em>
                <span className={`chapter-status status-${status}`}>{statusLabel[status]}</span>
              </span>
              <span className="course-entry-progress">
                <span><b>{progress.percent}%</b><small>{progress.completed}/{progress.total} 章已完成</small></span>
                <span className="progress-track"><span style={{ width: `${progress.percent}%`, background: course.accent }} /></span>
              </span>
              <Icon name="arrow" size={20} />
            </button>
          );
        })}
      </section>
      <section className="workbench-shortcuts" aria-labelledby="workbench-shortcuts-title">
        <div className="section-title">
          <div><span className="eyebrow">CIRCUIT SANDBOX</span><h2 id="workbench-shortcuts-title">快速进入电路工作台</h2></div>
          <p>从空白画布开始搭建、连接和验证。</p>
        </div>
        <div className="workbench-shortcut-grid">
          <button type="button" onClick={() => onOpenWorkbench("digital")}>
            <Icon name="chip" size={22} />
            <span><strong>数字电路工作台</strong><small>逻辑门、触发器与逻辑分析仪</small></span>
            <Icon name="arrow" size={18} />
          </button>
          <button type="button" onClick={() => onOpenWorkbench("analog")}>
            <Icon name="wave" size={22} />
            <span><strong>模拟电路工作台</strong><small>基础元件、表计与示波器</small></span>
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
