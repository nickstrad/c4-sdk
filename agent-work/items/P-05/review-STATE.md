# P-05 independent review checkpoint

## Assignment and ownership

- Fresh independent Codex Sol; no delegation. Cross-family review of Claude Sonnet implementation.
- Exact reviewed builder: bc3322946372d3346ace0483ac6ad50b5570d7e6; base a1929e4.
- Branch/worktree: review/p-05-sol / /tmp/c4-sdk-p-05-review.
- Authoritative [brief](brief.md), [claims](claims.md), [review](review.md), ../../COORDINATION.md, ../../../STATE.md.
- Owns only this checkpoint and review.md. Product read-only.
- No real publish/tag/push/merge/auth changes; publication tests fully mocked. Browser ports4185/4186 used; never4187/4188. Event skip applies.

## Outcome — 2026-10-15

**FAIL**: R1 symlink ancestors defeat cleanup containment; R2 ALLOW_DIRTY=1 can record clean evidence after a dirty build and reach mocked publication. Review contains locations, reproduction, severity and repair expectations. README_REPORT empty-location values and declaration/test-strengthening issues are notes.

Orientation completed: instructions, root/item STATE, brief/claims, plan, knowledge/event index, coordination and work-scripts index.

Independent checks: typecheck/lint passed (inherited button warning), unit204, properties34, API5; release79 passed with subprocess permissions. Sandbox release test run was78/79 because a node subprocess returned empty output; no product change before passing rerun. Locked npm install and real pack required elevated permissions. SDK build and preliminary pack succeeded,15 files,859203 bytes,version0.1.0-beta.1,sourceSHA bc3322946372d3346ace0483ac6ad50b5570d7e6,dirty:false,hash d7980de2c97d008e41c5ce6592eadfffea7eed36d3d8c4f6c214d0595edd33f8. Tampering rejected. Exact external consumer matrix passed; packaged browser10/10 passed. Verification then failed closed at the absent P-04 verifier, writing passed:false (inventory/package/browser passed; readme failed). Combined release-check is pending integration, not claimed.

## Evidence and knowledge assessment

Logs /tmp/p05-review-*.log; one-off reproductions /tmp/p05-cleanup-driver.mjs, /tmp/p05-provenance.mjs and /tmp/p05-adversarial.mjs. These use the actual orchestrators and fake process effects, plus real scratch filesystem deletion for R1. Recreate the exact reviewed checkout at its original path before rerunning scripts after cleanup. Final artifact/report copy: /tmp/p05-review-artifacts.

Physical containment and post-build provenance are durable lessons documented in review; coordinator may index after repair. No knowledge/index edits authorized. No reusable script needed; one-off reproduction files remain outside git.

## Handoff and cleanup

Review and checkpoint committed together on review/p-05-sol (resolve branch HEAD for review commit). After that commit is durable, remove only the assigned review worktree, retaining branch and /tmp evidence. No landing authorization. Next unit is a fresh builder in its own worktree for R1/R2, then fresh cross-family re-review. P-04 absence is an expected fail-closed integration gate, not an item defect. Final0.1.0/toolchain work stays P-06, serialized.
