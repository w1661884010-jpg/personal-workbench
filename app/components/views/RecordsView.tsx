import { useRef } from "react";
import type { MasteryLevel, Topic, UserState } from "../../lib/model";
import { Icon } from "../Icons";

export type RecordDraft = {
  masteryLevel: MasteryLevel;
  completion: "not-started" | "partial" | "completed";
  summary: string;
  evidenceKind:
    | "build-debug"
    | "explain"
    | "predict-verify"
    | "fix-error"
    | "trace-signal";
  evidenceDescription: string;
  errors: string;
  questions: string;
  reviewItems: string;
  relatedResources: string;
  nextStep: string;
};

const masteryOptions: Array<{ value: MasteryLevel; label: string }> = [
  { value: "untouched", label: "未接触" },
  { value: "recognize", label: "能识别" },
  { value: "explain", label: "能解释" },
  { value: "apply", label: "能应用" },
];

const evidenceOptions = [
  { value: "build-debug", label: "编译 / 下载 / 调试" },
  { value: "explain", label: "解释代码或寄存器" },
  { value: "predict-verify", label: "预测与运行验证" },
  { value: "fix-error", label: "定位并改正错误" },
  { value: "trace-signal", label: "指出完整信号路径" },
] as const;

type RecordsViewProps = {
  state: UserState;
  currentTopic: Topic;
  draft: RecordDraft;
  hasSavedRecord: boolean;
  onDraftChange: <K extends keyof RecordDraft>(
    key: K,
    value: RecordDraft[K],
  ) => void;
  onToggleTask: (taskId: string) => void;
  onSaveRecord: () => void;
  onExportMarkdown: () => void;
  onBackupJson: () => void;
  onImportFile: (file: File) => void;
  onDeleteRecord: () => void;
};

