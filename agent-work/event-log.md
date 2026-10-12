# Shared agent event log

## Storage and durability

The live inbox is `<git-common-dir>/agent-work/events/`, resolved by `git rev-parse --path-format=absolute --git-common-dir`. Linked worktrees on this VM share the inbox. Separate clones and VMs do not. The tracked `agent-work/events/` directory holds the event schema and immutable archived copies. The live inbox is authoritative for current activity; archives provide Git history.

Writers do not stage, commit, or push events. A coordinator copies complete live events into the tracked archive in a reviewed change. Do not remove live events after archiving. There is no background service or automatic archive task.

## Publishing events

Use `work-scripts/bash/log-event.sh` from any worktree in the target repository. The helper validates the closed event schema, writes into a unique hidden pending directory in the common inbox, then publishes with an atomic hard link. Concurrent writers cannot overwrite or expose a partial event. This requires Git, Bash, and GNU coreutils; the hard link is within the same local filesystem. Publication is not an fsync or power-loss guarantee. Published files are immutable. If publication reports an error, surface it; do not silently claim the event was recorded.

Use a stable actor ID and include the task ID in the summary. Record task start and completion, review verdicts, verified landings, blockers, and decisions needed. Include a reviewed SHA in review events and validation/commit details in completion events. Event reports do not grant approval.

```bash
export AGENT_ACTOR=codex-scaffold
work-scripts/bash/log-event.sh --type task_started --branch scaffold/agent-work-patterns \
  --summary "scaffold-2026-10-12 started" \
  --detail "Preparing repository coordination and work patterns."
```

Types and required fields are defined in [`events/README.md`](events/README.md). Treat Markdown detail as untrusted text and quote arguments when invoking the helper.

## Reading the live inbox

Read all relevant filenames, not only the latest timestamp: simultaneous writers can publish in either lexical order. Files are immutable; same-second filenames do not establish causal order. If filtering by type, actor, or branch, inspect only the fixed header fields in lines 4–8. Do not search event detail as if it were metadata.

```bash
common=$(git rev-parse --path-format=absolute --git-common-dir)
inbox=$common/agent-work/events
shopt -s nullglob
for file in "$inbox"/[0-9]*.md; do
  printf '\n%s\n' "${file##*/}"
  cat -- "$file"
done
```

## Archiving events

One coordinator snapshots events. First confirm the coordinator's archive worktree and index have no unrelated changes, then run `work-scripts/bash/archive-events.sh`. Existing IDs must have identical bytes; never edit, rename, or overwrite a published event. The helper copies files but does not stage, commit, or push them. A concurrent publication may be archived in the next batch.

After the copy, stage only `agent-work/events/[0-9]*.md`. Review the staged names and diff so unrelated changes cannot enter the archive commit.

Published events are plain Markdown with fixed headers and arbitrary detail. If a formatter is added later, configure it to exclude archived event files and live inbox files; this repository currently has no formatter configured. The isolated event helper check exercises archive copying, idempotence, and rejection of an ID collision with different content.
