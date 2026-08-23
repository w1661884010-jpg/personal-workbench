import { buildNetlist } from "./graph";
import { terminalKey, type CircuitDiagnostic, type CircuitDocument } from "./types";

export type AnalogSimulationModel = "linear-dc-mna" | "linear-transient-backward-euler" | "unsupported-nonlinear";

export interface AnalogDcResult {
  ok: boolean;
  model: AnalogSimulationModel;
  nodeVoltages: Record<string, number>;
  terminalVoltages: Record<string, number>;
  componentCurrents: Record<string, number>;
  meterReadings: Record<string, number>;
  warnings: string[];
  diagnostics: CircuitDiagnostic[];
}
export interface AnalogTransientSample {
  timeSeconds: number;
  nodeVoltages: Record<string, number>;
  componentCurrents: Record<string, number>;
}

export interface AnalogTransientResult {
  ok: boolean;
  model: AnalogSimulationModel;
  samples: AnalogTransientSample[];
  nodeTraces: Record<string, Array<{ timeSeconds: number; voltage: number }>>;
  warnings: string[];
  diagnostics: CircuitDiagnostic[];
}

interface SolveOptions {
  timeSeconds: number;
  timeStepSeconds?: number;
  capacitorVoltages?: Record<string, number>;
}

interface LinearSolveResult {
  ok: boolean;
  nodeVoltages: Record<string, number>;
  terminalVoltages: Record<string, number>;
  componentCurrents: Record<string, number>;
  meterReadings: Record<string, number>;
  diagnostics: CircuitDiagnostic[];
}

const nonlinearKinds = new Set(["diode", "bjt", "opamp"]);

function unsupportedDiagnostics(circuit: CircuitDocument): CircuitDiagnostic[] {
  return Object.values(circuit.components)
    .filter((component) => nonlinearKinds.has(component.kind))
    .map((component) => ({
      code: "unsupported-model" as const,
      severity: "error" as const,
      message: `${component.kind} 元件 ${component.id} 尚无可验证的非线性模型；本次不生成电压或波形。`,
      componentIds: [component.id],
    }));
}

function numberParameter(circuit: CircuitDocument, componentId: string, name: string): number {
  return Number(circuit.components[componentId]?.parameters[name]);
}

function sourceVoltage(circuit: CircuitDocument, componentId: string, timeSeconds: number): number {
  const component = circuit.components[componentId];
  if (component.kind === "dc-source") return Number(component.parameters.voltage);
  const offset = Number(component.parameters.offset ?? 0);
  const amplitude = Number(component.parameters.amplitude ?? 1);
  const frequency = Number(component.parameters.frequencyHz ?? 1);
  const phase = Number(component.parameters.phaseDegrees ?? 0) * Math.PI / 180;
  const angle = 2 * Math.PI * frequency * timeSeconds + phase;
  if (component.parameters.waveform === "square") return offset + (Math.sin(angle) >= 0 ? amplitude : -amplitude);
  if (component.parameters.waveform === "dc") return offset;
  return offset + amplitude * Math.sin(angle);
}

function solveLinearSystem(matrix: number[][], rightHandSide: number[]): number[] | null {
  const size = rightHandSide.length;
  const augmented = matrix.map((row, index) => [...row, rightHandSide[index]]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    if (Math.abs(augmented[pivot][column]) < 1e-12) return null;
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    const divisor = augmented[column][column];
    for (let entry = column; entry <= size; entry += 1) augmented[column][entry] /= divisor;
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      if (Math.abs(factor) < 1e-18) continue;
      for (let entry = column; entry <= size; entry += 1) augmented[row][entry] -= factor * augmented[column][entry];
    }
  }
  return augmented.map((row) => row[size]);
}

