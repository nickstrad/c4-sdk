# Haiku experiments and side quests

This board tracks small, bounded, read-only or scratch-only investigations of the product tree. Use `sq-NN-short-name` for each side quest. Implementation work that changes product files gets a separate brief and path claims under `agent-work/items/`, not an `sq-*` ID. Do not choose an agent or model from this document; the coordinator assigns one based on the task.

| ID | Question or task | Why it matters | Done criteria | Status | Finding |
| --- | --- | --- | --- | --- | --- |
| — | No experiments registered yet. | — | — | — | — |

## Operating rules

- The coordinator adds and updates rows on this shared board. Keep the question, scope, and done criteria narrow enough to finish in one short session.
- Use a branch named `sq-NN-short-name` and record the owner and branch in the finding.
- Do not change product files during a side quest. Keep code and measurements in scratch space or in scripts explicitly claimed for the quest. Record scratch paths and exact reproduction commands.
- Write each result to a unique `docs/haiku-experiments/findings/sq-NN-short-name.md` using [`findings/TEMPLATE.md`](haiku-experiments/findings/TEMPLATE.md). Include negative results and limits.
- Update the board status and finding link with the completed result. Keep review and landing decisions in the work item's review record and coordination log.
