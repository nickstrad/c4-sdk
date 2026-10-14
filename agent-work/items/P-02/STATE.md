# P-02 checkpoint

Status: assigned; not started.

Goal: implement and prove the installable dual-module `c4-sdk` package candidate after P-01 contract freeze. Never publish or tag. Actual npm publication requires Nick present for login/2FA.

Plan: [`docs/plans/productionization.md`](../../../docs/plans/productionization.md). Brief: [`brief.md`](brief.md). Claims: [`claims.md`](claims.md). Root checkpoint: [`STATE.md`](../../../STATE.md).

Builder: fresh Codex Sol in a dedicated worktree/branch. Reviewer: fresh Claude Sonnet, exact final builder head after cleanup.

## Handoff

Before artifact creation, make the one authorized read-only current availability query for `c4-sdk`; record exact result and time. Then implement only claimed paths. Coordinate final package inclusion/verification against P-03's notice files. Capture exact tarball SHA and source SHA and all consumer/browser outcomes. Commit implementation and post-work knowledge/scripts assessment separately where applicable; clean the worktree and report.
