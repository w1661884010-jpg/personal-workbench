import {
  CIRCUIT_SCHEMA_VERSION,
  analogComponentKinds,
  componentPorts,
  digitalComponentKinds,
  getPortDefinition,
  terminalKey,
  type CircuitComponent,
  type CircuitComponentKind,
  type CircuitConnection,
  type CircuitDocument,
  type CircuitEndpoint,
  type CircuitKind,
  type CircuitNetlist,
  type CircuitPoint,
  type ComponentParameter,
} from "./types";

function nowIso(): string {
  return new Date().toISOString();
}
function defaultParameters(kind: CircuitComponentKind): Record<string, ComponentParameter> {
  switch (kind) {
    case "switch": return { state: false };
    case "clock": return { frequencyHz: 1 };
    case "dff":
    case "jkff":
    case "tff": return { initialQ: 0 };
    case "counter": return { width: 4, initialCount: 0 };
    case "decoder": return { activeHigh: true };
    case "resistor": return { resistanceOhms: 1000 };
    case "capacitor": return { capacitanceFarads: 0.000001, initialVoltage: 0 };
    case "dc-source": return { voltage: 5 };
    case "signal-source": return { waveform: "sine", amplitude: 1, frequencyHz: 1000, offset: 0, phaseDegrees: 0 };
    case "diode": return { model: "unsupported" };
    case "bjt": return { model: "unsupported", polarity: "npn" };
    case "opamp": return { model: "unsupported" };
    default: return {};
  }
}

export function createCircuit(kind: CircuitKind, id: string, name: string, timestamp = nowIso()): CircuitDocument {
  if (!id.trim() || !name.trim()) throw new Error("电路 id 和名称不能为空。");
  return {
    schemaVersion: CIRCUIT_SCHEMA_VERSION,
    id,
    name: name.trim(),
    kind,
    components: {},
    connections: {},
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createComponent(
  id: string,
  kind: CircuitComponentKind,
  position: CircuitPoint,
  parameters: Record<string, ComponentParameter> = {},
  label?: string,
): CircuitComponent {
  if (!id.trim()) throw new Error("元件 id 不能为空。");
  if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) throw new Error("元件坐标无效。");
  return { id, kind, position: { ...position }, parameters: { ...defaultParameters(kind), ...parameters }, ...(label ? { label } : {}) };
}

function assertCompatible(circuit: CircuitDocument, component: CircuitComponent): void {
  const valid = circuit.kind === "digital"
    ? digitalComponentKinds.has(component.kind as never)
    : analogComponentKinds.has(component.kind as never);
  if (!valid) throw new Error(`${component.kind} 不能放入 ${circuit.kind} 电路。`);
}

export function addComponent(circuit: CircuitDocument, component: CircuitComponent, timestamp = nowIso()): CircuitDocument {
  assertCompatible(circuit, component);
  if (circuit.components[component.id]) throw new Error(`元件 ${component.id} 已存在。`);
  return { ...circuit, components: { ...circuit.components, [component.id]: structuredClone(component) }, updatedAt: timestamp };
}

export function moveComponent(circuit: CircuitDocument, componentId: string, position: CircuitPoint, timestamp = nowIso()): CircuitDocument {
  const component = circuit.components[componentId];
  if (!component) throw new Error(`找不到元件 ${componentId}。`);
  if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) throw new Error("元件坐标无效。");
  return {
    ...circuit,
    components: { ...circuit.components, [componentId]: { ...component, position: { ...position } } },
    updatedAt: timestamp,
  };
}

export function updateComponentParameters(
  circuit: CircuitDocument,
  componentId: string,
  parameters: Record<string, ComponentParameter>,
  timestamp = nowIso(),
): CircuitDocument {
  const component = circuit.components[componentId];
  if (!component) throw new Error(`找不到元件 ${componentId}。`);
  return {
    ...circuit,
    components: { ...circuit.components, [componentId]: { ...component, parameters: { ...component.parameters, ...parameters } } },
    updatedAt: timestamp,
  };
}

