import { courses } from "../data/courses";
import {
  createLearningBackup,
  createLearningState,
  isLearningState,
  migrateV2State,
  validateLearningBackup,
  type CourseId,
  type LearningState,
} from "./course-model";

export const LEARNING_STORAGE_KEY = "personal-electronics-workbench:state:v3";
export const PREVIOUS_STORAGE_KEY = "personal-electronics-workbench:state:v2";
export const LEGACY_STORAGE_KEY = "semester-electronics-learning-site:state:v1";
const JSON_MIME_TYPE = "application/json;charset=utf-8";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): StorageLike | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function migrateLegacyState(value: unknown, now = new Date()): LearningState | null {
  if (!value || typeof value !== "object") return null;
  const legacy = value as { currentTopicId?: unknown };
  if (typeof legacy.currentTopicId !== "string") return null;
  const currentTopicId = legacy.currentTopicId;
  const courseId = (["signals", "digital", "analog"] as const).find((id) => currentTopicId.startsWith(id)) ?? "signals";
  const state = createLearningState(courses, now);
  const course = courses.find((candidate) => candidate.id === courseId) ?? courses[0];
  const chapter = course.chapters.find((candidate) => currentTopicId.includes(candidate.id.replace(`${courseId}-`, "")))
    ?? course.chapters.find((candidate) => candidate.counted)
    ?? course.chapters[0];
  return {
    ...state,
    activeCourseId: course.id as CourseId,
    currentChapterByCourse: { ...state.currentChapterByCourse, [course.id]: chapter.id },
    chapterStatus: { [chapter.id]: "in_progress" },
  };
}

export function loadLearningState(storage: StorageLike | null = browserStorage()): LearningState | null {
  if (!storage) return null;
  try {
    const current = storage.getItem(LEARNING_STORAGE_KEY);
    if (current) {
      const parsed = JSON.parse(current) as unknown;
      return isLearningState(parsed, courses) ? structuredClone(parsed) : null;
    }
    const previous = storage.getItem(PREVIOUS_STORAGE_KEY);
    if (previous) {
      const migrated = migrateV2State(JSON.parse(previous) as unknown, courses);
      if (migrated) storage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    const legacy = storage.getItem(LEGACY_STORAGE_KEY);
    return legacy ? migrateLegacyState(JSON.parse(legacy) as unknown) : null;
  } catch {
    return null;
  }
}

export function saveLearningState(state: LearningState, storage: StorageLike | null = browserStorage()) {
  if (!storage) throw new Error("当前浏览器不支持本地存储，请先导出 JSON 备份。");
  if (!isLearningState(state, courses)) throw new Error("学习记录包含无效章节，已停止保存。");
  try {
    storage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    throw new Error("学习记录无法写入浏览器本地存储，请检查存储权限。", { cause: error });
  }
}

export function serializeLearningBackup(state: LearningState, exportedAt = new Date()) {
  return `${JSON.stringify(createLearningBackup(state, exportedAt), null, 2)}\n`;
}

export function restoreLearningBackup(serialized: string): LearningState {
  try {
    const parsed = JSON.parse(serialized.replace(/^\uFEFF/, "")) as unknown;
    if (isObject(parsed) && parsed.app === "personal-electronics-workbench" && parsed.schemaVersion === 2) {
      const migrated = migrateV2State(parsed.state, courses);
      if (!migrated) throw new Error("v2 学习记录结构损坏，无法迁移到当前课程。");
      return migrated;
    }
    return validateLearningBackup(parsed, courses);
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error("导入文件不是有效的 JSON。", { cause: error });
    throw error;
  }
}

export async function readLearningBackupFile(file: Blob) {
  return (await file.text()).replace(/^\uFEFF/, "");
}

function downloadText(content: string, filename: string) {
  if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") throw new Error("当前环境不支持下载文件。");
  const url = URL.createObjectURL(new Blob([content], { type: JSON_MIME_TYPE }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  try {
    anchor.click();
  } finally {
    anchor.remove();
    globalThis.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export function downloadLearningBackup(state: LearningState, exportedAt = new Date()) {
  const date = [exportedAt.getFullYear(), String(exportedAt.getMonth() + 1).padStart(2, "0"), String(exportedAt.getDate()).padStart(2, "0")].join("-");
  const filename = `个人电子课程工作台-${date}.json`;
  downloadText(serializeLearningBackup(state, exportedAt), filename);
  return filename;
}
