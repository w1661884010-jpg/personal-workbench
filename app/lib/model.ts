export const SCHEMA_VERSION = 1 as const;
export const BACKUP_APP_ID = "automation-learning-workbench" as const;

export const TOPIC_IDS = [
  "ccs-project-structure",
  "f28335-clock-gpio",
  "polling-interrupt-timer",
  "epwm",
  "adc-sampling",
  "integrated-example",
] as const;

export const SIGNAL_PATH_IDS = [
  "power-path",
  "digital-input-path",
  "digital-output-path",
  "timed-output-path",
  "analog-sampling-path",
] as const;

export const DEFERRED_ITEM_IDS = [
  "stm32",
  "plc",
  "can",
  "dma",
  "ecap-eqep",
  "motor-control",
  "svpwm",
  "pmsm",
  "bldc",
  "pid",
  "operating-system",
  "advanced-dsp",
  "fft-digital-filter",
] as const;

export const MASTERY_LEVELS = [
  "untouched",
  "recognize",
  "explain",
  "apply",
] as const;

export const EVIDENCE_KINDS = [
  "build-debug",
  "explain",
  "predict-verify",
  "fix-error",
  "trace-signal",
] as const;

export const COMPLETION_STATUSES = [
  "not-started",
  "partial",
  "completed",
] as const;

export type TopicId = (typeof TOPIC_IDS)[number];
export type SignalPathId = (typeof SIGNAL_PATH_IDS)[number];
export type DeferredItemId = (typeof DEFERRED_ITEM_IDS)[number];
export type MasteryLevel = (typeof MASTERY_LEVELS)[number];
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];
export type CompletionStatus = (typeof COMPLETION_STATUSES)[number];

export interface RoadmapTask {
  id: string;
  title: string;
  targetSignalPathId?: SignalPathId;
}

export interface CommonError {
  issue: string;
  check: string;
}

export interface RoadmapTopic {
  id: TopicId;
  order: number;
  title: string;
  question: string;
  prerequisites: readonly string[];
  explanation: string;
  relatedLocations: readonly string[];
  tasks: readonly RoadmapTask[];
  commonErrors: readonly CommonError[];
  completionCriteria: readonly string[];
  nextTopicId: TopicId | null;
}

export interface SignalPathNode {
  id: string;
  label: string;
  detail: string;
}

export interface SignalPath {
  id: SignalPathId;
  title: string;
  summary: string;
  nodes: readonly SignalPathNode[];
  knowledgePoints: readonly string[];
  beforeYouStart: readonly string[];
  keyNodes: readonly string[];
  relatedLocations: readonly string[];
  tasks: readonly string[];
  commonErrors: readonly CommonError[];
  conclusion: string;
  relatedTopicIds: readonly TopicId[];
}

export interface DeferredItem {
  id: DeferredItemId;
  title: string;
  reason: string;
}

export interface DeferredGroup {
  id: string;
  title: string;
  items: readonly DeferredItem[];
}

export type TodayTaskTarget =
  | {
      kind: "topic";
      id: TopicId;
    }
  | {
      kind: "signalPath";
      id: SignalPathId;
    };

export interface TodayTask {
  id: string;
  title: string;
  completed: boolean;
  target: TodayTaskTarget;
}

export interface TodayPlan {
  date: string;
  mainQuestion: string;
  tasks: TodayTask[];
  carryOver: string;
  nextStep: string;
}

export interface MasteryProgress {
  level: MasteryLevel;
  evidenceIds: string[];
}

/** Compatibility names used by view components. */
export type Topic = RoadmapTopic;
export type MasteryRecord = MasteryProgress;

export interface EvidenceRecord {
  id: string;
  topicId: TopicId;
  kind: EvidenceKind;
  description: string;
  createdAt: string;
}

export interface LearningRecord {
  id: string;
  date: string;
  topicId: TopicId;
  masteryLevel: MasteryLevel;
  completion: CompletionStatus;
  summary: string;
  evidenceIds: string[];
  errors: string;
  questions: string;
  reviewItems: string;
  relatedResources: string;
  nextStep: string;
  updatedAt: string;
}

export interface UserState {
  schemaVersion: typeof SCHEMA_VERSION;
  currentTopicId: TopicId;
  today: TodayPlan;
  mastery: Record<TopicId, MasteryProgress>;
  evidence: EvidenceRecord[];
  records: LearningRecord[];
  deferredReasons: Partial<Record<DeferredItemId, string>>;
  updatedAt: string;
}

