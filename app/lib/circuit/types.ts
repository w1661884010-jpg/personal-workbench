export const CIRCUIT_SCHEMA_VERSION = 1 as const;

export type CircuitKind = "digital" | "analog";
export type PortDirection = "input" | "output" | "passive";
export type LogicValue = 0 | 1 | "X";

export type DigitalComponentKind =
  | "switch"
  | "clock"
  | "not"
  | "and"
  | "or"
  | "xor"
  | "nand"
  | "nor"
  | "dff"
  | "jkff"
  | "tff"
  | "counter"
  | "decoder"
  | "led"
  | "seven-segment";

export type AnalogComponentKind =
  | "ground"
  | "resistor"
  | "capacitor"
  | "dc-source"
  | "signal-source"
  | "voltmeter"
  | "ammeter"
  | "diode"
  | "bjt"
  | "opamp";

export type CircuitComponentKind = DigitalComponentKind | AnalogComponentKind;
export type ComponentParameter = string | number | boolean;

export interface CircuitPoint {
  x: number;
  y: number;
}
export interface CircuitPortDefinition {
  id: string;
  direction: PortDirection;
  required?: boolean;
}

export interface CircuitComponent {
  id: string;
  kind: CircuitComponentKind;
  position: CircuitPoint;
  parameters: Record<string, ComponentParameter>;
  label?: string;
}

export interface CircuitEndpoint {
  componentId: string;
  portId: string;
}

export interface CircuitConnection {
  id: string;
  from: CircuitEndpoint;
  to: CircuitEndpoint;
}

export interface CircuitDocument {
  schemaVersion: typeof CIRCUIT_SCHEMA_VERSION;
  id: string;
  name: string;
  kind: CircuitKind;
  components: Record<string, CircuitComponent>;
  connections: Record<string, CircuitConnection>;
  courseId?: string;
  chapterId?: string;
  experimentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CircuitNetlist {
  terminalToNet: Record<string, string>;
  nets: Record<string, string[]>;
}

export interface CircuitDiagnostic {
  code:
    | "dangling-input"
    | "driver-conflict"
    | "combinational-loop"
    | "invalid-parameter"
    | "singular-circuit"
    | "unsupported-model";
  severity: "warning" | "error";
  message: string;
  componentIds?: string[];
  netId?: string;
}

const input = (id: string, required = true): CircuitPortDefinition => ({ id, direction: "input", required });
const output = (id: string): CircuitPortDefinition => ({ id, direction: "output" });
const passive = (id: string): CircuitPortDefinition => ({ id, direction: "passive" });

export const componentPorts: Readonly<Record<CircuitComponentKind, readonly CircuitPortDefinition[]>> = {
  switch: [output("out")],
  clock: [output("out")],
  not: [input("in"), output("out")],
  and: [input("a"), input("b"), output("out")],
  or: [input("a"), input("b"), output("out")],
  xor: [input("a"), input("b"), output("out")],
  nand: [input("a"), input("b"), output("out")],
  nor: [input("a"), input("b"), output("out")],
  dff: [input("d"), input("clk"), output("q"), output("nq")],
  jkff: [input("j"), input("k"), input("clk"), output("q"), output("nq")],
  tff: [input("t"), input("clk"), output("q"), output("nq")],
  counter: [input("clk"), input("reset", false), output("q0"), output("q1"), output("q2"), output("q3")],
  decoder: [input("a0"), input("a1"), input("a2"), input("enable", false), output("y0"), output("y1"), output("y2"), output("y3"), output("y4"), output("y5"), output("y6"), output("y7")],
  led: [input("in")],
  "seven-segment": [input("a"), input("b"), input("c"), input("d"), input("e"), input("f"), input("g"), input("dot", false)],
  ground: [passive("g")],
  resistor: [passive("p"), passive("n")],
  capacitor: [passive("p"), passive("n")],
  "dc-source": [passive("p"), passive("n")],
  "signal-source": [passive("p"), passive("n")],
  voltmeter: [passive("p"), passive("n")],
  ammeter: [passive("p"), passive("n")],
  diode: [passive("a"), passive("k")],
  bjt: [passive("c"), passive("b"), passive("e")],
  opamp: [passive("plus"), passive("minus"), passive("out"), passive("vplus"), passive("vminus")],
};

export const digitalComponentKinds = new Set<DigitalComponentKind>([
  "switch", "clock", "not", "and", "or", "xor", "nand", "nor", "dff", "jkff", "tff", "counter", "decoder", "led", "seven-segment",
]);

export const analogComponentKinds = new Set<AnalogComponentKind>([
  "ground", "resistor", "capacitor", "dc-source", "signal-source", "voltmeter", "ammeter", "diode", "bjt", "opamp",
]);

export function terminalKey(componentId: string, portId: string): string {
  return `${componentId}.${portId}`;
}

export function getPortDefinition(component: CircuitComponent, portId: string): CircuitPortDefinition | null {
  return componentPorts[component.kind].find((port) => port.id === portId) ?? null;
}
