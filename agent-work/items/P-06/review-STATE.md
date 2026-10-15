# P-06 independent review checkpoint

Completed 2026-10-15. Fresh Codex Sol reviewing Sonnet, no prior participation/delegation.
**Verdict: FAIL**, review commit `2938f95`; this separate checkpoint commit records final handoff/knowledge assessment.
Exact reviewed builder SHA `fd32c044754fc1a19af681860978166281726969`; release-input `fb74a91c539614542769e97e3ebbfe0677dcc356`, report `74e9639`.
Assigned branch `review/p-06-sol`, worktree `/tmp/c4-sdk-p06-review`. Only `review.md` and this checkpoint changed. No product repairs, publish, tag, push, merge or authentication action.

## Findings / next owner

- R1: nonwaived source acceptance remains unresolved. Independent focused source browsers with one worker: 6 pass/2 fail (desktop navigation new-tab and mobile Cursor showcase wrong explanation). Both source builds pass. Separate desktop navigation-only rerun after artifact checks: 1 pass. This does not erase intermittency or establish absence of regression. Trace shows repeated offscreen/intercepted Ctrl-click; source/toolchain causal attribution remains unresolved. Mobile showcase was not separately rerun.
- R2: correct release-report/knowledge overclaims. Baseline reproduces two navigation failures, not all failed paths; no categorical toolchain causal exclusion follows. Distinguish isolated tests from full-suite serial success and separate popup/focus/click/screenshot observations.
- Coordinator owns new bounded investigation/correction reservations and fresh independent re-review, or explicit human disposition of nonwaived failures. Do not land/claim complete readiness on this FAIL. This checkpoint grants no authorization to change product scope or publish.
- Human mobile component-docs waiver honored directly from `/root/c4-lead-mobile-nonblocking.md` and `/tmp/c4-p06-human-ruling.md`. Final report correctly notes recurrence across C4-07/C4-10/P-06 and isolated passing reruns. No waived mobile-docs fix requested; other failures not waived.

## Validation / retained evidence

Authoritative `/tmp/c4-sdk-release-0.1.0/` untouched, SHA256 `6b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084`; evidence hash unchanged `51257785e65c37b29c7212ecc7f35a895c36f762ed7f2b99cbec6e7685caa18d`.
Reviewer evidence outside worktree: `/tmp/p06-review-evidence/`, including final review copy, checkpoint copy, logs, binding script, unpacked tarball, exact-source clone, candidate scratch sidecars, browser screenshots/traces and external mobile investigation report (not reviewer-generated evidence).

Independent results:
- npm ci: exit0, 542 packages. make sdk-check: exit0, 206 unit/hooks,34 property,5 API,108 release; typecheck/lint pass with two documented advisories.
- SDK build: exit0; all15 retained packed files match regenerated assets/source docs byte-for-byte; frozen API/exports/types/worker/CSS/README/MIT consistent. Inventory unchanged,76 notice rows/full texts reconciled. Exact required rolldown/plugin-dts and TS/Vite retained.
- release-verify from report HEAD correctly rejected source SHA mismatch after package matrix; exact-source scratch clone fb74a91 release-verify exit0: package matrix,10 packaged browsers,6 README browsers, all8 snippets, hash/source-bound verify report. No guard bypass and no authoritative sidecar replacement.
- Focused source exit1,6pass2fail; isolated desktop navigation exit0,1pass. Original builder full source serial65/skip1 remains historical evidence; all default/baseline failures inspected. No further full-suite repetition.
- Inspected five representative retained images plus two reviewer failure screenshots/navigation trace. No claim to inspect all67 images.
- git diff --check passes. Only the two owned review files staged/committed. No hidden ts-db migration or removed copy-consumer support claim.

Read instructions, root/item state, brief/claims, plan, report, P01–P05 reviews/decisions, knowledge index and relevant live events. Event helper failed read-only common Git directory; authorized skip applied. KB search400 feedback recorded with escalation after database-write denial. No approval rejection occurred.

## Knowledge / scripts assessment and cleanup

R2 identifies a correction to the builder’s new durable knowledge entry; reviewer does not own shared knowledge/index files. Existing release/source fixtures encode reusable procedures. Binding checker is a one-off evidence tool; no indexed reusable script or new VM knowledge entry warranted.
Review/checkpoint commits remain on `review/p-06-sol`. Final report and checkpoint are copied outside the assigned worktree. After this checkpoint is durable, remove only the assigned reviewer worktree (including its ignored dependencies/builds), retain branch and external evidence. No cleanup of coordinator/builder worktrees or authoritative artifacts.
