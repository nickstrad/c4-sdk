# Project knowledge

This is the entry point to durable c4-sdk knowledge. Read it before planning work, then open the page that matches the question. Keep these pages short, dated, and linked to the authoritative work item or finding.

## Pages

| Page | Contents |
| --- | --- |
| [decisions.md](decisions.md) | Decisions and the rationale behind them |
| [gotchas.md](gotchas.md) | Tooling, environment, and behavior traps; dynamic partial order, resource bounds, stable overlays, physical topology, asynchronous focus restoration, routed-kind wrappers and code symbol rendering |
| [glossary.md](glossary.md) | Terms used in this repository's work process |

## Project orientation

- [STATE.md](../../STATE.md) is the current session handoff; reconcile it with Git at restart.

- [Implementation plan](../plans/implementation.md) defines vertical slices, SDK boundaries and consumer milestones.
- [`README.md`](../../README.md) describes the SDK, demo, and existing npm commands.
- [`agent-work/COORDINATION.md`](../../agent-work/COORDINATION.md) tracks current coordinated tasks.
- [Side quests](../../AGENTS.md#side-quests) defines bounded investigations and their findings.

## Maintenance

1. Read this index at orientation time.
2. Record durable lessons after a decision, landing, review, or debugging session that another contributor might otherwise repeat.
3. Date new entries (`YYYY-MM-DD`) and link instead of duplicating authoritative detail.
4. Mark superseded entries with a date and a link to the replacement; do not erase useful history.
5. Update this index whenever pages are added, moved, or removed.
6. Keep project memory in Markdown here; do not use the environment kb CLI or a separate database for it.
7. Never store credentials, tokens, private runtime data, or unreviewed generated dumps.

The repository has no configured formatter. Check `package.json` before claiming formatting validation or adding a formatter.
