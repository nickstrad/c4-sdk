# P-03 attribution fixup re-review

Reviewer: fresh Claude Sonnet 5.5. Reviewed HEAD: `346a113106fec725cff0092a01287f31605897bc` (branch `review/p-03-evidence-path-sonnet`), covering `ef035ab` and `346a113`.

**Verdict: PASS**

## Checks

- `THIRD_PARTY_NOTICES.md` and `docs/release/licenses.md` contain no `/tmp` paths. Both name the future committed path `tests/package/evidence/bundle-inventory.json` and say P-02 will record its SHA-256 in its checkpoint (`agent-work/items/P-02/STATE.md`, linked from the release record).
- `STATE.md` still marks exact `npm pack` reconciliation pending. It states the inventory file is not present in this branch and P-02 will add it. The `/tmp` hash is labelled provisional, in the item STATE only. No claim that the file or hash is committed.
- Inventory intact: 76 package rows (`### \`pkg@ver\``), including `character-entities@2.0.2`. Counts (65 MIT / 9 ISC / 1 BSD-3-Clause / 1 EPL-2.0 OR GPL-3.0-or-later) unchanged by these commits.
- Embedded minpath attributions intact: James Halliday (2013) and Joyent, Inc. and other Node contributors under `vfile@6.0.3`.
- Local links: all resolve except the new `tests/package/evidence/bundle-inventory.json` link in `docs/release/licenses.md`, which is intentionally forward-looking (disclosed in STATE). It will be dangling until P-02 lands the file.
- `git diff --check 7cae8e3 HEAD`: clean. The diff touches only the two permanent docs' evidence sentences and the item STATE.

## Notes

- The exact `npm pack` notice/file reconciliation remains an independent P-02 gate; this review does not satisfy it.
- Minor: the notices file says "P-02 checkpoint" without a link; the release record links it. Not a defect.
