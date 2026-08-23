export type CourseId = "signals" | "digital" | "analog";
export type ChapterStatus = "not_started" | "in_progress" | "completed";
export type Importance = "core" | "optional";
export type SourceStatus = "verified_local" | "supplemental_local" | "insufficient";
export type WorkbenchKind = "digital" | "analog" | "notebook";

export interface LearningSection {
  id: string;
  title: string;
  importance: Importance;
  sourceStatus: SourceStatus;
  content: string;
  formula?: string;
  variables?: readonly string[];
}

export interface WorkedExample {
  title: string;
  prompt: string;
  steps: readonly string[];
  answer: string;
}

export interface ChapterExperiment {
  id: string;
  title: string;
  workbench: WorkbenchKind;
  goal: string;
  steps: readonly string[];
  expected: string;
  presetId?: string;
  limitation?: string;
}

export interface CheckQuestion {
  id: string;
  prompt: string;
  options: readonly string[];
  answer: number;
  explanation: string;
}

export interface ChapterDefinition {
  id: string;
  number: string;
  title: string;
  counted: boolean;
  sourceStatus: SourceStatus;
  objectives: readonly string[];
  prerequisites: readonly string[];
  sections: readonly LearningSection[];
  examples: readonly WorkedExample[];
  experiments: readonly ChapterExperiment[];
  check: readonly CheckQuestion[];
  summary: readonly string[];
  tags: readonly string[];
}

export interface CourseDefinition {
  id: CourseId;
  title: string;
  shortTitle: string;
  textbook: string;
  sourceNote: string;
  role: string;
  accent: string;
  chapters: readonly ChapterDefinition[];
}

export interface ChapterCheckSubmission {
  answers: readonly number[];
  submittedAt: string;
  score: number;
}

export interface MistakeRecord {
  id: string;
  title: string;
  courseId: CourseId;
  chapterId: string;
  reason: string;
  correctApproach: string;
  nextReviewDate?: string;
  reviewed: boolean;
  updatedAt: string;
}

export interface LearningState {
  schemaVersion: 2;
  activeCourseId: CourseId;
  currentChapterByCourse: Record<CourseId, string>;
  chapterStatus: Record<string, ChapterStatus>;
  checkSubmissions: Record<string, ChapterCheckSubmission>;
  mistakes: readonly MistakeRecord[];
  updatedAt: string;
}

export const LEARNING_APP_ID = "personal-electronics-workbench";
export const LEARNING_SCHEMA_VERSION = 2 as const;

function dateOffset(date: Date, days: number): string {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return [next.getFullYear(), String(next.getMonth() + 1).padStart(2, "0"), String(next.getDate()).padStart(2, "0")].join("-");
}

function allChapters(courses: readonly CourseDefinition[]) {
  return courses.flatMap((course) => course.chapters);
}

export function createLearningState(courses: readonly CourseDefinition[], now = new Date()): LearningState {
  const currentChapterByCourse = Object.fromEntries(
    courses.map((course) => [course.id, course.chapters[0].id]),
  ) as Record<CourseId, string>;
  return {
    schemaVersion: LEARNING_SCHEMA_VERSION,
    activeCourseId: "signals",
    currentChapterByCourse,
    chapterStatus: {},
    checkSubmissions: {},
    mistakes: courses.map((course, index) => {
      const chapter = course.chapters.find((candidate) => candidate.counted) ?? course.chapters[0];
      return {
        id: `example-mistake-${course.id}`,
        title: index === 0 ? "变换条件与适用范围混淆" : index === 1 ? "只写逻辑式，没有回查真值表" : "静态工作点与交流增益混算",
        courseId: course.id,
        chapterId: chapter.id,
        reason: index === 0 ? "计算前没有先判断信号和系统条件。" : index === 1 ? "化简后省略了逐行验证。" : "没有先分离直流通路和交流小信号通路。",
        correctApproach: index === 0 ? "先写适用条件，再选择时域、频域或复频域工具。" : index === 1 ? "列出输入组合，用真值表核对原式和化简式。" : "先求静态工作点，再在线性化模型中求交流量。",
        nextReviewDate: dateOffset(now, index + 1),
        reviewed: false,
        updatedAt: now.toISOString(),
      } satisfies MistakeRecord;
    }),
    updatedAt: now.toISOString(),
  };
}

export function getChapter(courses: readonly CourseDefinition[], chapterId: string) {
  for (const course of courses) {
    const chapter = course.chapters.find((candidate) => candidate.id === chapterId);
    if (chapter) return { course, chapter };
  }
  return null;
}

export function getChapterStatus(state: LearningState, chapterId: string): ChapterStatus {
  return state.chapterStatus[chapterId] ?? "not_started";
}

export function getCurrentChapter(
  state: LearningState,
  course: CourseDefinition,
): ChapterDefinition {
  const chapter = course.chapters.find((candidate) => candidate.id === state.currentChapterByCourse[course.id])
    ?? course.chapters.find((chapter) => chapter.counted && getChapterStatus(state, chapter.id) !== "completed")
    ?? course.chapters.at(-1)
    ?? course.chapters[0];
  if (!chapter) throw new Error(`课程 ${course.id} 没有章节。`);
  return chapter;
}

export function getCourseProgress(state: LearningState, course: CourseDefinition) {
  const counted = course.chapters.filter((chapter) => chapter.counted);
  const completed = counted.filter((chapter) => getChapterStatus(state, chapter.id) === "completed").length;
  return { completed, total: counted.length, percent: counted.length ? Math.round((completed / counted.length) * 100) : 0 };
}