function solveLinearCircuit(circuit: CircuitDocument, options: SolveOptions): LinearSolveResult {
  const netlist = buildNetlist(circuit);
  const groundNets = new Set(Object.values(circuit.components)
    .filter((component) => component.kind === "ground")
    .map((component) => netlist.terminalToNet[terminalKey(component.id, "g")])
    .filter(Boolean));
  const diagnostics: CircuitDiagnostic[] = [];
  if (!groundNets.size) {
    diagnostics.push({ code: "singular-circuit", severity: "error", message: "模拟电路至少需要一个接地元件。" });
    return { ok: false, nodeVoltages: {}, terminalVoltages: {}, componentCurrents: {}, meterReadings: {}, diagnostics };
  }

  const nonGroundNets = Object.keys(netlist.nets).filter((netId) => !groundNets.has(netId)).sort();
  const nodeIndex = new Map(nonGroundNets.map((netId, index) => [netId, index]));
  const voltageSources = Object.values(circuit.components).filter((component) => component.kind === "dc-source" || component.kind === "signal-source" || component.kind === "ammeter");
  const size = nonGroundNets.length + voltageSources.length;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  const rhs = Array(size).fill(0);

  const net = (componentId: string, portId: string): string => netlist.terminalToNet[terminalKey(componentId, portId)];
  const addConductance = (positiveNet: string, negativeNet: string, conductance: number, historyVoltage = 0): void => {
    const positive = nodeIndex.get(positiveNet);
    const negative = nodeIndex.get(negativeNet);
    if (positive !== undefined) matrix[positive][positive] += conductance;
    if (negative !== undefined) matrix[negative][negative] += conductance;
    if (positive !== undefined && negative !== undefined) {
      matrix[positive][negative] -= conductance;
      matrix[negative][positive] -= conductance;
    }
    if (historyVoltage) {
      if (positive !== undefined) rhs[positive] += conductance * historyVoltage;
      if (negative !== undefined) rhs[negative] -= conductance * historyVoltage;
    }
  };

  for (const component of Object.values(circuit.components)) {
    if (component.kind === "resistor") {
      const resistance = numberParameter(circuit, component.id, "resistanceOhms");
      if (!Number.isFinite(resistance) || resistance <= 0) diagnostics.push({ code: "invalid-parameter", severity: "error", message: `电阻 ${component.id} 的阻值必须大于 0。`, componentIds: [component.id] });
      else addConductance(net(component.id, "p"), net(component.id, "n"), 1 / resistance);
    }
    if (component.kind === "capacitor" && options.timeStepSeconds !== undefined) {
      const capacitance = numberParameter(circuit, component.id, "capacitanceFarads");
      if (!Number.isFinite(capacitance) || capacitance <= 0) diagnostics.push({ code: "invalid-parameter", severity: "error", message: `电容 ${component.id} 的电容量必须大于 0。`, componentIds: [component.id] });
      else addConductance(net(component.id, "p"), net(component.id, "n"), capacitance / options.timeStepSeconds, options.capacitorVoltages?.[component.id] ?? Number(component.parameters.initialVoltage ?? 0));
    }
  }

  voltageSources.forEach((component, sourceOffset) => {
    const row = nonGroundNets.length + sourceOffset;
    const positiveNet = net(component.id, "p");
    const negativeNet = net(component.id, "n");
    const positive = nodeIndex.get(positiveNet);
    const negative = nodeIndex.get(negativeNet);
    if (positive !== undefined) { matrix[positive][row] += 1; matrix[row][positive] += 1; }
    if (negative !== undefined) { matrix[negative][row] -= 1; matrix[row][negative] -= 1; }
    const value = component.kind === "ammeter" ? 0 : sourceVoltage(circuit, component.id, options.timeSeconds);
    if (!Number.isFinite(value)) diagnostics.push({ code: "invalid-parameter", severity: "error", message: `电压源 ${component.id} 的参数无效。`, componentIds: [component.id] });
    rhs[row] = value;
  });
  if (diagnostics.some((diagnostic) => diagnostic.severity === "error")) return { ok: false, nodeVoltages: {}, terminalVoltages: {}, componentCurrents: {}, meterReadings: {}, diagnostics };

  const solution = solveLinearSystem(matrix, rhs);
  if (!solution) {
    diagnostics.push({ code: "singular-circuit", severity: "error", message: "电路矩阵奇异：请检查悬空节点、短路电压源或缺少参考地。" });
    return { ok: false, nodeVoltages: {}, terminalVoltages: {}, componentCurrents: {}, meterReadings: {}, diagnostics };
  }
  const nodeVoltages: Record<string, number> = {};
  for (const groundNet of groundNets) nodeVoltages[groundNet] = 0;
  nonGroundNets.forEach((netId, index) => { nodeVoltages[netId] = solution[index]; });
  const terminalVoltages = Object.fromEntries(Object.entries(netlist.terminalToNet).map(([terminal, netId]) => [terminal, nodeVoltages[netId] ?? 0]));
  const componentCurrents: Record<string, number> = {};
  const voltage = (componentId: string, portId: string): number => terminalVoltages[terminalKey(componentId, portId)] ?? 0;
  for (const component of Object.values(circuit.components)) {
    if (component.kind === "resistor") componentCurrents[component.id] = (voltage(component.id, "p") - voltage(component.id, "n")) / numberParameter(circuit, component.id, "resistanceOhms");
    else if (component.kind === "capacitor") {
      const previous = options.capacitorVoltages?.[component.id] ?? Number(component.parameters.initialVoltage ?? 0);
      componentCurrents[component.id] = options.timeStepSeconds === undefined ? 0 : numberParameter(circuit, component.id, "capacitanceFarads") * ((voltage(component.id, "p") - voltage(component.id, "n")) - previous) / options.timeStepSeconds;
    } else if (component.kind === "voltmeter" || component.kind === "ground") componentCurrents[component.id] = 0;
  }
  voltageSources.forEach((component, index) => { componentCurrents[component.id] = solution[nonGroundNets.length + index]; });
  const meterReadings: Record<string, number> = {};
  for (const component of Object.values(circuit.components)) {
    if (component.kind === "voltmeter") meterReadings[component.id] = voltage(component.id, "p") - voltage(component.id, "n");
    if (component.kind === "ammeter") meterReadings[component.id] = componentCurrents[component.id];
  }
  return { ok: true, nodeVoltages, terminalVoltages, componentCurrents, meterReadings, diagnostics };
}

