"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { allTags, allTopics, courses } from "../../data/semester";
import {
  formatStudyDate,
  getTopicLocation,
  masteryLabels,
  masteryLevels,
  type MasteryLevel,
  type SemesterState,
} from "../../lib/semester-model";
import { Icon } from "../Icons";
import { StudyDiagram } from "./StudyDiagram";

interface KnowledgeCardViewProps {
  state: SemesterState;
  topicId: string;
  onSelectTopic: (topicId: string) => void;
  onMasteryChange: (topicId: string, level: MasteryLevel) => void;
  onEvidenceChange: (topicId: string, evidence: string) => void;
  onReviewed: (topicId: string) => void;
}

export function KnowledgeCardView({
  state,
  topicId,
  onSelectTopic,
  onMasteryChange,
  onEvidenceChange,
  onReviewed,
}: KnowledgeCardViewProps) {
  const location = getTopicLocation(topicId) ?? getTopicLocation(allTopics[0].id)!;
  const topic = location.topic;
  const [courseFilter, setCourseFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [masteryFilter, setMasteryFilter] = useState("all");
  const [selfAnswers, setSelfAnswers] = useState<Record<string, string[]>>({});
  const [selfStatus, setSelfStatus] = useState<Record<string, string>>({});
  const currentTopicButtonRef = useRef<HTMLButtonElement>(null);
  const answers = selfAnswers[topic.id] ?? topic.selfTest.map(() => "");
  const review = state.reviews.find((item) => item.topicId === topic.id);

  const filteredTopics = useMemo(() => allTopics.filter((item) => {
    const itemLocation = getTopicLocation(item.id)!;
    return (courseFilter === "all" || itemLocation.course.id === courseFilter)
      && (tagFilter === "all" || item.tags.includes(tagFilter))
      && (masteryFilter === "all" || state.mastery[item.id] === masteryFilter);
  }), [courseFilter, masteryFilter, state.mastery, tagFilter]);

  const topicIndex = allTopics.findIndex((item) => item.id === topic.id);
  const previous = topicIndex > 0 ? allTopics[topicIndex - 1] : null;
  const next = topicIndex < allTopics.length - 1 ? allTopics[topicIndex + 1] : null;

  useEffect(() => {
    currentTopicButtonRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [topic.id]);

  function updateSelfAnswer(index: number, value: string) {
    const nextAnswers = [...answers];
    nextAnswers[index] = value;
    setSelfAnswers((current) => ({ ...current, [topic.id]: nextAnswers }));
    setSelfStatus((current) => ({ ...current, [topic.id]: "" }));
  }

  return (
    <div className="knowledge-page page-enter">
      <div className="knowledge-filterbar" aria-label="知识点筛选">
        <label>课程筛选
          <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
            <option value="all">全部课程</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
        </label>
        <label>标签筛选
          <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
            <option value="all">全部标签</option>
            {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </label>
        <label>掌握状态筛选
          <select value={masteryFilter} onChange={(event) => setMasteryFilter(event.target.value)}>
            <option value="all">全部状态</option>
            {masteryLevels.map((level) => <option key={level} value={level}>{masteryLabels[level]}</option>)}
          </select>
        </label>
        <span>{filteredTopics.length} 个知识点</span>
      </div>

      <div className="knowledge-grid">
        <aside className="knowledge-directory">
          <div className="section-title"><h2>知识目录</h2><span>{filteredTopics.length}</span></div>
          <div className="filtered-topic-list">
            {filteredTopics.map((item) => {
              const itemLocation = getTopicLocation(item.id)!;
              return (
                <button ref={item.id === topic.id ? currentTopicButtonRef : undefined} type="button" key={item.id} className={item.id === topic.id ? "is-current" : ""} onClick={() => onSelectTopic(item.id)}>
                  <span className={`mastery-dot level-${state.mastery[item.id]}`} />
                  <span><strong>{item.title}</strong><small>{itemLocation.course.shortTitle} · {itemLocation.chapter.title}</small></span>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="knowledge-article">
          <header>
            <h1>{topic.title}</h1>
            <p>{location.course.title} · {location.chapter.title}</p>
          </header>

          <section className="knowledge-block problem-block">
            <h2>要解决的问题</h2>
            <p>{topic.problem}</p>
          </section>

          <section className="knowledge-block prerequisites-block">
            <h2>前置知识</h2>
            <ul>{topic.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section className="knowledge-block">
            <h2>核心概念</h2>
            <p>{topic.coreConcept}</p>
          </section>

          <section className="knowledge-block visual-block">
            <div className="section-title"><h2>电路图、波形图或示意图</h2><span>{topic.diagram === "circuit" ? "电路等效" : topic.diagram === "wave" ? "时域波形" : "关系示意"}</span></div>
            <StudyDiagram kind={topic.diagram} title={topic.title} />
          </section>

          <section className="knowledge-block formula-block">
            <h2>公式及变量解释</h2>
            <code>{topic.formula.expression}</code>
            <ul>{topic.formula.variables.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section className="knowledge-block example-block">
            <h2>最小示例</h2>
            <p>{topic.minimalExample}</p>
          </section>

          <section className="knowledge-block errors-block">
            <h2>常见错误</h2>
            <ul>{topic.commonErrors.map((item) => <li key={item}><Icon name="warning" size={16} />{item}</li>)}</ul>
          </section>

          <form
            className="knowledge-block self-test-block"
            onSubmit={(event) => {
              event.preventDefault();
              const complete = answers.every((answer) => answer.trim().length >= 4);
              setSelfStatus((current) => ({ ...current, [topic.id]: complete ? "自测回答已记录。请对照知识卡逐项口述推理过程。" : "请先为两道题都写下至少一句可检查的答案。" }));
            }}
          >
            <div className="section-title"><h2>自测题</h2><span>先作答，再回看概念</span></div>
            {topic.selfTest.map((question, index) => (
              <label key={question}><span>{index + 1}. {question}</span><input value={answers[index] ?? ""} onChange={(event) => updateSelfAnswer(index, event.target.value)} placeholder="写下你的判断依据" /></label>
            ))}
            <button className="secondary-button" type="submit">提交自测</button>
            {selfStatus[topic.id] ? <p className="form-status" role="status">{selfStatus[topic.id]}</p> : null}
          </form>

          <section className="knowledge-block evidence-block">
            <h2>学习证据</h2>
            <p>{topic.evidencePrompt}</p>
            <label>
              <span>写下你实际完成的证据</span>
              <textarea value={state.evidence[topic.id] ?? ""} onChange={(event) => onEvidenceChange(topic.id, event.target.value)} placeholder={topic.evidencePrompt} />
            </label>
          </section>
        </article>

        <aside className="knowledge-status">
          <section>
            <h2>掌握状态</h2>
            <div className="mastery-control">
              {masteryLevels.map((level) => (
                <label key={level} className={state.mastery[topic.id] === level ? "is-selected" : ""}>
                  <input type="radio" name={`mastery-${topic.id}`} value={level} checked={state.mastery[topic.id] === level} onChange={() => onMasteryChange(topic.id, level)} />
                  <span>{masteryLabels[level]}</span>
                </label>
              ))}
            </div>
          </section>
          <section>
            <h2>知识标签</h2>
            <div className="tag-list">{topic.tags.map((tag) => <button type="button" key={tag} onClick={() => setTagFilter(tag)}>{tag}</button>)}</div>
          </section>
          <section>
            <h2>下次复习</h2>
            <strong className="review-date">{review ? formatStudyDate(review.dueDate) : "尚未安排"}</strong>
            <p>{review?.lastReviewedAt ? `上次复习：${new Date(review.lastReviewedAt).toLocaleDateString("zh-CN")}` : "完成本页后标记复习，系统会安排 7 天后的再次复习。"}</p>
          </section>
          {state.mistakes.some((mistake) => mistake.topicId === topic.id && !mistake.mastered) ? (
            <section className="mistake-reminder"><h2>错题提醒</h2><p>这个知识点仍有未掌握错题。复习后请回到错题页验证正确思路。</p></section>
          ) : null}
        </aside>
      </div>

      <footer className="knowledge-footer">
        <button type="button" disabled={!previous} onClick={() => previous && onSelectTopic(previous.id)}><Icon name="arrow" size={17} className="flip-icon" />上一个知识点</button>
        <button type="button" className="review-action" onClick={() => onReviewed(topic.id)}><Icon name="check" size={18} />标记为已复习</button>
        <button type="button" disabled={!next} onClick={() => next && onSelectTopic(next.id)}>下一个知识点<Icon name="arrow" size={17} /></button>
      </footer>
    </div>
  );
}
