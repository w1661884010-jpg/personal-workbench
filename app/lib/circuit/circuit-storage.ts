import { copyCircuit } from "./graph";
import {
  CIRCUIT_SCHEMA_VERSION,
  analogComponentKinds,
  componentPorts,
  digitalComponentKinds,
  getPortDefinition,
  type CircuitComponent,
  type CircuitDocument,
} from "./types";

export const CIRCUIT_STORAGE_KEY = "semester-electronics-learning-site:circuits:v1";

export interface CircuitLibraryEnvelope {
  schemaVersion: typeof CIRCUIT_SCHEMA_VERSION;
  circuits: Record<string, CircuitDocument>;
}
export type CircuitStorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function browserStorage(): CircuitStorageLike | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateComponent(value: unknown, circuit: CircuitDocument, key: string): CircuitComponent {
  if (!isObject(value) || !isText(value.id) || value.id !== key || !isText(value.kind)) throw new Error(`元件 ${key} 的 id 或 kind 无效。`);
  const compatible = circuit.kind === "digital"
    ? digitalComponentKinds.has(value.kind as never)
    : analogComponentKinds.has(value.kind as never);
  if (!compatible) throw new Error(`元件 ${key} 与 ${circuit.kind} 电路不兼容。`);
  if (!isObject(value.position) || !Number.isFinite(value.position.x) || !Number.isFinite(value.position.y)) throw new Error(`元件 ${key} 的坐标无效。`);
  if (!isObject(value.parameters)) throw new Error(`元件 ${key} 的参数无效。`);
  for (const parameter of Object.values(value.parameters)) {
    if (!(typeof parameter === "string" || typeof parameter === "number" || typeof parameter === "boolean") || (typeof parameter === "number" && !Number.isFinite(parameter))) {
      throw new Error(`元件 ${key} 包含无法保存的参数。`);
    }
  }
  return structuredClone(value as unknown as CircuitComponent);
}

export function validateCircuitDocument(value: unknown): CircuitDocument {
  if (!isObject(value)) throw new Error("电路文档必须是对象。");
  if (value.schemaVersion !== CIRCUIT_SCHEMA_VERSION) throw new Error("电路文档版本不受支持。");
  if (!isText(value.id) || !isText(value.name)) throw new Error("电路 id 和名称不能为空。");
  if (value.kind !== "digital" && value.kind !== "analog") throw new Error("电路类型无效。");
  if (!isObject(value.components) || !isObject(value.connections)) throw new Error("电路元件或连线不是规范化记录。");
  if (!isText(value.createdAt) || Number.isNaN(Date.parse(value.createdAt)) || !isText(value.updatedAt) || Number.isNaN(Date.parse(value.updatedAt))) throw new Error("电路时间戳无效。");
  const draft = structuredClone(value as unknown as CircuitDocument);
  const components: Record<string, CircuitComponent> = {};
  for (const [key, component] of Object.entries(value.components)) components[key] = validateComponent(component, draft, key);
  const connections: CircuitDocument["connections"] = {};
  for (const [key, connection] of Object.entries(value.connections)) {
    if (!isObject(connection) || connection.id !== key || !isObject(connection.from) || !isObject(connection.to)) throw new Error(`连线 ${key} 无效。`);
    const endpoints = [connection.from, connection.to];
    for (const endpoint of endpoints) {
      if (!isText(endpoint.componentId) || !isText(endpoint.portId)) throw new Error(`连线 ${key} 的端点无效。`);
      const component = components[endpoint.componentId];
      if (!component || !getPortDefinition(component, endpoint.portId)) throw new Error(`连线 ${key} 指向不存在的端口。`);
    }
    connections[key] = structuredClone(connection as unknown as CircuitDocument["connections"][string]);
  }
  for (const component of Object.values(components)) {
    if (!componentPorts[component.kind]?.length) throw new Error(`元件 ${component.id} 没有端口定义。`);
  }
  return { ...draft, components, connections };
}

