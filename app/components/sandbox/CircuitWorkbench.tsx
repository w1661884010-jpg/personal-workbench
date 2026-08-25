"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import type { ChapterExperiment, CourseDefinition } from "../../lib/course-model";
import { simulateAnalogTransient, solveAnalogDc, type AnalogDcResult, type AnalogTransientResult } from "../../lib/circuit/analog-simulator";
import { clearCircuitLibrary, deleteCircuit, listCircuits, loadCircuit, saveCircuit } from "../../lib/circuit/circuit-storage";
import { evaluateDigitalCircuit, generateTruthTable, sampleDigitalCircuit, type DigitalRuntime, type DigitalSimulationResult, type DigitalTraceSample, type TruthTableRow } from "../../lib/circuit/digital-simulator";
import { findAvailablePosition, getComponentSize, getPortGeometry, separateOverlappingComponents } from "../../lib/circuit/geometry";
import { addComponent, buildNetlist, connect, copyCircuit, createCircuit, createComponent, disconnect, moveComponent, removeComponent, resetCircuit, transformComponent, updateComponentParameters } from "../../lib/circuit/graph";
import { componentPorts, terminalKey, type AnalogComponentKind, type CircuitComponent, type CircuitComponentKind, type CircuitDocument, type CircuitEndpoint, type CircuitKind, type DigitalComponentKind, type LogicValue } from "../../lib/circuit/types";
import "./workbench.css";

type NotifyTone = "success" | "warning" | "error";

export interface CircuitWorkbenchProps {
  kind: CircuitKind;
  initialExperimentId?: string;
  courses: readonly CourseDefinition[];
  onOpenChapter: (chapterId: string) => void;
  onNotify: (message: string, tone?: NotifyTone) => void;
}

interface ExperimentLocation {
  course: CourseDefinition;
  chapterId: string;
  chapterTitle: string;
  experiment: ChapterExperiment;
}

const digitalPalette: readonly { kind: DigitalComponentKind; label: string }[] = [
  { kind: "switch", label: "开关" }, { kind: "clock", label: "时钟" }, { kind: "not", label: "非门" },
  { kind: "and", label: "与门" }, { kind: "or", label: "或门" }, { kind: "xor", label: "异或门" },
  { kind: "nand", label: "与非门" }, { kind: "nor", label: "或非门" }, { kind: "dff", label: "D 触发器" },
  { kind: "jkff", label: "JK 触发器" }, { kind: "tff", label: "T 触发器" }, { kind: "counter", label: "计数器" },
  { kind: "decoder", label: "译码器" }, { kind: "led", label: "LED" }, { kind: "seven-segment", label: "数码管" },
];

const analogPalette: readonly { kind: AnalogComponentKind; label: string }[] = [
  { kind: "ground", label: "接地" }, { kind: "dc-source", label: "直流电源" }, { kind: "signal-source", label: "信号源" },
  { kind: "resistor", label: "电阻" }, { kind: "capacitor", label: "电容" }, { kind: "diode", label: "二极管" },
  { kind: "bjt", label: "三极管" }, { kind: "opamp", label: "运算放大器" }, { kind: "voltmeter", label: "电压表" },
  { kind: "ammeter", label: "电流表" },
];

const componentLabels = Object.fromEntries([...digitalPalette, ...analogPalette].map((item) => [item.kind, item.label])) as Record<CircuitComponentKind, string>;
const unsupportedAnalogKinds = new Set<CircuitComponentKind>(["diode", "bjt", "opamp"]);
const stableTimestamp = "2026-08-24T00:00:00.000Z";
const canvasWidth = 1200;
const canvasHeight = 720;
const minimumZoom = 0.5;
const maximumZoom = 2;
const zoomStep = 0.1;

function emptyCircuit(kind: CircuitKind): CircuitDocument {
  return createCircuit(kind, `draft-${kind}`, kind === "digital" ? "未命名数字电路" : "未命名模拟电路", stableTimestamp);
}

function freshId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(3);
  return value.toFixed(4).replace(/\.?0+$/, "");
}

function logicPath(samples: readonly DigitalTraceSample[], width = 600, height = 42) {
  if (!samples.length) return "";
  const end = samples.at(-1)?.timeSeconds || 1;
  const y = (value: LogicValue) => value === 1 ? 7 : value === 0 ? height - 7 : height / 2;
  let path = `M 0 ${y(samples[0].value)}`;
  for (let index = 1; index < samples.length; index += 1) {
    const x = (samples[index].timeSeconds / end) * width;
    path += ` H ${x.toFixed(2)} V ${y(samples[index].value)}`;
  }
  return path;
}

