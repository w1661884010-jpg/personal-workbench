import { allTopics, courseById, courses, topicById } from "../data/semester";

export const SEMESTER_SCHEMA_VERSION = 1 as const;
export const SEMESTER_APP_ID = "semester-electronics-learning-site" as const;

export const masteryLevels = ["untouched", "recognize", "explain", "apply"] as const;
export type MasteryLevel = (typeof masteryLevels)[number];
export type DiagramKind = "logic" | "circuit" | "wave" | "system" | "spectrum" | "sampling";

export interface FormulaContent {
  readonly expression: string;
  readonly variables: readonly string[];
}
export interface KnowledgeTopic {
  readonly id: string;
  readonly title: string;
  readonly problem: string;
  readonly prerequisites: readonly string[];
  readonly coreConcept: string;
  readonly diagram: DiagramKind;
  readonly formula: FormulaContent;
  readonly minimalExample: string;
  readonly commonErrors: readonly string[];
  readonly selfTest: readonly string[];
  readonly evidencePrompt: string;
  readonly tags: readonly string[];
}

export interface Chapter {
  readonly id: string;
  readonly title: string;
  readonly topic: KnowledgeTopic;
}

export interface Course {
  readonly id: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly color: string;
  readonly role: string;
  readonly route: readonly string[];
  readonly chapters: readonly Chapter[];
}

export interface TodayTask {
  id: string;
  title: string;
  topicId: string;
  durationMinutes: number;
  completed: boolean;
}

export interface MistakeRecord {
  id: string;
  title: string;
  courseId: string;
  chapterId: string;
  topicId: string;
  reason: string;
  correctApproach: string;
  nextReviewDate: string;
  mastered: boolean;
  updatedAt: string;
}

export interface ReviewRecord {
  id: string;
  topicId: string;
  dueDate: string;
  lastReviewedAt: string | null;
}

export interface LearningLog {
  id: string;
  courseId: string;
  topicId: string;
  action: string;
  createdAt: string;
}

export interface SemesterState {
  schemaVersion: typeof SEMESTER_SCHEMA_VERSION;
  semesterWeek: number;
  currentTopicId: string;
  currentTopicByCourse: Record<string, string>;
  todayMainQuestion: string;
  tomorrowFirstThing: string;
  todayTasks: TodayTask[];
  mastery: Record<string, MasteryLevel>;
  evidence: Record<string, string>;
  mistakes: MistakeRecord[];
  reviews: ReviewRecord[];
  learningLogs: LearningLog[];
  updatedAt: string;
}

export interface SemesterBackupEnvelope {
  app: typeof SEMESTER_APP_ID;
  schemaVersion: typeof SEMESTER_SCHEMA_VERSION;
  exportedAt: string;
  state: SemesterState;
}

export interface TopicLocation {
  course: (typeof courses)[number];
  chapter: (typeof courses)[number]["chapters"][number];
  topic: KnowledgeTopic;
}

const topicIds = new Set(allTopics.map((topic) => topic.id));
const courseIds = new Set(courses.map((course) => course.id));
const chapterIds = new Set(courses.flatMap((course) => course.chapters.map((chapter) => chapter.id)));
const masterySet = new Set<string>(masteryLevels);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`));
}

function localDate(date: Date): string {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function dateOffset(date: Date, days: number): string {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return localDate(next);
}

export function formatStudyDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${Number(month)} 月 ${Number(day)} 日${year ? "" : ""}`;
}

export function getTopicLocation(topicId: string): TopicLocation | null {
  for (const course of courses) {
    for (const chapter of course.chapters) {
      if (chapter.topic.id === topicId) {
        return { course, chapter, topic: chapter.topic };
      }
    }
  }
  return null;
}

function masteryScore(level: MasteryLevel): number {
  return masteryLevels.indexOf(level);
}