export function solveAnalogDc(circuit: CircuitDocument): AnalogDcResult {
  if (circuit.kind !== "analog") throw new Error("模拟求解器只能处理模拟电路。");
  const unsupported = unsupportedDiagnostics(circuit);
  if (unsupported.length) {
    return { ok: false, model: "unsupported-nonlinear", nodeVoltages: {}, terminalVoltages: {}, componentCurrents: {}, meterReadings: {}, warnings: ["V1 仅对线性 R、独立电压源和理想表计执行 DC MNA；二极管、BJT 与运放尚未求解。"], diagnostics: unsupported };
  }
  const solved = solveLinearCircuit(circuit, { timeSeconds: 0 });
  return {
    ...solved,
    model: "linear-dc-mna",
    warnings: ["DC 模型把电容视为开路，电压源与表计视为理想元件。"],
  };
}

export function simulateAnalogTransient(
  circuit: CircuitDocument,
  options: { durationSeconds: number; timeStepSeconds: number },
): AnalogTransientResult {
  if (circuit.kind !== "analog") throw new Error("模拟求解器只能处理模拟电路。");
  if (!Number.isFinite(options.durationSeconds) || options.durationSeconds <= 0) throw new Error("瞬态时长必须大于 0。");
  if (!Number.isFinite(options.timeStepSeconds) || options.timeStepSeconds <= 0) throw new Error("时间步长必须大于 0。");
  const stepCount = Math.ceil(options.durationSeconds / options.timeStepSeconds);
  if (stepCount > 100_000) throw new Error("瞬态步数超过 100000，请增大步长或缩短时长。");
  const unsupported = unsupportedDiagnostics(circuit);
  if (unsupported.length) return { ok: false, model: "unsupported-nonlinear", samples: [], nodeTraces: {}, warnings: ["非线性器件暂无可验证模型，因此没有生成替代波形。"], diagnostics: unsupported };

  const netlist = buildNetlist(circuit);
  const nodeTraces = Object.fromEntries(Object.keys(netlist.nets).map((netId) => [netId, [{ timeSeconds: 0, voltage: 0 }]]));
  const samples: AnalogTransientSample[] = [{ timeSeconds: 0, nodeVoltages: Object.fromEntries(Object.keys(netlist.nets).map((netId) => [netId, 0])), componentCurrents: {} }];
  const capacitorVoltages: Record<string, number> = Object.fromEntries(Object.values(circuit.components)
    .filter((component) => component.kind === "capacitor")
    .map((component) => [component.id, Number(component.parameters.initialVoltage ?? 0)]));
  const diagnostics: CircuitDiagnostic[] = [];
  for (let step = 1; step <= stepCount; step += 1) {
    const timeSeconds = Math.min(step * options.timeStepSeconds, options.durationSeconds);
    const solved = solveLinearCircuit(circuit, { timeSeconds, timeStepSeconds: options.timeStepSeconds, capacitorVoltages });
    diagnostics.push(...solved.diagnostics);
    if (!solved.ok) return { ok: false, model: "linear-transient-backward-euler", samples: [], nodeTraces: {}, warnings: ["瞬态采用后向欧拉积分；求解失败时不保留部分波形。"], diagnostics };
    samples.push({ timeSeconds, nodeVoltages: solved.nodeVoltages, componentCurrents: solved.componentCurrents });
    for (const [netId, voltage] of Object.entries(solved.nodeVoltages)) nodeTraces[netId]?.push({ timeSeconds, voltage });
    for (const component of Object.values(circuit.components)) {
      if (component.kind === "capacitor") capacitorVoltages[component.id] = solved.terminalVoltages[terminalKey(component.id, "p")] - solved.terminalVoltages[terminalKey(component.id, "n")];
    }
  }
  return {
    ok: true,
    model: "linear-transient-backward-euler",
    samples,
    nodeTraces,
    warnings: ["瞬态使用理想集总元件和后向欧拉固定步长；结果不包含寄生参数、噪声或温漂。"],
    diagnostics,
  };
}
