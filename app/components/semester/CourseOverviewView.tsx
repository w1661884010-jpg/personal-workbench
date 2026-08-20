import { courseById, courses, topicById } from "../../data/semester";
import {
  formatStudyDate,
  getChapterProgress,
  getCourseProgress,
  getTopicLocation,
  getWeakTopics,
  masteryLabels,
  type SemesterState,
} from "../../lib/semester-model";
import { Icon } from "../Icons";

interface CourseOverviewViewProps {
  state: SemesterState;
  courseId: string;
  onSelectCourse: (courseId: string) => void;
  onOpenTopic: (topicId: string) => void;
}
export function CourseOverviewView({ state, courseId, onSelectCourse, onOpenTopic }: CourseOverviewViewProps) {
  const course = courseById[courseId] ?? courses[0];
  const currentTopicId = state.currentTopicByCourse[course.id];
  const current = getTopicLocation(currentTopicId) ?? getTopicLocation(course.chapters[0].topic.id)!;
  const logs = state.learningLogs.filter((log) => log.courseId === course.id).slice(0, 4);
  const weakTopics = getWeakTopics(state, course.id, 3);
  const courseReviews = state.reviews.filter((review) => getTopicLocation(review.topicId)?.course.id === course.id).slice(0, 3);

  return (
    <div className="course-page page-enter">
      <header className="page-heading course-page-heading">
        <div>
          <h1>{course.title}</h1>
          <p>{course.role}</p>
        </div>
        <div className="course-tabs" aria-label="切换课程">
          {courses.map((item) => (
            <button key={item.id} type="button" className={item.id === course.id ? "is-active" : ""} onClick={() => onSelectCourse(item.id)}>{item.shortTitle}</button>
          ))}
        </div>
      </header>

      <div className="course-overview-grid">
        <aside className="chapter-directory">
          <div className="section-title"><h2>章节目录</h2><span>{course.chapters.length} 章</span></div>
          <p className="current-note">当前章节：<strong>{current.chapter.title}</strong></p>
          <nav aria-label={`${course.title}章节目录`}>
            {course.chapters.map((chapter, index) => {
              const progress = getChapterProgress(state, chapter.id);
              return (
                <button
                  type="button"
                  key={chapter.id}
                  className={chapter.id === current.chapter.id ? "chapter-link is-current" : "chapter-link"}
                  onClick={() => onOpenTopic(chapter.topic.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span><strong>{chapter.title}</strong><small>{masteryLabels[state.mastery[chapter.topic.id]]}</small></span>
                  <em>{progress}%</em>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="course-route-panel">
          <div className="course-summary-line">
            <div><span>课程完成度</span><strong>{getCourseProgress(state, course.id)}%</strong></div>
            <div className="progress-track"><span style={{ width: `${getCourseProgress(state, course.id)}%`, background: course.color }} /></div>
            <p>当前重点：{current.topic.problem}</p>
          </div>

          <section className="route-section">
            <div className="section-title"><h2>课程学习路线</h2><span>从基础表示到可验证应用</span></div>
            <ol className="route-list">
              {course.chapters.map((chapter, index) => (
                <li key={chapter.id} className={chapter.id === current.chapter.id ? "is-current" : ""}>
                  <span className="route-index">{index + 1}</span>
                  <button type="button" onClick={() => onOpenTopic(chapter.topic.id)}>
                    <strong>{chapter.title}</strong>
                    <span>{course.route[index]}</span>
                  </button>
                  <span className="route-status">{masteryLabels[state.mastery[chapter.topic.id]]}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="recent-logs">
            <div className="section-title"><h2>最近学习记录</h2><span>自动保留最近 30 条</span></div>
            {logs.length ? logs.map((log) => (
              <button type="button" key={log.id} onClick={() => onOpenTopic(log.topicId)}>
                <time>{new Date(log.createdAt).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })}</time>
                <span><strong>{topicById[log.topicId]?.title}</strong><small>{log.action}</small></span>
                <Icon name="arrow" size={16} />
              </button>
            )) : <p>完成本课程的知识卡后，学习记录会显示在这里。</p>}
          </section>
        </section>

        <aside className="course-assist">
          <section>
            <div className="section-title"><h2>薄弱知识点</h2><Icon name="warning" size={19} /></div>
            <div className="weak-list">
              {weakTopics.map((topic) => (
                <button type="button" key={topic.id} onClick={() => onOpenTopic(topic.id)}>
                  <span className={`mastery-dot level-${state.mastery[topic.id]}`} />
                  <span><strong>{topic.title}</strong><small>{masteryLabels[state.mastery[topic.id]]} · {topic.tags.slice(0, 2).join(" / ")}</small></span>
                  <Icon name="arrow" size={15} />
                </button>
              ))}
            </div>
          </section>
          <section>
            <div className="section-title"><h2>待复习内容</h2><Icon name="clock" size={19} /></div>
            <div className="compact-review-list">
              {courseReviews.map((review) => (
                <button type="button" key={review.id} onClick={() => onOpenTopic(review.topicId)}>
                  <strong>{topicById[review.topicId]?.title}</strong>
                  <span>{formatStudyDate(review.dueDate)}</span>
                </button>
              ))}
            </div>
          </section>
          <blockquote>判断是否掌握：能否不看答案，从题意画出第一张图，并说出为什么这样画。</blockquote>
        </aside>
      </div>
    </div>
  );
}
