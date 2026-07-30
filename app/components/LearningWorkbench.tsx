"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { deferredGroups } from "../data/deferred";
import { signalPaths } from "../data/board";
import { roadmapTopics, roadmapTopicById } from "../data/roadmap";
import { downloadDailyMarkdown } from "../lib/markdown";
import {
  createDefaultState,
  rolloverDailyState,
  setMastery,
  type DeferredItemId,
  type EvidenceKind,
  type EvidenceRecord,
  type LearningRecord,
  type MasteryLevel,
  type SignalPath,
  type SignalPathId,
  type TopicId,
  type UserState,
} from "../lib/model";
import {
  downloadBackup,
  loadState,
  readTextFile,
  restoreBackup,
  saveState,
  STORAGE_KEY,
} from "../lib/storage";
import { DeferredView } from "./views/DeferredView";
import { KnowledgeView } from "./views/KnowledgeView";
import {
  RecordsView,
  type RecordDraft,
} from "./views/RecordsView";
import { RoadmapView } from "./views/RoadmapView";
import { TodayView } from "./views/TodayView";
import { Icon, type IconName } from "./Icons";

type ViewId = "today" | "roadmap" | "knowledge" | "records" | "deferred";
type SaveStatus = "idle" | "saving" | "saved" | "error";
type ToastTone = "success" | "warning" | "error";

type ToastState = {
  id: number;
  message: string;
  tone: ToastTone;
} | null;

const navItems: Array<{ id: ViewId; label: string; icon: IconName }> = [
  { id: "today", label: "今日学习", icon: "calendar" },
  { id: "roadmap", label: "学习路线", icon: "route" },
  { id: "knowledge", label: "知识与开发板", icon: "chip" },
  { id: "records", label: "学习记录", icon: "notebook" },
  { id: "deferred", label: "以后再学", icon: "clock" },
];

function createRecordDraft(
  state: UserState,
  topicId: TopicId,
): RecordDraft {
  const savedRecord = state.records.find(
    (record) =>
      record.date === state.today.date && record.topicId === topicId,
  );
  const evidence = savedRecord?.evidenceIds
    .map((id) => state.evidence.find((item) => item.id === id))
    .find(Boolean);

  return {
    masteryLevel:
      savedRecord?.masteryLevel ?? state.mastery[topicId].level ?? "untouched",
    completion: savedRecord?.completion ?? "not-started",
    summary: savedRecord?.summary ?? "",
    evidenceKind: evidence?.kind ?? "build-debug",
    evidenceDescription: evidence?.description ?? "",
    errors: savedRecord?.errors ?? "",
    questions: savedRecord?.questions ?? "",
    reviewItems: savedRecord?.reviewItems ?? "",
    relatedResources: savedRecord?.relatedResources ?? "",
    nextStep: savedRecord?.nextStep ?? state.today.nextStep,
  };
}

