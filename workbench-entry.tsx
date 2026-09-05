/* 工作台打包入口：把原站点 React 电路工作台（CircuitWorkbench + lib/circuit + workbench.css）
   连同 React 运行时打成独立 IIFE，暴露 PrototypeWorkbench.mount/setKind/unmount。
   骨架页本身保持零依赖，只在需要时加载这个 bundle。
   React 以相对路径直取原站 node_modules（骨架目录无 node_modules，不做符号链接）。 */
import { createRoot, type Root } from "../personal-workbench-sites/node_modules/react-dom/client.js";
import { createElement } from "../personal-workbench-sites/node_modules/react/index.js";
import { CircuitWorkbench } from "./CircuitWorkbench";
import type { CircuitKind } from "../personal-workbench-sites/app/lib/circuit/types";

type NotifyTone = "success" | "warning" | "error";

export interface MountOptions {
  kind: CircuitKind;
  initialExperimentId?: string;
  courses: readonly unknown[];
  onOpenChapter: (chapterId: string) => void;
  onNotify: (message: string, tone?: NotifyTone) => void;
}

const roots: Partial<Record<CircuitKind, Root>> = {};
const sessionContainers: Partial<Record<CircuitKind, HTMLElement>> = {};
let activeContainer: HTMLElement | null = null;
let activeOptions: MountOptions | null = null;
let activeKind: CircuitKind | null = null;
let visibleKind: CircuitKind | null = null;

/* 内容切换过渡时长（与原型 styles.css 保持一致）：淡出 80ms → 切换 → 淡入 120ms */
const FADE_OUT_MS = 80;
const FADE_IN_MS = 120;
const READY_POLL_MS = 40;
const READY_TIMEOUT_MS = 1500;

/* 切换代号：快速连点/卸载时使过期回调失效，只让最后一次选择落地 */
let switchSeq = 0;
let pendingTimers: Array<ReturnType<typeof setTimeout>> = [];
let readyPollTimer: ReturnType<typeof setInterval> | null = null;
let readyTimeoutTimer: ReturnType<typeof setTimeout> | null = null;

function prefersReducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clearReadyWatchers() {
  if (readyPollTimer !== null) {
    clearInterval(readyPollTimer);
    readyPollTimer = null;
  }
  if (readyTimeoutTimer !== null) {
    clearTimeout(readyTimeoutTimer);
    readyTimeoutTimer = null;
  }
}

function clearPendingTimers() {
  for (const timer of pendingTimers) clearTimeout(timer);
  pendingTimers = [];
}

function later(fn: () => void, ms: number) {
  const timer = setTimeout(() => {
    pendingTimers = pendingTimers.filter((t) => t !== timer);
    fn();
  }, ms);
  pendingTimers.push(timer);
}

/* 挂载就绪判断：轮询目标会话容器，待 React 提交出 .circuit-workbench 再开始替换。
   超时视为挂载失败，由调用方保留可用内容并反馈错误。 */
function waitForSessionReady(container: HTMLElement, onReady: () => void, onFail: () => void) {
  clearReadyWatchers();
  const deadline = Date.now() + READY_TIMEOUT_MS;
  readyPollTimer = setInterval(() => {
    if (container.querySelector(".circuit-workbench")) {
      clearReadyWatchers();
      onReady();
      return;
    }
    if (Date.now() >= deadline) {
      clearReadyWatchers();
      onFail();
    }
  }, READY_POLL_MS);
}

/* 原型布局桥接：原站把「逻辑探针与分析仪 / 表计与示波器」作为独立卡片放在工作台底部；
   原型改为把它并到右侧「参数与状态」检查器内（其下半部空白），画布获得整行高度。
   React 不知情只引用同一节点，更新子内容安全；卸载前必须还原，否则 React 在错误父节点删除。 */
const WORKBENCH_CLASS = "circuit-workbench";
const INSPECTOR_CLASS = "cw-inspector";
const INSTRUMENTS_CLASS = "cw-instruments";

function moveInstrumentsIntoInspector(container: HTMLElement) {
  const workbench = container.querySelector<HTMLElement>(`.${WORKBENCH_CLASS}`);
  if (!workbench) return;
  const inspector = workbench.querySelector<HTMLElement>(`.${INSPECTOR_CLASS}`);
  const instruments = workbench.querySelector<HTMLElement>(`.${INSTRUMENTS_CLASS}`);
  if (!inspector || !instruments) return;
  if (inspector !== instruments.parentElement) inspector.appendChild(instruments);
}

function restoreInstruments(container: HTMLElement) {
  const workbench = container.querySelector<HTMLElement>(`.${WORKBENCH_CLASS}`);
  if (!workbench) return;
  const instruments = workbench.querySelector<HTMLElement>(`.${INSTRUMENTS_CLASS}`);
  if (instruments && workbench !== instruments.parentElement) workbench.appendChild(instruments);
}

/* React createRoot.render 为异步提交：轮询挂载点，待 instruments 出现后桥接 */
function scheduleBridge(container: HTMLElement, attempts = 0) {
  if (attempts > 20) return;
  if (container.querySelector(`.${INSTRUMENTS_CLASS}`)) {
    moveInstrumentsIntoInspector(container);
    return;
  }
  later(() => scheduleBridge(container, attempts + 1), 40);
}

