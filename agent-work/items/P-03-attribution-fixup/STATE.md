# P-03 embedded attribution fixup checkpoint

Status: evidence-path repair committed; assessment/checkpoint update in progress; awaiting fresh Sonnet re-review.

P-02's browser-targeted SDK bundle includes `vfile@6.0.3/lib/minpath.browser.js`, whose bundled code retains its implementation but whose embedded copyright comments are stripped. This follow-up restores the James Halliday and Joyent/Node contributors MIT attributions and repairs the package notice inventory after P-02's final graph restored `character-entities@2.0.2`.

Plan: [`docs/plans/productionization.md`](../../../docs/plans/productionization.md). Brief: [`brief.md`](brief.md). Claims: [`claims.md`](claims.md). Related P-03 baseline: [`../P-03/STATE.md`](../P-03/STATE.md). P-02 checkpoint: [`../P-02/STATE.md`](../P-02/STATE.md).

## Work and evidence

Builder worktree: `/tmp/c4-sdk-p-03-minpath-final`; branch: `fix/p-03-minpath-final`; base: `2241c93b233afadf0d8753730a824fc8f8c9e5dc`.

- Implementation commit: `39044af` (`docs: restore character-entities attribution`). It restores the complete `character-entities@2.0.2` MIT notice from the prior main version and corrects the package counts, license distribution, inventory source/hash and pending exact-pack gate in the release license record. The earlier embedded minpath notices remain unchanged.
- Evidence-path repair: `ef035ab` (`docs: persist P-02 evidence path`). The permanent notice and release record now identify P-02's committed inventory path and state that P-02 will record its SHA-256 in its checkpoint.
- Provisional source inventory: `/tmp/c4-sdk-p-02/tests/package/evidence/bundle-inventory.json`, SHA-256 `88f62f2709fb334629bf36035bd57c7753721295b3c803f460367a041bd01ebc`. P-02 will commit the exact artifact inventory at `tests/package/evidence/bundle-inventory.json` and record its SHA-256 in the P-02 checkpoint; this provisional hash identifies the current evidence only.
- Inventory contents: 76 package rows — 65 MIT, 9 ISC, 1 BSD-3-Clause, and 1 EPL-2.0 OR GPL-3.0-or-later. Package name/version rows and license-text headings compare one-for-one: 76/76, no missing or extra rows.
- Notice integrity: the two supplemental MIT attributions remain in `THIRD_PARTY_NOTICES.md`: James Halliday (2013) and Joyent, Inc. and other Node contributors. They cover embedded code in `vfile@6.0.3`; they are not additional package rows.
- Validation: existing local Markdown links in the edited release record resolve. The new relative inventory link resolves to the expected repository path `tests/package/evidence/bundle-inventory.json`, which P-02 will add; it is not present in this branch. `git diff --check` passed. No tests or network access were needed. P-02's final `npm pack --json` reconciliation remains pending; these documents do not claim final tarball contents.

## Post-work assessment

No additional durable project knowledge or reusable script is justified. The corrected inventory, evidence boundary, and evidence-path repair are specific to this fixup and are recorded above and in [`docs/release/licenses.md`](../../../docs/release/licenses.md); the one-off comparisons do not merit a reusable helper. No VM/environment finding warrants a `kb` update. This assessment/checkpoint update follows evidence-path repair `ef035ab` in a separate commit. The exact final commit must be reviewed by fresh Claude Sonnet. Keep this branch available for review; do not merge or push. Clean up this worktree after the assessment commit is durable.
