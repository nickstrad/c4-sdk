# C4-10 ownership claims

Status: prepared; builder not dispatched.

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
