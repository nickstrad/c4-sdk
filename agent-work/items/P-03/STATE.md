# P-03 checkpoint

Status: implementation and post-work assessment complete; exact-pack reconciliation is a P-02 gate before candidate acceptance.

Goal: add an accurate MIT license and notices for bundled third-party code and assets. Do not package unrelated demo content or claim third-party material as first-party.

Plan: [`docs/plans/productionization.md`](../../../docs/plans/productionization.md). Brief: [`brief.md`](brief.md). Claims: [`claims.md`](claims.md). Root checkpoint: [`STATE.md`](../../../STATE.md).

Builder: fresh Codex Luna high, `/tmp/c4-sdk-p-03`, branch `item/p-03-licenses`, starting at `d1c228ca1a72278cf8df67813bc251cacb8a8374`. Owned paths are the root `LICENSE`, `THIRD_PARTY_NOTICES.md`, `docs/release/licenses.md`, and this checkpoint. No package/build/config/source paths were edited.

## Implementation and evidence

- Implementation commit: `7aebad65d863089264e8d85fe2b58c6153ef4c63` (`docs: add project and third-party license notices`).
- Inventory qualification commit: `3ce2c653d6cd0bd678073e0e9d7f2d3f9dc91956` (`docs: qualify provisional package inventory`). It marks P-02's current allowlist report provisional until the exact tarball is inspected.
- Added complete standard MIT License text with `Copyright (c) 2026 Nick Strad`. The holder is inferred from repository ownership (`github.com/nickstrad/c4-sdk`) and project authorship (`nickstrad <nickstrad.dev@gmail.com>`); no separate legal-holder attestation was recorded.
- P-02's current Rolldown module inventory reports 76 bundled third-party packages: 65 MIT, 9 ISC, 1 BSD-3-Clause, and `elkjs@0.12.0` (`EPL-2.0 OR GPL-3.0-or-later`), using EPL-2.0. It also reports React and React DOM as external peers. `THIRD_PARTY_NOTICES.md` lists the reported exact versions and reproduces the matching 76 upstream license files. This is the provisional source-build inventory at `/tmp/c4-sdk-p-02/tests/package/evidence/bundle-inventory.json`, not yet proof of exact tarball contents.
- P-02 reports the current package allowlist contains generated JavaScript, declarations, SDK CSS, a self-contained ELK worker, metadata, README, `LICENSE`, and `THIRD_PARTY_NOTICES.md`; it reports no font files, favicon, static image, external artwork, or demo content. No exact `npm pack --json` inventory has been provided yet, so the packed file list and final package reconciliation remain pending.
- The showcase article by Vicent Martí/Cursor remains attributed to its source and is not relicensed or included in the reported SDK package. No external artwork is asserted as project-owned.
- `docs/release/licenses.md` records copyright evidence, inventory method, asset boundary, and the required exact-pack gate. It links to the committed P-02 checkpoint and names the expected machine-readable inventory path, then requires synchronization with the exact packed candidate.

## Validation

- Read the MIT text and checked that it contains the standard permission, notice-preservation condition, warranty disclaimer, and liability clause; no placeholders remain.
- Direct comparison against the P-02 module inventory verified all 76 package/version/license-expression entries and all 76 full upstream license-file contents were present in `THIRD_PARTY_NOTICES.md`.
- `git diff --check`: PASS.
- The first local `git commit` attempt was denied because the worktree's shared Git metadata is read-only in the sandbox. The authorized commit then succeeded after the required filesystem escalation; implementation files were already staged in the assigned worktree.
- The task-start event helper was attempted and failed with `mkdir: .../.git/agent-work: Read-only file system`; no event was published, consistent with the root checkpoint's existing exception.

## Post-work knowledge and reusable-script assessment — 2026-10-14

The release-specific license policy and provisional third-party/asset boundary belong in [`docs/release/licenses.md`](../../../docs/release/licenses.md) and [`THIRD_PARTY_NOTICES.md`](../../../THIRD_PARTY_NOTICES.md); adding duplicate material to shared `docs/knowledge/` would not improve reuse and those shared paths are coordinator-owned. No additional durable project knowledge is justified until P-02 completes the exact artifact audit.

No reusable work script is justified. The 76-package license-file comparison was a one-off check against P-02's generated inventory; P-02's build already produces that inventory, and a reusable pack audit helper is outside P-03 claims. No VM/environment finding warrants a `kb` update.

Assessment/checkpoint commit: this checkpoint is committed separately after the two implementation commits. The assessment found no additional project knowledge or reusable script to add. P-02's final `npm pack --json` listing remains pending; it must be compared with these notices and asset exclusions, and any mismatch corrected within the appropriate item before candidate acceptance. This pending P-02 evidence does not change the provisional inventory into a verified packed inventory.

## Review nits repair — 2026-10-14

Fresh Codex Luna high fixup started from reviewed builder HEAD `8c0a1f0c7e8803261ee2a8e5a140c77951b86b07` in `/tmp/c4-sdk-p-03-fix`, branch `fix/p-03-license-review-nits`. The exact Sonnet NITS record is on `review/p-03-licenses-sonnet`.

- Repair commit: `0656203` (`docs: repair license record review nits`). It changes only this checkpoint and `docs/release/licenses.md`.
- Replaced the cross-branch evidence JSON link with a link to the committed P-02 checkpoint and plain text naming the expected `tests/package/evidence/bundle-inventory.json` path.
- Rephrased the holder basis as an inference from repository ownership and project authorship, and recorded that no separate legal-holder attestation was made. The MIT text and holder are unchanged.
- Validation: referenced local link targets resolve on this branch; `git diff --check` passes. No tests or network access were used. The 76-package inventory remains explicitly provisional pending exact-pack reconciliation.

Post-repair assessment: no additional durable project knowledge or reusable script is justified. These corrections are specific to the P-03 review findings, and the evidence-link timing will be resolved by coordinator integration with P-02. The repair is ready for fresh independent re-review; it is not yet approved for landing.

## Handoff

P-03's original builder HEAD received a Sonnet NITS review; the repair branch is ready for fresh independent re-review after its assessment commit. Before productionization candidate acceptance, P-02 must prove that the exact tarball includes `LICENSE` and `THIRD_PARTY_NOTICES.md` and that the bundled package/asset graph remains consistent with this notice inventory. No publish, merge, push, or registry operation was performed by this fixup.
