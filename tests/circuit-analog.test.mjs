import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let graph;
let analog;

before(async () => {
  vite = await createServer({ appType: "custom", configFile: false, logLevel: "silent", root: process.cwd(), server: { middlewareMode: true } });
  [graph, analog] = await Promise.all([
    vite.ssrLoadModule("/app/lib/circuit/graph.ts"),
    vite.ssrLoadModule("/app/lib/circuit/analog-simulator.ts"),
  ]);
});
after(async () => vite?.close());

function add(circuit, id, kind, parameters = {}) {
  return graph.addComponent(circuit, graph.createComponent(id, kind, { x: 0, y: 0 }, parameters));
}

function wire(circuit, id, fromComponent, fromPort, toComponent, toPort) {
  return graph.connect(circuit, { id, from: { componentId: fromComponent, portId: fromPort }, to: { componentId: toComponent, portId: toPort } });
}

test("linear DC MNA solves a voltage divider and ideal voltmeter", () => {
  let circuit = graph.createCircuit("analog", "divider", "分压器");
  circuit = add(circuit, "v", "dc-source", { voltage: 10 });
  circuit = add(circuit, "r1", "resistor", { resistanceOhms: 1000 });
  circuit = add(circuit, "r2", "resistor", { resistanceOhms: 1000 });
  circuit = add(circuit, "meter", "voltmeter");
  circuit = add(circuit, "g", "ground");
  circuit = wire(circuit, "g1", "v", "n", "g", "g");
  circuit = wire(circuit, "in", "v", "p", "r1", "p");
  circuit = wire(circuit, "mid1", "r1", "n", "r2", "p");
  circuit = wire(circuit, "mid2", "r1", "n", "meter", "p");
  circuit = wire(circuit, "out1", "r2", "n", "g", "g");
  circuit = wire(circuit, "out2", "meter", "n", "g", "g");
  const result = analog.solveAnalogDc(circuit);
  assert.equal(result.ok, true);
  assert.equal(result.model, "linear-dc-mna");
  assert.ok(Math.abs(result.meterReadings.meter - 5) < 1e-9);
  assert.ok(Math.abs(result.componentCurrents.r1 - 0.005) < 1e-9);
});

test("ideal ammeter is stamped as a zero-volt source and reports branch current", () => {
  let circuit = graph.createCircuit("analog", "ammeter", "电流表");
  circuit = add(circuit, "v", "dc-source", { voltage: 5 }); circuit = add(circuit, "a", "ammeter"); circuit = add(circuit, "r", "resistor", { resistanceOhms: 1000 }); circuit = add(circuit, "g", "ground");
  circuit = wire(circuit, "w1", "v", "p", "a", "p"); circuit = wire(circuit, "w2", "a", "n", "r", "p"); circuit = wire(circuit, "w3", "r", "n", "g", "g"); circuit = wire(circuit, "w4", "v", "n", "g", "g");
  const result = analog.solveAnalogDc(circuit);
  assert.equal(result.ok, true);
  assert.ok(Math.abs(Math.abs(result.meterReadings.a) - 0.005) < 1e-9);
});

test("RC transient uses numerical integration and approaches the analytic charging curve", () => {
  let circuit = graph.createCircuit("analog", "rc", "RC 充电");
  circuit = add(circuit, "v", "dc-source", { voltage: 1 }); circuit = add(circuit, "r", "resistor", { resistanceOhms: 1000 }); circuit = add(circuit, "c", "capacitor", { capacitanceFarads: 0.0001, initialVoltage: 0 }); circuit = add(circuit, "g", "ground");
  circuit = wire(circuit, "w1", "v", "p", "r", "p"); circuit = wire(circuit, "w2", "r", "n", "c", "p"); circuit = wire(circuit, "w3", "c", "n", "g", "g"); circuit = wire(circuit, "w4", "v", "n", "g", "g");
  const outputNet = graph.buildNetlist(circuit).terminalToNet["c.p"];
  const result = analog.simulateAnalogTransient(circuit, { durationSeconds: 0.1, timeStepSeconds: 0.001 });
  assert.equal(result.ok, true);
  assert.equal(result.model, "linear-transient-backward-euler");
  const finalVoltage = result.nodeTraces[outputNet].at(-1).voltage;
  assert.ok(Math.abs(finalVoltage - (1 - Math.exp(-1))) < 0.005, `Vout=${finalVoltage}`);
  assert.match(result.warnings.join(" "), /后向欧拉/);
});

test("unsupported nonlinear devices return explicit model warnings and no invented waveform", () => {
  let circuit = graph.createCircuit("analog", "nonlinear", "非线性");
  circuit = add(circuit, "d", "diode"); circuit = add(circuit, "q", "bjt"); circuit = add(circuit, "op", "opamp"); circuit = add(circuit, "g", "ground");
  const dc = analog.solveAnalogDc(circuit);
  assert.equal(dc.ok, false);
  assert.equal(dc.model, "unsupported-nonlinear");
  assert.deepEqual(dc.nodeVoltages, {});
  assert.equal(dc.diagnostics.filter((item) => item.code === "unsupported-model").length, 3);
  const transient = analog.simulateAnalogTransient(circuit, { durationSeconds: 0.01, timeStepSeconds: 0.001 });
  assert.equal(transient.ok, false);
  assert.deepEqual(transient.samples, []);
  assert.deepEqual(transient.nodeTraces, {});
  assert.match(transient.warnings.join(" "), /没有生成替代波形/);
});

test("missing ground and singular floating circuits fail without fake measurements", () => {
  let circuit = graph.createCircuit("analog", "floating", "悬空");
  circuit = add(circuit, "v", "dc-source", { voltage: 5 }); circuit = add(circuit, "r", "resistor", { resistanceOhms: 1000 });
  circuit = wire(circuit, "w", "v", "p", "r", "p");
  const result = analog.solveAnalogDc(circuit);
  assert.equal(result.ok, false);
  assert.deepEqual(result.nodeVoltages, {});
  assert.ok(result.diagnostics.some((item) => item.code === "singular-circuit"));
});
