import { addComponent, connect, createCircuit, createComponent } from "../lib/circuit/graph";
import type { CircuitComponentKind, CircuitDocument } from "../lib/circuit/types";

const presetTimestamp = "2026-08-31T00:00:00.000Z";

type ComponentSpec = {
  id: string;
  kind: CircuitComponentKind;
  x: number;
  y: number;
  label: string;
  parameters?: Record<string, string | number | boolean>;
};

type WireSpec = [id: string, fromComponent: string, fromPort: string, toComponent: string, toPort: string];

function buildPreset(
  kind: "digital" | "analog",
  id: string,
  name: string,
  components: readonly ComponentSpec[],
  wires: readonly WireSpec[],
): CircuitDocument {
  let circuit = createCircuit(kind, id, name, presetTimestamp);
  for (const component of components) {
    circuit = addComponent(circuit, createComponent(
      component.id,
      component.kind,
      { x: component.x, y: component.y },
      component.parameters,
      component.label,
    ), presetTimestamp);
  }
  for (const [wireId, fromComponent, fromPort, toComponent, toPort] of wires) {
    circuit = connect(circuit, {
      id: wireId,
      from: { componentId: fromComponent, portId: fromPort },
      to: { componentId: toComponent, portId: toPort },
    }, presetTimestamp);
  }
  return circuit;
}

