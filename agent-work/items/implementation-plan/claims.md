# Claims: implementation-plan

Updated: 2026-10-12

## Owned paths

- `docs/plans/implementation.md`
- `docs/knowledge/index.md`, `docs/knowledge/decisions.md`, `docs/knowledge/glossary.md`
- `agent-work/items/implementation-plan/`
- Implementation-plan row only in `agent-work/COORDINATION.md`

## Read-only paths

Scaffold application, manifests, configs, instructions, other task records, and ts-db source material.

## Changes made

Added the standalone implementation plan, populated knowledge decisions/terms and linked the plan from
the knowledge index. Updated only this task's coordination row and records. Product code and dependency changes are out
of scope. The existing scaffold task's ownership and review records are preserved.

## Validation evidence

- Inline Python parsed the complete worked JSON: 10 elements, 8 relationships, 2 diagrams. Checked unique
  IDs, references, visible edge endpoints, detail/parent destinations, groups and mixed-status notes.
- Checked local Markdown links and heading anchors across the plan, knowledge pages and task records.
- `git diff --check` passed. No repository formatter is configured or claimed.
- No product code changed; runtime unit/property/Playwright suites were not run for this plan-only edit.
  The plan requires all three throughout implementation, beginning in C4-01.
- Start-event publication failed because the Git common directory is read-only in the sandbox. Skipped
  under the user's instruction; no event publication is claimed.
- Independent exact-commit review remains pending.

## Scope changes and coordination

User moved the plan and SDK into c4-sdk, required copied-project consumption and a Cursor showcase,
and specified pure logic plus unit/property/browser testing and vertical slices. No build authorized.
