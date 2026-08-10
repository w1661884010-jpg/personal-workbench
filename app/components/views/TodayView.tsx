import type { Topic, UserState } from "../../lib/model";
import { Icon } from "../Icons";

type TodayViewProps = {
  state: UserState;
  currentTopic: Topic;
  topicIndex: number;
  topicCount: number;
  onToggleTask: (taskId: string) => void;
  onOpenTask: (taskId: string) => void;
  onContinue: () => void;
};

export function TodayView({
  state,
  currentTopic,
  topicIndex,
  topicCount,
  onToggleTask,
  onOpenTask,
  onContinue,
}: TodayViewProps) {
  const progress = Math.max(
    8,
    Math.round(((topicIndex + 1) / topicCount) * 100),
  );

  return (
    <section className="view today-view" aria-labelledby="today-title">
      <header className="view-header">
        <div>
          <p className="section-label">当前主题</p>
          <h1 id="today-title" className="view-title">
            {currentTopic.title}
          </h1>
        </div>
      </header>

      <div className="progress-block">
        <div className="progress-meta">
          <span>当前主线进度</span>
          <span>
            {topicIndex + 1} / {topicCount}
          </span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="当前主线学习进度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={`第 ${topicIndex + 1} 个主题，共 ${topicCount} 个`}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <article className="question-sheet" aria-labelledby="main-question">
        <Icon name="question" size={42} />
        <h2 id="main-question">{state.today.mainQuestion}</h2>
      </article>

      <section aria-labelledby="today-tasks">
        <h2 id="today-tasks" className="section-label">
          今日任务 <span aria-label="最多三项">（最多 3 项）</span>
        </h2>
        <div className="task-list">
          {state.today.tasks.slice(0, 3).map((task, index) => (
            <div
              className="task-row"
              data-complete={task.completed}
              key={task.id}
            >
              <span className="task-index">{index + 1}</span>
              <button
                className="task-copy"
                type="button"
                onClick={() => onOpenTask(task.id)}
                aria-label={`进入相关内容：${task.title}`}
              >
                {task.title}
              </button>
              <button
                className="task-status"
                type="button"
                onClick={() => onToggleTask(task.id)}
                aria-pressed={task.completed}
                aria-label={`${task.completed ? "标记为待完成" : "标记为已完成"}：${task.title}`}
              >
                <span className="task-status-icon">
                  {task.completed ? (
                    <Icon name="check" size={17} />
                  ) : (
                    <span aria-hidden="true">·</span>
                  )}
                </span>
                {task.completed ? "已完成" : "待完成"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="continuation-grid">
        <section className="continuation-cell warning" aria-labelledby="carry-over-label">
          <p id="carry-over-label" className="continuation-label">
            <Icon name="warning" size={22} />
            上次未解决的问题
          </p>
          <p className="continuation-value">
            {state.today.carryOver || "暂无遗留问题"}
          </p>
        </section>
        <section className="continuation-cell next" aria-labelledby="next-step-label">
          <p id="next-step-label" className="continuation-label">
            <Icon name="arrow" size={22} />
            下次第一件事
          </p>
          <p className="continuation-value">
            {state.today.nextStep || "先记录一个明确的下一步"}
          </p>
        </section>
      </div>

      <div className="today-primary">
        <button className="primary-action" type="button" onClick={onContinue}>
          <Icon name="book" size={28} />
          继续学习
        </button>
      </div>
    </section>
  );
}
