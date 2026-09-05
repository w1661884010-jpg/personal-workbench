# Narrow chapter navigation plan

Goal: full-width compact chapter navigation on narrow screens, without changing desktop layouts or chapter content.
Approach: correct the existing mobile media rule, including collapsed-state specificity. Preserve horizontal chapters, use a thin scrollbar, retain title while collapsed, place pager in normal flow.
Files: styles.css; checklist.md; context-notes.md.
- [x] Correct mobile widths, spacing, collapse icon direction and pager positioning.
- [x] Browser verified 390/760px expanded/collapsed and last chapter selection; 1440px desktop remains unchanged.
- [x] Full tests 38/38, diff check, evidence recorded.
Acceptance: at 390px and 760px no page overflow; chapter card matches content width; collapsed state does not create a narrow grid column; final chapter reachable by keyboard/scroll; pager does not overlay text. Existing theme tokens and content preserved.
