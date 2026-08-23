import { buildNetlist } from "./graph";
import {
  componentPorts,
  terminalKey,
  type CircuitDiagnostic,
  type CircuitDocument,
  type DigitalComponentKind,
  type LogicValue,
} from "./types";

export interface DigitalMemoryState {
  q?: LogicValue;
  count?: number;
}

export interface DigitalRuntime {
  timeSeconds: number;
  memory: Record<string, DigitalMemoryState>;
  previousClocks: Record<string, LogicValue>;
}

export interface DigitalSimulationResult {
  terminalValues: Record<string, LogicValue>;
  outputValues: Record<string, LogicValue>;
  indicators: Record<string, string>;
  diagnostics: CircuitDiagnostic[];
  runtime: DigitalRuntime;
}

export interface TruthTableRow {
  inputs: Record<string, LogicValue>;
  outputs: Record<string, LogicValue>;
}

export interface DigitalTraceSample {
  timeSeconds: number;
  value: LogicValue;
}

export interface DigitalSampleResult {
  traces: Record<string, DigitalTraceSample[]>;
  diagnostics: CircuitDiagnostic[];
  runtime: DigitalRuntime;
}

const combinationalKinds = new Set<DigitalComponentKind>(["not", "and", "or", "xor", "nand", "nor", "decoder"]);
const sequentialKinds = new Set<DigitalComponentKind>(["dff", "jkff", "tff", "counter"]);

function asLogic(value: unknown, fallback: LogicValue = "X"): LogicValue {
  if (value === 0 || value === false || value === "0") return 0;
  if (value === 1 || value === true || value === "1") return 1;
  return fallback;
}

function invert(value: LogicValue): LogicValue {
  return value === "X" ? "X" : value === 1 ? 0 : 1;
}

function binary(kind: DigitalComponentKind, left: LogicValue, right: LogicValue): LogicValue {
  if (kind === "and" || kind === "nand") {
    const value: LogicValue = left === 0 || right === 0 ? 0 : left === 1 && right === 1 ? 1 : "X";
    return kind === "nand" ? invert(value) : value;
  }
  if (kind === "or" || kind === "nor") {
    const value: LogicValue = left === 1 || right === 1 ? 1 : left === 0 && right === 0 ? 0 : "X";
    return kind === "nor" ? invert(value) : value;
  }
  return left === "X" || right === "X" ? "X" : left === right ? 0 : 1;
}

function clockValue(frequencyHz: number, timeSeconds: number): LogicValue {
  if (!Number.isFinite(frequencyHz) || frequencyHz <= 0) return "X";
  const phase = ((timeSeconds * frequencyHz) % 1 + 1) % 1;
  return phase >= 0.5 ? 1 : 0;
}

function cloneRuntime(runtime: DigitalRuntime | undefined, timeSeconds: number): DigitalRuntime {
  return {
    timeSeconds,
    memory: structuredClone(runtime?.memory ?? {}),
    previousClocks: { ...(runtime?.previousClocks ?? {}) },
  };
}

function resolveNets(
  circuit: CircuitDocument,
  outputValues: Record<string, LogicValue>,
): { values: Record<string, LogicValue>; conflicts: string[]; driverCounts: Record<string, number> } {
  const netlist = buildNetlist(circuit);
  const values: Record<string, LogicValue> = {};
  const conflicts: string[] = [];
  const driverCounts: Record<string, number> = {};
  for (const netId of Object.keys(netlist.nets)) {
    const drivers = netlist.nets[netId].filter((terminal) => terminal in outputValues).map((terminal) => outputValues[terminal]);
    driverCounts[netId] = drivers.length;
    if (!drivers.length) {
      values[netId] = "X";
      continue;
    }
    const known = new Set(drivers.filter((value): value is 0 | 1 => value !== "X"));
    if (known.size > 1) {
      values[netId] = "X";
      conflicts.push(netId);
    } else if (drivers.some((value) => value === "X")) {
      values[netId] = "X";
    } else {
      values[netId] = drivers[0];
    }
  }
  return { values, conflicts, driverCounts };
}

function netInput(terminalToNet: Record<string, string>, netValues: Record<string, LogicValue>, componentId: string, portId: string): LogicValue {
  const netId = terminalToNet[terminalKey(componentId, portId)];
  return netId ? netValues[netId] ?? "X" : "X";
}

