import { roadmapTopics } from "../data/roadmap";
import type { UserState } from "./model";
import { downloadTextFile } from "./storage";

export const MARKDOWN_MIME_TYPE = "text/markdown;charset=utf-8";

export interface DailyMarkdownOptions {
  date?: Date | string;
  topicTitle?: string;
}

const masteryLabels = {
  untouched: "未接触",
  recognize: "能识别",
  explain: "能解释",
  apply: "能应用",
} as const;

const evidenceKindLabels = {
  "build-debug": "编译、下载或调试",
  explain: "解释代码或寄存器",
  "predict-verify": "预测并验证",
  "fix-error": "定位并改正错误",
  "trace-signal": "指出完整信号路径",
} as const;

function nonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

function inlineText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function splitEntries(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function bulletList(
  values: readonly string[],
  emptyText = "暂无记录",
): string {
  const entries = values.flatMap(splitEntries);
  if (entries.length === 0) {
    return `- ${emptyText}`;
  }

  return entries.map((entry) => `- ${entry}`).join("\n");
}

function dateFromTimestamp(value: string): string | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : formatLocalDate(date);
}

function resolveOptions(
  options: DailyMarkdownOptions | Date,
): DailyMarkdownOptions {
  return options instanceof Date ? { date: options } : options;
}

function resolveDate(
  state: UserState,
  options: DailyMarkdownOptions,
): string {
  if (options.date instanceof Date) {
    return formatLocalDate(options.date);
  }

  if (typeof options.date === "string") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(options.date)) {
      throw new RangeError("Markdown 日期必须使用 YYYY-MM-DD 格式。");
    }
    return options.date;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(state.today.date)
    ? state.today.date
    : formatLocalDate();
}

export function formatLocalDate(date = new Date()): string {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("无法格式化无效日期。");
  }

  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Quotes a scalar using YAML's double-quoted form. Newlines and control
 * characters stay inside one scalar instead of accidentally changing YAML
 * structure.
 */
export function escapeYamlString(value: string): string {
  return JSON.stringify(value);
}

export function getDailyMarkdownFilename(
  date: Date | string = new Date(),
): string {
  if (date instanceof Date) {
    return `${formatLocalDate(date)}.md`;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new RangeError("Markdown 日期必须使用 YYYY-MM-DD 格式。");
  }
  return `${date}.md`;
}

/**
 * Produces a plain, plugin-independent Obsidian note with stable sections.
 */
export function buildDailyMarkdown(
  state: UserState,
  input: DailyMarkdownOptions | Date = {},
): string {
  const options = resolveOptions(input);
  const date = resolveDate(state, options);
  const topicTitle =
    options.topicTitle ??
    roadmapTopics.find((topic) => topic.id === state.currentTopicId)?.title ??
    state.currentTopicId;
  const mastery = state.mastery[state.currentTopicId];
  const dailyRecords = state.records.filter((record) => record.date === date);
  const recordEvidenceIds = new Set(
    dailyRecords.flatMap((record) => record.evidenceIds),
  );
  const fallbackEvidenceIds = new Set(mastery?.evidenceIds ?? []);
  let evidence = state.evidence.filter(
    (entry) =>
      recordEvidenceIds.has(entry.id) ||
      dateFromTimestamp(entry.createdAt) === date,
  );

  if (evidence.length === 0) {
    evidence = state.evidence.filter((entry) =>
      fallbackEvidenceIds.has(entry.id),
    );
  }

  const taskLines =
    state.today.date === date
      ? state.today.tasks.map(
          (task) => `- [${task.completed ? "x" : " "}] ${inlineText(task.title)}`,
        )
      : [];
  const summaries = dailyRecords
    .map((record) => inlineText(record.summary))
    .filter(nonEmpty)
    .map((summary) => `- 学习总结：${summary}`);
  const taskResults =
    taskLines.length + summaries.length > 0
      ? [...taskLines, ...summaries].join("\n")
      : "- 暂无记录";
  const evidenceLines =
    evidence.length > 0
      ? evidence
          .map(
            (entry) =>
              `- **${evidenceKindLabels[entry.kind]}**：${inlineText(entry.description)}`,
          )
          .join("\n")
      : "- 暂无记录";

  const issueLines = [
    ...(state.today.date === date && nonEmpty(state.today.carryOver)
      ? [`遗留问题：${inlineText(state.today.carryOver)}`]
      : []),
    ...dailyRecords.flatMap((record) =>
      splitEntries(record.errors).map((entry) => `错误：${entry}`),
    ),
    ...dailyRecords.flatMap((record) =>
      splitEntries(record.questions).map((entry) => `疑问：${entry}`),
    ),
    ...dailyRecords.flatMap((record) =>
      splitEntries(record.reviewItems).map((entry) => `待复习：${entry}`),
    ),
  ];
  const relatedResources = dailyRecords.flatMap((record) =>
    splitEntries(record.relatedResources),
  );
  const recordNextStep = [...dailyRecords]
    .reverse()
    .find((record) => nonEmpty(record.nextStep))?.nextStep;
  const nextStep =
    state.today.date === date && nonEmpty(state.today.nextStep)
      ? state.today.nextStep
      : recordNextStep;
  const mainQuestion =
    state.today.date === date && nonEmpty(state.today.mainQuestion)
      ? state.today.mainQuestion.trim()
      : "暂无记录";

  return [
    "---",
    `date: ${date}`,
    `topic: ${escapeYamlString(topicTitle)}`,
    `topic_id: ${escapeYamlString(state.currentTopicId)}`,
    "---",
    "",
    `# ${date} 学习记录`,
    "",
    "## 当前主题",
    "",
    `- 主题：${topicTitle}`,
    `- 掌握等级：${mastery ? masteryLabels[mastery.level] : "未接触"}`,
    "",
    "## 今日主问题",
    "",
    mainQuestion,
    "",
    "## 任务结果",
    "",
    taskResults,
    "",
    "## 掌握证据",
    "",
    evidenceLines,
    "",
    "## 错误或疑问",
    "",
    bulletList(issueLines),
    "",
    "## 相关文件或命令",
    "",
    bulletList(relatedResources),
    "",
    "## 下次第一件事",
    "",
    nextStep && nonEmpty(nextStep) ? nextStep.trim() : "暂无记录",
    "",
  ].join("\n");
}

export function downloadDailyMarkdown(
  state: UserState,
  input: DailyMarkdownOptions | Date = {},
): string {
  const options = resolveOptions(input);
  const date = resolveDate(state, options);
  const filename = getDailyMarkdownFilename(date);
  downloadTextFile(
    buildDailyMarkdown(state, options),
    filename,
    MARKDOWN_MIME_TYPE,
  );
  return filename;
}
