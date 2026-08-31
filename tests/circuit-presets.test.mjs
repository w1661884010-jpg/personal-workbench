import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let presets;
let courseData;
let analog;
let digital;

before(async () => {
  vite = await createServer({ appType: "custom", configFile: false, logLevel: "silent", root: process.cwd(), server: { middlewareMode: true } });
  [presets, courseData, analog, digital] = await Promise.all([
    vite.ssrLoadModule("/app/data/circuit-presets.ts"),
    vite.ssrLoadModule("/app/data/courses/index.ts"),
    vite.ssrLoadModule("/app/lib/circuit/analog-simulator.ts"),
    vite.ssrLoadModule("/app/lib/circuit/digital-simulator.ts"),
  ]);
});

after(async () => vite?.close());

test("every advertised circuit preset exists and no notebook experiment advertises a dead preset", () => {
  const experiments = courseData.courses.flatMap((course) => course.chapters.flatMap((chapter) => chapter.experiments));
  const referenced = experiments.filter((experiment) => experiment.presetId);
  assert.equal(referenced.length, 8);
  assert.ok(experiments.filter((experiment) => experiment.workbench === "notebook").every((experiment) => !experiment.presetId));
  for (const experiment of referenced) {
    const preset = presets.getCircuitPreset(experiment.presetId);
    assert.ok(preset, `${experiment.id}: preset exists`);
    assert.equal(preset.kind, experiment.workbench);
    assert.ok(Object.keys(preset.components).length >= 3, `${experiment.id}: useful components`);
    assert.ok(Object.keys(preset.connections).length >= 2, `${experiment.id}: useful wiring`);
  }
});

test("digital experiment presets are evaluated by the real logic engine", () => {
  for (const presetId of ["digital-full-adder", "digital-d-flipflop", "digital-counter-3bit"]) {
    const result = digital.evaluateDigitalCircuit(presets.getCircuitPreset(presetId));
    assert.ok(Object.keys(result.outputValues).length > 0, `${presetId}: evaluated outputs`);
    assert.equal(result.diagnostics.some((item) => item.code === "combinational-loop" || item.code === "driver-conflict"), false);
  }
});

test("analog runnable presets stay inside the verified linear solver boundary", () => {
  for (const presetId of ["analog-continuous-input", "analog-differential-inputs", "analog-rc-frequency", "analog-rc-selection", "analog-resistive-load"]) {
    const preset = presets.getCircuitPreset(presetId);
    assert.equal(Object.values(preset.components).some((component) => ["diode", "bjt", "opamp"].includes(component.kind)), false);
    const result = analog.solveAnalogDc(preset);
    assert.equal(result.ok, true, `${presetId}: linear DC solvable`);
    assert.equal(result.model, "linear-dc-mna");
  }
});