export function getCourseProgress(state: SemesterState, courseId: string): number {
  const course = courseById[courseId];
  if (!course) return 0;
  const score = course.chapters.reduce(
    (total, chapter) => total + masteryScore(state.mastery[chapter.topic.id] ?? "untouched"),
    0,
  );
  return Math.round((score / (course.chapters.length * 3)) * 100);
}

export function getOverallProgress(state: SemesterState): number {
  const score = allTopics.reduce(
    (total, topic) => total + masteryScore(state.mastery[topic.id] ?? "untouched"),
    0,
  );
  return Math.round((score / (allTopics.length * 3)) * 100);
}

export function getChapterProgress(state: SemesterState, chapterId: string): number {
  const chapter = courses.flatMap((course) => course.chapters).find((item) => item.id === chapterId);
  if (!chapter) return 0;
  return Math.round((masteryScore(state.mastery[chapter.topic.id] ?? "untouched") / 3) * 100);
}

export function getCoursePendingCount(state: SemesterState, courseId: string, today = new Date()): number {
  const pendingTasks = state.todayTasks.filter((task) => {
    const location = getTopicLocation(task.topicId);
    return !task.completed && location?.course.id === courseId;
  }).length;
  const dueReviews = state.reviews.filter((review) => {
    const location = getTopicLocation(review.topicId);
    return location?.course.id === courseId && review.dueDate <= localDate(today);
  }).length;
  const activeMistakes = state.mistakes.filter((mistake) => mistake.courseId === courseId && !mistake.mastered).length;
  return pendingTasks + dueReviews + activeMistakes;
}

export function getDueReviews(state: SemesterState, today = new Date()): ReviewRecord[] {
  const date = localDate(today);
  return [...state.reviews]
    .filter((review) => review.dueDate <= date)
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate));
}

export function getWeakTopics(state: SemesterState, courseId: string, limit = 3): KnowledgeTopic[] {
  const course = courseById[courseId];
  if (!course) return [];
  return [...course.chapters]
    .sort((left, right) => masteryScore(state.mastery[left.topic.id] ?? "untouched") - masteryScore(state.mastery[right.topic.id] ?? "untouched"))
    .slice(0, limit)
    .map((chapter) => chapter.topic);
}

export function toggleTask(state: SemesterState, taskId: string): SemesterState {
  return {
    ...state,
    todayTasks: state.todayTasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task),
    updatedAt: new Date().toISOString(),
  };
}

export function updateMastery(state: SemesterState, topicId: string, level: MasteryLevel): SemesterState {
  if (!topicIds.has(topicId) || !masterySet.has(level)) {
    throw new Error("无法更新未知知识点或掌握状态。");
  }
  const location = getTopicLocation(topicId);
  return {
    ...state,
    currentTopicId: topicId,
    currentTopicByCourse: location ? { ...state.currentTopicByCourse, [location.course.id]: topicId } : state.currentTopicByCourse,
    mastery: { ...state.mastery, [topicId]: level },
    updatedAt: new Date().toISOString(),
  };
}

export function updateEvidence(state: SemesterState, topicId: string, evidence: string): SemesterState {
  if (!topicIds.has(topicId)) throw new Error("无法为未知知识点记录证据。");
  return {
    ...state,
    evidence: { ...state.evidence, [topicId]: evidence },
    updatedAt: new Date().toISOString(),
  };
}

export function markTopicReviewed(state: SemesterState, topicId: string, reviewedAt = new Date()): SemesterState {
  if (!topicIds.has(topicId)) throw new Error("无法复习未知知识点。");
  const existing = state.reviews.find((review) => review.topicId === topicId);
  const nextReview: ReviewRecord = {
    id: existing?.id ?? `review-${topicId}`,
    topicId,
    lastReviewedAt: reviewedAt.toISOString(),
    dueDate: dateOffset(reviewedAt, 7),
  };
  const reviews = existing
    ? state.reviews.map((review) => review.topicId === topicId ? nextReview : review)
    : [...state.reviews, nextReview];
  const location = getTopicLocation(topicId);
  return {
    ...state,
    reviews,
    learningLogs: location ? [{
      id: `log-reviewed-${topicId}-${reviewedAt.getTime()}`,
      courseId: location.course.id,
      topicId,
      action: `复习“${location.topic.title}”并把下次复习安排到 ${nextReview.dueDate}`,
      createdAt: reviewedAt.toISOString(),
    }, ...state.learningLogs].slice(0, 30) : state.learningLogs,
    updatedAt: reviewedAt.toISOString(),
  };
}

