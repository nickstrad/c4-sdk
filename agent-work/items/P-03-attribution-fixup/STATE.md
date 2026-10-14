# P-03 embedded attribution fixup checkpoint

Status: implementation committed; assessment and checkpoint update pending.

P-02's browser-targeted build retained `minpath.browser.js` implementation but stripped its bundled embedded James Halliday and Joyent/Node contributors notices. Add faithful attribution coverage to the project notices and record source evidence. Preserve the pending exact-tarball gate.

Plan: [`docs/plans/productionization.md`](../../../docs/plans/productionization.md). Brief: [`brief.md`](brief.md). Claims: [`claims.md`](claims.md). Related baseline: [`../P-03/STATE.md`](../P-03/STATE.md), [`P-02 checkpoint`](../P-02/STATE.md).

Builder: fresh Codex Luna high in its own worktree. Reviewer: fresh Claude Sonnet on exact final commit after cleanup.

## Handoff

Read the exact source/license headers and current P-02 browser-targeted bundle inventory. Add only required embedded-code attribution, recheck all existing inventory rows, document the provisional exact-pack status, commit work and a separate assessment, clean up, and report.

## Implementation — 2026-10-14

Builder worktree: `/tmp/c4-sdk-p-03-minpath`; branch `fix/p-03-minpath-attribution`; base `21baf86c2431a77132647072efc92859a0588289`.

Implementation commit: `6ea87583420a15923f46ed03707cde93d1088689` (`docs: add minpath embedded attribution notices`). It adds the complete James Halliday and Joyent/Node contributors MIT notices to the existing `vfile@6.0.3` entry, explains their embedded-source scope, and updates the release license record. The current P-02 machine-readable inventory has 75 package rows (64 MIT, 9 ISC, 1 BSD-3-Clause, 1 EPL-2.0 OR GPL-3.0-or-later). It does not contain `character-entities@2.0.2`, so that stale prior-inventory notice row was removed. The 75 current package rows and notice rows compare exactly.

Source/build evidence read from the P-02 worktree at commit `d1c228ca1a72278cf8df67813bc251cacb8a8374` (the worktree had uncommitted package/build changes at inspection time):

- `node_modules/vfile/package.json` identifies source package `vfile@6.0.3`; SHA-256 `359ca117da48c3c42c73b9032369a412c5ad3462549d85aba090461e35227745`.
- `node_modules/vfile/lib/minpath.browser.js` contains both embedded headers, names `browserify/path-browserify` as the derivative source, and attributes extracted Node `path` code to Joyent and other Node contributors. SHA-256 `6c011d74955d2c202e1af91c8616e92e0a2381dce628128553dd81b03c900f95`.
- `tests/package/evidence/bundle-inventory.json` lists `node_modules/vfile/lib/minpath.browser.js` and records 75 package rows. SHA-256 `e8939350b2107c52388e3554369c3e1607359349e4df00e09066dfb9f552ec36`.
- The built `dist-sdk/index.cjs` contains the `minpath.browser.js` region and implementation without its header comments. SHA-256 `b9161385095bdd39643850d3b4d99e2da21cc62a840919a8906b85327b0748a8`.
- The embedded header itself supplies no separate upstream package versions for path-browserify or Node; the exact installed package/version containing the included source is `vfile@6.0.3`.

Validation: package-name/version rows compared exactly (75/75, no missing or extra rows); local links to `LICENSE`, `THIRD_PARTY_NOTICES.md`, and the P-02 checkpoint resolve in this branch; `git diff --check` passed. No tests or network access were needed. P-02's exact `npm pack --json` contents remain pending; this work makes no final tarball-content claim.

## Post-work assessment

No additional durable project knowledge or reusable script is justified. The source-version finding and provisional-evidence boundary are specific to this attribution fixup and are recorded here; there is no reusable command beyond the one-off inventory comparison. No VM/environment finding warrants a `kb` update.

Post-work assessment and this checkpoint are in a separate commit after implementation `6ea8758`. Fresh Claude Sonnet must review the exact final commit after the builder worktree is cleaned. Keep this branch for review and do not merge or push.
