import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let geometry;
let graph;

before(async () => {
  vite = await createServer({ appType: "custom", configFile: false, logLevel: "silent", root: process.cwd(), server: { middlewareMode: true } });
  [geometry, graph] = await Promise.all([
    vite.ssrLoadModule("/app/lib/circuit/geometry.ts"),
    vite.ssrLoadModule("/app/lib/circuit/graph.ts"),
  ]);
});
after(async () => vite?.close());

test("rotation and horizontal flip move ports while keeping labels upright in the renderer", () => {
  const base = graph.createComponent("gate", "not", { x: 240, y: 180 });
  const input = geometry.getPortGeometry(base, "in");
  const output = geometry.getPortGeometry(base, "out");
  assert.ok(input.point.x < base.position.x);
  assert.ok(output.point.x > base.position.x);

  const flipped = { ...base, flipped: true };
  assert.ok(geometry.getPortGeometry(flipped, "in").point.x > base.position.x);
  assert.ok(geometry.getPortGeometry(flipped, "out").point.x < base.position.x);

  const rotated = { ...base, rotation: 90 };
  assert.ok(geometry.getPortGeometry(rotated, "in").point.y < base.position.y);
  assert.ok(geometry.getPortGeometry(rotated, "out").point.y > base.position.y);
  assert.deepEqual(geometry.getComponentSize(rotated), { width: geometry.getComponentSize(base).height, height: geometry.getComponentSize(base).width });
});

test("placement and legacy loading separate overlapping component bounds", () => {
  let circuit = graph.createCircuit("analog", "overlap", "重叠测试", "2026-08-25T00:00:00.000Z");
  const source = graph.createComponent("source", "dc-source", { x: 180, y: 160 });
  circuit = graph.addComponent(circuit, source);
  const bjt = graph.createComponent("bjt", "bjt", { x: 180, y: 160 });
  const available = geometry.findAvailablePosition(circuit, bjt, bjt.position);
  assert.notDeepEqual(available, bjt.position);

  circuit = graph.addComponent(circuit, bjt);
  const separated = geometry.separateOverlappingComponents(circuit);
  assert.equal(geometry.componentsOverlap(separated.components.source, separated.components.bjt), false);
  assert.deepEqual(separated.connections, circuit.connections, "position repair must preserve wires");
});

test("wire routing exposes lead segments instead of hiding a short connection under bodies", () => {
  const from = { point: { x: 200, y: 200 }, normal: { x: 1, y: 0 } };
  const to = { point: { x: 236, y: 210 }, normal: { x: -1, y: 0 } };
  const path = geometry.createWirePath(from, to);
  assert.match(path, /^M 200 200 L 218 200/);
  assert.match(path, /L 218 210 L 236 210$/);
});
