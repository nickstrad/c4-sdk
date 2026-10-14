# P-03 review

Reviewed SHA: `8c0a1f0c7e8803261ee2a8e5a140c77951b86b07` (branch `item/p-03-licenses`; commits `7aebad6`, `3ce2c65`, `8c0a1f0`)
Reviewer: fresh Claude Sonnet 5.5, worktree `/tmp/c4-sdk-p-03-review`, branch `review/p-03-licenses-sonnet`
Verdict: **NITS** (no blocking defects; two non-blocking notes below)

## Checks

- **Path scope: PASS.** `git diff --name-only d1c228c HEAD` lists only `LICENSE`, `THIRD_PARTY_NOTICES.md`, `docs/release/licenses.md`, `agent-work/items/P-03/STATE.md`, all P-03 Owns.
- **MIT text: PASS.** Complete standard text, with permission grant, notice-preservation condition, warranty disclaimer and liability clause. No placeholders. Year 2026 matches the repository history (commits dated 2026-10).
- **Holder claim: NITS.** `Nick Strad` rests on the repo identity `nickstrad/c4-sdk`, commit author `nickstrad`, and an owner confirmation recorded only in P-03's own docs. The full legal name is not independently verifiable from repo evidence; it is documented honestly as owner-confirmed.
- **Notices vs the 76-package graph: PASS.** Compared `/tmp/c4-sdk-p-02/tests/package/evidence/bundle-inventory.json` with `THIRD_PARTY_NOTICES.md`:
  - 76/76 `name@version` entries are present in the inventory list (76 list entries, no extras).
  - License split matches the evidence: 65 MIT, 9 ISC, 1 BSD-3-Clause, 1 `EPL-2.0 OR GPL-3.0-or-later` (elkjs).
  - Every `licenseFiles` entry's full text, whitespace-normalised, appears in the notices.
  - Installed `package.json` versions match.
  - React and React DOM are correctly documented as external peers.
- **Original assets not relicensed: PASS.** The Cursor article by Vicent Martí is attributed and explicitly not relicensed or packaged; no external artwork is claimed. The favicon and demo assets are scoped as repository-only and outside the package inventory.
- **Provisional vs final inventory: PASS.** `docs/release/licenses.md` calls the inventory P-02 build evidence rather than a packed inventory. It states that the exact `npm pack --json` listing must confirm the file and asset exclusions and be reconciled before candidate acceptance. `THIRD_PARTY_NOTICES.md` carries the same qualification.
- **Whitespace: PASS.** `git diff --check d1c228c HEAD` is clean.
- **Links:** relative links to `LICENSE` and `THIRD_PARTY_NOTICES.md` resolve. See note 1 on the evidence JSON link.

## Findings (non-blocking)

1. `docs/release/licenses.md` links `tests/package/evidence/bundle-inventory.json`, which does not exist on this branch; it exists only on P-02's branch. The link is dangling until P-02 lands, and the STATE evidence path is an ephemeral `/tmp` worktree. Coordinator should confirm the file lands with P-02 before landing P-03 (or after, in order).
2. The holder's full legal name depends on the unrecorded-elsewhere owner confirmation. The coordinator may want a one-line human confirmation in root STATE.

## Follow-up (required regardless of verdict)

PASS/NITS does not verify the tarball. P-02 / the coordinator must compare the exact `npm pack --json` file list and bundled graph against these notices (including `LICENSE`, `THIRD_PARTY_NOTICES.md` present, and no fonts, favicon or images) before candidate acceptance.

No network was used. Implementation and notices were not edited.
