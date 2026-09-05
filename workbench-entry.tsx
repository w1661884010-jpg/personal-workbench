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
  /** 已显示类型变化（切换成功落地/失败回滚）时通知 shell，由其同步滑块/aria/activeWorkbench */
  onKindChange?: (kind: CircuitKind) => void;
}

const roots: Partial<Record<CircuitKind, Root>> = {};
const sessionContainers: Partial<Record<CircuitKind, HTMLElement>> = {};
let activeContainer: HTMLElement | null = null;
let activeOptions: MountOptions | null = null;
let activeKind: CircuitKind | null = null;   // 最近一次用户请求的目标（shell 滑块以此为准）
let visibleKind: CircuitKind | null = null;  // 实际显示中的面板（动画期间保持旧值）

/* 内容切换过渡时长（与原型 styles.css 保持一致）：淡出 80ms → 切换 → 淡入 120ms */
const FADE_OUT_MS = 80;
const FADE_IN_MS = 120;
const READY_POLL_MS = 40;
const READY_TIMEOUT_MS = 1500;

/* 任务生命周期分离：
   - layoutTimers：会话挂载/仪器面板桥接等布局任务，只能由 unmount 清理；
     切换（setKind）不得取消它们，否则首次挂载的桥接轮询会被误杀。
   - pendingTimers：切换动画编排，新切换到达时取消过期回调。 */
let switchSeq = 0;
let layoutTimers: Array<ReturnType<typeof setTimeout>> = [];
let pendingTimers: Array<ReturnType<typeof setTimeout>> = [];
let readyPollTimer: ReturnType<typeof setInterval> | null = null;
let readyTimeoutTimer: ReturnType<typeof setTimeout> | null = null;

function prefersReducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* 测试专用故障注入：仅当 URL 携带 cwReadyDelay / cwMountFail 时生效（行为测试用），
   正常使用无任何影响。cwReadyDelay=毫秒 表示挂载就绪后延迟上报（慢加载），
   cwMountFail=1 表示每次挂载都模拟失败，cwMountFail=once 表示仅第一次失败
   （失败后清除参数，供“失败回滚后再次点击可成功重试”验证）。 */
function testHookReadyDelay(): number {
  if (typeof location === "undefined") return 0;
  const raw = new URLSearchParams(location.search).get("cwReadyDelay");
  const value = raw ? Number(raw) : 0;
  return value > 0 ? value : 0;
}

