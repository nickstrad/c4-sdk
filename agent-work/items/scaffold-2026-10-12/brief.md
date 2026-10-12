# Work item: scaffold-2026-10-12

Status: in progress

Owner: coordinator and scaffold builder

Branch/worktree: `main` (branch creation was not permitted by the workspace)

## Goal

Establish practical coordination, event reporting, experiment, script, and durable knowledge patterns for c4-sdk, adapted from the ts-db repository.

## Scope

### Owns

- `AGENTS.md`, `CLAUDE.md`, and the brief-preserving orientation link in `README.md`
- `agent-work/`
- `docs/haiku-experiments.md` and its findings template
- `docs/knowledge/`
- `work-scripts/`

### Reads

- Existing package manifest, project README, and ts-db patterns under `/root/Software/ts-db`

## Inputs and dependencies

- c4-sdk uses Node, TypeScript, React, Vite, and npm; it has no Deno or configured formatter.
- Existing commands are `dev`, `build`, `lint`, and `preview` in `package.json`.

## Acceptance criteria

- [ ] Instructions are adapted to this repository and AGENTS.md / CLAUDE.md use the documented sync protocol.
- [ ] Task brief, claims, and review records have usable templates and a concrete scaffold mission record.
- [ ] Shared git-common-dir event logging and archive protocols are documented; helper rejects malformed input and safely publishes complete immutable events.
- [ ] Experiment board, findings template, reusable script index, and knowledge skeleton are present.
- [ ] The event helper check passes in an isolated repository with concurrent worktree writers.
- [ ] Only scaffolding files are included in the reviewed change; `kickoff-brief.md` remains untouched.