function ensureSession(kind: CircuitKind, initialExperimentId?: string) {
  if (!activeContainer || !activeOptions || roots[kind]) return;
  const container = document.createElement("div");
  container.className = "prototype-workbench-session";
  container.dataset.kind = kind;
  container.hidden = true;
  /* tablist/tabpanel 配对：切换控件通过 aria-controls 指向对应面板 */
  container.id = kind === "digital" ? "workbenchPanelDigital" : "workbenchPanelAnalog";
  container.setAttribute("role", "tabpanel");
  container.setAttribute("aria-labelledby", kind === "digital" ? "kindTabDigital" : "kindTabAnalog");
  activeContainer.appendChild(container);
  const sessionRoot = createRoot(container);
  roots[kind] = sessionRoot;
  sessionContainers[kind] = container;
  sessionRoot.render(
    createElement(CircuitWorkbench, {
      kind,
      initialExperimentId,
      courses: activeOptions.courses,
      onOpenChapter: activeOptions.onOpenChapter,
      onNotify: activeOptions.onNotify,
    }),
  );
  scheduleBridge(container);
}

export function mount(container: HTMLElement, options: MountOptions) {
  unmount();
  activeContainer = container;
  activeOptions = options;
  ensureSession(options.kind, options.initialExperimentId);
  /* 入场（回教材后重新进入/首次打开）由外层视图过渡负责，这里即时显示 */
  setKind(options.kind, true);
}

/* 数字/模拟切换：
   - 滑块状态由 shell 立即同步，activeKind 同步立即锁定最后目标；
   - 内容过渡只改透明度：当前可见会话 80ms 淡出 → 目标就绪后切显隐 → 目标 120ms 淡入；
     visibleKind 独立跟踪实际显示面板，动画期间保持旧值，避免快速连点时 current 定位错位；
   - immediate（键盘/reduced-motion/首次显示）走即时路径，不播动画；
   - 快速连点以最后一次为准（switchSeq 取消过期回调）；
   - 过渡期间两面板均不可操作（.cw-switching），结束后仅目标可操作。 */
export function setKind(kind: CircuitKind, immediate = false) {
  if (!activeContainer || !activeOptions || activeKind === kind) return;
  const seq = ++switchSeq;
  clearPendingTimers();
  clearReadyWatchers();
  ensureSession(kind);
  const target = sessionContainers[kind];
  const prevVisible = visibleKind && visibleKind !== kind ? sessionContainers[visibleKind] ?? null : null;
  activeKind = kind;
  const reduce = prefersReducedMotion();

  const applyNow = () => {
    if (seq !== switchSeq) return;
    for (const sessionKind of ["digital", "analog"] as const) {
      const container = sessionContainers[sessionKind];
      if (!container) continue;
      container.hidden = sessionKind !== kind;
      if (sessionKind !== kind) container.style.opacity = "";
      container.classList.remove("cw-switching", "cw-switching-in");
    }
    target.hidden = false;
    target.classList.remove("cw-switching", "cw-switching-in");
    target.style.opacity = "";
    visibleKind = kind;
  };

  /* 无旧可见内容、目标即当前可见面板、或要求即时：直接落地 */
  if (!prevVisible || prevVisible.hidden || prevVisible === target || immediate || reduce) {
    applyNow();
    return;
  }

  /* 动画路径：淡出当前，等目标挂载就绪后切换，再淡入目标 */
  const current = prevVisible;
  current.classList.add("cw-switching");
  current.style.opacity = "0";
  const fadeStart = Date.now();

  const finishSwitch = () => {
    if (seq !== switchSeq) return;
    current.hidden = true;
    current.classList.remove("cw-switching");
    current.style.opacity = "";
    target.hidden = false;
    target.classList.add("cw-switching-in");
    target.style.opacity = "0";
    void target.offsetHeight; /* 强制回流：淡入过渡在元素显示后才启动 */
    target.style.opacity = "1";
    visibleKind = kind;
    later(() => {
      if (seq !== switchSeq) return;
      target.classList.remove("cw-switching", "cw-switching-in");
      target.style.opacity = "";
    }, FADE_IN_MS);
  };

  waitForSessionReady(
    target,
    () => {
      const wait = Math.max(0, FADE_OUT_MS - (Date.now() - fadeStart));
      later(() => { if (seq === switchSeq) finishSwitch(); }, wait);
    },
    () => {
      if (seq !== switchSeq) return;
      /* 加载失败：保留可用内容并反馈错误，不切换到空白面板 */
      current.classList.remove("cw-switching");
      current.style.opacity = "";
      activeKind = visibleKind ?? kind;
      activeOptions?.onNotify?.("工作台内容加载失败，已保留当前类型。", "error");
    },
  );
}

export function unmount() {
  /* 使一切进行中的切换/挂载观察/延迟回调失效，防止旧回调重显已离开的内容 */
  switchSeq += 1;
  clearPendingTimers();
  clearReadyWatchers();
  /* 先还原节点位置：React 按 fiber 父节点移除，移入 inspector 后直接 unmount 会 NotFoundError */
  for (const kind of ["digital", "analog"] as const) {
    const container = sessionContainers[kind];
    if (container) restoreInstruments(container);
    roots[kind]?.unmount();
    delete roots[kind];
    delete sessionContainers[kind];
  }
  activeContainer?.replaceChildren();
  activeContainer = null;
  activeOptions = null;
  activeKind = null;
  visibleKind = null;
}
