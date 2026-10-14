# P-01 checkpoint

Status: assigned; work not started.

Goal: freeze the public SDK API and support proposal before package implementation. Nick approved the productionization track on 2026-10-14; P-01 is its required first, serialized item.

Plan: [`docs/plans/productionization.md`](../../../docs/plans/productionization.md). Brief: [`brief.md`](brief.md). Claims: [`claims.md`](claims.md). Root checkpoint: [`STATE.md`](../../../STATE.md).

Builder: fresh Codex Sol, own isolated worktree and `item/p-01-public-contract` branch. Exact base/worktree/agent ID are recorded by the coordinator at dispatch. Independent reviewer: fresh Claude Sonnet, only after the builder commits and cleans its worktree.

Owned paths are enumerated in claims. Coordinator retains STATE/COORDINATION and plan ownership. No package/release work is allowed before P-01 is reviewed and landed. Actual `npm publish` is outside the approved boundary and requires Nick present for account login/2FA.

## Progress

- Approval, human STE acceptance closeout, active plan copy, and initial claims prepared on current main `eafd15a6bf158176577af5b1af7e66c0e9660f79`.
- Implementation and validation have not started.

## Handoff

Next: coordinator commits this assignment/checkpoint and the approval records, creates a fresh item worktree, and dispatches the Codex Sol builder. Builder reads this file, root STATE, AGENTS, event log, plan, brief, claims, API guides and knowledge index before editing.