function computeDecoder(
  terminalToNet: Record<string, string>,
  netValues: Record<string, LogicValue>,
  componentId: string,
  activeHigh: boolean,
): Record<string, LogicValue> {
  const bits = ["a0", "a1", "a2"].map((port) => netInput(terminalToNet, netValues, componentId, port));
  const enable = netInput(terminalToNet, netValues, componentId, "enable");
  const enabled = enable === "X" ? 1 : enable;
  const result: Record<string, LogicValue> = {};
  if (enabled === 0) {
    for (let index = 0; index < 8; index += 1) result[`y${index}`] = activeHigh ? 0 : 1;
    return result;
  }
  if (bits.some((bit) => bit === "X")) {
    for (let index = 0; index < 8; index += 1) result[`y${index}`] = "X";
    return result;
  }
  const selected = Number(bits[0]) + Number(bits[1]) * 2 + Number(bits[2]) * 4;
  for (let index = 0; index < 8; index += 1) result[`y${index}`] = index === selected ? (activeHigh ? 1 : 0) : (activeHigh ? 0 : 1);
  return result;
}

function detectCombinationalLoops(circuit: CircuitDocument): string[][] {
  const netlist = buildNetlist(circuit);
  const gates = Object.values(circuit.components).filter((component) => combinationalKinds.has(component.kind as DigitalComponentKind));
  const adjacency = new Map(gates.map((component) => [component.id, new Set<string>()]));
  for (const source of gates) {
    const outputNets = componentPorts[source.kind]
      .filter((port) => port.direction === "output")
      .map((port) => netlist.terminalToNet[terminalKey(source.id, port.id)]);
    for (const target of gates) {
      const inputNets = componentPorts[target.kind]
        .filter((port) => port.direction === "input")
        .map((port) => netlist.terminalToNet[terminalKey(target.id, port.id)]);
      if (outputNets.some((netId) => inputNets.includes(netId))) adjacency.get(source.id)?.add(target.id);
    }
  }
  const loops = new Map<string, string[]>();
  for (const start of adjacency.keys()) {
    const visit = (node: string, path: string[], seen: Set<string>): void => {
      for (const next of adjacency.get(node) ?? []) {
        if (next === start) {
          const loop = [...path, node].sort();
          loops.set(loop.join("|"), loop);
        } else if (!seen.has(next)) {
          visit(next, [...path, node], new Set([...seen, next]));
        }
      }
    };
    visit(start, [], new Set([start]));
  }
  return [...loops.values()];
}

function observationTerminals(circuit: CircuitDocument): string[] {
  const result: string[] = [];
  for (const component of Object.values(circuit.components)) {
    for (const port of componentPorts[component.kind]) {
      if (port.direction === "output" && component.kind !== "switch" && component.kind !== "clock") result.push(terminalKey(component.id, port.id));
      if ((component.kind === "led" || component.kind === "seven-segment") && port.direction === "input") result.push(terminalKey(component.id, port.id));
    }
  }
  return [...new Set(result)].sort();
}

