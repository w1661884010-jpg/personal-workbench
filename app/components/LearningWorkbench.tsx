"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { courses } from "../data/courses";
import {
  CHECK_PASS_SCORE,
  completeChapter,
  createLearningState,
  getChapter,
  markMistakeReviewed,
  startChapter,
  submitChapterCheck,
  upsertMistake,
  type ChapterDefinition,
  type CourseDefinition,
  type CourseId,
  type LearningState,
  type MistakeRecord,
} from "../lib/course-model";
import { downloadLearningBackup, LEARNING_STORAGE_KEY, loadLearningState, readLearningBackupFile, restoreLearningBackup, saveLearningState } from "../lib/course-storage";
import { CircuitWorkbench } from "./sandbox/CircuitWorkbench";
import { AppShell, type NavigationItem, type SearchResult } from "./semester/AppShell";
import { ChapterMistakesView } from "./semester/ChapterMistakesView";
import { ChapterStudyView } from "./semester/ChapterStudyView";
import { CourseConnectionsView } from "./semester/CourseConnectionsView";
import { CourseOverviewView } from "./semester/CourseOverviewView";
import { DashboardView } from "./semester/DashboardView";

const navigation: readonly NavigationItem[] = [
  { id: "dashboard", label: "课程首页", mobileLabel: "首页", icon: "chip" },
  { id: "signals", label: "信号与系统", mobileLabel: "信号", icon: "wave" },
  { id: "digital", label: "数字电子技术", mobileLabel: "数电", icon: "notebook" },
  { id: "analog", label: "模拟电子技术", mobileLabel: "模电", icon: "book" },
  { id: "sandbox-digital", label: "数字电路工作台", mobileLabel: "数字台", icon: "chip", mobile: false },
  { id: "sandbox-analog", label: "模拟电路工作台", mobileLabel: "模拟台", icon: "wave", mobile: false },
  { id: "mistakes", label: "练习与错题", mobileLabel: "错题", icon: "warning", mobile: false },
  { id: "connections", label: "课程连接", mobileLabel: "连接", icon: "route", mobile: false },
];

type SaveStatus = "loading" | "saving" | "saved" | "error";
type ToastTone = "success" | "warning" | "error";
type Toast = { id: number; message: string; tone: ToastTone } | null;