export function startChapter(
  state: LearningState,
  courseId: CourseId,
  chapterId: string,
  now = new Date(),
): LearningState {
  const current = getChapterStatus(state, chapterId);
  return {
    ...state,
    activeCourseId: courseId,
    currentChapterByCourse: { ...state.currentChapterByCourse, [courseId]: chapterId },
    chapterStatus: current === "not_started" ? { ...state.chapterStatus, [chapterId]: "in_progress" } : state.chapterStatus,
    updatedAt: now.toISOString(),
  };
}

export function submitChapterCheck(
  state: LearningState,
  chapter: ChapterDefinition,
  answers: readonly number[],
  now = new Date(),
): LearningState {
  if (answers.length !== chapter.check.length || answers.some((answer) => !Number.isInteger(answer) || answer < 0)) {
    throw new Error("请先回答本章全部检验题。激活完成按钮不要求达到额外分数线。");
  }
  const correct = chapter.check.reduce((total, question, index) => total + Number(question.answer === answers[index]), 0);
  return {
    ...state,
    chapterStatus: {
      ...state.chapterStatus,
      [chapter.id]: getChapterStatus(state, chapter.id) === "completed" ? "completed" : "in_progress",
    },
    checkSubmissions: {
      ...state.checkSubmissions,
      [chapter.id]: {
        answers: [...answers],
        submittedAt: now.toISOString(),
        score: chapter.check.length ? Math.round((correct / chapter.check.length) * 100) : 100,
      },
    },
    updatedAt: now.toISOString(),
  };
}

export function completeChapter(state: LearningState, chapterId: string, now = new Date()): LearningState {
  if (!state.checkSubmissions[chapterId]) throw new Error("完成章节检验后，才能把本章标记为已完成。");
  return {
    ...state,
    chapterStatus: { ...state.chapterStatus, [chapterId]: "completed" },
    updatedAt: now.toISOString(),
  };
}

export function upsertMistake(state: LearningState, mistake: MistakeRecord, now = new Date()): LearningState {
  const exists = state.mistakes.some((item) => item.id === mistake.id);
  return {
    ...state,
    mistakes: exists ? state.mistakes.map((item) => item.id === mistake.id ? { ...mistake, updatedAt: now.toISOString() } : item) : [...state.mistakes, { ...mistake, updatedAt: now.toISOString() }],
    updatedAt: now.toISOString(),
  };
}

export function markMistakeReviewed(state: LearningState, mistakeId: string, now = new Date()): LearningState {
  return {
    ...state,
    mistakes: state.mistakes.map((item) => item.id === mistakeId ? { ...item, reviewed: true, updatedAt: now.toISOString() } : item),
    updatedAt: now.toISOString(),
  };
}

export function isLearningState(value: unknown, courses: readonly CourseDefinition[]): value is LearningState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<LearningState>;
  if (state.schemaVersion !== LEARNING_SCHEMA_VERSION || !state.currentChapterByCourse || !state.chapterStatus || !state.checkSubmissions || !Array.isArray(state.mistakes)) return false;
  const chapterIds = new Set(allChapters(courses).map((chapter) => chapter.id));
  const courseIds = ["signals", "digital", "analog"] as const;
  return courseIds.includes(state.activeCourseId as CourseId)
    && courseIds.every((courseId) => getChapter(courses, state.currentChapterByCourse?.[courseId] ?? "")?.course.id === courseId)
    && Object.entries(state.chapterStatus).every(([id, status]) => chapterIds.has(id) && ["not_started", "in_progress", "completed"].includes(status))
    && Object.entries(state.checkSubmissions).every(([id, submission]) => chapterIds.has(id)
      && Array.isArray(submission.answers)
      && submission.answers.every((answer) => Number.isInteger(answer) && answer >= 0)
      && Number.isFinite(submission.score) && submission.score >= 0 && submission.score <= 100
      && !Number.isNaN(Date.parse(submission.submittedAt)))
    && state.mistakes.every((mistake) => chapterIds.has(mistake.chapterId)
      && getChapter(courses, mistake.chapterId)?.course.id === mistake.courseId
      && [mistake.id, mistake.title, mistake.reason, mistake.correctApproach, mistake.updatedAt].every((field) => typeof field === "string" && field.length > 0)
      && (mistake.nextReviewDate === undefined || (typeof mistake.nextReviewDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(mistake.nextReviewDate) && !Number.isNaN(Date.parse(`${mistake.nextReviewDate}T00:00:00`))))
      && typeof mistake.reviewed === "boolean")
    && typeof state.updatedAt === "string" && !Number.isNaN(Date.parse(state.updatedAt));
}

export function createLearningBackup(state: LearningState, now = new Date()) {
  return { app: LEARNING_APP_ID, schemaVersion: LEARNING_SCHEMA_VERSION, exportedAt: now.toISOString(), state };
}

export function validateLearningBackup(value: unknown, courses: readonly CourseDefinition[]): LearningState {
  if (!value || typeof value !== "object") throw new Error("文件不是有效的学习记录。");
  const envelope = value as { app?: unknown; schemaVersion?: unknown; state?: unknown };
  if (envelope.app !== LEARNING_APP_ID || envelope.schemaVersion !== LEARNING_SCHEMA_VERSION) {
    throw new Error("这不是本学习站点导出的 v2 记录。");
  }
  if (!isLearningState(envelope.state, courses)) throw new Error("学习记录结构损坏或引用了不存在的章节。");
  return structuredClone(envelope.state);
}
