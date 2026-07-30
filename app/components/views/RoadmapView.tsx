import type {
  MasteryLevel,
  MasteryRecord,
  Topic,
} from "../../lib/model";
import { Icon } from "../Icons";

const masteryLabels: Record<MasteryLevel, string> = {
  untouched: "未接触",
  recognize: "能识别",
  explain: "能解释",
  apply: "能应用",
};

type RoadmapViewProps = {
  topics: Topic[];
  currentTopicId: string;
  selectedTopicId: string;
  mastery: Record<string, MasteryRecord>;
  onSelectTopic: (topicId: string) => void;
  onSetMastery: (topicId: string, level: MasteryLevel) => void;
  onContinue: (topicId: string) => void;
};

export function RoadmapView({
  topics,
  currentTopicId,
  selectedTopicId,
  mastery,
  onSelectTopic,
  onSetMastery,
  onContinue,
}: RoadmapViewProps) {
  const selectedTopic =
    topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];
  const selectedMastery =
    mastery[selectedTopic.id]?.level ?? ("untouched" as MasteryLevel);
  const nextTopic = topics.find(
    (topic) => topic.id === selectedTopic.nextTopicId,
  );

  return (
    <section className="view" aria-labelledby="roadmap-title">
      <header className="view-header">
        <div>
          <h1 id="roadmap-title" className="view-title compact">
            学习路线
          </h1>
          <p className="view-conclusion">只沿一条主线推进，不并行扩展</p>
        </div>
      </header>

      <div className="route-layout">
        <nav className="route-rail" aria-label="F28335 基础学习主题">
          {topics.map((topic) => {
            const topicMastery =
              mastery[topic.id]?.level ?? ("untouched" as MasteryLevel);
            const isCurrent = topic.id === currentTopicId;
            const isSelected = topic.id === selectedTopic.id;

            return (
              <button
                type="button"
                className="route-item"
                key={topic.id}
                aria-current={isCurrent ? "step" : undefined}
                aria-pressed={isSelected}
                onClick={() => onSelectTopic(topic.id)}
              >
                <span className="route-number">{topic.order}</span>
                <span>
                  <span className="route-title">{topic.title}</span>
                  <span className="route-state">
                    {isCurrent ? "当前 · " : ""}
                    {masteryLabels[topicMastery]}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <article className="topic-panel" aria-labelledby="selected-topic-title">
          <header className="topic-panel-header">
            <h2 id="selected-topic-title">
              {selectedTopic.order}. {selectedTopic.title}
            </h2>
            <span className="topic-state">
              {selectedTopic.id === currentTopicId ? "进行中 · " : ""}
              {masteryLabels[selectedMastery]}
            </span>
          </header>

          <dl className="detail-rows">
            <div className="detail-row">
              <dt>
                <Icon name="question" size={21} />
                当前问题
              </dt>
              <dd>{selectedTopic.question}</dd>
            </div>
            <div className="detail-row">
              <dt>
                <Icon name="notebook" size={21} />
                最少前置
              </dt>
              <dd>
                {selectedTopic.prerequisites.length ? (
                  <ul className="detail-list">
                    {selectedTopic.prerequisites.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  "无额外前置，先从最小工程开始。"
                )}
              </dd>
            </div>
            <div className="detail-row">
              <dt>
                <Icon name="check" size={21} />
                可执行任务
              </dt>
              <dd>
                <ol className="detail-list">
                  {selectedTopic.tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ol>
              </dd>
            </div>
            <div className="detail-row">
              <dt>
                <Icon name="info" size={21} />
                核心解释
              </dt>
              <dd>{selectedTopic.explanation}</dd>
            </div>
            <div className="detail-row">
              <dt>
                <Icon name="route" size={21} />
                相关位置
              </dt>
              <dd>{selectedTopic.relatedLocations.join("；")}</dd>
            </div>
            <div className="detail-row">
              <dt>
                <Icon name="check" size={21} />
                完成标准
              </dt>
              <dd>
                <ul className="detail-list">
                  {selectedTopic.completionCriteria.map((criterion) => (
                    <li key={criterion}>{criterion}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <section className="mastery-block" aria-labelledby="mastery-title">
            <div className="mastery-label">
              <span id="mastery-title">掌握程度</span>
              <span className="mastery-note">能应用需要至少一条证据</span>
            </div>
            <div className="mastery-options">
              {(Object.keys(masteryLabels) as MasteryLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  className="mastery-button"
                  aria-pressed={selectedMastery === level}
                  onClick={() => onSetMastery(selectedTopic.id, level)}
                >
                  {masteryLabels[level]}
                  {level === "apply" ? "（需证据）" : ""}
                </button>
              ))}
            </div>
          </section>

          <dl className="detail-rows">
            <div className="detail-row">
              <dt>
                <Icon name="arrow" size={21} />
                下一主题
              </dt>
              <dd>{nextTopic?.title ?? "主线完成，整理证据与遗留问题。"}</dd>
            </div>
          </dl>

          <div className="panel-action">
            <button
              className="primary-action"
              type="button"
              onClick={() => onContinue(selectedTopic.id)}
            >
              <Icon name="book" size={24} />
              继续当前主题
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