export function upsertMistake(state: SemesterState, mistake: MistakeRecord): SemesterState {
  const existing = state.mistakes.some((item) => item.id === mistake.id);
  return {
    ...state,
    mistakes: existing
      ? state.mistakes.map((item) => item.id === mistake.id ? { ...mistake } : item)
      : [...state.mistakes, { ...mistake }],
    updatedAt: mistake.updatedAt,
  };
}

export function markMistakeMastered(state: SemesterState, mistakeId: string): SemesterState {
  const mistake = state.mistakes.find((item) => item.id === mistakeId);
  if (!mistake) return state;
  const mastered = {
    ...state,
    mistakes: state.mistakes.map((item) => item.id === mistakeId ? { ...item, mastered: true, updatedAt: new Date().toISOString() } : item),
  };
  return updateMastery(mastered, mistake.topicId, "apply");
}

export function createSemesterState(now = new Date()): SemesterState {
  const initialLevels: MasteryLevel[][] = [
    ["apply", "explain", "explain", "apply", "explain", "recognize"],
    ["apply", "explain", "explain", "recognize", "untouched", "apply", "explain", "recognize"],
    ["apply", "explain", "explain", "explain", "recognize", "recognize", "untouched", "untouched"],
  ];
  const mastery = Object.fromEntries(
    courses.flatMap((course, courseIndex) =>
      course.chapters.map((chapter, chapterIndex) => [chapter.topic.id, initialLevels[courseIndex][chapterIndex]]),
    ),
  ) as Record<string, MasteryLevel>;
  const timestamp = now.toISOString();

  return {
    schemaVersion: SEMESTER_SCHEMA_VERSION,
    semesterWeek: 3,
    currentTopicId: "signals-convolution-topic",
    currentTopicByCourse: {
      digital: "digital-combinational-topic",
      analog: "analog-amplifier-topic",
      signals: "signals-convolution-topic",
    },
    todayMainQuestion: "为什么卷积能够描述 LTI 系统对任意输入的响应？",
    tomorrowFirstThing: "画出共射放大电路的小信号等效模型，并标出 rπ 与 gm·vπ。",
    todayTasks: [
      { id: "task-convolution-read", title: "阅读连续时间卷积知识卡并画出翻转、平移步骤", topicId: "signals-convolution-topic", durationMinutes: 30, completed: false },
      { id: "task-convolution-exercise", title: "完成矩形脉冲卷积自测并写出分段积分上下限", topicId: "signals-convolution-topic", durationMinutes: 40, completed: false },
      { id: "task-kmap-review", title: "复盘卡诺图错题：重新圈组并解释被消去变量", topicId: "digital-boolean-kmap-topic", durationMinutes: 20, completed: false },
    ],
    mastery,
    evidence: {
      "signals-lti-topic": "我能从冲激分解、线性和时不变三步说明输出为什么写成卷积。",
      "digital-combinational-topic": "我已独立写出一位全加器的八行真值表并验证 1+1+1。",
      "analog-qpoint-topic": "我能从原电路画出直流等效图并算出 IBQ、ICQ 与 VCEQ。",
    },
    mistakes: [
      {
        id: "mistake-kmap-edge",
        title: "卡诺图漏掉首尾相邻圈组",
        courseId: "digital",
        chapterId: "digital-boolean-kmap",
        topicId: "digital-boolean-kmap-topic",
        reason: "按普通表格理解边界，没有把格雷码首尾列视为相邻。",
        correctApproach: "先标出行列格雷码，再同时检查上下、左右边界能否组成更大的 2ⁿ 单元组。",
        nextReviewDate: dateOffset(now, 0),
        mastered: false,
        updatedAt: timestamp,
      },
      {
        id: "mistake-qpoint-capacitor",
        title: "静态工作点分析时保留了耦合电容",
        courseId: "analog",
        chapterId: "analog-qpoint",
        topicId: "analog-qpoint-topic",
        reason: "没有区分直流通路和交流通路，导致基极偏置回路画错。",
        correctApproach: "求 Q 点时将耦合、旁路电容全部开路，只保留直流电源和偏置电阻。",
        nextReviewDate: dateOffset(now, 1),
        mastered: false,
        updatedAt: timestamp,
      },
      {
        id: "mistake-convolution-flip",
        title: "卷积计算忘记翻转 h(τ)",
        courseId: "signals",
        chapterId: "signals-convolution",
        topicId: "signals-convolution-topic",
        reason: "直接把 h(τ) 平移成 h(τ−t)，导致重叠区间和输出支撑范围错误。",
        correctApproach: "固定 x(τ)，依次画 h(−τ)、h(t−τ)，再按照端点相交时刻分段积分。",
        nextReviewDate: dateOffset(now, 0),
        mastered: false,
        updatedAt: timestamp,
      },
    ],
    reviews: [
      { id: "review-kmap", topicId: "digital-boolean-kmap-topic", dueDate: dateOffset(now, -1), lastReviewedAt: null },
      { id: "review-convolution", topicId: "signals-convolution-topic", dueDate: dateOffset(now, 0), lastReviewedAt: null },
      { id: "review-qpoint", topicId: "analog-qpoint-topic", dueDate: dateOffset(now, 1), lastReviewedAt: null },
      { id: "review-full-adder", topicId: "digital-combinational-topic", dueDate: dateOffset(now, 3), lastReviewedAt: null },
    ],
    learningLogs: [
      { id: "log-lti", courseId: "signals", topicId: "signals-lti-topic", action: "完成 LTI 系统冲激响应知识卡，自测 2/2", createdAt: new Date(now.getTime() - 86_400_000).toISOString() },
      { id: "log-qpoint", courseId: "analog", topicId: "analog-qpoint-topic", action: "重画直流等效电路并修正 Q 点计算", createdAt: new Date(now.getTime() - 2 * 86_400_000).toISOString() },
      { id: "log-adder", courseId: "digital", topicId: "digital-combinational-topic", action: "完成全加器真值表并留下学习证据", createdAt: new Date(now.getTime() - 3 * 86_400_000).toISOString() },
    ],
    updatedAt: timestamp,
  };
}

