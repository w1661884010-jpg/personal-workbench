import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let graph;
let storage;

before(async () => {
  vite = await createServer({ appType: "custom", configFile: false, logLevel: "silent", root: process.cwd(), server: { middlewareMode: true } });
  [graph, storage] = await Promise.all([
    vite.ssrLoadModule("/app/lib/circuit/graph.ts"),
    vite.ssrLoadModule("/app/lib/circuit/circuit-storage.ts"),
  ]);
});
after(async () => vite?.close());

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test("normalized graph supports component CRUD, movement, orientation, parameters, connection cleanup, and reset", () => {
  let circuit = graph.createCircuit("digital", "logic-1", "逻辑实验", "2026-08-24T00:00:00.000Z");
  circuit = graph.addComponent(circuit, graph.createComponent("s1", "switch", { x: 10, y: 20 }));
  circuit = graph.addComponent(circuit, graph.createComponent("led1", "led", { x: 200, y: 20 }));
  circuit = graph.connect(circuit, { id: "wire-1", from: { componentId: "s1", portId: "out" }, to: { componentId: "led1", portId: "in" } });

  assert.deepEqual(Object.keys(circuit.components).sort(), ["led1", "s1"]);
  assert.deepEqual(Object.keys(circuit.connections), ["wire-1"]);
  assert.equal(graph.buildNetlist(circuit).terminalToNet["s1.out"], graph.buildNetlist(circuit).terminalToNet["led1.in"]);

  circuit = graph.moveComponent(circuit, "led1", { x: 260, y: 80 });
  circuit = graph.transformComponent(circuit, "led1", { rotation: 90, flipped: true });
  circuit = graph.updateComponentParameters(circuit, "s1", { state: true });
  assert.deepEqual(circuit.components.led1.position, { x: 260, y: 80 });
  assert.equal(circuit.components.led1.rotation, 90);
  assert.equal(circuit.components.led1.flipped, true);
  assert.equal(circuit.components.s1.parameters.state, true);

  circuit = graph.removeComponent(circuit, "s1");
  assert.equal(circuit.components.s1, undefined);
  assert.deepEqual(circuit.connections, {});
  assert.deepEqual(graph.resetCircuit(circuit).components, {});
});

test("graph rejects incompatible components, invalid ports, and duplicate wires", () => {
  let digital = graph.createCircuit("digital", "d", "数字");
  assert.throws(() => graph.addComponent(digital, graph.createComponent("r", "resistor", { x: 0, y: 0 })), /不能放入/);
  digital = graph.addComponent(digital, graph.createComponent("s", "switch", { x: 0, y: 0 }));
  digital = graph.addComponent(digital, graph.createComponent("l", "led", { x: 1, y: 0 }));
  assert.throws(() => graph.connect(digital, { id: "bad", from: { componentId: "s", portId: "missing" }, to: { componentId: "l", portId: "in" } }), /没有端口/);
  digital = graph.connect(digital, { id: "w", from: { componentId: "s", portId: "out" }, to: { componentId: "l", portId: "in" } });
  assert.throws(() => graph.connect(digital, { id: "w2", from: { componentId: "l", portId: "in" }, to: { componentId: "s", portId: "out" } }), /已经连接/);
});

test("versioned local circuit library saves, loads, copies, deletes, and rejects damaged documents", () => {
  const local = memoryStorage();
  let circuit = graph.createCircuit("analog", "rc", "RC 电路", "2026-08-24T00:00:00.000Z");
  circuit = graph.addComponent(circuit, { ...graph.createComponent("g", "ground", { x: 0, y: 0 }), rotation: 270, flipped: true }, "2026-08-24T00:01:00.000Z");
  storage.saveCircuit(circuit, local);

  const loaded = storage.loadCircuit("rc", local);
  assert.deepEqual(loaded, circuit);
  assert.equal(loaded.components.g.rotation, 270);
  assert.equal(loaded.components.g.flipped, true);
  assert.notEqual(loaded, circuit);
  assert.equal(storage.listCircuits(local).length, 1);

  const copied = storage.copyStoredCircuit("rc", "rc-copy", "RC 副本", local, "2026-08-24T00:02:00.000Z");
  assert.equal(copied.id, "rc-copy");
  assert.equal(storage.listCircuits(local).length, 2);
  assert.equal(storage.deleteCircuit("rc", local), true);
  assert.equal(storage.loadCircuit("rc", local), null);

  const serialized = local.getItem(storage.CIRCUIT_STORAGE_KEY);
  const damagedVersion = JSON.parse(serialized);
  damagedVersion.schemaVersion = 99;
  assert.throws(() => storage.parseCircuitLibrary(JSON.stringify(damagedVersion)), /版本或结构/);
  const damagedReference = JSON.parse(serialized);
  damagedReference.circuits["rc-copy"].connections.bad = { id: "bad", from: { componentId: "missing", portId: "p" }, to: { componentId: "g", portId: "g" } };
  assert.throws(() => storage.parseCircuitLibrary(JSON.stringify(damagedReference)), /不存在的端口/);
  const oldDocument = JSON.parse(serialized);
  delete oldDocument.circuits["rc-copy"].components.g.rotation;
  delete oldDocument.circuits["rc-copy"].components.g.flipped;
  const migrated = storage.parseCircuitLibrary(JSON.stringify(oldDocument));
  assert.equal(migrated["rc-copy"].components.g.rotation, 0);
  assert.equal(migrated["rc-copy"].components.g.flipped, false);
  storage.clearCircuitLibrary(local);
  assert.deepEqual(storage.listCircuits(local), []);
});
