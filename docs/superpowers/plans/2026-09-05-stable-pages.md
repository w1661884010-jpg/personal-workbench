# Stable 3010 release
Goal: replace existing personal-workbench GitHub Pages (old 3000 version) with tested 3010 runtime. Preserve both Git histories, never force push; do not delete local 3000.
Architecture: ours merge of origin/main (ae25963) retains current 3010 tree with old history as second parent. Existing Pages workflow replaced with Node-only allowlist packaging of committed runtime bundles and fonts.
- [ ] Add packager, CI asset validation and Pages workflow; test subpath-safe assets.
- [ ] Run full local suite, scan publishable history for credential patterns, commit release setup.
- [ ] Merge old history, normal push main and exact recovery tags; wait for Pages success.
- [ ] Verify public HTML/assets and interactive page identity; report origin-localStorage separation.
Recovery: stable-3010-2026-09-05 -> 0a8cee4; before-3010-pages-2026-09-05 -> ae25963. Restore by creating reviewable commits or separate worktree, not force reset of shared main.