export function evaluateDigitalCircuit(
  circuit: CircuitDocument,
  options: { runtime?: DigitalRuntime; timeSeconds?: number } = {},
): DigitalSimulationResult {
  if (circuit.kind !== "digital") throw new Error("数字仿真器只能处理数字电路。");
  const timeSeconds = options.timeSeconds ?? options.runtime?.timeSeconds ?? 0;
  const runtime = cloneRuntime(options.runtime, timeSeconds);
  const netlist = buildNetlist(circuit);
  const outputValues: Record<string, LogicValue> = {};
  const diagnostics: CircuitDiagnostic[] = [];

  for (const component of Object.values(circuit.components)) {
    if (component.kind === "switch") outputValues[terminalKey(component.id, "out")] = asLogic(component.parameters.state, 0);
    else if (component.kind === "clock") {
      const frequency = Number(component.parameters.frequencyHz);
      outputValues[terminalKey(component.id, "out")] = clockValue(frequency, timeSeconds);
      if (!Number.isFinite(frequency) || frequency <= 0) diagnostics.push({ code: "invalid-parameter", severity: "error", message: `时钟 ${component.id} 的频率必须大于 0。`, componentIds: [component.id] });
    } else if (sequentialKinds.has(component.kind as DigitalComponentKind)) {
      const memory = runtime.memory[component.id] ?? {};
      if (component.kind === "counter") {
        const width = Math.max(1, Math.min(4, Math.trunc(Number(component.parameters.width) || 4)));
        const count = memory.count ?? Math.trunc(Number(component.parameters.initialCount) || 0);
        runtime.memory[component.id] = { count };
        for (let bit = 0; bit < 4; bit += 1) outputValues[terminalKey(component.id, `q${bit}`)] = bit < width ? ((count >> bit) & 1) as 0 | 1 : 0;
      } else {
        const q = memory.q ?? asLogic(component.parameters.initialQ, 0);
        runtime.memory[component.id] = { q };
        outputValues[terminalKey(component.id, "q")] = q;
        outputValues[terminalKey(component.id, "nq")] = invert(q);
      }
    } else {
      for (const port of componentPorts[component.kind]) if (port.direction === "output") outputValues[terminalKey(component.id, port.id)] = "X";
    }
  }

  const runCombinational = (): ReturnType<typeof resolveNets> => {
    let resolved = resolveNets(circuit, outputValues);
    for (let pass = 0; pass < Math.max(4, Object.keys(circuit.components).length * 2); pass += 1) {
      let changed = false;
      for (const component of Object.values(circuit.components)) {
        if (!combinationalKinds.has(component.kind as DigitalComponentKind)) continue;
        if (component.kind === "not") {
          const next = invert(netInput(netlist.terminalToNet, resolved.values, component.id, "in"));
          const key = terminalKey(component.id, "out");
          changed ||= outputValues[key] !== next;
          outputValues[key] = next;
        } else if (component.kind === "decoder") {
          const values = computeDecoder(netlist.terminalToNet, resolved.values, component.id, component.parameters.activeHigh !== false);
          for (const [port, next] of Object.entries(values)) {
            const key = terminalKey(component.id, port);
            changed ||= outputValues[key] !== next;
            outputValues[key] = next;
          }
        } else {
          const next = binary(component.kind as DigitalComponentKind, netInput(netlist.terminalToNet, resolved.values, component.id, "a"), netInput(netlist.terminalToNet, resolved.values, component.id, "b"));
          const key = terminalKey(component.id, "out");
          changed ||= outputValues[key] !== next;
          outputValues[key] = next;
        }
      }
      const nextResolved = resolveNets(circuit, outputValues);
      resolved = nextResolved;
      if (!changed) break;
    }
    return resolved;
  };

  let resolved = runCombinational();
  for (const component of Object.values(circuit.components)) {
    if (!sequentialKinds.has(component.kind as DigitalComponentKind)) continue;
    const clock = netInput(netlist.terminalToNet, resolved.values, component.id, "clk");
    const previous = runtime.previousClocks[component.id] ?? 0;
    const rising = previous === 0 && clock === 1;
    runtime.previousClocks[component.id] = clock;
    if (!rising) continue;
    if (component.kind === "counter") {
      const reset = netInput(netlist.terminalToNet, resolved.values, component.id, "reset");
      const width = Math.max(1, Math.min(4, Math.trunc(Number(component.parameters.width) || 4)));
      const current = runtime.memory[component.id]?.count ?? 0;
      runtime.memory[component.id] = { count: reset === 1 ? 0 : (current + 1) % (2 ** width) };
    } else {
      const current = runtime.memory[component.id]?.q ?? 0;
      let q: LogicValue = current;
      if (component.kind === "dff") q = netInput(netlist.terminalToNet, resolved.values, component.id, "d");
      if (component.kind === "tff") {
        const t = netInput(netlist.terminalToNet, resolved.values, component.id, "t");
        q = t === "X" || current === "X" ? "X" : t === 1 ? invert(current) : current;
      }
      if (component.kind === "jkff") {
        const j = netInput(netlist.terminalToNet, resolved.values, component.id, "j");
        const k = netInput(netlist.terminalToNet, resolved.values, component.id, "k");
        if (j === "X" || k === "X" || current === "X") q = "X";
        else if (j === 0 && k === 0) q = current;
        else if (j === 0 && k === 1) q = 0;
        else if (j === 1 && k === 0) q = 1;
        else q = invert(current);
      }
      runtime.memory[component.id] = { q };
    }
  }

  for (const component of Object.values(circuit.components)) {
    if (component.kind === "counter") {
      const width = Math.max(1, Math.min(4, Math.trunc(Number(component.parameters.width) || 4)));
      const count = runtime.memory[component.id]?.count ?? 0;
      for (let bit = 0; bit < 4; bit += 1) outputValues[terminalKey(component.id, `q${bit}`)] = bit < width ? ((count >> bit) & 1) as 0 | 1 : 0;
    } else if (component.kind === "dff" || component.kind === "jkff" || component.kind === "tff") {
      const q = runtime.memory[component.id]?.q ?? "X";
      outputValues[terminalKey(component.id, "q")] = q;
      outputValues[terminalKey(component.id, "nq")] = invert(q);
    }
  }
  resolved = runCombinational();
  for (const netId of resolved.conflicts) diagnostics.push({ code: "driver-conflict", severity: "error", message: `网络 ${netId} 同时被高、低电平驱动。`, netId });
  for (const component of Object.values(circuit.components)) {
    for (const port of componentPorts[component.kind]) {
      if (port.direction !== "input" || port.required === false) continue;
      const netId = netlist.terminalToNet[terminalKey(component.id, port.id)];
      if (!netId || resolved.driverCounts[netId] === 0) diagnostics.push({ code: "dangling-input", severity: "warning", message: `${component.id}.${port.id} 没有信号源。`, componentIds: [component.id], netId });
    }
  }
  for (const loop of detectCombinationalLoops(circuit)) diagnostics.push({ code: "combinational-loop", severity: "error", message: `组合逻辑环路：${loop.join(" → ")}。`, componentIds: loop });

  const terminalValues = Object.fromEntries(Object.entries(netlist.terminalToNet).map(([terminal, netId]) => [terminal, resolved.values[netId] ?? "X"])) as Record<string, LogicValue>;
  const indicators: Record<string, string> = {};
  for (const component of Object.values(circuit.components)) {
    if (component.kind === "led") {
      const value = terminalValues[terminalKey(component.id, "in")] ?? "X";
      indicators[component.id] = value === 1 ? "on" : value === 0 ? "off" : "unknown";
    } else if (component.kind === "seven-segment") {
      indicators[component.id] = ["a", "b", "c", "d", "e", "f", "g", "dot"].map((port) => terminalValues[terminalKey(component.id, port)] ?? "X").join("");
    }
  }
  return { terminalValues, outputValues: { ...outputValues }, indicators, diagnostics, runtime };
}

