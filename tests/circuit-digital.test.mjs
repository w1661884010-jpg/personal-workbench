import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let graph;
let digital;

before(async () => {
  vite = await createServer({ appType: "custom", configFile: false, logLevel: "silent", root: process.cwd(), server: { middlewareMode: true } });
  [graph, digital] = await Promise.all([
    vite.ssrLoadModule("/app/lib/circuit/graph.ts"),
    vite.ssrLoadModule("/app/lib/circuit/digital-simulator.ts"),
  ]);
});
after(async () => vite?.close());

function add(circuit, id, kind, parameters = {}) {
  return graph.addComponent(circuit, graph.createComponent(id, kind, { x: 0, y: 0 }, parameters));
}

function wire(circuit, id, fromComponent, fromPort, toComponent, toPort) {
  return graph.connect(circuit, { id, from: { componentId: fromComponent, portId: fromPort }, to: { componentId: toComponent, portId: toPort } });
}

function twoInputGate(kind, a, b) {
  let circuit = graph.createCircuit("digital", `${kind}-${a}-${b}`, kind);
  circuit = add(circuit, "a", "switch", { state: a });
  circuit = add(circuit, "b", "switch", { state: b });
  circuit = add(circuit, "gate", kind);
  circuit = add(circuit, "led", "led");
  circuit = wire(circuit, "wa", "a", "out", "gate", "a");
  circuit = wire(circuit, "wb", "b", "out", "gate", "b");
  circuit = wire(circuit, "wo", "gate", "out", "led", "in");
  return digital.evaluateDigitalCircuit(circuit).terminalValues["led.in"];
}

test("all combinational gates produce real 0/1 logic and truth tables", () => {
  assert.equal(twoInputGate("and", 1, 1), 1);
  assert.equal(twoInputGate("or", 0, 1), 1);
  assert.equal(twoInputGate("xor", 1, 1), 0);
  assert.equal(twoInputGate("nand", 1, 1), 0);
  assert.equal(twoInputGate("nor", 0, 0), 1);

  let circuit = graph.createCircuit("digital", "not", "NOT");
  circuit = add(circuit, "s", "switch", { state: 0 });
  circuit = add(circuit, "n", "not");
  circuit = add(circuit, "led", "led");
  circuit = wire(circuit, "w1", "s", "out", "n", "in");
  circuit = wire(circuit, "w2", "n", "out", "led", "in");
  assert.equal(digital.evaluateDigitalCircuit(circuit).indicators.led, "on");

  const andCircuit = (() => {
    let value = graph.createCircuit("digital", "truth", "AND 真值表");
    value = add(value, "a", "switch"); value = add(value, "b", "switch"); value = add(value, "gate", "and"); value = add(value, "led", "led");
    value = wire(value, "a1", "a", "out", "gate", "a"); value = wire(value, "b1", "b", "out", "gate", "b"); value = wire(value, "o", "gate", "out", "led", "in");
    return value;
  })();
  const rows = digital.generateTruthTable(andCircuit, { observationTerminals: ["led.in"] });
  assert.deepEqual(rows.map((row) => row.outputs["led.in"]), [0, 0, 0, 1]);
});

test("decoder and seven-segment expose evaluated outputs rather than preset animation", () => {
  let circuit = graph.createCircuit("digital", "decoder", "译码显示");
  circuit = add(circuit, "a0", "switch", { state: 1 });
  circuit = add(circuit, "a1", "switch", { state: 0 });
  circuit = add(circuit, "a2", "switch", { state: 1 });
  circuit = add(circuit, "dec", "decoder");
  circuit = add(circuit, "display", "seven-segment");
  for (const bit of ["a0", "a1", "a2"]) circuit = wire(circuit, `w-${bit}`, bit, "out", "dec", bit);
  for (let index = 0; index < 7; index += 1) circuit = wire(circuit, `seg-${index}`, "dec", `y${index}`, "display", ["a", "b", "c", "d", "e", "f", "g"][index]);
  const result = digital.evaluateDigitalCircuit(circuit);
  assert.equal(result.outputValues["dec.y5"], 1);
  assert.equal(result.indicators.display, "0000010X");
});

