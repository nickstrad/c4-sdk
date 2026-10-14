# P-03 attribution fixup review

Reviewer: fresh Claude Sonnet 5.5, worktree `/tmp/c4-sdk-p-03-minpath-review`, branch `review/p-03-minpath-sonnet`.

Reviewed exact HEAD: `7cae8e3d3fe01b73c58ecf24c1b4d15a97cbb217`
(repair commits `6ea8758`, `2241c93`, `39044af`, `7cae8e3`).

## Verdict: PASS

## Checks

- **Inventory evidence.** `/tmp/c4-sdk-p-02/tests/package/evidence/bundle-inventory.json` has SHA-256 `88f62f2709fb334629bf36035bd57c7753721295b3c803f460367a041bd01ebc` (matches) and 76 package rows. Hash and path match in both `THIRD_PARTY_NOTICES.md` and `docs/release/licenses.md`.
- **76/76 correspondence.** Every inventory package name@version has exactly one `### name@version — license` heading and one Inventory list entry in `THIRD_PARTY_NOTICES.md`; license in each heading equals the inventory license. No missing, extra, or mismatched rows.
- **Distribution.** 65 MIT / 9 ISC / 1 BSD-3-Clause / 1 EPL-2.0 OR GPL-3.0-or-later, computed from the inventory; matches both documents.
- **character-entities@2.0.2.** Present in the list and as a full MIT notice (Titus Wormer, 2015); it was absent before `39044af`.
- **minpath notices.** Both full MIT notices remain (James Halliday 2013; Joyent, Inc. and other Node contributors). Text compared against the installed `vfile@6.0.3/lib/minpath.browser.js` header in the P-02 worktree: copyright lines match. The inventory lists `node_modules/vfile/lib/minpath.browser.js` as bundled. Scope is accurate: attributed to file `lib/minpath.browser.js` in `vfile@6.0.3`, stated as supplemental, not additional package rows.
- **Pending gate.** Both documents state that the exact `npm pack --json` reconciliation is still pending and make no claim about final tarball contents.
- **Links / whitespace.** Local link targets in `docs/release/licenses.md` and the fixup `STATE.md` resolve; `git diff --check HEAD~4 HEAD` is clean.

## Nits (non-blocking)

- Notices and release record cite an absolute `/tmp/...` evidence path that will not exist for later readers; acceptable as provisional evidence, but P-02 should record the final inventory in-repo with the pack listing.

## Required follow-up

P-02 must still repack after this notice fix and reconcile exact tarball contents against these 76 rows plus the supplemental minpath notices before candidate acceptance.
