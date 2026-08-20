"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { courses } from "../data/semester";
import {
  createSemesterState,
  getTopicLocation,
  markMistakeMastered,
  markTopicReviewed,
  toggleTask,
  updateEvidence,
  updateMastery,
  upsertMistake,
  type MasteryLevel,
  type MistakeRecord,
  type SemesterState,
} from "../lib/semester-model";
import {
  downloadSemesterBackup,
  loadSemesterState,
  readSemesterBackupFile,
  restoreSemesterBackup,
  saveSemesterState,
  SEMESTER_STORAGE_KEY,
} from "../lib/semester-storage";
import { AppShell, type NavigationItem, type SearchResult, type SemesterViewId } from "./semester/AppShell";
import { ConnectionsView } from "./semester/ConnectionsView";
import { CourseOverviewView } from "./semester/CourseOverviewView";
import { DashboardView } from "./semester/DashboardView";
import { KnowledgeCardView } from "./semester/KnowledgeCardView";
import { MistakesView } from "./semester/MistakesView";

const navigation: readonly NavigationItem[] = [
  { id: "dashboard", label: "学习总览", mobileLabel: "总览", icon: "chip" },
  { id: "courses", label: "三门课程", mobileLabel: "课程", icon: "book" },
  { id: "knowledge", label: "知识卡片", mobileLabel: "卡片", icon: "notebook" },
  { id: "mistakes", label: "练习与错题", mobileLabel: "错题", icon: "warning" },
  { id: "connections", label: "课程连接", mobileLabel: "连接", icon: "route" },
];

const validViews = new Set(navigation.map((item) => item.id));
const HYDRATION_DATE = new Date("2026-08-20T08:00:00.000Z");

type SaveStatus = "loading" | "saving" | "saved" | "error";
type ToastTone = "success" | "warning" | "error";
type Toast = { id: number; message: string; tone: ToastTone } | null;

function saveLabel(status: SaveStatus) {
  if (status === "loading") return "正在读取本地记录";
  if (status === "saving") return "正在保存";
  if (status === "error") return "本地保存失败";
  return "已保存到本机";
}