function freshId(prefix: string) {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `${prefix}-${uuid ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
}

function saveStatusLabel(status: SaveStatus) {
  if (status === "saving") return "正在保存";
  if (status === "saved") return "已保存到本机";
  if (status === "error") return "保存失败";
  return "本机数据";
}

export function LearningWorkbench() {
  const [state, setState] = useState<UserState>(() => createDefaultState());
  const [activeView, setActiveView] = useState<ViewId>("today");
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>(
    state.currentTopicId,
  );
  const [selectedPathId, setSelectedPathId] =
    useState<SignalPathId>("digital-output-path");
  const [selectedDeferredId, setSelectedDeferredId] =
    useState<DeferredItemId | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [pendingImport, setPendingImport] = useState<UserState | null>(null);
  const [draft, setDraft] = useState<RecordDraft>(() =>
    createRecordDraft(state, state.currentTopicId),
  );
  const importDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const toastCounter = useRef(0);

  const currentTopic =
    roadmapTopics.find((topic) => topic.id === state.currentTopicId) ??
    roadmapTopics[0];
  const currentTopicIndex = roadmapTopics.findIndex(
    (topic) => topic.id === currentTopic.id,
  );
  const hasSavedRecord = state.records.some(
    (record) =>
      record.date === state.today.date &&
      record.topicId === state.currentTopicId,
  );

  const showToast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      toastCounter.current += 1;
      setToast({ id: toastCounter.current, message, tone });
    },
    [],
  );

  const navigate = useCallback((view: ViewId) => {
    setActiveView(view);
    globalThis.requestAnimationFrame?.(() => {
      globalThis.scrollTo?.({ top: 0, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    const stored = loadState();
    const readyState = stored ? rolloverDailyState(stored) : null;
    const timer = globalThis.setTimeout(() => {
      if (readyState) {
        setState(readyState);
        setSelectedTopicId(readyState.currentTopicId);
        setDraft(createRecordDraft(readyState, readyState.currentTopicId));
        setSaveStatus("saved");
      }
      setHydrated(true);
    }, 0);
    return () => globalThis.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = globalThis.setTimeout(() => {
      setDraft(createRecordDraft(state, state.currentTopicId));
    }, 0);
    return () => globalThis.clearTimeout(timer);
    // Only reset the form when the identity of the daily record changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, state.currentTopicId, state.today.date]);

  useEffect(() => {
    if (!hydrated) return;

    const statusTimer = globalThis.setTimeout(
      () => setSaveStatus("saving"),
      0,
    );
    const timer = globalThis.setTimeout(() => {
      try {
        saveState(state);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
        showToast(
          "本地保存失败。请先下载 JSON 备份，并检查浏览器存储权限。",
          "error",
        );
      }
    }, 400);

    return () => {
      globalThis.clearTimeout(statusTimer);
      globalThis.clearTimeout(timer);
    };
  }, [hydrated, showToast, state]);

  useEffect(() => {
    if (!toast) return;
    const timer = globalThis.setTimeout(() => setToast(null), 4200);
    return () => globalThis.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const next = rolloverDailyState(restoreBackup(event.newValue));
        setState(next);
        setSelectedTopicId(next.currentTopicId);
        showToast("另一个标签页更新了学习数据，当前页面已同步。", "warning");
      } catch {
        // Ignore invalid external writes and preserve the current valid state.
      }
    }

    globalThis.addEventListener("storage", handleStorage);
    return () => globalThis.removeEventListener("storage", handleStorage);
  }, [showToast]);

  function updateState(updater: (previous: UserState) => UserState) {
    setState((previous) => ({
      ...updater(previous),
      updatedAt: new Date().toISOString(),
    }));
  }

  function handleToggleTask(taskId: string) {
    updateState((previous) => ({
      ...previous,
      today: {
        ...previous.today,
        tasks: previous.today.tasks.map((task) =>
          task.id === taskId
            ? { ...task, completed: !task.completed }
            : task,
        ),
      },
    }));
  }

  function handleOpenTask(taskId: string) {
    const task = state.today.tasks.find((item) => item.id === taskId);
    if (!task) return;
    if (task.target.kind === "topic") {
      setSelectedTopicId(task.target.id);
      navigate("roadmap");
    } else {
      setSelectedPathId(task.target.id);
      navigate("knowledge");
    }
  }

  function handleContinueTopic(topicId: TopicId = state.currentTopicId) {
    const topic = roadmapTopicById[topicId];
    const nextStep = topic.tasks[0]?.title ?? "打开主题并确认当前问题";
    updateState((previous) => ({
      ...previous,
      currentTopicId: topicId,
      today: {
        ...previous.today,
        mainQuestion: topic.question,
        tasks: topic.tasks.slice(0, 3).map((task) => ({
          id: `today-${topic.id}-${task.id}`,
          title: task.title,
          completed: false,
          target: task.targetSignalPathId
            ? { kind: "signalPath" as const, id: task.targetSignalPathId }
            : { kind: "topic" as const, id: topic.id },
        })),
        nextStep,
      },
    }));
    setSelectedTopicId(topicId);
    navigate("today");
    showToast(`已把“${topic.title}”设为当前主题。`);
  }

  function handleSetMastery(topicId: string, level: MasteryLevel) {
    const typedTopicId = topicId as TopicId;
    try {
      const next = setMastery(state, typedTopicId, level);
      setState(next);
      showToast(`掌握程度已更新为“${level === "apply" ? "能应用" : level === "explain" ? "能解释" : level === "recognize" ? "能识别" : "未接触"}”。`);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "更新掌握程度失败，请先补充证据。",
        "warning",
      );
      navigate("records");
    }
  }

  function handleStartSignalPath(path: SignalPath) {
    const topicId = path.relatedTopicIds[0] ?? state.currentTopicId;
    const topic = roadmapTopicById[topicId];
    updateState((previous) => ({
      ...previous,
      currentTopicId: topicId,
      today: {
        ...previous.today,
        mainQuestion: topic.question,
        tasks: path.tasks.slice(0, 3).map((task, index) => ({
          id: `today-${path.id}-${index + 1}`,
          title: task,
          completed: false,
          target: { kind: "signalPath" as const, id: path.id },
        })),
        nextStep: path.beforeYouStart[0] ?? previous.today.nextStep,
      },
    }));
    setSelectedTopicId(topicId);
    navigate("today");
    showToast(`已把“${path.title}”的小任务放到今日学习。`);
  }

  function handleDraftChange<K extends keyof RecordDraft>(
    key: K,
    value: RecordDraft[K],
  ) {
    setDraft((previous) => ({ ...previous, [key]: value }));
  }

  function handleSaveRecord() {
    const now = new Date().toISOString();
    const existing = state.records.find(
      (record) =>
        record.date === state.today.date &&
        record.topicId === state.currentTopicId,
    );
    const existingEvidence = existing?.evidenceIds
      .map((id) => state.evidence.find((item) => item.id === id))
      .find(Boolean);
    const hasEvidence = draft.evidenceDescription.trim().length > 0;

    if (draft.masteryLevel === "apply" && !hasEvidence && !existingEvidence) {
      showToast(
        "“能应用”必须附带证据。请写清步骤、现象和结果后再保存。",
        "warning",
      );
      return;
    }

    const evidenceId = hasEvidence
      ? existingEvidence?.id ?? freshId("evidence")
      : existingEvidence?.id;
    const nextEvidence: EvidenceRecord[] = hasEvidence
      ? [
          ...state.evidence.filter((item) => item.id !== evidenceId),
          {
            id: evidenceId!,
            topicId: state.currentTopicId,
            kind: draft.evidenceKind as EvidenceKind,
            description: draft.evidenceDescription.trim(),
            createdAt: existingEvidence?.createdAt ?? now,
          },
        ]
      : state.evidence;
    const evidenceIds = evidenceId ? [evidenceId] : [];
    const nextRecord: LearningRecord = {
      id:
        existing?.id ??
        `record-${state.today.date}-${state.currentTopicId}`,
      date: state.today.date,
      topicId: state.currentTopicId,
      masteryLevel: draft.masteryLevel,
      completion: draft.completion,
      summary: draft.summary.trim(),
      evidenceIds,
      errors: draft.errors.trim(),
      questions: draft.questions.trim(),
      reviewItems: draft.reviewItems.trim(),
      relatedResources: draft.relatedResources.trim(),
      nextStep: draft.nextStep.trim(),
      updatedAt: now,
    };

    let nextState: UserState = {
      ...state,
      evidence: nextEvidence,
      records: [
        ...state.records.filter((record) => record.id !== nextRecord.id),
        nextRecord,
      ],
      today: {
        ...state.today,
        carryOver: draft.questions.trim() || draft.errors.trim(),
        nextStep:
          draft.nextStep.trim() || "下次先确认本次记录中的未完成项",
      },
      updatedAt: now,
    };

    try {
      nextState = setMastery(
        nextState,
        state.currentTopicId,
        draft.masteryLevel,
        evidenceIds,
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "证据校验失败。",
        "warning",
      );
      return;
    }

    setState(nextState);
    showToast("本次学习记录和掌握证据已保存。");
  }

  function handleBackup() {
    try {
      const filename = downloadBackup(state);
      showToast(`已下载 ${filename}`);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "JSON 备份失败。",
        "error",
      );
    }
  }

  function handleExportMarkdown() {
    try {
      const filename = downloadDailyMarkdown(state, {
        topicTitle: currentTopic.title,
      });
      showToast(`已导出 ${filename}，请放入 logs/daily/。`);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Markdown 导出失败。",
        "error",
      );
    }
  }

  async function handleImportFile(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      showToast("备份文件超过 2 MB，已拒绝导入。", "error");
      return;
    }

    try {
      const serialized = await readTextFile(file);
      const restored = rolloverDailyState(restoreBackup(serialized));
      setPendingImport(restored);
      importDialogRef.current?.showModal();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "备份文件校验失败。",
        "error",
      );
    }
  }

  function confirmImport() {
    if (!pendingImport) return;
    try {
      saveState(pendingImport);
      setState(pendingImport);
      setSelectedTopicId(pendingImport.currentTopicId);
      setDraft(
        createRecordDraft(pendingImport, pendingImport.currentTopicId),
      );
      setPendingImport(null);
      importDialogRef.current?.close();
      navigate("today");
      setSaveStatus("saved");
      showToast("备份已校验并完整恢复。");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "恢复备份失败。",
        "error",
      );
    }
  }

  function confirmDeleteRecord() {
    const record = state.records.find(
      (item) =>
        item.date === state.today.date &&
        item.topicId === state.currentTopicId,
    );
    if (!record) {
      deleteDialogRef.current?.close();
      return;
    }

    const otherEvidenceIds = new Set(
      state.records
        .filter((item) => item.id !== record.id)
        .flatMap((item) => item.evidenceIds),
    );
    const removedEvidenceIds = new Set(record.evidenceIds);
    const nextEvidence = state.evidence.filter(
      (item) =>
        !removedEvidenceIds.has(item.id) || otherEvidenceIds.has(item.id),
    );
    const remainingTopicEvidenceIds = state.mastery[
      state.currentTopicId
    ].evidenceIds.filter((id) =>
      nextEvidence.some((evidence) => evidence.id === id),
    );
    const currentMastery = state.mastery[state.currentTopicId];
    const nextLevel: MasteryLevel =
      currentMastery.level === "apply" &&
      remainingTopicEvidenceIds.length === 0
        ? "explain"
        : currentMastery.level;

    updateState((previous) => ({
      ...previous,
      evidence: nextEvidence,
      records: previous.records.filter((item) => item.id !== record.id),
      mastery: {
        ...previous.mastery,
        [previous.currentTopicId]: {
          level: nextLevel,
          evidenceIds: remainingTopicEvidenceIds,
        },
      },
    }));
    setDraft(createRecordDraft(createDefaultState(), state.currentTopicId));
    deleteDialogRef.current?.close();
    showToast(
      nextLevel !== currentMastery.level
        ? "记录已删除；因最后一条证据被移除，掌握程度已降为“能解释”。"
        : "当天记录已删除。",
      "warning",
    );
  }

  const saveStateNode = (
    <span className="save-state" data-state={saveStatus} aria-live="polite">
      <Icon name="cloud" size={22} />
      {saveStatusLabel(saveStatus)}
    </span>
  );

  const activeContent = useMemo(() => {
    if (activeView === "roadmap") {
      return (
        <RoadmapView
          topics={[...roadmapTopics]}
          currentTopicId={state.currentTopicId}
          selectedTopicId={selectedTopicId}
          mastery={state.mastery}
          onSelectTopic={(topicId) => setSelectedTopicId(topicId as TopicId)}
          onSetMastery={handleSetMastery}
          onContinue={(topicId) =>
            handleContinueTopic(topicId as TopicId)
          }
        />
      );
    }
    if (activeView === "knowledge") {
      return (
        <KnowledgeView
          paths={[...signalPaths]}
          selectedPathId={selectedPathId}
          onSelectPath={(pathId) => setSelectedPathId(pathId as SignalPathId)}
          onStartTask={handleStartSignalPath}
        />
      );
    }
    if (activeView === "records") {
      return (
        <RecordsView
          state={state}
          currentTopic={currentTopic}
          draft={draft}
          hasSavedRecord={hasSavedRecord}
          onDraftChange={handleDraftChange}
          onToggleTask={handleToggleTask}
          onSaveRecord={handleSaveRecord}
          onExportMarkdown={handleExportMarkdown}
          onBackupJson={handleBackup}
          onImportFile={handleImportFile}
          onDeleteRecord={() => deleteDialogRef.current?.showModal()}
        />
      );
    }
    if (activeView === "deferred") {
      return (
        <DeferredView
          groups={[...deferredGroups]}
          reasons={state.deferredReasons}
          selectedId={selectedDeferredId}
          onSelect={(id) =>
            setSelectedDeferredId((current) =>
              current === id ? null : (id as DeferredItemId),
            )
          }
          onReasonChange={(id, value) =>
            updateState((previous) => ({
              ...previous,
              deferredReasons: {
                ...previous.deferredReasons,
                [id]: value,
              },
            }))
          }
          onSaveReason={(id) =>
            showToast(
              state.deferredReasons[id as DeferredItemId]?.trim()
                ? "延期原因已保存。"
                : "已保留默认延期理由。",
            )
          }
          onReturnToday={() => navigate("today")}
        />
      );
    }
    return (
      <TodayView
        state={state}
        currentTopic={currentTopic}
        topicIndex={Math.max(0, currentTopicIndex)}
        topicCount={roadmapTopics.length}
        onToggleTask={handleToggleTask}
        onOpenTask={handleOpenTask}
        onContinue={() => {
          setSelectedTopicId(state.currentTopicId);
          navigate("roadmap");
        }}
      />
    );
    // Event handlers intentionally close over the latest state rendered here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeView,
    currentTopic,
    currentTopicIndex,
    draft,
    hasSavedRecord,
    selectedDeferredId,
    selectedPathId,
    selectedTopicId,
    state,
  ]);

  return (
    <div className="workbench">
      <aside className="sidebar">
        <div className="brand">自动化基础学习台</div>
        <nav className="side-nav" aria-label="一级导航">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-button"
              aria-current={activeView === item.id ? "page" : undefined}
              onClick={() => navigate(item.id)}
            >
              <Icon name={item.icon} size={27} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p className="view-conclusion">
            本地优先 · 无需登录
            <br />
            Markdown 与 Git 仍是内容原件
          </p>
        </div>
      </aside>

      <div>
        <header className="mobile-topbar">
          <span className="mobile-brand">自动化基础学习台</span>
          {saveStateNode}
        </header>
        <main className="workspace">
          <div className="desktop-status">{saveStateNode}</div>
          {activeContent}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="移动端一级导航">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="mobile-nav-button"
            aria-current={activeView === item.id ? "page" : undefined}
            onClick={() => navigate(item.id)}
          >
            <Icon name={item.icon} size={23} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast ? (
          <div className="toast" data-tone={toast.tone} key={toast.id}>
            <Icon
              name={
                toast.tone === "error"
                  ? "warning"
                  : toast.tone === "warning"
                    ? "info"
                    : "check"
              }
              size={21}
            />
            <p>{toast.message}</p>
            <button
              type="button"
              className="icon-button"
              aria-label="关闭提示"
              onClick={() => setToast(null)}
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        ) : null}
      </div>

      <dialog
        ref={importDialogRef}
        onCancel={() => setPendingImport(null)}
        aria-labelledby="import-title"
      >
        <div className="dialog-content">
          <h2 id="import-title">恢复备份会覆盖当前数据</h2>
          <p>
            已校验备份：{pendingImport?.records.length ?? 0} 条学习记录、
            {pendingImport?.evidence.length ?? 0} 条证据。确认后会完整替换当前浏览器中的学习状态。
          </p>
          <div className="dialog-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={handleBackup}
            >
              <Icon name="database" size={18} />
              先备份当前数据
            </button>
            <button
              type="button"
              className="quiet-action"
              onClick={() => {
                setPendingImport(null);
                importDialogRef.current?.close();
              }}
            >
              取消
            </button>
            <button
              type="button"
              className="danger-action"
              onClick={confirmImport}
            >
              确认覆盖并恢复
            </button>
          </div>
        </div>
      </dialog>

      <dialog ref={deleteDialogRef} aria-labelledby="delete-title">
        <div className="dialog-content">
          <h2 id="delete-title">删除当天学习记录？</h2>
          <p>
            这会删除当前主题在 {state.today.date} 的记录及未被其他记录引用的证据。若它是“能应用”的最后证据，掌握程度会自动降为“能解释”。
          </p>
          <div className="dialog-actions">
            <button
              type="button"
              className="quiet-action"
              onClick={() => deleteDialogRef.current?.close()}
            >
              取消
            </button>
            <button
              type="button"
              className="danger-action"
              onClick={confirmDeleteRecord}
            >
              <Icon name="trash" size={18} />
              确认删除
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
