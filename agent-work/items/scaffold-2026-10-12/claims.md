# Claims: scaffold-2026-10-12

Updated: 2026-10-12

## Owned paths

- `AGENTS.md`, `CLAUDE.md`, `README.md`
- `agent-work/`
- `docs/haiku-experiments.md`, `docs/haiku-experiments/findings/`
- `docs/knowledge/`
- `work-scripts/`

## Read-only paths

- Existing product source and package configuration
- `/root/Software/ts-db` reference patterns
- `kickoff-brief.md` user input

## Changes made

- Added repository instructions and orientation links, with identical shared branch/worktree and commit sections in `AGENTS.md` and `CLAUDE.md`.
- Added the work-item flow, active scaffold brief/claims/pending review, reusable templates, coordination table, and common Git-dir event schema/protocol.
- Added a read-only/scratch-only `sq-*` board and findings template, the knowledge-page index/skeleton, and Bash/Node work-script docs and index.
- Added event publish, archive, and isolated validation scripts; the validation exercises 100 concurrent writers across linked worktrees.

## Validation evidence

- `bash work-scripts/bash/log-event-check.sh` — PASS: malformed input rejection; six event types; 100 concurrent linked-worktree writes; complete publication; literal data handling; archive publish, idempotence, and collision refusal.
- `bash -n work-scripts/bash/log-event.sh work-scripts/bash/archive-events.sh work-scripts/bash/log-event-check.sh` — PASS.
- `node --experimental-strip-types work-scripts/node/runtime-info.ts` — PASS on Node v22.23.2.
- The lead's `git show --check` found trailing hard-break spaces in Markdown templates. The follow-up removes them; `git diff --check 82ddc44` — PASS across the full change from baseline.
- `kickoff-brief.md` remains unmodified and untracked. Git metadata is read-only in the managed workspace; branch creation and access to the live common-dir inbox were unavailable.

## Scope changes and coordination

- None.
