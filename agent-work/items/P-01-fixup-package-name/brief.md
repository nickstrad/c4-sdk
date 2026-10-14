# P-01 package identity alignment

## Goal

Align the active productionization plan and P-01 candidate docs with Nick's 2026-10-14 approval note, which records that the exact unscoped npm package name `c4-sdk` was verified available on 2026-10-12. The P-01 candidate docs currently recommend `@nickstrad/c4-sdk`; use the verified unscoped identity as the candidate and retain an explicit instruction to recheck current availability before P-02 artifacts/publication.

## Permission profile

Repository-only docs update in an isolated worktree. No network/registry query, manifest edit, account login, product/source/test changes, publication, push, or merge.

## Owns

- `docs/plans/productionization.md` (identity section and illustrative export paths only).
- `docs/api/public-api.md` (package specifiers only).
- `docs/api/support-matrix.md` (identity recommendation/evidence only).
- `agent-work/items/P-01-fixup-package-name/STATE.md`.

## Reads

Root `STATE.md`, `agent-work/COORDINATION.md`, event log, repository instructions, P-01 brief/claims/STATE, P-01 public API/support docs, P-01 independent review, approved productionization plan, and Nick's approval note as summarized in the root checkpoint.

## Acceptance

- Candidate package name is `c4-sdk` consistently in the plan's identity/examples and P-01 import specifiers.
- State the source/evidence precisely: Nick relayed availability verification on 2026-10-12; this work did not query npm, prove present-day availability or confirm account ownership. P-02 revalidates before building its package artifact; actual publication waits for Nick's login/2FA.
- Do not change source exports, API signatures, version recommendation, build/manifest/config/test files, or any behavior. Preserve `0.1.0-beta.1` as the candidate version.
- Verify all package specifiers in the owned docs agree; relevant links and `git diff --check` pass.
- Assess durable knowledge/reusable scripts after the diff; report whether separate content is justified. Commit the docs change and a separate assessment/checkpoint as required; clean the worktree.
- Fresh Claude Sonnet reviews the exact fixup commit before the coordinator lands P-01.
