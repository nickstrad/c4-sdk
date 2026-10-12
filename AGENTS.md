# Agent coordination and project structure

This file defines how agents coordinate work in this repository. Repository conventions for Claude Code live in [`CLAUDE.md`](CLAUDE.md). Keep those files focused on separate topics and follow the [sync protocol](#instruction-file-sync-protocol) if their shared topics change.

## Work items

Track each coordinated task in its own directory under `agent-work/items/`. Start from the templates in `agent-work/items/templates/` and include a brief, a claims record, and a review record. The brief names the goal, scope, ownership, inputs, and acceptance criteria. Builders update claims before editing and keep them current as scope changes. Reviewers record the reviewed commit, verdict, findings, and follow-up. A review record stays pending until an actual review occurs; a task's completion or commit does not imply approval.

The flow is brief → build → review → land. An independent reviewer inspects the exact commit and records PASS, NITS, or FAIL against the brief. PASS allows the coordinator to land when the task is authorized for landing. NITS returns the findings to the builder for a fix and review of the updated commit. FAIL returns the item to the builder with the defect list. Review approval and permission to land are separate; follow any explicit human approval requirement in the task.

## Branch and worktree etiquette

Use the branch and worktree assigned to the task. Before editing, read the task's `brief.md` and `claims.md`, then check `agent-work/COORDINATION.md` for shared-file conflicts. Do not edit paths claimed by another active task. If scope must change, update the claims record and coordinate the change first. Only the coordinator lands or pushes work unless the task explicitly assigns that responsibility.

## Commit style

Make one logical change per commit. Use `<area>: <imperative summary>` for the subject, such as `docs: add agent coordination scaffold`. Keep generated output and unrelated local files out of commits.

## Side quests and experiments

Side quests are read-only or scratch-only investigations against the product tree. Give each one an `sq-NN-short-name` ID and track it on [`docs/haiku-experiments.md`](docs/haiku-experiments.md). The coordinator owns the shared board; a quest builder owns its unique finding and any scripts explicitly claimed for that quest. Findings live at `docs/haiku-experiments/findings/sq-NN-short-name.md` and use [`docs/haiku-experiments/findings/TEMPLATE.md`](docs/haiku-experiments/findings/TEMPLATE.md). If work needs to change product files, track it as an implementation work item under `agent-work/items/` with explicit path ownership instead of treating it as a side quest. Record evidence and reproduction steps in the finding.

## Shared agent event log

At task start, read `agent-work/event-log.md` and the latest live events relevant to the task. Use `work-scripts/bash/log-event.sh` to report task starts, completions, review verdicts, landings, blockers, and decisions. Events are status reports; they do not grant approval or change task ownership. The common Git directory inbox is shared among linked worktrees on this VM. Tracked `agent-work/events/` holds immutable event archives.

## Reusable work scripts

Reusable scripts belong under `work-scripts/bash/` or `work-scripts/node/`. Read [`work-scripts/INDEX.md`](work-scripts/INDEX.md) before adding one and add an index row in the same change. Do not add package scripts or dependencies just to run a one-off helper; use the existing Node and npm environment.

## Durable project knowledge

Read [`docs/knowledge/index.md`](docs/knowledge/index.md) before planning repository work. Record durable decisions, gotchas, and terminology in the appropriate page, dated and linked to the authoritative work item or finding. Keep the index current and never store secrets or private runtime data.

## Instruction-file sync protocol

`AGENTS.md` is the source of truth for coordination, work ownership, experiments, event reporting, and project knowledge. `CLAUDE.md` is for Claude Code repository conventions and environment-specific commands. The files are deliberately disjoint except for the two sections titled “Branch and worktree etiquette” and “Commit style.” Keep those sections textually identical in both files whenever either changes; put every other topic in only its designated file. Do not make either file a summary or symlink of the other.
