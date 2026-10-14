# P-02 path claims

Builder: fresh Codex Sol in its own worktree. Independent review: fresh Claude Sonnet after builder cleanup. Coordinator owns merge/push, shared docs/state, index and knowledge reconciliation.

## Owns

- `package.json`, root package lockfile
- Library build/declaration configuration and scripts; SDK output wiring
- `tests/package/**`
- `agent-work/items/P-02/STATE.md`

## Read-only

`LICENSE`, `THIRD_PARTY_NOTICES.md`, `docs/release/licenses.md` (P-03); root README and examples (P-04); Makefile, `work-scripts/**`, CI/workflows and runbook (P-05); product source/public API unless a concrete coordination request is approved; root `STATE.md`, `agent-work/COORDINATION.md`, `docs/knowledge/**`, work-scripts index, all other item files.

## Coordination

P-02 may run concurrently with P-03. Preserve planned notice paths in package allowlists; coordinate with the lead before final packed candidate validation if P-03 has not landed. Any needed edits outside claims require a concrete coordination request first. Builder commits and cleans; does not merge or push. Review exact final builder head independently.