function validateState(input: unknown): SemesterState {
  if (!isObject(input)) throw new Error("学习记录必须是对象。");
  if (input.schemaVersion !== SEMESTER_SCHEMA_VERSION) throw new Error("不支持的 schemaVersion。");
  if (!Number.isInteger(input.semesterWeek) || Number(input.semesterWeek) < 1) throw new Error("semesterWeek 无效。");
  if (!isText(input.currentTopicId) || !topicIds.has(input.currentTopicId)) throw new Error("currentTopicId 指向未知知识点。");
  if (!isObject(input.currentTopicByCourse)) throw new Error("currentTopicByCourse 无效。");
  for (const courseId of courseIds) {
    const topicId = input.currentTopicByCourse[courseId];
    if (!isText(topicId) || getTopicLocation(topicId)?.course.id !== courseId) throw new Error(`currentTopicByCourse.${courseId} 无效。`);
  }
  if (!isText(input.todayMainQuestion) || !isText(input.tomorrowFirstThing)) throw new Error("今日问题或明日第一件事为空。");
  if (!Array.isArray(input.todayTasks) || input.todayTasks.length < 1 || input.todayTasks.length > 3) throw new Error("todayTasks 必须包含 1 至 3 项。");
  for (const task of input.todayTasks) {
    if (!isObject(task) || !isText(task.id) || !isText(task.title) || !isText(task.topicId) || !topicIds.has(task.topicId) || typeof task.completed !== "boolean" || !Number.isFinite(task.durationMinutes)) {
      throw new Error("todayTasks 中存在无效 topicId 或字段。");
    }
  }
  if (!isObject(input.mastery)) throw new Error("mastery 无效。");
  for (const topicId of topicIds) {
    if (!masterySet.has(String(input.mastery[topicId]))) throw new Error(`mastery.${topicId} 无效。`);
  }
  if (!isObject(input.evidence)) throw new Error("evidence 无效。");
  if (!Array.isArray(input.mistakes) || !Array.isArray(input.reviews) || !Array.isArray(input.learningLogs)) throw new Error("错题、复习或学习记录无效。");
  for (const mistake of input.mistakes) {
    if (!isObject(mistake) || !isText(mistake.id) || !isText(mistake.title) || !courseIds.has(String(mistake.courseId)) || !chapterIds.has(String(mistake.chapterId)) || !topicIds.has(String(mistake.topicId)) || !isText(mistake.reason) || !isText(mistake.correctApproach) || !isDate(mistake.nextReviewDate) || typeof mistake.mastered !== "boolean" || !isText(mistake.updatedAt)) {
      throw new Error("mistakes 中存在无效引用或字段。");
    }
  }
  for (const review of input.reviews) {
    if (!isObject(review) || !isText(review.id) || !isText(review.topicId) || !topicIds.has(review.topicId) || !isDate(review.dueDate) || !(review.lastReviewedAt === null || isText(review.lastReviewedAt))) {
      throw new Error("reviews 中存在无效 topicId 或日期。");
    }
  }
  for (const log of input.learningLogs) {
    if (!isObject(log) || !isText(log.id) || !courseIds.has(String(log.courseId)) || !topicIds.has(String(log.topicId)) || !isText(log.action) || !isText(log.createdAt)) {
      throw new Error("learningLogs 中存在无效引用或字段。");
    }
  }
  if (!isText(input.updatedAt)) throw new Error("updatedAt 无效。");
  return clone(input as unknown as SemesterState);
}

