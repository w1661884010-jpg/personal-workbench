# Selection and Wire Regression Fix Implementation Plan

> **For Codex:** Execute this plan in order and keep each change scoped to the reported regression.

**Goal:** Restore reliable double-click selection and selected-component actions while returning wires to the original single-curve style and retaining clearer terminal state feedback.

**Architecture:** Keep the existing React state model and SVG workbench. Fix pointer-capture ownership so the component receives the browser's real double-click event, make placement and single-click non-sticky, and restore the previous cubic Bezier wire rendering. Preserve the newer connected-terminal classes and status text because they solve the requested readability problem without changing simulation behavior.

**Tech Stack:** React, TypeScript, SVG, Node test runner, ESLint, Vinext/Vite, Sites hosting.

---

### Task 1: Lock the regression into tests

**Files:**
- Modify: `tests/semester-ui-contract.test.mjs`
- Modify: `tests/circuit-geometry.test.mjs`

- [x] Assert that pointer capture belongs to the component event target rather than the outer SVG.
- [x] Assert that adding a component does not automatically create a sticky selection.
- [x] Assert that keyboard deletion prevents browser navigation and removes a selected component.
- [x] Assert that wire rendering is again a single `cw-wire` cubic path, while connected terminals retain `is-connected` feedback.
- [x] Run the focused tests and confirm they fail for the current regression.

### Task 2: Restore selection and deletion behavior

**Files:**
- Modify: `app/components/sandbox/CircuitWorkbench.tsx`
- Modify: `app/components/sandbox/workbench.css`

- [x] Capture the pointer on the component element so native double-click remains targeted to that component.
- [x] Keep single-click and drag as focus/movement only; double-click and keyboard activation create the sticky selection.
- [x] Prevent the browser's default Backspace/Delete behavior before removing the selected component.
- [x] Expose the selected state through accessible state and make keyboard focus visually distinct from sticky selection.

### Task 3: Restore the original wire presentation

**Files:**
- Modify: `app/components/sandbox/CircuitWorkbench.tsx`
- Modify: `app/components/sandbox/workbench.css`
- Modify: `app/lib/circuit/geometry.ts`

- [x] Render each connection as the previous single teal cubic Bezier path.
- [x] Remove the temporary hit/halo/orthogonal-wire implementation and its unused geometry helpers.
- [x] Preserve persistent connected-terminal rings, colors, labels and accessible status.

### Task 4: Verify and publish

**Files:**
- Modify: `checklist.md`
- Modify: `context-notes.md`

- [x] Run focused tests, full tests, lint, production build and `git diff --check`.
- [x] Verify real mouse double-click, toolbar actions, Backspace deletion, original wire style and node states in a desktop browser.
- [x] Verify the workbench remains usable at a mobile viewport and the console has no errors or warnings.
- [ ] Create one semantic commit and publish the validated build to the existing site.
