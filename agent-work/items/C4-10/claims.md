# C4-10 ownership claims

Status: builder implementation complete; independent review pending; exact base `59156023e3d1b888d87ccbc6e0173b3a2ea63de6`, worktree `/tmp/c4-sdk-c4-10-build`, branch `item/c4-10-hardening`.

Base: current c4-sdk `main` (record exact SHA in coordination before dispatch). C4-09 remains paused; no ts-db worktree or files are in this item.

## Builder owns

- `src/**`
- `tests/**`
- `demos/git-at-any-scale/**`
- `docs/knowledge/**` (durable findings only; update index when adding pages)
- `docs/api/**` (create source API docs if needed)
- `work-scripts/**` and `work-scripts/INDEX.md` only for a justified reusable validation helper
- `package.json` and `package-lock.json` only if a current, supported security fix is verified or an acceptance test cannot be run without a narrowly justified script change
- `agent-work/items/C4-10/{brief,claims,review,STATE}.md`

## Reads / exclusions

Reads root `README.md` and confirms the C4-08 correction, but does not edit it without a new explicit claim from root. Reads root `STATE.md`, `agent-work/COORDINATION.md`, `docs/plans/implementation.md`, current C4-07/C4-08 review records, all existing tests and relevant source. Root coordinator files and plan are not builder-owned.

Excludes: all ts-db files, C4-09, `AGENTS.md`, `.github/workflows/**`, root `STATE.md`, root `agent-work/COORDINATION.md`, and npm publishing/manual deployment. Do not broaden claims when a shared seam is found; stop and return it to root.

One fresh builder owns these paths until its implementation, learning assessment and checkpoint commits are inspected. Review uses its own fresh worktree on a different company and exact reviewed HEAD. Fixups require a new builder and new reviewer.

## Documentation NITS fix ownership — 2026-10-14

Fresh Codex Sol fix agent, assigned by root, owns only `README.md`, `docs/api/acceptance.md`, and this item's `claims.md`/`STATE.md` in branch `fix/c4-10-doc-nits`, worktree `/tmp/c4-sdk-c4-10-doc-nits`, based on review commit `41cf06a1718b12a8cf66c99808cf8155767565f7`. Root explicitly authorizes the README exception for the pending-layout sentence and enforced-limits label. Remove the acceptance report's obsolete C4-09 pause/resume and second-consumer gate; C4-09 is removed and C4-10 proceeds independently. No behavior, historical C4-09 refs, root coordinator records or other documentation is owned by this fix.
