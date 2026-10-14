# P-03 attribution follow-up

## Goal

Update third-party notices for embedded license headers discovered after the browser-targeted P-02 build. The rolled browser `vfile` graph includes `minpath.browser.js` code whose embedded James Halliday and Joyent/Node contributors notices were stripped by the bundler. The P-02 builder confirms they require explicit notice coverage.

## Permission profile

Repository-only changes in the paths below. No network, registry, publication, push or merge.

## Owns

- `THIRD_PARTY_NOTICES.md`
- `docs/release/licenses.md`
- this item's `STATE.md`

## Reads

Repository/global protocol; main `STATE.md` and `agent-work/COORDINATION.md`; productionization plan; P-03 prior checkpoint/reviews; P-02 brief/checkpoint and its current browser-targeted bundle inventory at `/tmp/c4-sdk-p-02/tests/package/evidence/bundle-inventory.json`; exact source/license headers for the bundled `vfile`/minpath implementation and attribution lines identified by P-02.

## Acceptance

- Identify exact upstream package/source file, version and embedded attribution text from installed source/build evidence; add a faithful concise notice that preserves the required copyright/license notices without claiming unbundled code.
- Re-check complete notice inventory against the current 76-package graph. Keep any incomplete exact-pack reconciliation explicitly pending; do not assert final tarball contents.
- Update docs/release/licenses.md with the source, reason for the supplemental notice and provisional/final evidence boundary.
- Check local links, textual attribution, `git diff --check`; no tests/network needed for notice prose.
- Assess for durable knowledge/scripts; commit implementation and assessment separately if needed, update STATE, clean the worktree. Fresh Claude Sonnet independently reviews exact final commit.

## Exclusions

No package/test/build/source files, package inventory evidence, other P-03 review records, root state/coordination, merge/push, registry access or publication. Coordinate any changed package/source version with P-02 before final integration.
