# P-01 package identity fixup checkpoint

Status: builder complete; documentation validation PASS; fresh Claude Sonnet re-review pending. No merge, push or publication performed.

Goal: align the active candidate package identity with Nick's 2026-10-14 approval note relaying verification that unscoped `c4-sdk` was available on 2026-10-12. Preserve candidate version `0.1.0-beta.1`. This fixup did not query npm or prove present-day availability/account ownership. P-02 must revalidate current registry availability before building its artifact; actual publication waits for Nick present for npm account login/2FA.

Brief: [`brief.md`](brief.md). Claims: [`claims.md`](claims.md). Original P-01 checkpoint: [`../P-01/STATE.md`](../P-01/STATE.md). Prior independent PASS review is on `review/p-01-sonnet`, exact commit `f92d8d2185b478f0d55f2e069ae64c5d0ca6f69c`, for builder HEAD `5346c383a06d8540d8d2c48c45cd0965f06e3f5b`.

Builder: fresh Codex Sol `/root/p01_package_name_fixup_builder`, branch `fix/p-01-package-name`, isolated worktree `/tmp/c4-sdk-p-01-name-fixup`. Exact starting HEAD after coordinator merge of P-01: `0d5100596152d1486b7003e3637995923915e5a4`; underlying main base `7b46f1d`.

Owned paths: identity/examples in `docs/plans/productionization.md`, package specifiers in `docs/api/public-api.md`, identity evidence/recommendation in `docs/api/support-matrix.md`, and this checkpoint. Coordinator retains root STATE/COORDINATION, integration and shared knowledge ownership.

## Implementation and validation — 2026-10-14

Documentation commit: `3454cc822e147098e922e3f87d40c7f9bd860b25`.

- Aligned both entry tables and the illustrative manifest name to `c4-sdk`; no scoped package references remain in the three owned docs.
- Updated plan/support identity text with dated Nick evidence, explicit uncertainty, P-02 registry revalidation before artifact creation, and publication login/2FA gate.
- Checked both tables contain exactly `c4-sdk`, `c4-sdk/core`, `c4-sdk/styles.css`, `c4-sdk/layout-worker.js`; candidate version remains `0.1.0-beta.1`.
- All 9 local Markdown link targets/anchors in the three docs passed a filesystem/heading check. External URLs were unchanged and were not fetched, consistent with the no-network brief.
- `git diff --check` passed; manual diff/scope inspection confirmed only the three authorized documentation files changed in the implementation commit. No source, manifest, build/config, tests or API signatures changed. Runtime/browser tests were not needed for this prose/specifier correction.
- Read repository/root/item coordination and checkpoints, prior exact review and knowledge/script indexes. Live event inbox contained zero files. Publication remains skipped under Nick's existing root-checkpoint exception; no event is fabricated.

## Post-work knowledge and reusable-script assessment — 2026-10-14

Assessed the committed diff and validation. The durable correction is authoritative in the plan and support proposal: `c4-sdk` supersedes the prior scoped candidate recommendation, while dated relayed availability is not present-day evidence or ownership. Coordinator should reconcile this correction with the original P-01 knowledge delta when updating `docs/knowledge/decisions.md`; knowledge pages/index remain read-only under these claims. No separate knowledge-content edit is justified within this narrow assignment.

No reusable work-script is warranted. The checks are one-off documentation consistency checks; an indexed script would add maintenance for this small correction. No durable VM/environment finding warrants a kb update. This checkpoint is the required separate assessment commit; its exact SHA is reported in the completion handoff because a file cannot contain its own commit hash.

## Handoff and next gate

After committing this checkpoint, clean only this builder's worktree and linked metadata, retain branch `fix/p-01-package-name` and all durable commits, and report cleanup/final HEAD to the coordinator. Fresh Claude Sonnet must re-review the exact final branch HEAD from a new worktree. Review/landing remain pending; P-02/P-03 remain gated until P-01 integration. No publication or ts-db action is authorized by this checkpoint.
