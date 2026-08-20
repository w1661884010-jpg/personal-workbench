import {
  createSemesterBackupEnvelope,
  validateSemesterBackup,
  validateSemesterState,
  type SemesterState,
} from "./semester-model";

export const SEMESTER_STORAGE_KEY = "semester-electronics-learning-site:state:v1";
export const SEMESTER_JSON_MIME_TYPE = "application/json;charset=utf-8";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): StorageLike | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
export function loadSemesterState(storage: StorageLike | null = browserStorage()): SemesterState | null {
  if (!storage) return null;
  try {
    const serialized = storage.getItem(SEMESTER_STORAGE_KEY);
    return serialized ? validateSemesterState(JSON.parse(serialized) as unknown) : null;
  } catch {
    return null;
  }
}

export function saveSemesterState(state: SemesterState, storage: StorageLike | null = browserStorage()): void {
  if (!storage) throw new Error("当前浏览器不支持本地存储，请先导出 JSON 备份。");
  try {
    storage.setItem(SEMESTER_STORAGE_KEY, JSON.stringify(validateSemesterState(state)));
  } catch (error) {
    throw new Error("学习记录无法写入浏览器本地存储，请检查存储权限。", { cause: error });
  }
}

export function serializeSemesterBackup(state: SemesterState, exportedAt = new Date()): string {
  return `${JSON.stringify(createSemesterBackupEnvelope(state, exportedAt), null, 2)}\n`;
}

export function restoreSemesterBackup(serialized: string): SemesterState {
  try {
    const input = JSON.parse(serialized.replace(/^\uFEFF/, "")) as unknown;
    return validateSemesterBackup(input);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("导入文件不是有效的 JSON。", { cause: error });
    }
    throw error;
  }
}

export async function readSemesterBackupFile(file: Blob): Promise<string> {
  return (await file.text()).replace(/^\uFEFF/, "");
}

function downloadText(content: string, filename: string): void {
  if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") {
    throw new Error("当前环境不支持下载文件。");
  }
  const url = URL.createObjectURL(new Blob([content], { type: SEMESTER_JSON_MIME_TYPE }));
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

function fileDate(date: Date): string {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function downloadSemesterBackup(state: SemesterState, exportedAt = new Date()): string {
  const filename = `电子课程学习记录-${fileDate(exportedAt)}.json`;
  downloadText(serializeSemesterBackup(state, exportedAt), filename);
  return filename;
}
