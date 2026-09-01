# Compact Course Dashboard Implementation Plan

> **For agentic workers:** Implement this plan inline in the current Site-owning task; no subagent is needed for this single-surface change.

**Goal:** Move the two circuit workbench shortcuts beside “本学期电子课程” and compress the dashboard so all three course entries are visible in a typical desktop first viewport.

**Architecture:** Keep `DashboardView` as the only dashboard component and preserve its existing callbacks and course progress model. Replace the separate shortcut section with a compact heading action group, then scope spacing and size changes to the dashboard classes in `app/globals.css` so other routes remain unchanged.

**Tech Stack:** React 19, TypeScript, CSS, Node test runner, Vinext/Vite.

## Global Constraints

- Do not change course data, progress rules, routing, localStorage, or workbench behavior.
- Keep both workbench shortcuts as real buttons with the existing `onOpenWorkbench("digital" | "analog")` callbacks.
- Preserve the established neutral gray light/dark themes and current icon family.
- Desktop must expose all three courses without the former standalone shortcut block; mobile may wrap the actions below the heading without horizontal overflow.
- Do not add dependencies or create a new component abstraction for this one-time layout.

---

### Task 1: Lock the compact dashboard contract

**Files:**
- Modify: `tests/semester-ui-contract.test.mjs`

**Interfaces:**
- Consumes: `DashboardView` source and `app/globals.css`.
- Produces: a source-level contract for heading actions, absence of the former section, and compact course sizing.

- [ ] Add assertions that `workbench-heading-actions` is rendered inside the page heading, both workbench labels and callbacks remain present, `workbench-shortcuts` is absent, and dashboard course entries use the compact height/spacing rules.
- [ ] Run `node --test tests/semester-ui-contract.test.mjs` and confirm the new assertions fail against the old standalone shortcut layout.

### Task 2: Implement the compact course-first layout

**Files:**
- Modify: `app/components/semester/DashboardView.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `onOpenWorkbench(kind)` and the existing `course-entry` markup.
- Produces: two compact heading buttons and three shorter course rows with unchanged navigation/progress behavior.

- [ ] Move both workbench buttons into the page heading, use concise visible labels “数字工作台” and “模拟工作台”, and retain descriptive accessible names.
- [ ] Remove the standalone `workbench-shortcuts` markup and its large-card styles.
- [ ] Reduce dashboard-only heading margin, course row gap, minimum height, padding, mark size, copy gaps, and progress spacing; keep mobile actions wrapped and course rows readable.
- [ ] Run `node --test tests/semester-ui-contract.test.mjs` and confirm the dashboard contract passes.

### Task 3: Validate and publish the exact source

**Files:**
- Modify: `checklist.md`
- Modify: `context-notes.md`

**Interfaces:**
- Consumes: the completed dashboard source and existing build/publish scripts.
- Produces: a verified Git/Sites release with matching GitHub Pages output.

- [ ] Run `npm test`, `npm run lint`, `npm run build`, `npm run build:pages`, and `git diff --check`; require zero failed or skipped tests.
- [ ] Start the existing local development command, require an HTTP 200 response, and use the Sites-prescribed non-browser preview handoff without DOM, screenshot, click, or resize QA.
- [ ] Commit the single logical change, synchronize GitHub `main`, verify the Pages workflow, package the exact validated source, and deploy the existing public Sites project after approval required by the Sites hosting flow.