export function serializeCircuitLibrary(circuits: Record<string, CircuitDocument>): string {
  const validated: Record<string, CircuitDocument> = {};
  for (const [id, circuit] of Object.entries(circuits)) {
    const next = validateCircuitDocument(circuit);
    if (next.id !== id) throw new Error(`电路库键 ${id} 与文档 id 不一致。`);
    validated[id] = next;
  }
  return JSON.stringify({ schemaVersion: CIRCUIT_SCHEMA_VERSION, circuits: validated } satisfies CircuitLibraryEnvelope);
}

export function parseCircuitLibrary(serialized: string): Record<string, CircuitDocument> {
  let input: unknown;
  try {
    input = JSON.parse(serialized.replace(/^\uFEFF/, "")) as unknown;
  } catch (error) {
    throw new Error("电路库不是有效的 JSON。", { cause: error });
  }
  if (!isObject(input) || input.schemaVersion !== CIRCUIT_SCHEMA_VERSION || !isObject(input.circuits)) throw new Error("电路库版本或结构无效。");
  const circuits: Record<string, CircuitDocument> = {};
  for (const [id, circuit] of Object.entries(input.circuits)) {
    const next = validateCircuitDocument(circuit);
    if (next.id !== id) throw new Error(`电路库键 ${id} 与文档 id 不一致。`);
    circuits[id] = next;
  }
  return circuits;
}

export function loadCircuitLibrary(storage: CircuitStorageLike | null = browserStorage()): Record<string, CircuitDocument> {
  if (!storage) return {};
  const serialized = storage.getItem(CIRCUIT_STORAGE_KEY);
  return serialized ? parseCircuitLibrary(serialized) : {};
}

function persist(circuits: Record<string, CircuitDocument>, storage: CircuitStorageLike | null): void {
  if (!storage) throw new Error("当前浏览器不支持本地电路存储。");
  storage.setItem(CIRCUIT_STORAGE_KEY, serializeCircuitLibrary(circuits));
}

export function listCircuits(storage: CircuitStorageLike | null = browserStorage()): CircuitDocument[] {
  return Object.values(loadCircuitLibrary(storage)).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function loadCircuit(circuitId: string, storage: CircuitStorageLike | null = browserStorage()): CircuitDocument | null {
  const circuit = loadCircuitLibrary(storage)[circuitId];
  return circuit ? structuredClone(circuit) : null;
}

export function saveCircuit(circuit: CircuitDocument, storage: CircuitStorageLike | null = browserStorage()): CircuitDocument {
  const validated = validateCircuitDocument(circuit);
  const circuits = loadCircuitLibrary(storage);
  circuits[validated.id] = validated;
  persist(circuits, storage);
  return structuredClone(validated);
}

export function deleteCircuit(circuitId: string, storage: CircuitStorageLike | null = browserStorage()): boolean {
  const circuits = loadCircuitLibrary(storage);
  if (!circuits[circuitId]) return false;
  delete circuits[circuitId];
  persist(circuits, storage);
  return true;
}

export function copyStoredCircuit(
  sourceCircuitId: string,
  newCircuitId: string,
  name?: string,
  storage: CircuitStorageLike | null = browserStorage(),
  timestamp = new Date().toISOString(),
): CircuitDocument {
  const circuits = loadCircuitLibrary(storage);
  const source = circuits[sourceCircuitId];
  if (!source) throw new Error(`找不到电路 ${sourceCircuitId}。`);
  if (circuits[newCircuitId]) throw new Error(`电路 ${newCircuitId} 已存在。`);
  const copy = copyCircuit(source, newCircuitId, name ?? `${source.name} 副本`, timestamp);
  circuits[copy.id] = copy;
  persist(circuits, storage);
  return structuredClone(copy);
}

export function clearCircuitLibrary(storage: CircuitStorageLike | null = browserStorage()): void {
  if (!storage) throw new Error("当前浏览器不支持本地电路存储。");
  storage.removeItem(CIRCUIT_STORAGE_KEY);
}