function currentRoute() {
  return globalThis.location?.hash.replace(/^#/, "") || "dashboard";
}

function activeNavigationId(route: string) {
  if (route.startsWith("course/")) return route.slice(7);
  if (route.startsWith("chapter/")) return getChapter(courses, route.slice(8))?.course.id ?? "signals";
  if (route.startsWith("sandbox/digital")) return "sandbox-digital";
  if (route.startsWith("sandbox/analog")) return "sandbox-analog";
  return navigation.some((item) => item.id === route) ? route : "dashboard";
}

function navRoute(id: string) {
  if (["signals", "digital", "analog"].includes(id)) return `course/${id}`;
  if (id === "sandbox-digital") return "sandbox/digital";
  if (id === "sandbox-analog") return "sandbox/analog";
  return id;
}

export function LearningWorkbench() {
  const [state, setState] = useState<LearningState>(() => createLearningState(courses, new Date("2026-08-24T00:00:00.000Z")));
  const [route, setRoute] = useState("dashboard");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");
  const [toast, setToast] = useState<Toast>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const toastId = useRef(0);
  const courseId = route.startsWith("course/") ? route.slice(7) as CourseId : null;

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    toastId.current += 1;
    setToast({ id: toastId.current, message, tone });
  }, []);

  const navigate = useCallback((next: string) => {
    setSelectedChapterId(null);
    setRoute(next);
    if (globalThis.history && globalThis.location?.hash !== `#${next}`) globalThis.history.pushState({ route: next }, "", `#${next}`);
    globalThis.scrollTo?.({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      const initialRoute = currentRoute();
      let nextState = loadLearningState() ?? createLearningState(courses);
      if (initialRoute.startsWith("chapter/")) {
        const location = getChapter(courses, initialRoute.slice(8));
        if (location) nextState = startChapter(nextState, location.course.id, location.chapter.id);
      }
      setState(nextState);
      setSelectedChapterId(null);
      setRoute(initialRoute);
      setHydrated(true);
      setSaveStatus("saved");
    }, 0);
    return () => globalThis.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const listener = () => {
      const nextRoute = currentRoute();
      setSelectedChapterId(null);
      setRoute(nextRoute);
      if (nextRoute.startsWith("chapter/")) {
        const location = getChapter(courses, nextRoute.slice(8));
        if (location) setState((current) => startChapter(current, location.course.id, location.chapter.id));
      }
    };
    globalThis.addEventListener("popstate", listener);
    globalThis.addEventListener("hashchange", listener);
    return () => { globalThis.removeEventListener("popstate", listener); globalThis.removeEventListener("hashchange", listener); };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const statusTimer = globalThis.setTimeout(() => setSaveStatus("saving"), 0);
    const timer = globalThis.setTimeout(() => {
      try { saveLearningState(state); setSaveStatus("saved"); }
      catch (error) { setSaveStatus("error"); showToast(error instanceof Error ? error.message : "保存失败。", "error"); }
    }, 220);
    return () => { globalThis.clearTimeout(statusTimer); globalThis.clearTimeout(timer); };
  }, [hydrated, showToast, state]);

  useEffect(() => {
    const listener = (event: StorageEvent) => { if (event.key === LEARNING_STORAGE_KEY && event.newValue) { const next = loadLearningState(); if (next) { setState(next); showToast("另一个标签页更新了学习记录，本页已同步。", "warning"); } } };
    globalThis.addEventListener("storage", listener);
    return () => globalThis.removeEventListener("storage", listener);
  }, [showToast]);

  useEffect(() => { if (!toast) return; const timer = globalThis.setTimeout(() => setToast(null), 3600); return () => globalThis.clearTimeout(timer); }, [toast]);

  const searchResults = useMemo<SearchResult[]>(() => {
    const normalized = deferredQuery.trim().toLocaleLowerCase("zh-CN");
    if (!normalized) return [];
    const results: SearchResult[] = [];
    for (const course of courses) {
      if (`${course.title}${course.shortTitle}${course.textbook}${course.role}`.toLocaleLowerCase("zh-CN").includes(normalized)) results.push({ id: course.id, kind: "course", title: course.title, meta: course.textbook, route: `course/${course.id}` });
      for (const chapter of course.chapters) {
        const chapterRoute = `chapter/${chapter.id}`;
        if (`${chapter.number}${chapter.title}${chapter.tags.join(" ")}`.toLocaleLowerCase("zh-CN").includes(normalized)) results.push({ id: chapter.id, kind: "chapter", title: `${chapter.number} ${chapter.title}`, meta: course.title, route: chapterRoute });
        for (const section of chapter.sections) if (`${section.title}${section.content}${section.formula ?? ""}${section.variables?.join(" ") ?? ""}`.toLocaleLowerCase("zh-CN").includes(normalized)) results.push({ id: `${chapter.id}-${section.id}`, kind: "section", title: section.title, meta: `${course.title} · ${chapter.title}`, route: chapterRoute });
        for (const experiment of chapter.experiments) if (`${experiment.title}${experiment.goal}`.toLocaleLowerCase("zh-CN").includes(normalized)) results.push({ id: experiment.id, kind: "experiment", title: experiment.title, meta: `${course.title} · 实验`, route: experiment.workbench === "notebook" ? chapterRoute : `sandbox/${experiment.workbench}/${experiment.id}` });
      }
    }
    return results.slice(0, 10);
  }, [deferredQuery]);

  function openCourse(nextCourseId: CourseId) { navigate(`course/${nextCourseId}`); }
  function openChapter(course: CourseDefinition, chapterId: string) { setState((current) => startChapter(current, course.id, chapterId)); navigate(`chapter/${chapterId}`); }
  function openExperiment(chapter: ChapterDefinition, experimentId: string) {
    const experiment = chapter.experiments.find((item) => item.id === experimentId);
    if (!experiment) return;
    if (experiment.workbench === "notebook") { showToast("实验步骤已在本页列出；计算请使用课程目录中的 Notebook。", "warning"); return; }
    navigate(`sandbox/${experiment.workbench}/${experiment.id}`);
  }

  async function handleImport(file: File) {
    try {
      const next = restoreLearningBackup(await readLearningBackupFile(file));
      if (!(globalThis.confirm?.("导入会覆盖当前浏览器中的学习记录，是否继续？") ?? false)) { showToast("已取消导入。", "warning"); return; }
      setState(next); saveLearningState(next); showToast("JSON 学习记录已导入并保存。");
    } catch (error) { showToast(error instanceof Error ? error.message : "导入失败。", "error"); }
  }

  function handleExport() { try { showToast(`已导出 ${downloadLearningBackup(state)}`); } catch (error) { showToast(error instanceof Error ? error.message : "导出失败。", "error"); } }

  const chapterLocation = route.startsWith("chapter/") ? getChapter(courses, route.slice(8)) : null;
  const course = courses.find((item) => item.id === courseId);
  const sandboxMatch = /^sandbox\/(digital|analog)(?:\/(.+))?$/.exec(route);
  let content: React.ReactNode = <DashboardView courses={courses} state={state} onOpenCourse={openCourse} onOpenWorkbench={(kind) => navigate(`sandbox/${kind}`)} />;
  if (course) content = <CourseOverviewView course={course} state={state} selectedChapterId={selectedChapterId} onPreviewChapter={setSelectedChapterId} onContinueChapter={(chapterId) => openChapter(course, chapterId)} onOpenWorkbench={(kind) => navigate(`sandbox/${kind}`)} />;
  else if (chapterLocation) content = <ChapterStudyView key={chapterLocation.chapter.id} course={chapterLocation.course} chapter={chapterLocation.chapter} state={state} onBack={() => openCourse(chapterLocation.course.id)} onSelectChapter={(chapterId) => openChapter(chapterLocation.course, chapterId)} onSubmitCheck={(chapter, answers) => {
    try {
      const correct = chapter.check.reduce((total, question, index) => total + Number(question.answer === answers[index]), 0);
      const score = chapter.check.length ? Math.round((correct / chapter.check.length) * 100) : 100;
      setState((current) => submitChapterCheck(current, chapterLocation.course.id, chapter, answers));
      showToast(score >= CHECK_PASS_SCORE ? "章节检验 " + score + "%：已达到完成门槛。" : "章节检验 " + score + "%：未达到 " + CHECK_PASS_SCORE + "%，错题已自动收录。", score >= CHECK_PASS_SCORE ? "success" : "warning");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "提交失败。", "error");
    }
  }} onComplete={(chapterId) => { try { setState((current) => completeChapter(current, chapterId)); showToast("本章已完成，课程进度已按章节同步。"); } catch (error) { showToast(error instanceof Error ? error.message : "无法完成章节。", "error"); } }} onOpenExperiment={openExperiment} />;
  else if (sandboxMatch) content = <CircuitWorkbench kind={sandboxMatch[1] as "digital" | "analog"} initialExperimentId={sandboxMatch[2]} courses={courses} onOpenChapter={(chapterId) => { const location = getChapter(courses, chapterId); if (location) openChapter(location.course, chapterId); }} onNotify={showToast} />;
  else if (route === "mistakes") content = <ChapterMistakesView courses={courses} state={state} onSave={(record: MistakeRecord) => { setState((current) => upsertMistake(current, record)); showToast("错题已保存。"); }} onReviewed={(id) => { setState((current) => markMistakeReviewed(current, id)); showToast("已标记为已复盘；课程章节进度不受影响。"); }} onOpenChapter={openChapter} />;
  else if (route === "connections") content = <CourseConnectionsView courses={courses} onOpenCourse={openCourse} />;

  return <AppShell activeNavigationId={activeNavigationId(route)} navigation={navigation} searchQuery={query} searchResults={searchResults} saveLabel={saveStatus === "loading" ? "正在读取记录" : saveStatus === "saving" ? "正在保存" : saveStatus === "error" ? "保存失败" : "已保存到本机"} onNavigate={(id) => navigate(navRoute(id))} onSearchChange={setQuery} onSearchSelect={(result) => { setQuery(""); if (result.route.startsWith("chapter/")) { const location = getChapter(courses, result.route.slice(8)); if (location) setState((current) => startChapter(current, location.course.id, location.chapter.id)); } navigate(result.route); }} onExport={handleExport} onImport={handleImport}>{!hydrated ? <div className="hydration-note" role="status">正在读取本地学习记录…</div> : null}{content}{toast ? <div className={`toast toast-${toast.tone}`} role="status" key={toast.id}>{toast.message}</div> : null}</AppShell>;
}