function ParameterEditor({ component, onChange }: { component: CircuitComponent; onChange: (name: string, value: string | number | boolean) => void }) {
  const numeric = (name: string, label: string, min?: number, step = "any") => (
    <label>{label}<input type="number" min={min} step={step} value={Number(component.parameters[name] ?? 0)} onChange={(event) => onChange(name, Number(event.target.value))} /></label>
  );
  return (
    <div className="cw-parameter-editor">
      <label>标注<input value={component.label ?? ""} onChange={(event) => onChange("__label", event.target.value)} placeholder={componentLabels[component.kind]} /></label>
      {component.kind === "switch" ? <label className="cw-switch-control"><span>输出电平</span><button type="button" className={component.parameters.state ? "is-high" : ""} onClick={() => onChange("state", !component.parameters.state)}>{component.parameters.state ? "高电平 1" : "低电平 0"}</button></label> : null}
      {component.kind === "clock" ? numeric("frequencyHz", "时钟频率 / Hz", 0.001) : null}
      {component.kind === "counter" ? numeric("width", "计数位宽", 1, "1") : null}
      {component.kind === "resistor" ? numeric("resistanceOhms", "电阻 / Ω", 0.000001) : null}
      {component.kind === "capacitor" ? <>{numeric("capacitanceFarads", "电容 / F", 1e-15)}{numeric("initialVoltage", "初始电压 / V")}</> : null}
      {component.kind === "dc-source" ? numeric("voltage", "电压 / V") : null}
      {component.kind === "signal-source" ? <><label>波形<select value={String(component.parameters.waveform ?? "sine")} onChange={(event) => onChange("waveform", event.target.value)}><option value="sine">正弦</option><option value="square">方波</option><option value="dc">直流偏置</option></select></label>{numeric("amplitude", "幅值 / V")}{numeric("frequencyHz", "频率 / Hz", 0)}{numeric("offset", "偏置 / V")}</> : null}
      {unsupportedAnalogKinds.has(component.kind) ? <p className="cw-unsupported"><strong>当前不可求解</strong>：该元件可放置、连线和保存，但 V1 没有可验证的非线性模型。运行时不会生成替代波形。</p> : null}
    </div>
  );
}