export function validateSemesterState(input: unknown): SemesterState {
  return validateState(input);
}

export function createSemesterBackupEnvelope(state: SemesterState, exportedAt = new Date()): SemesterBackupEnvelope {
  return {
    app: SEMESTER_APP_ID,
    schemaVersion: SEMESTER_SCHEMA_VERSION,
    exportedAt: exportedAt.toISOString(),
    state: validateState(state),
  };
}

export function validateSemesterBackup(input: unknown): SemesterState {
  if (!isObject(input) || input.app !== SEMESTER_APP_ID) throw new Error("这不是本学习站点导出的 JSON 备份。");
  if (input.schemaVersion !== SEMESTER_SCHEMA_VERSION) throw new Error("备份 schemaVersion 不受支持。");
  if (!isText(input.exportedAt) || Number.isNaN(Date.parse(input.exportedAt))) throw new Error("备份 exportedAt 无效。");
  return validateState(input.state);
}

export const masteryLabels: Record<MasteryLevel, string> = {
  untouched: "未接触",
  recognize: "能识别",
  explain: "能解释",
  apply: "能应用",
};

export const masteryScores = Object.fromEntries(masteryLevels.map((level, index) => [level, index])) as Record<MasteryLevel, number>;

export function getCourseForTopic(topicId: string) {
  return getTopicLocation(topicId)?.course ?? null;
}

export function getTopic(topicId: string) {
  return topicById[topicId] ?? null;
}
