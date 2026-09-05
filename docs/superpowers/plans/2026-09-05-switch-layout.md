# Switch layout stability Implementation Plan

**Goal:** Preserve the settled toolbar geometry during entry and kind switching.
**Architecture:** Investigate the pre-bridge instrument card's contribution to the fixed-height grid. Remove only its temporary layout footprint, preserving the existing bridge and transitions.
**Tech Stack:** CSS, existing React bridge, Node test runner and Chromium behaviour tests.

## Task 1
- [x] Browser regression failed before fix: heading height 53 vs 164.4375px.
- [x] Remove the temporary direct-child instrument footprint only.
- [x] Full suite 38/38 and diff check passed; added frame sampling for entry/re-entry/rapid switching.

Files: styles.css; tests/kind-switcher.behaviour.test.mjs; checklist.md; context-notes.md.
Acceptance: toolbar x/y/width/height differ by at most 1px between pre-bridge and settled layouts. Existing rapid switching, state preservation, keyboard and reduced-motion tests remain green. No changes to final layout or simulation logic.
