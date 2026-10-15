# P-05 fixup arbitration checkpoint

Status: **complete — second FAIL upheld; one bounded correction + one fresh
independent re-review authorized; landing not authorized.** Arbitrator: fresh
Muse Wonder Full (Standard mode), third family. Branch `arbitration/p-05-muse`,
worktree `/tmp/c4-sdk-p-05-arbitration`, base corrected repair **97648b6**
(guard source identical to second-reviewed 5203fb3; verified by diff — amend
removed only `dist-sdk/**` + `artifacts/release/**`).

Verdict and exact remedy/acceptance: [`arbitration.md`](arbitration.md).

- F1 sustained (High): `checkReadmeReport` rejects the real passed P-04 report
  because `validLocations` requires every `evidence` leaf to be a string;
  deleting `evidence.output` flips it to `[]`. P-05 adapts to the landed P-04
  producer shape; P-04 is not to be changed.
- F2 sustained (Medium): `releasePack` calls `mkdirp(destination)` before the
  physical recheck on the missing-destination branch; reproduced outside
  candidate creation before rejection (`/tmp/p05-arb-f2.mjs`). No deletion or
  file write occurs.
- Original R1 (deletion cases), R2, declaration note, digest note: repaired and
  closed; F2 is the only remaining pre-mutation gap under R1.
- Generated-file scope deviation: corrected at 97648b6, not blocking.

Owned paths: only `agent-work/items/P-05-fixup/arbitration.md` and this file.
No product edits, no delegation, no install, no browser/pack/publish/tag/push/
merge/auth. Event skip applies. Full release suite not rerun (no `node_modules`
here); F1/F2 reproduced directly as recorded in the arbitration.

Next step (coordinator): dispatch one fresh bounded correction builder per
`arbitration.md`, then one fresh cross-family re-review of its exact commit.
Stop before `npm publish` (human boundary). A further FAIL goes to a human.

Knowledge assessment: lessons (location-vs-execution evidence validation;
pre-mutation physical revalidation after build) are recorded in `arbitration.md`
for coordinator indexing into `docs/knowledge/`. No reusable script added;
reproductions remain one-off under `/tmp`.