function viewFromHash(): SemesterViewId | null {
  const value = globalThis.location?.hash.replace(/^#/, "") as SemesterViewId | undefined;
  return value && validViews.has(value) ? value : null;
}

export function LearningWorkbench() {
  const [state, setState] = useState<SemesterState>(() => createSemesterState(HYDRATION_DATE));
  const [activeView, setActiveView] = useState<SemesterViewId>("dashboard");
  const [selectedCourseId, setSelectedCourseId] = useState("signals");
  const [selectedTopicId, setSelectedTopicId] = useState("signals-convolution-topic");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");
  const [toast, setToast] = useState<Toast>(null);
  const toastCounter = useRef(0);

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    toastCounter.current += 1;
    setToast({ id: toastCounter.current, message, tone });
  }, []);

  const navigate = useCallback((view: SemesterViewId) => {
    setActiveView(view);
    if (globalThis.history && globalThis.location?.hash !== `#${view}`) {
      globalThis.history.pushState({ view }, "", `#${view}`);
    }
    globalThis.scrollTo?.({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const next = loadSemesterState() ?? createSemesterState();
    const initialView = viewFromHash();
    const timer = globalThis.setTimeout(() => {
      setState(next);
      setSelectedTopicId(next.currentTopicId);
      setSelectedCourseId(getTopicLocation(next.currentTopicId)?.course.id ?? "signals");
      if (initialView) setActiveView(initialView);
      setSaveStatus("saved");
      setHydrated(true);
    }, 0);
    return () => globalThis.clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handlePopState() {
      setActiveView(viewFromHash() ?? "dashboard");
    }
    globalThis.addEventListener("popstate", handlePopState);
    return () => globalThis.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const statusTimer = globalThis.setTimeout(() => setSaveStatus("saving"), 0);
    const timer = globalThis.setTimeout(() => {
      try {
        saveSemesterState(state);
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
        showToast(error instanceof Error ? error.message : "本地保存失败。", "error");
      }
    }, 250);
    return () => {
      globalThis.clearTimeout(statusTimer);
      globalThis.clearTimeout(timer);
    };
  }, [hydrated, showToast, state]);

  useEffect(() => {
    if (!toast) return;
    const timer = globalThis.setTimeout(() => setToast(null), 3500);
    return () => globalThis.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== SEMESTER_STORAGE_KEY || !event.newValue) return;
      const next = loadSemesterState();
      if (next) {
        setState(next);
        showToast("另一个标签页更新了学习记录，本页已同步。", "warning");
      }
    }
    globalThis.addEventListener("storage", handleStorage);
    return () => globalThis.removeEventListener("storage", handleStorage);
  }, [showToast]);

  const searchResults = useMemo<SearchResult[]>(() => {
    const query = deferredSearchQuery.trim().toLocaleLowerCase("zh-CN");
    if (!query) return [];
    const results: SearchResult[] = [];
    for (const course of courses) {
      if (`${course.title}${course.shortTitle}${course.role}`.toLocaleLowerCase("zh-CN").includes(query)) {
        results.push({ id: course.id, kind: "course", title: course.title, meta: "课程", courseId: course.id });
      }
      for (const chapter of course.chapters) {
        if (chapter.title.toLocaleLowerCase("zh-CN").includes(query)) {
          results.push({ id: chapter.id, kind: "chapter", title: chapter.title, meta: `${course.title} · 章节`, courseId: course.id, topicId: chapter.topic.id });
        }
        const topicText = `${chapter.topic.title}${chapter.topic.problem}${chapter.topic.tags.join(" ")}`.toLocaleLowerCase("zh-CN");
        if (topicText.includes(query)) {
          results.push({ id: chapter.topic.id, kind: "topic", title: chapter.topic.title, meta: `${course.title} · ${chapter.title}`, courseId: course.id, topicId: chapter.topic.id });
        }
      }
    }
    return results.slice(0, 9);
  }, [deferredSearchQuery]);

  function openCourse(courseId: string) {
    setSelectedCourseId(courseId);
    navigate("courses");
  }

  function openTopic(topicId: string) {
    const location = getTopicLocation(topicId);
    if (location) setSelectedCourseId(location.course.id);
    setSelectedTopicId(topicId);
    navigate("knowledge");
  }

  function handleSearchSelect(result: SearchResult) {
    setSearchQuery("");
    if (result.kind === "course") openCourse(result.courseId);
    else if (result.topicId) openTopic(result.topicId);
  }

  async function handleImport(file: File) {
    try {
      const next = restoreSemesterBackup(await readSemesterBackupFile(file));
      const confirmed = globalThis.confirm?.("导入会覆盖当前浏览器中的学习记录。是否继续？") ?? false;
      if (!confirmed) {
        showToast("已取消导入，当前记录没有变化。", "warning");
        return;
      }
      setState(next);
      setSelectedTopicId(next.currentTopicId);
      setSelectedCourseId(getTopicLocation(next.currentTopicId)?.course.id ?? "signals");
      saveSemesterState(next);
      showToast("JSON 学习记录已导入并保存。", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "导入失败，请检查 JSON 文件。", "error");
    }
  }

  function handleExport() {
    try {
      const filename = downloadSemesterBackup(state);
      showToast(`已导出 ${filename}`, "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "导出失败。", "error");
    }
  }

  function handleMasteryChange(topicId: string, level: MasteryLevel) {
    setState((current) => updateMastery(current, topicId, level));
    showToast(`掌握状态已更新为“${level === "untouched" ? "未接触" : level === "recognize" ? "能识别" : level === "explain" ? "能解释" : "能应用"}”，课程进度已同步。`);
  }

  function handleReviewed(topicId: string) {
    setState((current) => markTopicReviewed(current, topicId));
    showToast("已记录本次复习，下次复习安排在 7 天后。");
  }

  function handleSaveMistake(mistake: MistakeRecord) {
    setState((current) => upsertMistake(current, mistake));
    showToast("错题已保存。", "success");
  }

  function handleMarkMastered(mistakeId: string) {
    setState((current) => markMistakeMastered(current, mistakeId));
    showToast("错题已标记掌握，对应知识点进度已同步。", "success");
  }

  let content = <DashboardView state={state} onToggleTask={(taskId) => setState((current) => toggleTask(current, taskId))} onOpenCourse={openCourse} onOpenTopic={openTopic} onContinue={() => openTopic(state.currentTopicId)} />;
  if (activeView === "courses") {
    content = <CourseOverviewView state={state} courseId={selectedCourseId} onSelectCourse={setSelectedCourseId} onOpenTopic={openTopic} />;
  } else if (activeView === "knowledge") {
    content = <KnowledgeCardView state={state} topicId={selectedTopicId} onSelectTopic={setSelectedTopicId} onMasteryChange={handleMasteryChange} onEvidenceChange={(topicId, evidence) => setState((current) => updateEvidence(current, topicId, evidence))} onReviewed={handleReviewed} />;
  } else if (activeView === "mistakes") {
    content = <MistakesView state={state} onSaveMistake={handleSaveMistake} onMarkMastered={handleMarkMastered} onOpenTopic={openTopic} />;
  } else if (activeView === "connections") {
    content = <ConnectionsView onOpenCourse={openCourse} />;
  }

  return (
    <AppShell
      activeView={activeView}
      navigation={navigation}
      searchQuery={searchQuery}
      searchResults={searchResults}
      saveLabel={saveLabel(saveStatus)}
      onNavigate={navigate}
      onSearchChange={setSearchQuery}
      onSearchSelect={handleSearchSelect}
      onExport={handleExport}
      onImport={handleImport}
    >
      {!hydrated ? <div className="hydration-note" role="status">正在读取本地学习记录…</div> : null}
      {content}
      {toast ? <div className={`toast toast-${toast.tone}`} role="status" key={toast.id}>{toast.message}</div> : null}
    </AppShell>
  );
}