export function RecordsView({
  state,
  currentTopic,
  draft,
  hasSavedRecord,
  onDraftChange,
  onToggleTask,
  onSaveRecord,
  onExportMarkdown,
  onBackupJson,
  onImportFile,
  onDeleteRecord,
}: RecordsViewProps) {
  const importInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="view" aria-labelledby="records-title">
      <header className="view-header">
        <div>
          <h1 id="records-title" className="view-title compact">
            学习记录
          </h1>
          <p className="view-conclusion">
            {state.today.date} · {currentTopic.title}
          </p>
        </div>
        {hasSavedRecord ? (
          <button
            type="button"
            className="danger-action"
            onClick={onDeleteRecord}
          >
            <Icon name="trash" size={19} />
            删除当天记录
          </button>
        ) : null}
      </header>

      <div className="records-grid">
        <div>
          <div className="record-sheet">
            <section className="form-section" aria-labelledby="task-results-title">
              <h2 id="task-results-title">1. 任务结果</h2>
              <div className="record-task-list">
                {state.today.tasks.map((task) => (
                  <label className="record-task" key={task.id}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                    />
                    <span>{task.title}</span>
                    <span className="task-result" aria-live="polite">
                      {task.completed ? "已完成" : "待完成"}
                    </span>
                  </label>
                ))}
              </div>

              <div className="field" style={{ marginTop: 18 }}>
                <label htmlFor="record-summary">理解与结果总结</label>
                <textarea
                  id="record-summary"
                  value={draft.summary}
                  onChange={(event) =>
                    onDraftChange("summary", event.target.value)
                  }
                  placeholder="写下你观察到的现象、关键关系和仍不确定的地方。"
                  maxLength={800}
                />
              </div>

              <div className="field" style={{ marginTop: 18 }}>
                <span className="field-label">本次掌握程度</span>
                <div className="segmented">
                  {masteryOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="segment-button"
                      aria-pressed={draft.masteryLevel === option.value}
                      onClick={() =>
                        onDraftChange("masteryLevel", option.value)
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {draft.masteryLevel === "apply" ? (
                  <p className="inline-warning">
                    <Icon name="warning" size={18} />
                    能应用需要在下方提交至少一条完整证据。
                  </p>
                ) : null}
              </div>
            </section>

            <section className="form-section" aria-labelledby="evidence-title">
              <h2 id="evidence-title">2. 掌握证据</h2>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="evidence-kind">证据类型</label>
                  <select
                    id="evidence-kind"
                    value={draft.evidenceKind}
                    onChange={(event) =>
                      onDraftChange(
                        "evidenceKind",
                        event.target.value as RecordDraft["evidenceKind"],
                      )
                    }
                  >
                    {evidenceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="completion">完成情况</label>
                  <select
                    id="completion"
                    value={draft.completion}
                    onChange={(event) =>
                      onDraftChange(
                        "completion",
                        event.target.value as RecordDraft["completion"],
                      )
                    }
                  >
                    <option value="not-started">未开始</option>
                    <option value="partial">部分完成</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="evidence-description">
                  证据描述（步骤、现象、结果）
                </label>
                <textarea
                  id="evidence-description"
                  value={draft.evidenceDescription}
                  onChange={(event) =>
                    onDraftChange("evidenceDescription", event.target.value)
                  }
                  placeholder="例如：Clean Build 为 0 errors；下载后在 main() 命中断点，并能解释入口文件和链接命令文件的作用。"
                  maxLength={1000}
                />
              </div>
            </section>

            <section className="form-section" aria-labelledby="issues-title">
              <h2 id="issues-title">3. 错误、疑问与待复习</h2>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="errors">错误</label>
                  <textarea
                    id="errors"
                    value={draft.errors}
                    onChange={(event) =>
                      onDraftChange("errors", event.target.value)
                    }
                    placeholder="错误现象、原因、修改和复验结果"
                  />
                </div>
                <div className="field">
                  <label htmlFor="questions">疑问</label>
                  <textarea
                    id="questions"
                    value={draft.questions}
                    onChange={(event) =>
                      onDraftChange("questions", event.target.value)
                    }
                    placeholder="仍需确认的一个具体问题"
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="review-items">待复习项</label>
                <textarea
                  id="review-items"
                  value={draft.reviewItems}
                  onChange={(event) =>
                    onDraftChange("reviewItems", event.target.value)
                  }
                  placeholder="只记录当前任务暴露出的短知识缺口，不重开完整课程。"
                />
              </div>
            </section>

            <section className="form-section" aria-labelledby="resources-title">
              <h2 id="resources-title">4. 相关文件或命令</h2>
              <div className="field">
                <label htmlFor="related-resources" className="sr-only">
                  相关文件或命令
                </label>
                <textarea
                  id="related-resources"
                  value={draft.relatedResources}
                  onChange={(event) =>
                    onDraftChange("relatedResources", event.target.value)
                  }
                  placeholder="仓库相对路径、寄存器名称或实际执行过的命令"
                />
              </div>
            </section>

            <section className="form-section" aria-labelledby="next-action-title">
              <h2 id="next-action-title">5. 下次第一件事</h2>
              <div className="field">
                <label htmlFor="next-action" className="sr-only">
                  下次第一件事
                </label>
                <input
                  id="next-action"
                  value={draft.nextStep}
                  onChange={(event) =>
                    onDraftChange("nextStep", event.target.value)
                  }
                  placeholder="下次打开时，先做什么？"
                  maxLength={200}
                />
              </div>
            </section>
          </div>

          <div className="record-primary">
            <button
              type="button"
              className="primary-action"
              onClick={onSaveRecord}
            >
              <Icon name="save" size={21} />
              保存本次记录
            </button>
          </div>
        </div>

        <aside className="data-actions" aria-labelledby="data-actions-title">
          <h2 id="data-actions-title">数据管理</h2>
          <p>记录只保存在本浏览器。换设备前请先备份。</p>
          <div className="data-action-list">
            <button
              type="button"
              className="secondary-action"
              onClick={onExportMarkdown}
            >
              <Icon name="download" size={19} />
              导出 Markdown
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={onBackupJson}
            >
              <Icon name="database" size={19} />
              备份 JSON
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => importInputRef.current?.click()}
            >
              <Icon name="upload" size={19} />
              恢复备份
            </button>
            <input
              ref={importInputRef}
              id="restore-backup"
              className="sr-only"
              type="file"
              tabIndex={-1}
              aria-label="选择 JSON 备份文件"
              accept="application/json,.json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onImportFile(file);
                event.currentTarget.value = "";
              }}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
