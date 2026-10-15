# P-06-browser-fix — correct P-06 source browser evidence

Status: in progress. Branch `fix/p-06-browser-evidence`, worktree `/tmp/c4-sdk-p06-fix`, exact base `3acf790`.
State checkpoint: `agent-work/items/P-06-browser-fix/STATE.md` (owner: this builder).

## Goal
Repair review FAIL `2938f95`/`3acf790` on `fd32c04`: (R1) bounded investigation and test-side correction of offscreen canvas
interactions in navigation/context/showcase specs, preserving real click/Control-click behavior and assertions;
(R2) correct the release report and gotchas causality. Test/docs-only: tarball `fb74a91`
SHA256 `6b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084` unchanged, never repacked.

## Out of scope
Mobile component-docs spec (waived, NONBLOCKING per `/root/c4-lead-mobile-nonblocking.md`), runtime/source/manifest/lock/README/build files,
publication/tag/push/merge.

## Acceptance
- Each changed interaction has before/after evidence under `/tmp/c4-p06-fix-evidence`; no force/dispatchEvent/sleep/retry/timeout change.
- Full source suite serial passes after fix; focused repetition under same renderer slowdown.
- Report and gotchas state exact failures, isolation vs serial, and no categorical causal exclusion.