function sequentialCircuit(kind, inputs) {
  let circuit = graph.createCircuit("digital", kind, kind);
  circuit = add(circuit, "clk", "switch", { state: 0 });
  circuit = add(circuit, "seq", kind, kind === "counter" ? { width: 2 } : { initialQ: 0 });
  circuit = wire(circuit, "clock", "clk", "out", "seq", "clk");
  for (const [port, value] of Object.entries(inputs)) {
    circuit = add(circuit, port, "switch", { state: value });
    circuit = wire(circuit, `w-${port}`, port, "out", "seq", port);
  }
  return circuit;
}

function risingEdge(circuit, runtime) {
  const low = digital.evaluateDigitalCircuit(circuit, { runtime });
  const highCircuit = structuredClone(circuit);
  highCircuit.components.clk.parameters.state = 1;
  return digital.evaluateDigitalCircuit(highCircuit, { runtime: low.runtime });
}

test("D, JK and T flip-flops plus counter update only on a rising edge", () => {
  const d = risingEdge(sequentialCircuit("dff", { d: 1 }));
  assert.equal(d.outputValues["seq.q"], 1);
  const jk = risingEdge(sequentialCircuit("jkff", { j: 1, k: 1 }));
  assert.equal(jk.outputValues["seq.q"], 1);
  const t = risingEdge(sequentialCircuit("tff", { t: 1 }));
  assert.equal(t.outputValues["seq.q"], 1);
  const counter = risingEdge(sequentialCircuit("counter", {}));
  assert.equal(counter.outputValues["seq.q0"], 1);
  assert.equal(counter.outputValues["seq.q1"], 0);
});

test("clock sampling records real transitions for probes and logic analysis", () => {
  let circuit = graph.createCircuit("digital", "clock-sample", "时钟采样");
  circuit = add(circuit, "clock", "clock", { frequencyHz: 1 });
  circuit = add(circuit, "led", "led");
  circuit = wire(circuit, "w", "clock", "out", "led", "in");
  const sampled = digital.sampleDigitalCircuit(circuit, { durationSeconds: 1, sampleRateHz: 4, terminals: ["led.in"] });
  assert.deepEqual(sampled.traces["led.in"].map((sample) => sample.value), [0, 0, 1, 1, 0]);
});

test("floating inputs, conflicting drivers and combinational loops are diagnosed as X", () => {
  let floating = graph.createCircuit("digital", "floating", "悬空");
  floating = add(floating, "g", "and");
  const floatingResult = digital.evaluateDigitalCircuit(floating);
  assert.equal(floatingResult.outputValues["g.out"], "X");
  assert.ok(floatingResult.diagnostics.some((item) => item.code === "dangling-input"));

  let conflict = graph.createCircuit("digital", "conflict", "冲突");
  conflict = add(conflict, "low", "switch", { state: 0 }); conflict = add(conflict, "high", "switch", { state: 1 }); conflict = add(conflict, "led", "led");
  conflict = wire(conflict, "w1", "low", "out", "led", "in"); conflict = wire(conflict, "w2", "high", "out", "led", "in");
  const conflictResult = digital.evaluateDigitalCircuit(conflict);
  assert.equal(conflictResult.terminalValues["led.in"], "X");
  assert.ok(conflictResult.diagnostics.some((item) => item.code === "driver-conflict"));

  let loop = graph.createCircuit("digital", "loop", "组合环");
  loop = add(loop, "n1", "not"); loop = add(loop, "n2", "not");
  loop = wire(loop, "l1", "n1", "out", "n2", "in"); loop = wire(loop, "l2", "n2", "out", "n1", "in");
  assert.ok(digital.evaluateDigitalCircuit(loop).diagnostics.some((item) => item.code === "combinational-loop"));
});