export function generateTruthTable(
  circuit: CircuitDocument,
  options: { switchIds?: string[]; observationTerminals?: string[] } = {},
): TruthTableRow[] {
  const switchIds = options.switchIds ?? Object.values(circuit.components).filter((component) => component.kind === "switch").map((component) => component.id).sort();
  if (switchIds.length > 10) throw new Error("真值表最多枚举 10 个开关输入。");
  for (const id of switchIds) if (circuit.components[id]?.kind !== "switch") throw new Error(`${id} 不是开关元件。`);
  const observations = options.observationTerminals ?? observationTerminals(circuit);
  const rows: TruthTableRow[] = [];
  for (let mask = 0; mask < 2 ** switchIds.length; mask += 1) {
    const candidate = structuredClone(circuit);
    const inputs: Record<string, LogicValue> = {};
    switchIds.forEach((id, bit) => {
      const value = ((mask >> bit) & 1) as 0 | 1;
      candidate.components[id].parameters.state = value;
      inputs[id] = value;
    });
    const result = evaluateDigitalCircuit(candidate);
    rows.push({ inputs, outputs: Object.fromEntries(observations.map((terminal) => [terminal, result.terminalValues[terminal] ?? "X"])) });
  }
  return rows;
}

export function sampleDigitalCircuit(
  circuit: CircuitDocument,
  options: { durationSeconds: number; sampleRateHz: number; terminals?: string[]; runtime?: DigitalRuntime },
): DigitalSampleResult {
  if (!Number.isFinite(options.durationSeconds) || options.durationSeconds < 0) throw new Error("采样时长无效。");
  if (!Number.isFinite(options.sampleRateHz) || options.sampleRateHz <= 0) throw new Error("采样率必须大于 0。");
  const sampleCount = Math.floor(options.durationSeconds * options.sampleRateHz) + 1;
  if (sampleCount > 100_000) throw new Error("采样点超过 100000，请缩短时长或降低采样率。");
  const terminals = options.terminals ?? observationTerminals(circuit);
  const traces = Object.fromEntries(terminals.map((terminal) => [terminal, []])) as Record<string, DigitalTraceSample[]>;
  const diagnostics = new Map<string, CircuitDiagnostic>();
  let runtime = options.runtime;
  for (let index = 0; index < sampleCount; index += 1) {
    const timeSeconds = index / options.sampleRateHz;
    const result = evaluateDigitalCircuit(circuit, { runtime, timeSeconds });
    runtime = result.runtime;
    for (const terminal of terminals) traces[terminal].push({ timeSeconds, value: result.terminalValues[terminal] ?? "X" });
    for (const diagnostic of result.diagnostics) diagnostics.set(`${diagnostic.code}:${diagnostic.netId ?? diagnostic.componentIds?.join(",") ?? diagnostic.message}`, diagnostic);
  }
  return { traces, diagnostics: [...diagnostics.values()], runtime: runtime ?? cloneRuntime(undefined, 0) };
}
