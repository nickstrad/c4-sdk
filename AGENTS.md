# Agent coordination and project structure

This file defines how agents coordinate work in this repository. Repository conventions for Claude Code live in [`CLAUDE.md`](CLAUDE.md). Keep those files focused on separate topics and follow the [sync protocol](#instruction-file-sync-protocol) if their shared topics change.

## Work items

Track each coordinated task in its own directory under `agent-work/items/`. Start from the templates in `agent-work/items/templates/` and include a brief, a claims record, and a review record. The brief names the goal, scope, ownership, inputs, and acceptance criteria. Builders update claims before editing and keep them current as scope changes. Reviewers record the reviewed commit, verdict, findings, and follow-up. A review record stays pending until an actual review occurs; a task's completion or commit does not imply approval.

The flow is brief → build → review → land. An independent reviewer inspects the exact commit and records PASS, NITS, or FAIL against the brief. PASS allows the coordinator to land when the task is authorized for landing. NITS returns the findings to the builder for a fix and review of the updated commit. FAIL returns the item to the builder with the defect list. Review approval and permission to land are separate; follow any explicit human approval requirement in the task.

## Fresh-agent work lifecycle

Every work item is assigned to a **new agent with fresh context** in its own isolated worktree. Never reuse a completed, active, stalled, or errored subagent for another work item, review, or fixup. Each independent review also uses a new agent that did not build the commit. If an agent stops, preserve and checkpoint its changes; transfer them into a new agent's own worktree and record the old and new branches and exact base. Do not let the successor edit in the stopped agent's worktree.

For a regular item, the new builder reads root and item `STATE.md`, the brief, claims, repository instructions, current coordination and relevant event log before editing. It commits the implementation and evidence first. Then it checks the finished diff and validation/debugging for durable c4-sdk knowledge and reusable scripts or information that will help later agents. Add useful lessons to the appropriate `docs/knowledge/` page and index, and reusable scripts to the indexed work-scripts directory. Commit these follow-up changes separately on the item branch. Do not add a script for a one-off command; if there is no durable lesson or reusable helper, state that in the item checkpoint. Knowledge entries must give a date and link to the item/evidence.

The builder updates item `STATE.md` with implementation and knowledge/script commit SHAs, validation, handoff and evidence, then cleans up its own worktree after all its commits are durable. The coordinator keeps the branch and commits available for review/landing. A fresh independent reviewer checks the final exact builder commit from its own worktree, records the SHA, verdict and test evidence, and commits the review record. After review, that reviewer cleans its own worktree. The coordinator lands only a PASS, adds the review record, reruns integration checks, updates root `STATE.md`/`COORDINATION.md`, and pushes when authorized. A NITS/FAIL fix or re-review is a **new agent** in a new worktree; it does not resume or reuse the former builder or reviewer.

Apply the same fresh-agent and cleanup rules to side quests. A side quest has no product-code permission; its assigned new agent commits its unique finding and any indexed reusable research helper, records whether the knowledge check produced a lesson, and removes its worktree when done.

## Execution modes (hybrid)

Work runs in one of two modes. The mode never changes the fresh-agent lifecycle above: fresh context per unit, commit, knowledge/script preservation, worktree cleanup.

1. **Headless runs (default for item work).** Builds, reviews, fixups, and side quests run as non-interactive agent processes launched by the coordinator: the brief is a file passed to the run (`claude -p`, `codex exec`, or `muse exec --prompt-file`), the run gets its own branch/worktree, the brief names its permission profile and acceptance checks up front, and the coordinator records the run's exit status and saves its machine-readable output (JSON event stream or transcript) with the item checkpoint. No interactive session is created or kept for item work, and no work waits on anyone watching a terminal.
2. **Long-lived interactive sessions (coordinators and planners only).** A small number of persistent sessions (e.g. in tmux) are reserved for roles whose value is accumulated context across items: plan authoring, research synthesis, cross-item coordination. They dispatch headless runs and judge results; they do not do item work themselves.
3. **Coordination is files, in both modes.** Briefs/claims, `agent-work/COORDINATION.md`, `STATE.md`, and the shared event log are the coordination channel. Messages between agents travel as committed files or new headless runs, never as text typed into another agent's terminal session.
4. **Exceptions are explicit.** Interactive item work (live debugging, joint exploration with the user) is allowed when the brief names it and says why; it is never the default.

## Model-seat mapping

Use the model seat named by the plan or brief. A paired label names the matching Anthropic/OpenAI choices for that seat; follow actual usage budgets and user instructions when selecting a provider. Normal mappings are Sol / Sonnet (`gpt-6.1-sol` / Claude Sonnet), Astra / Opus (`gpt-6-astra` / Claude Opus), and Luna / Haiku (`gpt-6-luna` / Haiku 5.5 or later, high effort). Do not substitute a different tier without a scoped, documented reason. Builders and independent reviewers use separate fresh agents, normally in the assigned seat; only the difficult C4-04 layout uses Astra / Opus under this plan.

## Branch and worktree etiquette

Use the branch and worktree assigned to the task. Before editing, read the task's `brief.md` and `claims.md`, then check `agent-work/COORDINATION.md` for shared-file conflicts. Do not edit paths claimed by another active task. If scope must change, update the claims record and coordinate the change first. Only the coordinator lands or pushes work unless the task explicitly assigns that responsibility.

## Commit style

Make one logical change per commit. Use `<area>: <imperative summary>` for the subject, such as `docs: add agent coordination scaffold`. Keep generated output and unrelated local files out of commits.

## Planning, models and concurrent execution

Plans live in `docs/plans/` in this repository. Prefer vertical slices that deliver usable behavior.
Use Sol by default, Astra only with a specific particularly difficult problem in the brief, and Luna
(high effort) for well-defined, tightly scoped work. This applies to planned production items as well as
investigations; do not infer that Luna always means a side quest. Reviewers remain independent of builders.

Every plan must explicitly list what can run concurrently, prerequisites, shared-file owners and integration
order. Builders use separate branches/worktrees with exact Owns/Reads claims reserved before dispatch.
Worktrees do not make edits to a common schema, entry point or lockfile independent. Serialize shared
changes; if new overlap appears, stop the affected overlap and revise claims. Integrate approved items one
at a time, rerun affected checks on the combined tree, and re-review semantic conflict resolutions.

Playwright validates visual slices throughout implementation. New or changed domain logic requires unit
and fast-check property tests. Nonvisual items use the validation most helpful for their output; do not
invent UI work to satisfy a browser-test checkbox. Keep business rules in pure functions and framework
integration in thin hooks/adapters, with props-only views.

## Side quests

Work has two forms: regular work items under `agent-work/items/` and side quests with `sq-NN-short-name` IDs. Side quests are read-only or scratch-only investigations against the product tree. Track ownership and status in `agent-work/COORDINATION.md`; the coordinator owns shared status edits. A quest builder owns its unique finding at `agent-work/side-quests/sq-NN-short-name.md` and explicitly claimed, indexed work scripts. Use [`agent-work/side-quests/TEMPLATE.md`](agent-work/side-quests/TEMPLATE.md), record the question, why it matters, done criteria, evidence, exact reproduction commands, negative results and limits. Use a branch named `sq-NN-short-name`. Product changes require a regular work item with explicit path ownership.

## Restart state

Every planning or work effort must maintain a `STATE.md` checkpoint. Read the relevant checkpoint at session start and after compaction, before acting. The brief identifies its path and owner: use the existing plan checkpoint, or `agent-work/items/<id>/STATE.md` for independent work. A side quest may use `agent-work/side-quests/<sq-id>/STATE.md`. Do not overwrite another effort’s checkpoint or create competing authoritative copies.

Keep the checkpoint current as work, decisions, scope, blockers, validation or commits change, and always update it before compaction, pause, handoff or session end. Record the goal and latest user instructions, current status, branch/worktree and relevant SHAs, owned paths, completed work, evidence, open questions/blockers, and concrete next steps. Link authoritative briefs, plans, claims and reviews. A restarting session must be able to continue from this file without the prior chat. Distinguish pending work from authorization; a checkpoint never grants permission to resume paused work or land changes.

The build coordinator owns root `STATE.md`, coordination and knowledge-index updates. Concurrent builders maintain item-local checkpoints and report deltas; unrelated tasks must not overwrite the shared handoff.

## Shared agent event log

At task start, read `agent-work/event-log.md` and the latest live events relevant to the task. Use `work-scripts/bash/log-event.sh` to report task starts, completions, review verdicts, landings, blockers, and decisions. Events are status reports; they do not grant approval or change task ownership. The common Git directory inbox is shared among linked worktrees on this VM. Tracked `agent-work/events/` holds immutable event archives.

## Reusable work scripts

Reusable scripts belong under `work-scripts/bash/` or `work-scripts/node/`. Read [`work-scripts/INDEX.md`](work-scripts/INDEX.md) before adding one and add an index row in the same change. Do not add package scripts or dependencies just to run a one-off helper; use the existing Node and npm environment.

## Durable project knowledge

Read [`docs/knowledge/index.md`](docs/knowledge/index.md) before planning repository work. Record durable decisions, gotchas, and terminology in the appropriate page, dated and linked to the authoritative work item or finding. Keep the index current and never store secrets or private runtime data.

## Instruction-file sync protocol

`AGENTS.md` is the source of truth for coordination, work ownership, side quests, restart state, event reporting, and project knowledge. `CLAUDE.md` is for Claude Code repository conventions and environment-specific commands. The files are deliberately disjoint except for the two sections titled “Branch and worktree etiquette” and “Commit style.” Keep those sections textually identical in both files whenever either changes; put every other topic in only its designated file. Do not make either file a summary or symlink of the other.
