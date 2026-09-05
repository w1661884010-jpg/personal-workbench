# Stable 3010 release
Goal: replace existing personal-workbench GitHub Pages (old 3000 version) with tested 3010 runtime. Preserve both Git histories, never force push; do not delete local 3000.
Architecture: ours merge of origin/main (ae25963) retains current 3010 tree with old history as second parent. Existing Pages workflow replaced with Node-only allowlist packaging of committed runtime bundles and fonts.
- [x] Packager and workflow added; 8 runtime files + 60 fonts validated.
- [x] Full tests 38/38, credential-pattern history scan zero matches.
- [x] Merge 4815644 preserves old history; normal push, Pages run 33950935490 succeeded.
- [x] Public lesson and digital/analog workbench verified; no console errors. LocalStorage separation documented.
Recovery: stable-3010-2026-09-05 -> 0a8cee4; before-3010-pages-2026-09-05 -> ae25963. Restore by creating reviewable commits or separate worktree, not force reset of shared main.
