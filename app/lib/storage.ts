import {
  BACKUP_APP_ID,
  createBackupEnvelope as createValidatedBackupEnvelope,
  validateBackup,
} from "./model";
import type { BackupEnvelope, UserState } from "./model";

export const STORAGE_KEY = "automation-learning-workbench:user-state";
export { BACKUP_APP_ID };
export const JSON_MIME_TYPE = "application/json;charset=utf-8";

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

function getBrowserStorage(): StorageLike | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function localDatePart(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("无法为无效日期生成文件名。");
  }

  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Loads and validates the complete user state stored by this application.
 * Corrupt or outdated unsupported data is ignored so the caller can fall back
 * to createDefaultState() without crashing the page.
 */
export function loadState(
  storage: StorageLike | null = getBrowserStorage(),
): UserState | null {
  if (!storage) {
    return null;
  }

  try {
    const serialized = storage.getItem(STORAGE_KEY);
    if (!serialized) {
      return null;
    }

    return validateBackup(JSON.parse(serialized) as unknown);
  } catch {
    return null;
  }
}

/**
 * Validates before writing so a malformed runtime object cannot replace a
 * previously valid local copy.
 */
export function saveState(
  state: UserState,
  storage: StorageLike | null = getBrowserStorage(),
): void {
  if (!storage) {
    throw new Error("当前环境不支持浏览器本地存储。");
  }

  const validatedState = validateBackup(state);
  storage.setItem(STORAGE_KEY, JSON.stringify(validatedState));
}

export function createBackupEnvelope(
  state: UserState,
  exportedAt = new Date(),
): BackupEnvelope {
  return createValidatedBackupEnvelope(state, exportedAt);
}

export function serializeBackup(
  state: UserState,
  exportedAt = new Date(),
): string {
  return `${JSON.stringify(createBackupEnvelope(state, exportedAt), null, 2)}\n`;
}

/**
 * Parses a complete JSON backup without mutating localStorage. The caller can
 * therefore show an overwrite confirmation before passing the returned state
 * to saveState().
 */
export function restoreBackup(serializedBackup: string): UserState {
  try {
    const withoutBom = serializedBackup.replace(/^\uFEFF/, "");
    return validateBackup(JSON.parse(withoutBom) as unknown);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("备份文件不是有效的 JSON。", { cause: error });
    }

    throw error;
  }
}

/**
 * Reads a user-selected text file as UTF-8. File extends Blob, while accepting
 * Blob here also keeps the helper straightforward to test.
 */
export async function readTextFile(file: Blob): Promise<string> {
  const text = await file.text();
  return text.replace(/^\uFEFF/, "");
}

export const readFileAsText = readTextFile;

/**
 * Starts a browser download for arbitrary UTF-8 text content.
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType = "text/plain;charset=utf-8",
): void {
  if (
    typeof document === "undefined" ||
    typeof URL === "undefined" ||
    typeof URL.createObjectURL !== "function"
  ) {
    throw new Error("当前环境不支持文件下载。");
  }

  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.hidden = true;
  document.body?.append(anchor);

  try {
    anchor.click();
  } finally {
    anchor.remove();
    globalThis.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }
}

export function downloadBackup(
  state: UserState,
  exportedAt = new Date(),
): string {
  const filename = `automation-learning-workbench-backup-${localDatePart(exportedAt)}.json`;
  downloadTextFile(
    serializeBackup(state, exportedAt),
    filename,
    JSON_MIME_TYPE,
  );
  return filename;
}