export interface BackupEnvelope {
  app: typeof BACKUP_APP_ID;
  schemaVersion: typeof SCHEMA_VERSION;
  exportedAt: string;
  state: UserState;
}

export class BackupValidationError extends Error {
  readonly issues: string[];

  constructor(issues: readonly string[]) {
    super(`备份校验失败：${issues.join("；")}`);
    this.name = "BackupValidationError";
    this.issues = [...issues];
  }
}

const topicIdSet = new Set<string>(TOPIC_IDS);
const signalPathIdSet = new Set<string>(SIGNAL_PATH_IDS);
const deferredItemIdSet = new Set<string>(DEFERRED_ITEM_IDS);
const masteryLevelSet = new Set<string>(MASTERY_LEVELS);
const evidenceKindSet = new Set<string>(EVIDENCE_KINDS);
const completionStatusSet = new Set<string>(COMPLETION_STATUSES);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDateTime(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

function isLocalDate(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function hasUniqueStrings(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function isCompleteEvidenceValue(value: unknown): value is EvidenceRecord {
  return (
    isObject(value) &&
    isNonEmptyString(value.id) &&
    typeof value.topicId === "string" &&
    topicIdSet.has(value.topicId) &&
    typeof value.kind === "string" &&
    evidenceKindSet.has(value.kind) &&
    isNonEmptyString(value.description) &&
    isIsoDateTime(value.createdAt)
  );
}

function validateStringField(
  object: Record<string, unknown>,
  key: string,
  path: string,
  issues: string[],
  allowEmpty = true,
): void {
  const value = object[key];
  if (typeof value !== "string" || (!allowEmpty && value.trim().length === 0)) {
    issues.push(`${path}.${key}: 必须是${allowEmpty ? "" : "非空"}字符串`);
  }
}

function validateToday(
  value: unknown,
  issues: string[],
): void {
  if (!isObject(value)) {
    issues.push("today: 必须是对象");
    return;
  }

  if (!isLocalDate(value.date)) {
    issues.push("today.date: 必须是有效的 YYYY-MM-DD 本地日期");
  }
  validateStringField(value, "mainQuestion", "today", issues, false);
  validateStringField(value, "carryOver", "today", issues);
  validateStringField(value, "nextStep", "today", issues, false);

  if (!Array.isArray(value.tasks)) {
    issues.push("today.tasks: 必须是数组");
    return;
  }
  if (value.tasks.length === 0 || value.tasks.length > 3) {
    issues.push("today.tasks: 必须包含 1 至 3 项任务，最多只能有 3 项任务");
  }

  const taskIds: string[] = [];
  value.tasks.forEach((task, index) => {
    const path = `today.tasks[${index}]`;
    if (!isObject(task)) {
      issues.push(`${path}: 必须是对象`);
      return;
    }
    if (!isNonEmptyString(task.id)) {
      issues.push(`${path}.id: 必须是非空稳定 ID`);
    } else {
      taskIds.push(task.id);
    }
    validateStringField(task, "title", path, issues, false);
    if (typeof task.completed !== "boolean") {
      issues.push(`${path}.completed: 必须是布尔值`);
    }
    if (!isObject(task.target)) {
      issues.push(`${path}.target: 必须是对象`);
      return;
    }
    const { kind, id } = task.target;
    if (kind === "topic") {
      if (typeof id !== "string" || !topicIdSet.has(id)) {
        issues.push(`${path}.target.id: 引用了不存在的主题`);
      }
    } else if (kind === "signalPath") {
      if (typeof id !== "string" || !signalPathIdSet.has(id)) {
        issues.push(`${path}.target.id: 引用了不存在的信号路径`);
      }
    } else {
      issues.push(`${path}.target.kind: 必须是 topic 或 signalPath`);
    }
  });
  if (!hasUniqueStrings(taskIds)) {
    issues.push("today.tasks: 任务 ID 必须唯一");
  }
}

function validateEvidence(
  value: unknown,
  issues: string[],
): Map<string, EvidenceRecord> {
  const evidenceById = new Map<string, EvidenceRecord>();
  if (!Array.isArray(value)) {
    issues.push("evidence: 必须是数组");
    return evidenceById;
  }

  value.forEach((evidence, index) => {
    const path = `evidence[${index}]`;
    if (!isObject(evidence)) {
      issues.push(`${path}: 必须是对象`);
      return;
    }

    if (!isNonEmptyString(evidence.id)) {
      issues.push(`${path}.id: 必须是非空稳定 ID`);
    } else if (evidenceById.has(evidence.id)) {
      issues.push(`${path}.id: 证据 ID 重复`);
    }
    if (typeof evidence.topicId !== "string" || !topicIdSet.has(evidence.topicId)) {
      issues.push(`${path}.topicId: 引用了不存在的主题`);
    }
    if (typeof evidence.kind !== "string" || !evidenceKindSet.has(evidence.kind)) {
      issues.push(`${path}.kind: 未知的证据类型`);
    }
    if (!isNonEmptyString(evidence.description)) {
      issues.push(`${path}.description: 完整证据必须描述步骤、现象或结果`);
    }
    if (!isIsoDateTime(evidence.createdAt)) {
      issues.push(`${path}.createdAt: 必须是有效的 ISO 日期时间`);
    }

    if (isCompleteEvidenceValue(evidence) && !evidenceById.has(evidence.id)) {
      evidenceById.set(evidence.id, evidence);
    }
  });

  return evidenceById;
}

function validateMastery(
  value: unknown,
  evidenceById: ReadonlyMap<string, EvidenceRecord>,
  issues: string[],
): void {
  if (!isObject(value)) {
    issues.push("mastery: 必须是对象");
    return;
  }

  for (const key of Object.keys(value)) {
    if (!topicIdSet.has(key)) {
      issues.push(`mastery.${key}: 引用了不存在的主题`);
    }
  }

  for (const topicId of TOPIC_IDS) {
    const progress = value[topicId];
    const path = `mastery.${topicId}`;
    if (!isObject(progress)) {
      issues.push(`${path}: 缺少主题掌握状态`);
      continue;
    }

    const level =
      typeof progress.level === "string" && masteryLevelSet.has(progress.level)
        ? progress.level
        : null;
    if (!level) {
      issues.push(`${path}.level: 未知的掌握等级`);
    }

    if (!Array.isArray(progress.evidenceIds)) {
      issues.push(`${path}.evidenceIds: 必须是数组`);
      continue;
    }

    const evidenceIds = progress.evidenceIds.filter(
      (id): id is string => typeof id === "string",
    );
    if (evidenceIds.length !== progress.evidenceIds.length) {
      issues.push(`${path}.evidenceIds: 只能包含字符串 ID`);
    }
    if (!hasUniqueStrings(evidenceIds)) {
      issues.push(`${path}.evidenceIds: 证据 ID 不得重复`);
    }

    let matchingCompleteEvidenceCount = 0;
    for (const evidenceId of evidenceIds) {
      const evidence = evidenceById.get(evidenceId);
      if (!evidence) {
        issues.push(`${path}.evidenceIds: 引用了不存在或不完整的证据 ${evidenceId}`);
      } else if (evidence.topicId !== topicId) {
        issues.push(`${path}.evidenceIds: 证据 ${evidenceId} 不属于当前主题`);
      } else {
        matchingCompleteEvidenceCount += 1;
      }
    }

    if (level === "apply" && matchingCompleteEvidenceCount === 0) {
      issues.push(`${path}: “能应用”必须至少关联一条完整证据`);
    }
  }
}

function validateRecords(
  value: unknown,
  evidenceById: ReadonlyMap<string, EvidenceRecord>,
  issues: string[],
): void {
  if (!Array.isArray(value)) {
    issues.push("records: 必须是数组");
    return;
  }

  const recordIds: string[] = [];
  value.forEach((record, index) => {
    const path = `records[${index}]`;
    if (!isObject(record)) {
      issues.push(`${path}: 必须是对象`);
      return;
    }

    if (!isNonEmptyString(record.id)) {
      issues.push(`${path}.id: 必须是非空稳定 ID`);
    } else {
      recordIds.push(record.id);
    }
    if (!isLocalDate(record.date)) {
      issues.push(`${path}.date: 必须是有效的 YYYY-MM-DD 本地日期`);
    }
    if (typeof record.topicId !== "string" || !topicIdSet.has(record.topicId)) {
      issues.push(`${path}.topicId: 引用了不存在的主题`);
    }
    if (
      typeof record.masteryLevel !== "string" ||
      !masteryLevelSet.has(record.masteryLevel)
    ) {
      issues.push(`${path}.masteryLevel: 未知的掌握等级`);
    }
    if (
      typeof record.completion !== "string" ||
      !completionStatusSet.has(record.completion)
    ) {
      issues.push(`${path}.completion: 未知的完成状态`);
    }

    for (const key of [
      "summary",
      "errors",
      "questions",
      "reviewItems",
      "relatedResources",
      "nextStep",
    ]) {
      validateStringField(record, key, path, issues);
    }
    if (!isIsoDateTime(record.updatedAt)) {
      issues.push(`${path}.updatedAt: 必须是有效的 ISO 日期时间`);
    }

    if (!Array.isArray(record.evidenceIds)) {
      issues.push(`${path}.evidenceIds: 必须是数组`);
      return;
    }
    const ids = record.evidenceIds.filter(
      (id): id is string => typeof id === "string",
    );
    if (ids.length !== record.evidenceIds.length) {
      issues.push(`${path}.evidenceIds: 只能包含字符串 ID`);
    }
    if (!hasUniqueStrings(ids)) {
      issues.push(`${path}.evidenceIds: 证据 ID 不得重复`);
    }

    let matchingEvidenceCount = 0;
    for (const evidenceId of ids) {
      const evidence = evidenceById.get(evidenceId);
      if (!evidence) {
        issues.push(`${path}.evidenceIds: 引用了不存在或不完整的证据 ${evidenceId}`);
      } else if (evidence.topicId !== record.topicId) {
        issues.push(`${path}.evidenceIds: 证据 ${evidenceId} 与记录主题不一致`);
      } else {
        matchingEvidenceCount += 1;
      }
    }
    if (record.masteryLevel === "apply" && matchingEvidenceCount === 0) {
      issues.push(`${path}: “能应用”必须至少关联一条完整证据`);
    }
  });

  if (!hasUniqueStrings(recordIds)) {
    issues.push("records: 记录 ID 必须唯一");
  }
}

function validateDeferredReasons(value: unknown, issues: string[]): void {
  if (!isObject(value)) {
    issues.push("deferredReasons: 必须是对象");
    return;
  }

  for (const [itemId, reason] of Object.entries(value)) {
    if (!deferredItemIdSet.has(itemId)) {
      issues.push(`deferredReasons.${itemId}: 引用了不存在的延期主题`);
    }
    if (typeof reason !== "string") {
      issues.push(`deferredReasons.${itemId}: 延期原因必须是字符串`);
    }
  }
}

function extractStateCandidate(input: unknown, issues: string[]): unknown {
  if (!isObject(input)) {
    issues.push("backup: 必须是对象");
    return input;
  }

  if (!Object.prototype.hasOwnProperty.call(input, "state")) {
    return input;
  }

  if (input.app !== BACKUP_APP_ID) {
    issues.push(`app: 必须是 ${BACKUP_APP_ID}`);
  }
  if (input.schemaVersion !== SCHEMA_VERSION) {
    issues.push(`schemaVersion: 不支持版本 ${String(input.schemaVersion)}`);
  }
  if (!isIsoDateTime(input.exportedAt)) {
    issues.push("exportedAt: 必须是有效的 ISO 日期时间");
  }
  return input.state;
}

/**
 * Version migration entry point. V1 has no older supported representation yet;
 * keeping this function separate makes a future migration explicit and testable.
 */
export function migrateBackupState(input: unknown): unknown {
  if (!isObject(input)) {
    throw new BackupValidationError(["state: 必须是对象"]);
  }
  if (input.schemaVersion !== SCHEMA_VERSION) {
    throw new BackupValidationError([
      `state.schemaVersion: 不支持版本 ${String(input.schemaVersion)}`,
    ]);
  }
  return cloneJson(input);
}

export function createDefaultState(now = new Date()): UserState {
  if (Number.isNaN(now.getTime())) {
    throw new RangeError("createDefaultState 需要有效日期");
  }

  const currentTopicId = TOPIC_IDS[0];
  const mastery = Object.fromEntries(
    TOPIC_IDS.map((topicId) => [
      topicId,
      {
        level: "untouched" as const,
        evidenceIds: [],
      },
    ]),
  ) as unknown as Record<TopicId, MasteryProgress>;

  return {
    schemaVersion: SCHEMA_VERSION,
    currentTopicId,
    today: {
      date: localDateString(now),
      mainQuestion: "怎样从现有例程中识别一个最小 CCS 工程的关键结构？",
      tasks: [
        {
          id: "today-ccs-build",
          title: "打开最小工程并完成一次编译",
          completed: false,
          target: {
            kind: "topic",
            id: currentTopicId,
          },
        },
        {
          id: "today-ccs-entry-linker",
          title: "找到入口文件与链接命令文件",
          completed: false,
          target: {
            kind: "topic",
            id: currentTopicId,
          },
        },
        {
          id: "today-ccs-main-breakpoint",
          title: "在调试器中停在 main()",
          completed: false,
          target: {
            kind: "topic",
            id: currentTopicId,
          },
        },
      ],
      carryOver: "CCS 12.3 与旧教程界面不同",
      nextStep: "确认工程使用的器件与链接配置",
    },
    mastery,
    evidence: [],
    records: [],
    deferredReasons: {},
    updatedAt: now.toISOString(),
  };
}

/**
 * Starts a fresh local-day plan without discarding durable learning history.
 *
 * The current topic and its plan remain the continuation point; only the
 * day-specific date and completion flags are reset. Returning the original
 * object for the same date keeps hydration and autosave idempotent.
 */
export function rolloverDailyState(
  state: UserState,
  now = new Date(),
): UserState {
  if (Number.isNaN(now.getTime())) {
    throw new RangeError("rolloverDailyState 需要有效日期");
  }

  const date = localDateString(now);
  if (state.today.date === date) {
    return state;
  }

  const currentTopicId = topicIdSet.has(state.currentTopicId)
    ? state.currentTopicId
    : TOPIC_IDS[0];

  return {
    ...state,
    currentTopicId,
    today: {
      ...state.today,
      date,
      tasks: state.today.tasks.map((task) => ({
        ...task,
        completed: false,
      })),
    },
    updatedAt: now.toISOString(),
  };
}

export function setMastery(
  state: UserState,
  topicId: TopicId,
  level: MasteryLevel,
  evidenceIds: readonly string[] = state.mastery[topicId]?.evidenceIds ?? [],
): UserState {
  if (!topicIdSet.has(topicId)) {
    throw new RangeError(`不存在的主题：${String(topicId)}`);
  }
  if (!masteryLevelSet.has(level)) {
    throw new RangeError(`未知的掌握等级：${String(level)}`);
  }

  const selectedEvidenceIds = [...new Set(evidenceIds)];
  for (const evidenceId of selectedEvidenceIds) {
    const evidence = state.evidence.find((item) => item.id === evidenceId);
    if (!evidence) {
      throw new Error(`证据 ${evidenceId} 不存在`);
    }
    if (evidence.topicId !== topicId) {
      throw new Error(`证据 ${evidenceId} 不属于当前主题`);
    }
    if (!isCompleteEvidenceValue(evidence)) {
      throw new Error(`证据 ${evidenceId} 不完整，需描述步骤、现象或结果`);
    }
  }

  if (level === "apply" && selectedEvidenceIds.length === 0) {
    throw new Error("升级为“能应用”必须至少关联一条完整证据");
  }

  return {
    ...state,
    mastery: {
      ...state.mastery,
      [topicId]: {
        level,
        evidenceIds: selectedEvidenceIds,
      },
    },
    updatedAt: new Date().toISOString(),
  };
}

export function validateBackup(input: unknown): UserState {
  const issues: string[] = [];
  const candidate = extractStateCandidate(input, issues);

  if (!isObject(candidate)) {
    issues.push("state: 必须是对象");
    throw new BackupValidationError(issues);
  }
  if (candidate.schemaVersion !== SCHEMA_VERSION) {
    issues.push(
      `state.schemaVersion: 不支持版本 ${String(candidate.schemaVersion)}`,
    );
  }
  if (
    typeof candidate.currentTopicId !== "string" ||
    !topicIdSet.has(candidate.currentTopicId)
  ) {
    issues.push("currentTopicId: 引用了不存在的主题");
  }

  validateToday(candidate.today, issues);
  const evidenceById = validateEvidence(candidate.evidence, issues);
  validateMastery(candidate.mastery, evidenceById, issues);
  validateRecords(candidate.records, evidenceById, issues);
  validateDeferredReasons(candidate.deferredReasons, issues);
  if (!isIsoDateTime(candidate.updatedAt)) {
    issues.push("updatedAt: 必须是有效的 ISO 日期时间");
  }

  if (issues.length > 0) {
    throw new BackupValidationError(issues);
  }

  return cloneJson(candidate) as unknown as UserState;
}

export function createBackupEnvelope(
  state: UserState,
  now = new Date(),
): BackupEnvelope {
  const validatedState = validateBackup(state);
  if (Number.isNaN(now.getTime())) {
    throw new RangeError("createBackupEnvelope 需要有效日期");
  }

  return {
    app: BACKUP_APP_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    state: validatedState,
  };
}