function CircuitWorkbenchSession({ kind, initialExperimentId, courses, onOpenChapter, onNotify }: CircuitWorkbenchProps) {
  const [circuit, setCircuit] = useState<CircuitDocument>(() => emptyCircuit(kind));
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [pendingEndpoint, setPendingEndpoint] = useState<CircuitEndpoint | null>(null);
  const [interactionMode, setInteractionMode] = useState<"connect" | "probe">("connect");
  const [probeTerminals, setProbeTerminals] = useState<string[]>([]);
  const [savedCircuits, setSavedCircuits] = useState<CircuitDocument[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState("");
  const [running, setRunning] = useState(false);
  const [digitalResult, setDigitalResult] = useState<DigitalSimulationResult | null>(null);
  const [truthTable, setTruthTable] = useState<TruthTableRow[]>([]);
  const [digitalTraces, setDigitalTraces] = useState<Record<string, DigitalTraceSample[]>>({});
  const [dcResult, setDcResult] = useState<AnalogDcResult | null>(null);
  const [transientResult, setTransientResult] = useState<AnalogTransientResult | null>(null);
  const [transientCursor, setTransientCursor] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(1);
  const [timeStepSeconds, setTimeStepSeconds] = useState(0.01);
  const [selectedExperimentId, setSelectedExperimentId] = useState(initialExperimentId ?? "");
  const [dragging, setDragging] = useState<{ componentId: string; offsetX: number; offsetY: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const circuitRef = useRef(circuit);
  const digitalRuntimeRef = useRef<DigitalRuntime | undefined>(undefined);
  const digitalTimeRef = useRef(0);

  const experiments = useMemo<ExperimentLocation[]>(() => courses.flatMap((course) => course.chapters.flatMap((chapter) => chapter.experiments
    .filter((experiment) => experiment.workbench === kind)
    .map((experiment) => ({ course, chapterId: chapter.id, chapterTitle: chapter.title, experiment })))), [courses, kind]);
  const selectedExperiment = experiments.find((item) => item.experiment.id === selectedExperimentId) ?? experiments[0] ?? null;
  const palette = kind === "digital" ? digitalPalette : analogPalette;
  const selectedComponent = selectedComponentId ? circuit.components[selectedComponentId] ?? null : null;
  const connectedTerminals = useMemo(() => {
    const terminals = new Set<string>();
    for (const connection of Object.values(circuit.connections)) {
      terminals.add(terminalKey(connection.from.componentId, connection.from.portId));
      terminals.add(terminalKey(connection.to.componentId, connection.to.portId));
    }
    return terminals;
  }, [circuit.connections]);
  const viewBox = useMemo(() => {
    const width = canvasWidth / zoom;
    const height = canvasHeight / zoom;
    return { x: (canvasWidth - width) / 2, y: (canvasHeight - height) / 2, width, height };
  }, [zoom]);
  const netlist = useMemo(() => buildNetlist(circuit), [circuit]);
  const analogTraceNets = useMemo(() => {
    const selected = probeTerminals.map((terminal) => netlist.terminalToNet[terminal]).filter(Boolean);
    return [...new Set(selected.length ? selected : Object.keys(netlist.nets).slice(0, 3))];
  }, [netlist, probeTerminals]);

  const refreshSaved = useCallback(() => {
    try {
      const next = listCircuits().filter((item) => item.kind === kind);
      setSavedCircuits(next);
      setSelectedSavedId((current) => next.some((item) => item.id === current) ? current : next[0]?.id ?? "");
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "无法读取本地电路。", "error");
    }
  }, [kind, onNotify]);

  useEffect(() => {
    const timer = globalThis.setTimeout(refreshSaved, 0);
    return () => globalThis.clearTimeout(timer);
  }, [refreshSaved]);

  useEffect(() => { circuitRef.current = circuit; }, [circuit]);

  useEffect(() => {
    if (kind !== "digital") return;
    try {
      const result = evaluateDigitalCircuit(circuit, { runtime: digitalRuntimeRef.current, timeSeconds: digitalTimeRef.current });
      digitalRuntimeRef.current = result.runtime;
      setDigitalResult(result);
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "数字电路求值失败。", "error");
    }
  }, [circuit, kind, onNotify]);

  useEffect(() => {
    if (!running || kind !== "digital") return;
    const timer = globalThis.setInterval(() => {
      digitalTimeRef.current += 0.05;
      const result = evaluateDigitalCircuit(circuitRef.current, { runtime: digitalRuntimeRef.current, timeSeconds: digitalTimeRef.current });
      digitalRuntimeRef.current = result.runtime;
      setDigitalResult(result);
      setDigitalTraces((current) => {
        const next = { ...current };
        for (const terminal of probeTerminals) next[terminal] = [...(next[terminal] ?? []), { timeSeconds: digitalTimeRef.current, value: result.terminalValues[terminal] ?? "X" }].slice(-240);
        return next;
      });
    }, 50);
    return () => globalThis.clearInterval(timer);
  }, [kind, probeTerminals, running]);

  useEffect(() => {
    if (!running || kind !== "analog" || !transientResult?.ok) return;
    const timer = globalThis.setInterval(() => setTransientCursor((current) => {
      const next = current + Math.max(1, Math.ceil(transientResult.samples.length / 250));
      if (next >= transientResult.samples.length) {
        setRunning(false);
        return transientResult.samples.length;
      }
      return next;
    }), 40);
    return () => globalThis.clearInterval(timer);
  }, [kind, running, transientResult]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if ((event.key !== "Delete" && event.key !== "Backspace") || !selectedComponentId || target?.matches("input,textarea,select")) return;
      event.preventDefault();
      setCircuit((current) => removeComponent(current, selectedComponentId));
      setProbeTerminals((current) => current.filter((terminal) => !terminal.startsWith(`${selectedComponentId}.`)));
      setPendingEndpoint((current) => current?.componentId === selectedComponentId ? null : current);
      setSelectedComponentId(null);
    };
    globalThis.addEventListener("keydown", handleKey);
    return () => globalThis.removeEventListener("keydown", handleKey);
  }, [selectedComponentId]);

  function canvasPoint(clientX: number, clientY: number) {
    const bounds = svgRef.current?.getBoundingClientRect();
    if (!bounds) return { x: 120, y: 100 };
    return {
      x: viewBox.x + ((clientX - bounds.left) / bounds.width) * viewBox.width,
      y: viewBox.y + ((clientY - bounds.top) / bounds.height) * viewBox.height,
    };
  }

  function placeComponent(componentKind: CircuitComponentKind, point?: { x: number; y: number }) {
    const count = Object.keys(circuit.components).length;
    const desiredPosition = point ?? { x: 120 + (count % 6) * 170, y: 100 + Math.floor(count / 6) * 120 };
    try {
      const component = createComponent(freshId(componentKind), componentKind, desiredPosition, {}, componentLabels[componentKind]);
      setCircuit((current) => addComponent(current, { ...component, position: findAvailablePosition(current, component, desiredPosition) }));
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "无法放置元件。", "error");
    }
  }

  function handlePort(endpoint: CircuitEndpoint) {
    const key = terminalKey(endpoint.componentId, endpoint.portId);
    if (interactionMode === "probe") {
      setProbeTerminals((current) => current.includes(key) ? current.filter((terminal) => terminal !== key) : [...current, key]);
      return;
    }
    if (!pendingEndpoint) {
      setPendingEndpoint(endpoint);
      return;
    }
    if (terminalKey(pendingEndpoint.componentId, pendingEndpoint.portId) === key) {
      setPendingEndpoint(null);
      return;
    }
    try {
      setCircuit((current) => connect(current, { id: freshId("wire"), from: pendingEndpoint, to: endpoint }));
      onNotify(`已连接 ${pendingEndpoint.componentId}.${pendingEndpoint.portId} → ${endpoint.componentId}.${endpoint.portId}。`);
      setPendingEndpoint(null);
    } catch (error) {
      onNotify(error instanceof Error ? error.message : "连线失败。", "error");
    }
  }

  function startDrag(event: ReactPointerEvent<SVGGElement>, component: CircuitComponent) {
    if ((event.target as Element).closest("[data-port]")) return;
    const point = canvasPoint(event.clientX, event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging({ componentId: component.id, offsetX: point.x - component.position.x, offsetY: point.y - component.position.y });
  }

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    const point = canvasPoint(event.clientX, event.clientY);
    const desired = { x: point.x - dragging.offsetX, y: point.y - dragging.offsetY };
    setCircuit((current) => {
      const component = current.components[dragging.componentId];
      if (!component) return current;
      return moveComponent(current, dragging.componentId, findAvailablePosition(current, component, desired));
    });
  }

  function rotateSelected() {
    if (!selectedComponentId) return;
    setCircuit((current) => {
      const component = current.components[selectedComponentId];
      if (!component) return current;
      const rotation = (((component.rotation ?? 0) + 90) % 360) as 0 | 90 | 180 | 270;
      const transformed = transformComponent(current, component.id, { rotation });
      const nextComponent = transformed.components[component.id];
      return moveComponent(transformed, component.id, findAvailablePosition(transformed, nextComponent, nextComponent.position));
    });
  }

  function flipSelected() {
    if (!selectedComponentId) return;
    setCircuit((current) => {
      const component = current.components[selectedComponentId];
      if (!component) return current;
      const transformed = transformComponent(current, component.id, { flipped: !(component.flipped ?? false) });
      const nextComponent = transformed.components[component.id];
      return moveComponent(transformed, component.id, findAvailablePosition(transformed, nextComponent, nextComponent.position));
    });
  }

  function changeZoom(delta: number) {
    setZoom((current) => Math.max(minimumZoom, Math.min(maximumZoom, Number((current + delta).toFixed(2)))));
  }

  function handleCanvasWheel(event: ReactWheelEvent<SVGSVGElement>) {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    changeZoom(event.deltaY > 0 ? -zoomStep : zoomStep);
  }

  function updateSelected(name: string, value: string | number | boolean) {
    if (!selectedComponent) return;
    if (name === "__label") {
      setCircuit((current) => ({ ...current, components: { ...current.components, [selectedComponent.id]: { ...current.components[selectedComponent.id], label: String(value) } }, updatedAt: new Date().toISOString() }));
    } else setCircuit((current) => updateComponentParameters(current, selectedComponent.id, { [name]: value }));
  }

  function saveCurrent() {
    try {
      saveCircuit(circuit);
      refreshSaved();
      setSelectedSavedId(circuit.id);
      onNotify("电路已保存到当前浏览器。");
    } catch (error) { onNotify(error instanceof Error ? error.message : "保存失败。", "error"); }
  }

  function loadSelected() {
    try {
      const loaded = loadCircuit(selectedSavedId);
      if (!loaded || loaded.kind !== kind) throw new Error("没有找到可载入的同类电路。");
      setCircuit(separateOverlappingComponents(loaded));
      setSelectedComponentId(null);
      setProbeTerminals([]);
      resetSimulation();
      onNotify(`已载入“${loaded.name}”。`);
    } catch (error) { onNotify(error instanceof Error ? error.message : "载入失败。", "error"); }
  }

  function duplicateCurrent() {
    try {
      const copy = copyCircuit(circuit, freshId(kind), `${circuit.name} 副本`);
      saveCircuit(copy);
      setCircuit(copy);
      refreshSaved();
      setSelectedSavedId(copy.id);
      onNotify("已复制并保存为新电路。");
    } catch (error) { onNotify(error instanceof Error ? error.message : "复制失败。", "error"); }
  }

  function removeSaved() {
    if (!selectedSavedId || !(globalThis.confirm?.("确定删除所选本地电路？此操作无法撤销。") ?? false)) return;
    try { deleteCircuit(selectedSavedId); refreshSaved(); onNotify("本地电路已删除。", "warning"); }
    catch (error) { onNotify(error instanceof Error ? error.message : "删除失败。", "error"); }
  }

  function clearCanvas() {
    if (Object.keys(circuit.components).length && !(globalThis.confirm?.("确定清空当前画布？已保存的电路不受影响。") ?? false)) return;
    setCircuit((current) => resetCircuit(current));
    setSelectedComponentId(null);
    setPendingEndpoint(null);
    setProbeTerminals([]);
    resetSimulation();
    onNotify("画布已清空。", "warning");
  }

  function resetSimulation() {
    setRunning(false);
    digitalRuntimeRef.current = undefined;
    digitalTimeRef.current = 0;
    setDigitalTraces({});
    setTruthTable([]);
    setDcResult(null);
    setTransientResult(null);
    setTransientCursor(0);
    if (kind === "digital") setDigitalResult(evaluateDigitalCircuit(circuitRef.current));
  }

  function runTruthTable() {
    try { setTruthTable(generateTruthTable(circuit)); onNotify("真值表已由当前连线逐行求值得出。"); }
    catch (error) { onNotify(error instanceof Error ? error.message : "无法生成真值表。", "error"); }
  }

  function offlineDigitalSample() {
    try {
      const sampled = sampleDigitalCircuit(circuit, { durationSeconds: 2, sampleRateHz: 20, terminals: probeTerminals });
      setDigitalTraces(sampled.traces);
      onNotify("逻辑分析仪已按当前时钟和连线采样 2 秒。");
    } catch (error) { onNotify(error instanceof Error ? error.message : "逻辑采样失败。", "error"); }
  }

  function runDc() {
    setRunning(false);
    setTransientResult(null);
    setTransientCursor(0);
    const result = solveAnalogDc(circuit);
    setDcResult(result);
    if (!result.ok) onNotify(result.diagnostics[0]?.message ?? "DC 求解失败。", "error");
    else onNotify("DC MNA 求解完成。所有读数来自当前电路矩阵。");
  }

  function startTransient() {
    try {
      setRunning(false);
      setDcResult(null);
      setTransientResult(null);
      setTransientCursor(0);
      const result = simulateAnalogTransient(circuit, { durationSeconds, timeStepSeconds });
      setTransientResult(result);
      setTransientCursor(result.ok ? 1 : 0);
      setRunning(result.ok);
      if (!result.ok) onNotify(result.diagnostics[0]?.message ?? "瞬态求解失败。", "error");
      else onNotify("瞬态波形已由后向欧拉 MNA 计算；正在播放求解样本。");
    } catch (error) {
      setRunning(false);
      setTransientResult(null);
      setTransientCursor(0);
      onNotify(error instanceof Error ? error.message : "瞬态求解失败。", "error");
    }
  }

  const diagnosticItems = kind === "digital" ? digitalResult?.diagnostics ?? [] : [...(dcResult?.diagnostics ?? []), ...(transientResult?.diagnostics ?? [])];
  const analogWaveSamples = useMemo(() => {
    if (!transientResult?.ok) return [];
    const visible = transientResult.samples.slice(0, transientCursor);
    const stride = Math.max(1, Math.ceil(visible.length / 1200));
    return visible.filter((_, index) => index % stride === 0 || index === visible.length - 1);
  }, [transientCursor, transientResult]);
  let analogMin = Number.POSITIVE_INFINITY;
  let analogMax = Number.NEGATIVE_INFINITY;
  for (const sample of analogWaveSamples) {
    for (const netId of analogTraceNets) {
      const value = sample.nodeVoltages[netId];
      if (Number.isFinite(value)) { analogMin = Math.min(analogMin, value); analogMax = Math.max(analogMax, value); }
    }
  }
  if (!Number.isFinite(analogMin)) analogMin = 0;
  if (!Number.isFinite(analogMax)) analogMax = 1;
  const analogRange = analogMax - analogMin || 1;

  return (
    <div className={`circuit-workbench cw-${kind}`}>
      <header className="cw-heading">
        <div><span className="cw-eyebrow">{kind === "digital" ? "DIGITAL LOGIC WORKBENCH" : "ANALOG MNA WORKBENCH"}</span><h1>{kind === "digital" ? "数字电路工作台" : "模拟电路工作台"}</h1><p>{kind === "digital" ? "0 / 1 / X 离散逻辑求值；支持组合与时序电路。" : "线性 DC MNA 与 RC 瞬态；不支持的非线性模型会停止求解。"}</p></div>
        <div className="cw-run-controls">
          {kind === "digital" ? <button type="button" className="cw-primary" onClick={() => setRunning((value) => !value)}>{running ? "暂停" : "启动"}</button> : <><button type="button" onClick={runDc}>求解 DC</button><button type="button" className="cw-primary" onClick={running ? () => setRunning(false) : startTransient}>{running ? "暂停" : "启动瞬态"}</button></>}
          <button type="button" onClick={resetSimulation}>重置仿真</button>
        </div>
      </header>

      <section className="cw-experiment-strip">
        <label>实验目标<select value={selectedExperiment?.experiment.id ?? ""} onChange={(event) => setSelectedExperimentId(event.target.value)}>{experiments.map((item) => <option key={item.experiment.id} value={item.experiment.id}>{item.course.shortTitle} · {item.chapterTitle} · {item.experiment.title}</option>)}</select></label>
        {selectedExperiment ? <div><strong>{selectedExperiment.experiment.goal}</strong><span>预期：{selectedExperiment.experiment.expected}</span><details><summary>查看实验步骤</summary><ol>{selectedExperiment.experiment.steps.map((step) => <li key={step}>{step}</li>)}</ol></details>{selectedExperiment.experiment.limitation ? <em>边界：{selectedExperiment.experiment.limitation}</em> : null}</div> : <p>当前课程资料中没有匹配的工作台实验；仍可从空白画布自由搭建。</p>}
        {selectedExperiment ? <button type="button" onClick={() => onOpenChapter(selectedExperiment.chapterId)}>返回教材章节</button> : null}
      </section>

      <div className="cw-storage-bar">
        <label className="cw-name-field">电路名称<input value={circuit.name} onChange={(event) => setCircuit((current) => ({ ...current, name: event.target.value, updatedAt: new Date().toISOString() }))} /></label>
        <button type="button" onClick={saveCurrent}>保存电路</button><button type="button" onClick={duplicateCurrent}>复制电路</button>
        <select aria-label="本地电路" value={selectedSavedId} onChange={(event) => setSelectedSavedId(event.target.value)}><option value="">选择本地电路</option>{savedCircuits.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <button type="button" disabled={!selectedSavedId} onClick={loadSelected}>载入</button><button type="button" disabled={!selectedSavedId} onClick={removeSaved}>删除</button>
        <button type="button" className="cw-danger" onClick={clearCanvas}>清空画布</button>
        <button type="button" className="cw-text-button" onClick={() => { if (!(globalThis.confirm?.("确定删除当前浏览器中的全部本地电路？") ?? false)) return; try { clearCircuitLibrary(); refreshSaved(); onNotify("全部本地电路已删除。", "warning"); } catch (error) { onNotify(error instanceof Error ? error.message : "无法删除本地电路。", "error"); } }}>删除全部存档</button>
      </div>

      <div className="cw-main-grid">
        <aside className="cw-palette">
          <div className="cw-panel-title"><h2>元件</h2><span>{palette.length}</span></div>
          <p>点击放置，或拖到画布。</p>
          <div className="cw-palette-list">{palette.map((item) => <button type="button" draggable key={item.kind} onClick={() => placeComponent(item.kind)} onDragStart={(event) => event.dataTransfer.setData("application/x-circuit-component", item.kind)}><span>{item.kind.toUpperCase()}</span>{item.label}</button>)}</div>
        </aside>

        <section className="cw-canvas-panel">
          <div className="cw-canvas-toolbar">
            <div role="group" aria-label="画布工具"><button type="button" className={interactionMode === "connect" ? "is-active" : ""} onClick={() => { setInteractionMode("connect"); setPendingEndpoint(null); }}>连线模式</button><button type="button" className={interactionMode === "probe" ? "is-active" : ""} onClick={() => { setInteractionMode("probe"); setPendingEndpoint(null); }}>探针模式</button></div>
            <div className="cw-transform-controls" role="group" aria-label="元件方向"><button type="button" disabled={!selectedComponentId} onClick={rotateSelected}>旋转 90°</button><button type="button" disabled={!selectedComponentId} onClick={flipSelected}>水平翻转</button></div>
            <span>{pendingEndpoint ? `选择第二端点：${pendingEndpoint.componentId}.${pendingEndpoint.portId}` : interactionMode === "probe" ? `已选 ${probeTerminals.length} 个探针` : `${Object.keys(circuit.connections).length} 条连线 · 点击两个端口连线；双击连线删除`}</span>
            <div className="cw-zoom-controls" role="group" aria-label="画布缩放"><button type="button" aria-label="缩小" disabled={zoom <= minimumZoom} onClick={() => changeZoom(-zoomStep)}>−</button><button type="button" aria-label="重置缩放" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button><button type="button" aria-label="放大" disabled={zoom >= maximumZoom} onClick={() => changeZoom(zoomStep)}>＋</button></div>
            <button type="button" disabled={!selectedComponentId} onClick={() => { if (selectedComponentId) { setCircuit((current) => removeComponent(current, selectedComponentId)); setProbeTerminals((current) => current.filter((terminal) => !terminal.startsWith(`${selectedComponentId}.`))); setPendingEndpoint((current) => current?.componentId === selectedComponentId ? null : current); setSelectedComponentId(null); } }}>删除所选</button>
          </div>
          <p className="cw-canvas-help">双击元件保持选中；拖动会自动避开其他元件。使用缩放按钮，或按住 Ctrl/⌘ 滚动。</p>
          <svg ref={svgRef} className="cw-canvas" viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} role="application" aria-label="可自由搭建的电路画布" onWheel={handleCanvasWheel} onPointerMove={handlePointerMove} onPointerUp={() => setDragging(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event: DragEvent<SVGSVGElement>) => { event.preventDefault(); const componentKind = event.dataTransfer.getData("application/x-circuit-component") as CircuitComponentKind; if (componentLabels[componentKind]) placeComponent(componentKind, canvasPoint(event.clientX, event.clientY)); }} onClick={(event) => { if (event.target === event.currentTarget) setSelectedComponentId(null); }}>
            <defs><pattern id={`cw-grid-${kind}`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" className="cw-grid-line" /></pattern></defs>
            <rect width={canvasWidth} height={canvasHeight} fill={`url(#cw-grid-${kind})`} onClick={() => setSelectedComponentId(null)} />
            {Object.values(circuit.connections).map((connection) => {
              const from = circuit.components[connection.from.componentId]; const to = circuit.components[connection.to.componentId];
              if (!from || !to) return null;
              const a = getPortGeometry(from, connection.from.portId).point; const b = getPortGeometry(to, connection.to.portId).point;
              const middleX = (a.x + b.x) / 2;
              return <path className="cw-wire" d={`M ${a.x} ${a.y} C ${middleX} ${a.y}, ${middleX} ${b.y}, ${b.x} ${b.y}`} key={connection.id} onDoubleClick={() => setCircuit((current) => disconnect(current, connection.id))}><title>双击删除连线</title></path>;
            })}
            {Object.values(circuit.components).map((component) => {
              const { width, height } = getComponentSize(component);
              const orientation = `${component.rotation ?? 0}°${component.flipped ? " · 镜像" : ""}`;
              return <g key={component.id} data-component-id={component.id} data-rotation={component.rotation ?? 0} className={selectedComponentId === component.id ? "cw-component is-selected" : "cw-component"} role="button" tabIndex={0} aria-pressed={selectedComponentId === component.id} aria-label={`${component.label || component.kind} 元件，双击选中${selectedComponentId === component.id ? "，已选中" : ""}`} onPointerDown={(event) => startDrag(event, component)} onDoubleClick={(event) => { event.stopPropagation(); setSelectedComponentId(component.id); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedComponentId(component.id); } }}>
                <rect x={component.position.x - width / 2} y={component.position.y - height / 2} width={width} height={height} rx="8" />
                <text className="cw-component-kind" x={component.position.x} y={component.position.y - 5} textAnchor="middle">{component.kind.toUpperCase()}</text>
                <text className="cw-component-label" x={component.position.x} y={component.position.y + 15} textAnchor="middle">{component.label || componentLabels[component.kind]}</text>
                {(component.rotation ?? 0) !== 0 || component.flipped ? <text className="cw-component-orientation" x={component.position.x + width / 2 - 7} y={component.position.y - height / 2 + 12} textAnchor="end">{orientation}</text> : null}
                {unsupportedAnalogKinds.has(component.kind) ? <text className="cw-component-warning" x={component.position.x} y={component.position.y + 32} textAnchor="middle">UNSUPPORTED</text> : null}
                {componentPorts[component.kind].map((port) => {
                  const geometry = getPortGeometry(component, port.id); const key = terminalKey(component.id, port.id); const active = probeTerminals.includes(key) || (pendingEndpoint && terminalKey(pendingEndpoint.componentId, pendingEndpoint.portId) === key); const connected = connectedTerminals.has(key);
                  const labelX = geometry.point.x - geometry.normal.x * 12; const labelY = geometry.point.y - geometry.normal.y * 12 + (geometry.normal.y === 0 ? 4 : geometry.normal.y > 0 ? -2 : 10); const textAnchor = geometry.normal.x > 0 ? "end" : geometry.normal.x < 0 ? "start" : "middle";
                  return <g data-port="true" className={`cw-port${connected ? " is-connected" : ""}${active ? " is-active" : ""}`} key={port.id} role="button" tabIndex={0} aria-label={`${component.label || component.kind} ${port.id} 端口${connected ? "，已连接" : ""}`} onClick={(event) => { event.stopPropagation(); handlePort({ componentId: component.id, portId: port.id }); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); handlePort({ componentId: component.id, portId: port.id }); } }}>
                    {connected ? <circle className="cw-port-status-ring" cx={geometry.point.x} cy={geometry.point.y} r="11" /> : null}
                    <circle cx={geometry.point.x} cy={geometry.point.y} r="7" /><text x={labelX} y={labelY} textAnchor={textAnchor}>{port.id}</text>
                  </g>;
                })}
              </g>;
            })}
            {!Object.keys(circuit.components).length ? <text className="cw-empty-canvas" x="600" y="350" textAnchor="middle">从左侧点击元件，或拖到这里开始搭建</text> : null}
          </svg>
        </section>

        <aside className="cw-inspector">
          <div className="cw-panel-title"><h2>参数与状态</h2><span>{selectedComponent ? componentLabels[selectedComponent.kind] : "未选择"}</span></div>
          {selectedComponent ? <ParameterEditor component={selectedComponent} onChange={updateSelected} /> : <p className="cw-panel-empty">选择画布上的元件后，可修改电平、频率或器件参数。</p>}
          <div className="cw-probe-list"><h3>探针</h3>{probeTerminals.length ? probeTerminals.map((terminal) => <button type="button" key={terminal} onClick={() => setProbeTerminals((current) => current.filter((item) => item !== terminal))}>{terminal}<span>×</span></button>) : <p>切换到探针模式，再点击端口。</p>}</div>
          {diagnosticItems.length ? <div className="cw-diagnostics"><h3>诊断</h3>{diagnosticItems.map((item, index) => <p className={item.severity === "error" ? "is-error" : ""} key={`${item.code}-${index}`}><strong>{item.code}</strong>{item.message}</p>)}</div> : <div className="cw-ok-state">当前没有求解诊断。</div>}
        </aside>
      </div>

      {kind === "digital" ? <section className="cw-instruments">
        <div className="cw-instrument-head"><div><h2>逻辑探针与分析仪</h2><p>结果来自当前图结构的离散事件求值。</p></div><button type="button" onClick={runTruthTable}>生成真值表</button><button type="button" disabled={!probeTerminals.length} onClick={offlineDigitalSample}>采样 2 秒</button></div>
        <div className="cw-live-values">{digitalResult ? Object.entries(digitalResult.indicators).map(([id, value]) => <span key={id}><strong>{id}</strong>{value}</span>) : <p>放置 LED 或数码管后显示逻辑结果。</p>}</div>
        <div className="cw-logic-traces">{Object.entries(digitalTraces).map(([terminal, samples]) => <div key={terminal}><code>{terminal}</code><svg viewBox="0 0 600 42" preserveAspectRatio="none" aria-label={`${terminal} 逻辑波形`}><path d={logicPath(samples)} /></svg><span>{samples.at(-1)?.value ?? "X"}</span></div>)}</div>
        {truthTable.length ? <div className="cw-table-wrap"><table><thead><tr>{Object.keys(truthTable[0].inputs).map((key) => <th key={key}>{key}</th>)}{Object.keys(truthTable[0].outputs).map((key) => <th key={key}>{key}</th>)}</tr></thead><tbody>{truthTable.map((row, index) => <tr key={index}>{Object.values(row.inputs).map((value, cell) => <td key={`i-${cell}`}>{value}</td>)}{Object.values(row.outputs).map((value, cell) => <td key={`o-${cell}`}>{value}</td>)}</tr>)}</tbody></table></div> : null}
      </section> : <section className="cw-instruments">
        <div className="cw-instrument-head"><div><h2>表计与示波器</h2><p>DC 使用线性 MNA；瞬态使用固定步长后向欧拉。</p></div><label>时长 / s<input type="number" min="0.001" step="0.1" value={durationSeconds} onChange={(event) => setDurationSeconds(Number(event.target.value))} /></label><label>步长 / s<input type="number" min="0.000001" step="0.001" value={timeStepSeconds} onChange={(event) => setTimeStepSeconds(Number(event.target.value))} /></label></div>
        {dcResult?.ok ? <div className="cw-meter-grid">{Object.entries(dcResult.meterReadings).map(([id, value]) => <div key={id}><span>{circuit.components[id]?.kind === "ammeter" ? "电流表" : "电压表"} · {id}</span><strong>{formatNumber(value)} {circuit.components[id]?.kind === "ammeter" ? "A" : "V"}</strong></div>)}{Object.entries(dcResult.componentCurrents).filter(([id]) => circuit.components[id]?.kind === "resistor").map(([id, value]) => <div key={id}><span>支路电流 · {id}</span><strong>{formatNumber(value)} A</strong></div>)}</div> : null}
        {transientResult?.ok && analogWaveSamples.length ? <div className="cw-analog-scope"><div className="cw-scope-scale"><span>{formatNumber(analogMax)} V</span><span>{formatNumber(analogMin)} V</span></div><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label="由 MNA 求解得到的节点波形"><path className="cw-scope-grid" d="M0 45H600M0 90H600M0 135H600M150 0V180M300 0V180M450 0V180" />{analogTraceNets.map((netId, traceIndex) => { const points = analogWaveSamples.map((sample) => `${(sample.timeSeconds / durationSeconds) * 600},${170 - (((sample.nodeVoltages[netId] ?? 0) - analogMin) / analogRange) * 160}`).join(" "); return <polyline key={netId} className={`cw-trace trace-${traceIndex % 3}`} points={points} />; })}</svg><div className="cw-scope-legend">{analogTraceNets.map((netId, index) => <span key={netId} className={`trace-${index % 3}`}>{netId}</span>)}</div></div> : <p className="cw-scope-empty">添加电源、接地、R/C 和探针后启动瞬态，波形只显示真实求解样本。</p>}
        {[...(dcResult?.warnings ?? []), ...(transientResult?.warnings ?? [])].map((warning) => <p className="cw-model-warning" key={warning}>{warning}</p>)}
      </section>}
    </div>
  );
}

export function CircuitWorkbench(props: CircuitWorkbenchProps) {
  return <CircuitWorkbenchSession key={`${props.kind}:${props.initialExperimentId ?? "blank"}`} {...props} />;
}
