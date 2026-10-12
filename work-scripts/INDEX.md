# Work script index

Every reusable script under this directory must have one row here. Update the index in the same change that adds or removes a script.

| Script | Date | Author | Purpose | Usage | Notes |
| --- | --- | --- | --- | --- | --- |
| `bash/log-event.sh` | 2026-10-12 | scaffold agent | Validate and atomically publish an agent event to the Git common-dir inbox | `work-scripts/bash/log-event.sh --type task_started --branch <branch> --summary "<task id and status>"` | Bash, Git, GNU coreutils; see `agent-work/event-log.md` |
| `bash/log-event-check.sh` | 2026-10-12 | scaffold agent | Exercise event validation, immutable publication, archive collision handling, and concurrent worktree writes in an isolated Git fixture | `bash work-scripts/bash/log-event-check.sh` | Scratch fixture is created under `${TMPDIR:-/tmp}` and removed on exit |
| `bash/archive-events.sh` | 2026-10-12 | scaffold agent | Copy complete live events to the tracked archive, checking immutable IDs | `bash work-scripts/bash/archive-events.sh` | Run from the coordinator's archive worktree; does not stage or commit |
| `node/runtime-info.ts` | 2026-10-12 | scaffold agent | Print Node runtime and platform details for environment reports | `node --experimental-strip-types work-scripts/node/runtime-info.ts` | Uses erasable TypeScript syntax; validated with Node 22.23.2 |