const presets = new Map<string, CircuitDocument>([
  ["digital-full-adder", buildPreset("digital", "preset-digital-full-adder", "一位全加器", [
    { id: "a", kind: "switch", x: 120, y: 130, label: "A" },
    { id: "b", kind: "switch", x: 120, y: 260, label: "B" },
    { id: "cin", kind: "switch", x: 120, y: 390, label: "Cin" },
    { id: "xor1", kind: "xor", x: 360, y: 190, label: "A⊕B" },
    { id: "xor2", kind: "xor", x: 610, y: 190, label: "SUM" },
    { id: "and1", kind: "and", x: 360, y: 390, label: "AB" },
    { id: "and2", kind: "and", x: 610, y: 390, label: "Cin(A⊕B)" },
    { id: "or1", kind: "or", x: 820, y: 390, label: "Cout" },
    { id: "sumLed", kind: "led", x: 850, y: 190, label: "S" },
    { id: "carryLed", kind: "led", x: 1040, y: 390, label: "Cout" },
  ], [
    ["w1", "a", "out", "xor1", "a"], ["w2", "b", "out", "xor1", "b"],
    ["w3", "a", "out", "and1", "a"], ["w4", "b", "out", "and1", "b"],
    ["w5", "xor1", "out", "xor2", "a"], ["w6", "cin", "out", "xor2", "b"],
    ["w7", "xor1", "out", "and2", "a"], ["w8", "cin", "out", "and2", "b"],
    ["w9", "and1", "out", "or1", "a"], ["w10", "and2", "out", "or1", "b"],
    ["w11", "xor2", "out", "sumLed", "in"], ["w12", "or1", "out", "carryLed", "in"],
  ])],
  ["digital-d-flipflop", buildPreset("digital", "preset-digital-dff", "D 触发器边沿采样", [
    { id: "d", kind: "switch", x: 170, y: 210, label: "D" },
    { id: "clk", kind: "clock", x: 170, y: 390, label: "CLK", parameters: { frequencyHz: 1 } },
    { id: "dff", kind: "dff", x: 500, y: 300, label: "DFF" },
    { id: "q", kind: "led", x: 830, y: 240, label: "Q" },
    { id: "nq", kind: "led", x: 830, y: 370, label: "Q̅" },
  ], [
    ["w1", "d", "out", "dff", "d"], ["w2", "clk", "out", "dff", "clk"],
    ["w3", "dff", "q", "q", "in"], ["w4", "dff", "nq", "nq", "in"],
  ])],
  ["digital-counter-3bit", buildPreset("digital", "preset-digital-counter", "三位同步计数器", [
    { id: "clk", kind: "clock", x: 180, y: 320, label: "1 Hz", parameters: { frequencyHz: 1 } },
    { id: "counter", kind: "counter", x: 500, y: 320, label: "3-bit", parameters: { width: 3, initialCount: 0 } },
    { id: "q0", kind: "led", x: 850, y: 200, label: "Q0" },
    { id: "q1", kind: "led", x: 850, y: 320, label: "Q1" },
    { id: "q2", kind: "led", x: 850, y: 440, label: "Q2" },
  ], [
    ["w1", "clk", "out", "counter", "clk"], ["w2", "counter", "q0", "q0", "in"],
    ["w3", "counter", "q1", "q1", "in"], ["w4", "counter", "q2", "q2", "in"],
  ])],
  ["analog-continuous-input", buildPreset("analog", "preset-analog-continuous", "连续输入观察", [
    { id: "source", kind: "signal-source", x: 220, y: 270, label: "Vin", parameters: { waveform: "sine", amplitude: 1, frequencyHz: 1, offset: 0 } },
    { id: "meter", kind: "voltmeter", x: 650, y: 250, label: "Vout" },
    { id: "ground", kind: "ground", x: 440, y: 500, label: "GND" },
  ], [
    ["w1", "source", "p", "meter", "p"], ["w2", "source", "n", "ground", "g"],
    ["w3", "meter", "n", "ground", "g"],
  ])],
  ["analog-differential-inputs", buildPreset("analog", "preset-analog-differential", "差模与共模输入", [
    { id: "v1", kind: "dc-source", x: 180, y: 180, label: "v1", parameters: { voltage: 1 } },
    { id: "v2", kind: "dc-source", x: 180, y: 420, label: "v2", parameters: { voltage: -1 } },
    { id: "m1", kind: "voltmeter", x: 620, y: 180, label: "V1" },
    { id: "m2", kind: "voltmeter", x: 620, y: 420, label: "V2" },
    { id: "ground", kind: "ground", x: 410, y: 600, label: "GND" },
  ], [
    ["w1", "v1", "p", "m1", "p"], ["w2", "v1", "n", "ground", "g"],
    ["w3", "m1", "n", "ground", "g"], ["w4", "v2", "p", "m2", "p"],
    ["w5", "v2", "n", "ground", "g"], ["w6", "m2", "n", "ground", "g"],
  ])],
  ["analog-rc-frequency", buildPreset("analog", "preset-analog-rc-frequency", "一阶 RC 频点", [
    { id: "source", kind: "signal-source", x: 150, y: 300, label: "Vin", parameters: { waveform: "sine", amplitude: 1, frequencyHz: 100, offset: 0 } },
    { id: "resistor", kind: "resistor", x: 430, y: 220, label: "1 kΩ", parameters: { resistanceOhms: 1000 } },
    { id: "capacitor", kind: "capacitor", x: 690, y: 380, label: "1 µF", parameters: { capacitanceFarads: 0.000001, initialVoltage: 0 } },
    { id: "meter", kind: "voltmeter", x: 900, y: 270, label: "Vout" },
    { id: "ground", kind: "ground", x: 520, y: 580, label: "GND" },
  ], [
    ["w1", "source", "p", "resistor", "p"], ["w2", "resistor", "n", "capacitor", "p"],
    ["w3", "resistor", "n", "meter", "p"], ["w4", "source", "n", "ground", "g"],
    ["w5", "capacitor", "n", "ground", "g"], ["w6", "meter", "n", "ground", "g"],
  ])],
  ["analog-rc-selection", buildPreset("analog", "preset-analog-rc-selection", "RC 选频网络", [
    { id: "source", kind: "signal-source", x: 150, y: 300, label: "Vin", parameters: { waveform: "sine", amplitude: 1, frequencyHz: 1000, offset: 0 } },
    { id: "resistor", kind: "resistor", x: 430, y: 220, label: "10 kΩ", parameters: { resistanceOhms: 10000 } },
    { id: "capacitor", kind: "capacitor", x: 690, y: 380, label: "10 nF", parameters: { capacitanceFarads: 0.00000001, initialVoltage: 0 } },
    { id: "meter", kind: "voltmeter", x: 900, y: 270, label: "Vout" },
    { id: "ground", kind: "ground", x: 520, y: 580, label: "GND" },
  ], [
    ["w1", "source", "p", "resistor", "p"], ["w2", "resistor", "n", "capacitor", "p"],
    ["w3", "resistor", "n", "meter", "p"], ["w4", "source", "n", "ground", "g"],
    ["w5", "capacitor", "n", "ground", "g"], ["w6", "meter", "n", "ground", "g"],
  ])],
  ["analog-resistive-load", buildPreset("analog", "preset-analog-load", "纯电阻负载功率", [
    { id: "source", kind: "dc-source", x: 150, y: 300, label: "5 V", parameters: { voltage: 5 } },
    { id: "ammeter", kind: "ammeter", x: 390, y: 200, label: "Iload" },
    { id: "load", kind: "resistor", x: 650, y: 250, label: "1 kΩ", parameters: { resistanceOhms: 1000 } },
    { id: "voltmeter", kind: "voltmeter", x: 900, y: 300, label: "Vload" },
    { id: "ground", kind: "ground", x: 500, y: 580, label: "GND" },
  ], [
    ["w1", "source", "p", "ammeter", "p"], ["w2", "ammeter", "n", "load", "p"],
    ["w3", "load", "p", "voltmeter", "p"], ["w4", "load", "n", "ground", "g"],
    ["w5", "source", "n", "ground", "g"], ["w6", "voltmeter", "n", "ground", "g"],
  ])],
]);

export function getCircuitPreset(presetId: string | undefined): CircuitDocument | null {
  if (!presetId) return null;
  const preset = presets.get(presetId);
  return preset ? structuredClone(preset) : null;
}

export const circuitPresetIds = new Set(presets.keys());
