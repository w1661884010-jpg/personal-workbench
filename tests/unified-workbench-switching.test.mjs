import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("the workbench switcher stays outside the React mount so React cannot erase it", async () => {
  const html = await read("index.html");
  const stageIndex = html.indexOf('id="workbenchStage"');
  const switcherIndex = html.indexOf('id="kindSwitcher"');
  const rootIndex = html.indexOf('id="workbenchRoot"');

  assert.ok(stageIndex >= 0, "missing the unified workbench stage");
  assert.ok(switcherIndex > stageIndex, "the kind switcher must be inside the stage");
  assert.ok(rootIndex > switcherIndex, "the React mount must follow, not contain, the switcher");
  assert.match(html, /data-kind="digital"/);
  assert.match(html, /data-kind="analog"/);
});

test("the topbar exposes one workbench entry while kind selection stays inside", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);

  assert.equal((html.match(/id="workbenchToggle"/g) ?? []).length, 1, "there is one circuit-workbench entry; practice may share its visual button class");
  assert.match(html, /id="workbenchToggle"[\s\S]{0,700}<span>工作台<\/span>/);
  assert.doesNotMatch(html, /<span>数字台<\/span>|<span>模拟台<\/span>/);
  assert.match(app, /var workbenchButton\s*=\s*document\.getElementById\(["']workbenchToggle["']\)/);
  assert.match(app, /isCircuitWorkbench\(activeWorkbench\)\s*\?\s*null\s*:\s*["']digital["']/);
});

test("digital and analog keep separate mounted React sessions while switching", async () => {
  const entry = await read("workbench-entry.tsx");

  assert.match(entry, /const roots:\s*Partial<Record<CircuitKind, Root>>\s*=\s*\{\}/);
  assert.match(entry, /const sessionContainers:\s*Partial<Record<CircuitKind, HTMLElement>>\s*=\s*\{\}/);
  assert.match(entry, /export function setKind\(kind: CircuitKind, immediate = false\)/);
  assert.match(entry, /container\.hidden\s*=\s*sessionKind\s*!==\s*kind/);
  assert.doesNotMatch(entry, /setKind[\s\S]{0,500}confirm\(/, "kind switching must not offer a discard path");
});

test("the shell switches an active workbench in place and synchronizes both controls", async () => {
  const app = await read("app.js");

  assert.match(app, /function syncKindSwitcher\(instant\)/);
  assert.match(app, /isCircuitWorkbench\(prev\)\s*&&\s*isCircuitWorkbench\(wbKind\)/);
  assert.match(app, /function switchWorkbenchKind\(kind, immediate\)/);
  assert.match(app, /PrototypeWorkbench\.setKind\(kind, !!immediate\)/);
  assert.match(app, /button\.dataset\.kind/);
  assert.match(app, /setAttribute\(["']aria-selected["']/);
});

test("the kind switcher is one shared sliding track with fixed labels", async () => {
  const [html, styles] = await Promise.all([read("index.html"), read("styles.css")]);

  assert.match(html, /id="kindSwitcher"[\s\S]{0,80}class="kind-thumb"/, "the slider thumb rides in the switcher");
  assert.match(html, /class="kind-switch-button" role="tab" data-kind="digital"[^>]*aria-controls="workbenchPanelDigital"/);
  assert.match(html, /class="kind-switch-button" role="tab" data-kind="analog"[^>]*aria-controls="workbenchPanelAnalog"/);
  assert.match(styles, /\.kind-switcher\s*\{[\s\S]{0,260}width:\s*44px/, "vertical independent bubble sits left of the workbench card");
  assert.match(styles, /\.kind-thumb\s*\{[\s\S]{0,380}transform:\s*translateY\(0\);[\s\S]{0,160}transition:\s*transform 180ms cubic-bezier\(\.22, 1, \.36, 1\)/);
  assert.doesNotMatch(styles, /\.kind-switch-button\.is-active\s*\{[\s\S]{0,80}background/, "active state must not repaint the label, only the thumb slides");
  assert.match(styles, /\.kind-switcher\.is-instant \.kind-thumb\s*\{\s*transition:\s*none;\s*\}/);
});

test("the content transition is tokenized so rapid switches settle on the last choice", async () => {
  const entry = await read("workbench-entry.tsx");

  assert.match(entry, /let switchSeq\s*=\s*0/);
  assert.match(entry, /const seq = \+\+switchSeq;/);
  assert.match(entry, /if \(seq !== switchSeq\) return;/);
  assert.match(entry, /prefersReducedMotion\(\)/);
  assert.match(entry, /waitForSessionReady\(/, "target mount readiness gates the swap, not a fixed guess");
  assert.match(entry, /activeOptions\?\.onNotify\?\.\(["']工作台内容加载失败[\s\S]*"error"\)/, "mount failure keeps content and reports an error");
  assert.match(entry, /export function unmount\(\)[\s\S]{0,240}switchSeq \+= 1;[\s\S]{0,160}clearPendingTimers\(\);[\s\S]{0,160}clearReadyWatchers\(\);[\s\S]{0,160}clearLayoutTimers\(\);/);
});

test("mount/layout tasks live outside the switch cancellation scope", async () => {
  const entry = await read("workbench-entry.tsx");

  assert.match(entry, /let layoutTimers: Array<ReturnType<typeof setTimeout>> = \[\];/);
  assert.match(entry, /function scheduleLayout\(fn: \(\) => void, ms: number\)/);
  const setKindBlock = entry.slice(entry.indexOf("export function setKind"), entry.indexOf("export function unmount"));
  assert.doesNotMatch(setKindBlock, /clearLayoutTimers\(\)/, "switching must never cancel layout/bridge tasks");
  assert.match(entry, /scheduleBridge[\s\S]{0,200}scheduleLayout\(/, "the instruments bridge is scheduled as a layout task");
});

test("failure and rollback notifies the shell, and keyboard/inert paths are wired", async () => {
  const [entry, app, html] = await Promise.all([read("workbench-entry.tsx"), read("app.js"), read("index.html")]);

  assert.match(entry, /onKindChange\?: \(kind: CircuitKind\) => void/, "entry exposes the displayed-kind callback");
  assert.match(entry, /activeKind = visibleKind \?\? kind;[\s\S]{0,80}if \(activeKind !== kind\) emitKindChange\(activeKind\)/, "failure rolls bundle state back and informs the shell");
  assert.match(entry, /container\.inert = sessionKind !== kind;/, "non-target sessions become inert");
  assert.match(entry, /target\.inert = false;/, "target panel is interactive when settled");
  assert.match(app, /onKindChange: syncKindFromBundle/);
  assert.match(app, /function syncKindFromBundle\(kind\)/);
  assert.match(app, /setAttribute\(["']tabindex["'], active \? ["']0["'] : ["']-1["']\)/, "roving tabindex on the tabs");
  assert.match(app, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(app, /event\.detail === 0/, "keyboard-synthesized clicks also switch instantly");
  assert.match(html, /id="kindTabDigital"[\s\S]{0,180}tabindex="0"/);
  assert.match(html, /id="kindTabAnalog"[\s\S]{0,180}tabindex="-1"/);
});

test("keyboard switching is instant and reduced motion disables both transitions", async () => {
  const [app, styles] = await Promise.all([read("app.js"), read("styles.css")]);

  assert.match(app, /kindSwitcher\.addEventListener\(["']keydown["']/);
  assert.match(app, /event\.key === "ArrowRight"/);
  assert.match(app, /switchWorkbenchKind\(next, true\)/, "keyboard path falls through to the instant switch");
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]{0,160}\.kind-thumb\s*\{\s*transition:\s*none;\s*\}\s*\.prototype-workbench-session\s*\{\s*transition:\s*none;\s*\}\s*\}/);
});

test("mobile workbench controls reflow instead of widening the page", async () => {
  const styles = await read("styles.css");
  const mobileOverride = styles.slice(styles.lastIndexOf("@media (max-width: 760px)"));

  assert.equal(styles.match(/\{/g)?.length, styles.match(/\}/g)?.length, "the stylesheet must stay balanced so the final media query is parsed");
  assert.match(mobileOverride, /\.workbench-root \.cw-storage-bar\s*\{[\s\S]{0,180}grid-template-columns:\s*minmax\(0, 1fr\) auto auto/);
  assert.match(mobileOverride, /\.workbench-root \.cw-experiment-strip\s*\{[\s\S]{0,180}grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(mobileOverride, /\.cw-experiment-actions\s*\{[\s\S]{0,180}grid-area:\s*3 \/ 1/);
});

test("wide workbench controls spend space on controls instead of empty fixed columns", async () => {
  const styles = await read("styles.css");
  const wideStart = styles.lastIndexOf("@media (min-width: 1200px)");

  assert.ok(wideStart >= 0, "missing the wide workbench density layout");
  assert.ok(wideStart > styles.indexOf(".workbench-root .cw-storage-bar > :nth-child(8)"), "the desktop grouping must override the base storage placement");
  const wideOverride = styles.slice(wideStart);
  assert.match(wideOverride, /grid-template-areas:\s*"head strip" "storage storage" "main main"/, "storage should have its own full-width row instead of forcing all three groups to share a height");
  assert.match(wideOverride, /\.cw-storage-bar > :nth-child\(n\)\s*\{ grid-area: auto;/, "old cell positions must not create extra storage rows");
});