export function removeComponent(circuit: CircuitDocument, componentId: string, timestamp = nowIso()): CircuitDocument {
  if (!circuit.components[componentId]) return circuit;
  const components = { ...circuit.components };
  delete components[componentId];
  const connections = Object.fromEntries(Object.entries(circuit.connections).filter(([, connection]) =>
    connection.from.componentId !== componentId && connection.to.componentId !== componentId));
  return { ...circuit, components, connections, updatedAt: timestamp };
}

function assertEndpoint(circuit: CircuitDocument, endpoint: CircuitEndpoint): void {
  const component = circuit.components[endpoint.componentId];
  if (!component) throw new Error(`找不到元件 ${endpoint.componentId}。`);
  if (!getPortDefinition(component, endpoint.portId)) throw new Error(`元件 ${endpoint.componentId} 没有端口 ${endpoint.portId}。`);
}

export function connect(
  circuit: CircuitDocument,
  connection: CircuitConnection,
  timestamp = nowIso(),
): CircuitDocument {
  if (!connection.id.trim()) throw new Error("连线 id 不能为空。");
  if (circuit.connections[connection.id]) throw new Error(`连线 ${connection.id} 已存在。`);
  assertEndpoint(circuit, connection.from);
  assertEndpoint(circuit, connection.to);
  if (terminalKey(connection.from.componentId, connection.from.portId) === terminalKey(connection.to.componentId, connection.to.portId)) {
    throw new Error("不能把端口连接到自身。");
  }
  const duplicate = Object.values(circuit.connections).some((candidate) => {
    const existing = new Set([terminalKey(candidate.from.componentId, candidate.from.portId), terminalKey(candidate.to.componentId, candidate.to.portId)]);
    return existing.has(terminalKey(connection.from.componentId, connection.from.portId))
      && existing.has(terminalKey(connection.to.componentId, connection.to.portId));
  });
  if (duplicate) throw new Error("这两个端口已经连接。");
  return { ...circuit, connections: { ...circuit.connections, [connection.id]: structuredClone(connection) }, updatedAt: timestamp };
}

export function disconnect(circuit: CircuitDocument, connectionId: string, timestamp = nowIso()): CircuitDocument {
  if (!circuit.connections[connectionId]) return circuit;
  const connections = { ...circuit.connections };
  delete connections[connectionId];
  return { ...circuit, connections, updatedAt: timestamp };
}

export function resetCircuit(circuit: CircuitDocument, timestamp = nowIso()): CircuitDocument {
  return { ...circuit, components: {}, connections: {}, updatedAt: timestamp };
}

export function copyCircuit(circuit: CircuitDocument, id: string, name = `${circuit.name} 副本`, timestamp = nowIso()): CircuitDocument {
  if (!id.trim()) throw new Error("副本 id 不能为空。");
  const copy = structuredClone(circuit);
  return { ...copy, id, name: name.trim(), createdAt: timestamp, updatedAt: timestamp };
}

export function buildNetlist(circuit: CircuitDocument): CircuitNetlist {
  const parents = new Map<string, string>();
  const find = (key: string): string => {
    const parent = parents.get(key);
    if (!parent || parent === key) return key;
    const root = find(parent);
    parents.set(key, root);
    return root;
  };
  const union = (left: string, right: string): void => {
    const a = find(left);
    const b = find(right);
    if (a !== b) parents.set(a < b ? b : a, a < b ? a : b);
  };

  for (const component of Object.values(circuit.components)) {
    for (const port of componentPorts[component.kind]) {
      const key = terminalKey(component.id, port.id);
      parents.set(key, key);
    }
  }
  for (const connection of Object.values(circuit.connections)) {
    const from = terminalKey(connection.from.componentId, connection.from.portId);
    const to = terminalKey(connection.to.componentId, connection.to.portId);
    if (parents.has(from) && parents.has(to)) union(from, to);
  }

  const groups = new Map<string, string[]>();
  for (const terminal of [...parents.keys()].sort()) {
    const root = find(terminal);
    const values = groups.get(root) ?? [];
    values.push(terminal);
    groups.set(root, values);
  }
  const terminalToNet: Record<string, string> = {};
  const nets: Record<string, string[]> = {};
  for (const terminals of groups.values()) {
    const netId = [...terminals].sort()[0];
    nets[netId] = [...terminals].sort();
    for (const terminal of terminals) terminalToNet[terminal] = netId;
  }
  return { terminalToNet, nets };
}