function testHookMountFail(): boolean {
  if (typeof location === "undefined") return false;
  const params = new URLSearchParams(location.search);
  const mode = params.get("cwMountFail");
  if (!mode) return false;
  if (mode === "once") {
    params.delete("cwMountFail");
    history.replaceState(null, "", location.pathname + (params.size ? "?" + params.toString() : ""));
  }
  return true;
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

function scheduleLayout(fn: () => void, ms: number) {
  const timer = setTimeout(() => {
    layoutTimers = layoutTimers.filter((t) => t !== timer);
    fn();
  }, ms);
  layoutTimers.push(timer);
}

function scheduleSwitch(fn: () => void, ms: number) {
  const timer = setTimeout(() => {
    pendingTimers = pendingTimers.filter((t) => t !== timer);
    fn();
  }, ms);
  pendingTimers.push(timer);
}

function clearLayoutTimers() {
  for (const timer of layoutTimers) clearTimeout(timer);
  layoutTimers = [];
}

function clearPendingTimers() {
  for (const timer of pendingTimers) clearTimeout(timer);
  pendingTimers = [];
}

function emitKindChange(kind: CircuitKind) {
  activeOptions?.onKindChange?.(kind);
}

/* 挂载就绪判断：轮询目标会话容器，待 React 提交出 .circuit-workbench 再开始替换。
   超时或注入失败以失败回调结束，由调用方保留可用内容并反馈错误。 */
function waitForSessionReady(container: HTMLElement, onReady: () => void, onFail: () => void) {
  clearReadyWatchers();
  const delay = testHookReadyDelay();
  const deadline = Date.now() + READY_TIMEOUT_MS;
  readyPollTimer = setInterval(() => {
    if (testHookMountFail()) {
      clearReadyWatchers();
      onFail();
      return;
    }
    if (container.querySelector(".circuit-workbench")) {
      clearReadyWatchers();
      if (delay > 0) {
        /* 慢加载注入：就绪后延迟上报，期间旧内容保持可见 */
        readyTimeoutTimer = setTimeout(() => {
          readyTimeoutTimer = null;
          onReady();
        }, delay);
      } else {
        onReady();
      }
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

/* React createRoot.render 为异步提交：轮询挂载点，待 instruments 出现后桥接。
   这是布局任务，走 layoutTimers，切换不会取消它。
   桥接完成前给容器加 cw-bridging（仪器卡 visibility:hidden，避免瞬时排版错位）。 */
function scheduleBridge(container: HTMLElement, attempts = 0) {
  if (attempts > 20) {
    container.classList.remove("cw-bridging");
    return;
  }
  if (container.querySelector(`.${INSTRUMENTS_CLASS}`)) {
    moveInstrumentsIntoInspector(container);
    container.classList.remove("cw-bridging");
    return;
  }
  scheduleLayout(() => scheduleBridge(container, attempts + 1), 40);
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
  container.classList.add("cw-bridging");   /* 仪器桥接完成前隐藏原始位置的仪器卡 */
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
   - 内容过渡：先等目标挂载就绪（旧内容保持可见，不提前隐藏唯一可用内容），
     就绪后旧会话 80ms 淡出 → 切显隐 → 目标 120ms 淡入；
   - visibleKind 独立跟踪实际显示面板；switchSeq 取消过期回调（快速连点以最后一次为准）；
   - 过渡期间两面板均 inert（不可点击/聚焦/键盘触发），切换控件始终可响应；
   - immediate（键盘/reduced-motion/首次显示）走即时路径；失败保留旧内容并回滚 shell 状态。 */
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
      container.inert = sessionKind !== kind;
      if (sessionKind !== kind) container.style.opacity = "";
      container.classList.remove("cw-switching", "cw-switching-in");
    }
    target.hidden = false;
    target.inert = false;
    target.classList.remove("cw-switching", "cw-switching-in");
    target.style.opacity = "";
    visibleKind = kind;
    emitKindChange(kind);
  };

  /* 无旧可见内容、目标即当前可见面板、或要求即时：直接落地 */
  if (!prevVisible || prevVisible.hidden || prevVisible === target || immediate || reduce) {
    applyNow();
    return;
  }

  /* 动画路径：先等目标就绪（旧内容保持可见），就绪后淡出当前 → 切换 → 淡入目标 */
  const current = prevVisible;

  const startSwitch = () => {
    if (seq !== switchSeq) return;
    current.classList.add("cw-switching");
    current.inert = true;
    current.style.opacity = "0";
    scheduleSwitch(() => {
      if (seq !== switchSeq) return;
      current.hidden = true;
      current.classList.remove("cw-switching");
      current.style.opacity = "";
      target.hidden = false;
      target.classList.add("cw-switching-in");
      target.inert = true;
      target.style.opacity = "0";
      void target.offsetHeight; /* 强制回流：淡入过渡在元素显示后才启动 */
      target.style.opacity = "1";
      visibleKind = kind;
      emitKindChange(kind);
      scheduleSwitch(() => {
        if (seq !== switchSeq) return;
        target.classList.remove("cw-switching", "cw-switching-in");
        target.inert = false;
        target.style.opacity = "";
      }, FADE_IN_MS);
    }, FADE_OUT_MS);
  };

  waitForSessionReady(
    target,
    startSwitch,
    () => {
      if (seq !== switchSeq) return;
      /* 加载失败：旧内容从未被隐藏，保留并反馈错误；回滚 bundle 与 shell 状态，
         滑块/aria 回到已显示类型，再次点击可重试 */
      current.classList.remove("cw-switching");
      current.inert = false;
      current.style.opacity = "";
      activeKind = visibleKind ?? kind;
      if (activeKind !== kind) emitKindChange(activeKind);
      activeOptions?.onNotify?.("工作台内容加载失败，已保留当前类型。", "error");
    },
  );
}

export function unmount() {
  /* 使一切进行中的切换/挂载观察/延迟回调失效，防止旧回调重显已离开的内容；
     布局任务（含尚未完成的仪器桥接）一并清理 */
  switchSeq += 1;
  clearPendingTimers();
  clearReadyWatchers();
  clearLayoutTimers();
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
