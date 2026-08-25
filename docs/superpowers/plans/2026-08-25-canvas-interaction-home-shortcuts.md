# Canvas Interaction and Home Shortcuts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复电路画布选中与重叠问题，增加元件旋转/翻转和画布缩放，清理资料缺口说明正文，并在首页增加两个工作台快捷入口。

**Architecture:** 保留现有 React、SVG 画布、localStorage 和电路图模型。新增一个纯几何模块统一计算旋转后的尺寸、端口、碰撞分离和正交连线路径；React 组件只负责交互状态与渲染。既有电路文档通过可选方向字段保持向后兼容。

**Tech Stack:** React 19、TypeScript、SVG、Vinext/Vite、Node test。

## Global Constraints

- 只修改现有课程站点，不建立平行内容体系。
- 不修改 `C:\Users\Lenovo\Desktop\learning\课程` 源资料。
- 资料不足仍保留状态标记，但正文不显示缺资料说明或自行补写内容。
- 模拟仿真能力边界不变。
- 使用现有 Sites 项目发布，保留暗色工程笔记风格。

---

### Task 1: Circuit Geometry and Persistence

**Files:**
- Create: `app/lib/circuit/geometry.ts`
- Modify: `app/lib/circuit/types.ts`
- Modify: `app/lib/circuit/graph.ts`
- Modify: `app/lib/circuit/circuit-storage.ts`
- Test: `tests/circuit-geometry.test.mjs`
- Test: `tests/circuit-graph-storage.test.mjs`

**Interfaces:**
- Produces: `getComponentSize(component)`, `getPortGeometry(component, portId)`, `findAvailablePosition(circuit, component, desired)`, `separateOverlappingComponents(circuit)`, `createWirePath(from, to)` and `transformComponent(circuit, id, transform)`.
- Persists: optional `rotation: 0 | 90 | 180 | 270` and `flipped: boolean`, defaulting to `0` and `false` for old saved circuits.

- [ ] **Step 1: Write failing geometry and persistence tests**

  Assert that 90° rotation changes port axes, horizontal flip swaps terminal sides, overlapping desired positions resolve to separated bounds, orthogonal wire paths include visible lead segments, and saved orientation round-trips.

- [ ] **Step 2: Run focused tests and confirm the new exports/fields fail**

  Run: `node --test tests/circuit-geometry.test.mjs tests/circuit-graph-storage.test.mjs`

- [ ] **Step 3: Implement the smallest pure geometry and graph changes**

  Use 24-unit grid search with component bounds plus 20-unit clearance; if no free location exists, preserve the previous valid position. Keep timestamps and immutable graph updates consistent with existing functions.

- [ ] **Step 4: Run focused tests until they pass**

### Task 2: Workbench Interaction and Visual Feedback

**Files:**
- Modify: `app/components/sandbox/CircuitWorkbench.tsx`
- Modify: `app/components/sandbox/workbench.css`
- Test: `tests/semester-ui-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1 geometry helpers and transform function.
- Produces: sticky double-click selection, non-overlapping placement/movement/load, rotate and horizontal-flip controls, 50–200% zoom, connected-port rings, connection count feedback, outlined orthogonal wires.

- [ ] **Step 1: Add failing UI contract assertions**

  Require `onDoubleClick`, rotate/flip labels, zoom controls, connected-port classes, connection count text and geometry helper usage.

- [ ] **Step 2: Run the UI contract and confirm failure**

  Run: `node --test tests/semester-ui-contract.test.mjs`

- [ ] **Step 3: Implement interaction state and SVG rendering**

  Keep drag on single pointer gesture but select only on double click; map pointer coordinates through the current view box; prevent overlap during movement; expose `-`, percentage, `+`, reset controls; use Ctrl/Command + wheel as an additional zoom path.

- [ ] **Step 4: Add accessible text and responsive toolbar styles**

  Connected endpoints use a teal outer ring and wires use a dark halo plus a bright foreground path; hover and pending endpoints use orange feedback.

- [ ] **Step 5: Run focused tests until they pass**

### Task 3: Course Copy and Dashboard Shortcuts

**Files:**
- Modify: `app/data/courses/digital.ts`
- Modify: `app/data/courses/analog.ts`
- Modify: `app/data/courses/signals.ts`
- Modify: `app/components/semester/ChapterStudyView.tsx`
- Modify: `app/components/semester/CourseOverviewView.tsx`
- Modify: `app/components/semester/DashboardView.tsx`
- Modify: `app/components/LearningWorkbench.tsx`
- Modify: `app/globals.css`
- Test: `tests/semester-model.test.mjs`
- Test: `tests/semester-ui-contract.test.mjs`

**Interfaces:**
- Dashboard adds `onOpenWorkbench(kind: "digital" | "analog")`.
- Missing-source sections keep `sourceStatus: "insufficient"` while using `content: ""`; rendering omits empty paragraphs and empty source-note blocks.

- [ ] **Step 1: Write failing content and dashboard tests**

  Assert that textbook labels exclude the quoted parenthetical, insufficient section bodies are empty, and the home page exposes two real workbench buttons.

- [ ] **Step 2: Run focused tests and confirm failure**

  Run: `node --test tests/semester-model.test.mjs tests/semester-ui-contract.test.mjs`

- [ ] **Step 3: Apply the minimal data and component changes**

  Do not replace removed source-gap prose with new filler; retain course/chapter titles, status labels and existing verified content.

- [ ] **Step 4: Run focused tests until they pass**

### Task 4: Full Validation and Publishing

**Files:**
- Modify: `checklist.md`
- Modify: `context-notes.md`

- [ ] **Step 1: Run full automated validation**

  Run: `npm test`, `npm run lint`, `npm run build`, `git diff --check`.

- [ ] **Step 2: Validate rendered behavior**

  Test the flow `首页 -> 数字工作台快捷入口 -> 放置两个元件 -> 双击选中 -> 旋转/翻转 -> 连接 -> 缩放 -> 拖动不重叠`, plus one mobile viewport and console health.

- [ ] **Step 3: Commit and publish the exact validated source**

  Push the final commit to GitHub and the configured Sites source, package `dist`, save a version, publish it to the existing public URL, and verify production status.
