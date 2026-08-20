import { courses } from "../../data/semester";
import {
  formatStudyDate,
  getCoursePendingCount,
  getCourseProgress,
  getDueReviews,
  getOverallProgress,
  getTopicLocation,
  masteryLabels,
  type SemesterState,
} from "../../lib/semester-model";
import { Icon } from "../Icons";

interface DashboardViewProps {
  state: SemesterState;
  onToggleTask: (taskId: string) => void;
  onOpenCourse: (courseId: string) => void;
  onOpenTopic: (topicId: string) => void;
  onContinue: () => void;
}

export function DashboardView({ state, onToggleTask, onOpenCourse, onOpenTopic, onContinue }: DashboardViewProps) {
  const progress = getOverallProgress(state);
  const dueReviews = getDueReviews(state).slice(0, 3);

  return (
    <div className="dashboard-layout page-enter">
      <section className="dashboard-main">
        <header className="page-heading dashboard-heading">
          <div>
            <h1>本周进度</h1>
            <p>本周目标：把卷积的图解步骤与静态工作点分析练到能独立复现。</p>
          </div>
          <strong>第 {state.semesterWeek} 学习周</strong>
        </header>

        <div className="overall-progress" aria-label={`本周整体进度 ${progress}%`}>
          <span>整体进度</span>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <strong>{progress}%</strong>
        </div>

        <section className="dashboard-section">
          <div className="section-title"><h2>课程进度</h2><span>掌握状态实时汇总</span></div>
          <div className="course-rows">
            {courses.map((course) => {
              const courseProgress = getCourseProgress(state, course.id);
              const currentTopicId = state.currentTopicByCourse[course.id];
              const location = getTopicLocation(currentTopicId);
              return (
                <button className="course-row" type="button" key={course.id} onClick={() => onOpenCourse(course.id)}>
                  <span className="course-mark" style={{ borderColor: course.color, color: course.color }}>{course.shortTitle.slice(0, 1)}</span>
                  <span className="course-row-copy"><strong>{course.title}</strong><small>{location?.chapter.title}</small></span>
                  <span className="progress-track course-progress"><span style={{ width: `${courseProgress}%`, background: course.color }} /></span>
                  <strong className="course-percent">{courseProgress}%</strong>
                  <span className="pending-count">{getCoursePendingCount(state, course.id)} 项待处理</span>
                  <Icon name="arrow" size={18} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="main-question">
          <span>?</span>
          <div><h2>今日主问题</h2><p>{state.todayMainQuestion}</p></div>
        </section>

        <section className="dashboard-section today-tasks">
          <div className="section-title"><h2>今日任务</h2><span>最多 3 项 · 点击整行即可完成</span></div>
          <div className="task-list">
            {state.todayTasks.slice(0, 3).map((task) => {
              const location = getTopicLocation(task.topicId);
              return (
                <label className={task.completed ? "task-row is-complete" : "task-row"} key={task.id}>
                  <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} />
                  <span className="custom-check"><Icon name="check" size={15} /></span>
                  <span className="task-copy"><strong>{task.title}</strong><small>{location?.course.title} · {location?.chapter.title}</small></span>
                  <span className="task-time"><Icon name="clock" size={16} />约 {task.durationMinutes} 分钟</span>
                </label>
              );
            })}
          </div>
        </section>

        <button className="primary-action" type="button" onClick={onContinue}>
          <span>继续学习</span><Icon name="arrow" size={20} />
        </button>
      </section>

      <aside className="dashboard-aside">
        <section className="aside-block review-block">
          <div className="section-title"><h2>待复习知识点</h2><span className="count-circle">{dueReviews.length}</span></div>
          <div className="review-list">
            {dueReviews.map((review) => {
              const location = getTopicLocation(review.topicId);
              if (!location) return null;
              return (
                <button type="button" key={review.id} onClick={() => onOpenTopic(review.topicId)}>
                  <span className="review-icon"><Icon name={location.topic.diagram === "circuit" ? "wave" : "notebook"} size={20} /></span>
                  <span><strong>{location.topic.title}</strong><small>{location.course.title} · {masteryLabels[state.mastery[review.topicId]]}</small><em>{formatStudyDate(review.dueDate)}到期</em></span>
                  <Icon name="arrow" size={16} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="aside-block tomorrow-block">
          <div className="section-title"><h2>明天第一件事</h2><Icon name="calendar" size={20} /></div>
          <div className="tomorrow-diagram" aria-hidden="true">
            <span className="wire-line" /><span className="resistor">R<sub>C</sub></span><span className="transistor">BJT</span><span className="ground">⏚</span>
          </div>
          <p>{state.tomorrowFirstThing}</p>
          <button type="button" className="text-action" onClick={() => onOpenTopic("analog-small-signal-topic")}>打开小信号模型知识卡 <Icon name="arrow" size={16} /></button>
        </section>
      </aside>
    </div>
  );
}
