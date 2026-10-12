# Work coordination

This file is the current human-maintained view of coordinated work. Detailed task scope and review evidence live in each task directory under [`items/`](items/).

| Task | Summary | Owner | Branch | Status | Review |
| --- | --- | --- | --- | --- | --- |
| scaffold-2026-10-12 | Establish repository coordination and reusable work patterns | Codex scaffold agent | `main` (branch creation not permitted) | Complete | PASS on `a0525c2`; landed `486db29` |
| implementation-plan | Standalone SDK implementation plan, vertical slices and showcase | c4-sdk-plan | `plan/c4-react` | Complete; plan branch published | PASS on `340baa4`; no main merge |

Update the row when ownership, branch, status, or review changes. Do not record a PASS until a reviewer has inspected the exact commit and written the verdict in that task's `review.md`.

Build authorized 2026-10-12 by `build-kickoff.md`. Coordinator is landing the reviewed plan and will dispatch C4-01 first. Root restart checkpoint: `STATE.md`.

| C4-01 | Open runtime JSON context with test harness | Sol builder | `item/c4-01-context` `/tmp/c4-sdk-c4-01` | Dispatched | Pending |

Plan merge `3524a26`: independent Sol review PASS. Build coordinator owns root STATE and integrations.
