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
  setTimeout(() => scheduleBridge(container, attempts + 1), 40);
}

function ensureSession(kind: CircuitKind, initialExperimentId?: string) {
  if (!activeContainer || !activeOptions || roots[kind]) return;
  const container = document.createElement("div");
  container.className = "prototype-workbench-session";
  container.dataset.kind = kind;
  container.hidden = true;
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
  setKind(options.kind);
}

export function setKind(kind: CircuitKind) {
  if (!activeContainer || !activeOptions || activeKind === kind) return;
  ensureSession(kind);
  for (const sessionKind of ["digital", "analog"] as const) {
    const container = sessionContainers[sessionKind];
    if (container) container.hidden = sessionKind !== kind;
  }
  activeKind = kind;
}

export function unmount() {
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
}
