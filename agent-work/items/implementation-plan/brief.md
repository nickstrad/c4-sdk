# Work item: implementation-plan

Status: in progress

Owner: c4-sdk-plan (coordinator and plan author)

Branch/worktree: `plan/c4-react`, `/tmp/c4-sdk-plan`

## Goal

Move and revise the c4-react design into the c4-sdk implementation plan, preserving the seven-type JSON
and view/hook/container requirements while adding vertical slices, copy-based consumption, the Cursor
showcase, durable knowledge and continuous three-layer testing.

## Scope

### Owns

- `docs/plans/implementation.md`
- `docs/knowledge/index.md`, `docs/knowledge/decisions.md`, `docs/knowledge/glossary.md`
- `agent-work/items/implementation-plan/`
- The implementation-plan row in `agent-work/COORDINATION.md`

### Reads

- Repository instructions, scaffold and package/config files.
- ts-db `plan/c4-react:docs/plans/c4-react.md` and pinned architecture/FFI sources.
- https://cursor.com/blog/git-at-any-scale and linked primary library documentation.

## Acceptance criteria

- [x] Plan is authoritative in c4-sdk; no framework implementation in this task.
- [x] No npm packaging/publishing now; repeatable project-copy workflow for ts-db Pages.
- [x] Cursor showcase under demos/ with JSON and STE100 write-ups; documented vs inferred boundaries.
- [x] Pure domain functions separated from React/framework effects; thin hooks and props-only views.
- [x] Vertical slices with unit, fast-check and Playwright evidence throughout.
- [x] Existing knowledge skeleton is adapted and populated without importing ts-db history.
- [x] Prior schema/example, seven types, navigation and model assignments retained coherently.

## Validation

Markdown/link/reference checks; JSON example checks; independent review of the exact commit. No runtime
suite or visual-validation claim for this documentation-only task. Commit and push responsibility is
assigned to this coordinator by the continuing user request.
