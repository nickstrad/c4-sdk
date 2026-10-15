# P-05 fixup arbitration — second FAIL upheld; one bounded correction authorized

- Arbitrator: fresh Muse Wonder Full (Standard mode), third family under the global
  three-CLI protocol, 2026-10-15. Branch `arbitration/p-05-muse`,
  worktree `/tmp/c4-sdk-p-05-arbitration`. No delegation, no product edits.
- Arbitrated exact target: **97648b6** (guard source identical to second-reviewed
  **5203fb3**; repair **3e8af96**). Original builder **bc33229**, original FAIL
  **20cbece**, second FAIL **f258963** (`agent-work/items/P-05-fixup/review.md` at
  that commit). P-04 PASS **f9cd615** is on main.
- This verdict is final subject to human gates. It does **not** authorize landing,
  merge, push, tag, or publication. `npm publish` remains a human boundary.

## Verdict

**The second FAIL is upheld. Do not land 97648b6 / 5203fb3 / 3e8af96 as-is.**

Both second-review blocking findings (F1, F2) are sustained on independent
reproduction against the arbitrated tree. Neither is a nit and neither is
waivable: F1 breaks the required P-04/P-05 combined gate, and F2 breaks the
fixup brief's explicit "reject symlinked ancestors before mutation" invariant.
The generated-file scope deviation noted by the second reviewer is corrected
(see below) and is not itself a reason to sustain the FAIL.

The remedy is exactly **one fresh, bounded correction** (scope and acceptance
below) followed by **one fresh independent cross-family re-review** of the exact
corrected commit. Landing requires that re-review to PASS plus the coordinator's
combined P-04-integrated gate. A further FAIL stops the loop and goes to a human.

## Scope-deviation disposition (corrected — not blocking)

Verified directly: `git diff 5203fb3 97648b6` deletes only `dist-sdk/**` and
`artifacts/release/**` (15 files, 138,390 deletions) and touches no guard source;
`git diff 5203fb3 97648b6 -- work-scripts/ tests/release/ docs/release/` is empty,
and `git diff 3e8af96 97648b6` is only the fixup `STATE.md`. `git diff --check
20cbece 97648b6` is clean. The accidentally committed generated output is removed,
so the second reviewer's source findings apply verbatim to 97648b6. Any corrected
lineage must likewise contain no `dist-sdk/**` or `artifacts/**` commits.

## F1 — SUSTAINED (High): real P-04 mixed evidence is rejected

`validLocations` in `work-scripts/node/release/policy.mjs:206-211` requires every
leaf of `evidence` to be a nonempty string, and `checkReadmeReport` (line 219)
applies it to `report.evidence ?? report.evidenceLocations`.

Independent reproduction on this tree with the real passed P-04 report
(`/tmp/p04-review-evidence/report.json`, sha256 `bfdfaf8c…04263`, version
`0.1.0-beta.1`, `passed:true`):

```
real:            ["README report names no valid evidence locations …"]
without output:  []
```

Deleting only `evidence.output` flips the result to `[]`; identity and every
location path are unchanged. The rejected leaves are execution results such as
`evidence.output.esm[0].nodes: 4`.

Authority: main's passed P-04 producer emits exactly this shape —
`tests/readme/verify.mjs` writes `evidence: { consumer, output: { esm, cjs },
screenshots }`. The shared P-04/P-05 briefs require `passed:true`, matching
sha256/version, and evidence locations; neither forbids structured execution
evidence. The original review note required rejecting empty/malformed locations
(`""`, `false`, `0`); the repair overshot that note into rejecting the real
producer. **P-05 must adapt to the landed P-04 shape; P-04 must not be changed
to stringify or drop its execution evidence.** The failure direction is
fail-closed (no unsafe publication follows), which limits harm but does not make
a permanently failing combined gate acceptable.

## F2 — SUSTAINED (Medium): post-build symlink is checked after `mkdirp` mutation

In `releasePack` (`work-scripts/node/release/cli.mjs:101-113`), an existing
destination is physically rechecked before `removeTree`, but a missing
destination goes straight to `io.mkdirp(destination)` (line 111) and is only
physically rechecked afterward (line 112).

Independent real-filesystem reproduction (`/tmp/p05-arb-f2.mjs`, actual
`releasePack`/`createIo`, only git state and the build step replaced; the mocked
build creates `repo/artifacts -> outside` with an initially missing destination):

```
error: unsafe artifacts destination: …/repo/artifacts is a symbolic link; refusing to follow it
outsideCandidateCreatedBeforeRejection: true
```

Impact calibration: only an empty outside candidate directory is created — no
deletion, marker, tarball, or evidence write occurs, because the post-`mkdirp`
check still fires before `writeAtomic`. That bounds the harm to Medium, but the
fixup brief requires rejecting symlinked ancestors **before mutation**, and this
branch observably mutates first. It is a deterministic build-boundary defect, not
a concurrent-race claim; no race-proofing beyond this ordering is required or may
be claimed.

## Original findings disposition (20cbece)

- **R1 destructive cleanup through symlinked ancestors: repaired** for every
  reproduced deletion case (outside root, protected `src` ancestor, symlinked
  candidate, symlinked marker, positive replacement), via `physicalContainmentErrors`
  in `process.mjs:24-42` and the pre-deletion recheck. F2 is the sole remaining
  pre-mutation gap; R1 is otherwise closed and must not regress.
- **R2 `ALLOW_DIRTY` clean provenance: repaired.** `cli.mjs:100` sets
  `dirty = allowDirty || before.dirty || after.dirty || after.sha !== before.sha`
  and records `dirtyBefore`/`dirtyAfter`/`sourceShaAfter`/`allowDirty`; every
  override run is unpublishable. Closed; must not regress.
- **README malformed-evidence note: repaired in intent, defective in extent** —
  see F1. Empty/scalar/nested-empty rejection must be preserved by the correction.
- **Declaration note: repaired.** `policy.mjs:132-144` resolves relative imports
  only to packed `.d.mts`/`.d.cts` counterparts, never a runtime `.mjs`/`.cjs`
  alone. Closed.
- **Digest property note: repaired.** `tests/release/policy.test.mjs:77` mutates
  `size` to `files[index].size + 1`. Closed.

## Exact bounded correction authorized

One **fresh** builder agent (not the P-05 builder, fixup builder, either reviewer,
or this arbitrator), in its **own new worktree/branch** from the corrected lineage
(97648b6 content, no generated files). Scope is closed:

- May edit: `work-scripts/node/release/policy.mjs` (README evidence validation
  only), `work-scripts/node/release/cli.mjs` (`releasePack` check ordering only),
  `tests/release/**`, `docs/release/runbook.md` only if wording must match, and its
  own fixup checkpoint/claims records.
- Must not edit: P-04 files (`tests/readme/**`, README/examples), product source,
  manifest/lock, Makefile/CI, `process.mjs` containment semantics, root
  STATE/coordination/index. Must not weaken any other guard, and must not publish,
  tag, push, merge, or change auth.

### F1 correction contract (testable)

Validate **location-bearing** evidence separately from execution evidence, keyed
to the frozen producer shape `evidence: { consumer, output, screenshots }`:

1. String evidence: must be a nonempty (non-whitespace) string. Array evidence:
   nonempty, every element a valid location under these rules.
2. Object evidence: every leaf **outside** the `output` subtree must be a nonempty
   string, the object must be nonempty, and at least one such location string must
   exist. The `output` subtree (ESM/CJS execution results) is ignored for location
   validation and can never by itself satisfy the requirement. Designated location
   fields, when present, must be well-formed: `consumer` a nonempty string,
   `screenshots` a nonempty array of nonempty strings.
3. `evidenceLocations` is evaluated **in addition to**, not only as a nullish
   fallback for, `evidence`: acceptance requires at least one valid location from
   the union of present fields, and no present designated location field may be
   malformed.

Required regression coverage (committed under `tests/release/**`):

- Accept: a fixture with the **real producer shape** (consumer path, screenshots
  array, `output.esm/cjs` entries containing string fields **and** `nodes: 4`);
  the previously accepted `"/tmp/x"`, `["/tmp/a","/tmp/b"]`, `{a:{b:["/tmp/c"]}}`,
  `{browser:"/tmp/x"}`; and `evidenceLocations` both alone and alongside an
  `evidence.output`-bearing object. The real-shape fixture must also pass through
  the `releaseVerify` orchestrator with injected IO (readme stage passes).
- Reject (each must still yield the evidence-locations error): `""`, `"  "`,
  `false`, `0`, `true`, `7`, `null`, `[]`, `[""]`, `[{}]`, `{a:""}`, `{a:{b:[]}}`,
  `{a:0}`, `{}`, `{consumer:""}`, `{screenshots:[]}`, `{screenshots:[""]}`,
  `{output:[{nodes:4}]}` alone, `{consumer:"/tmp/x", screenshots:[]}`, and a
  report with neither `evidence` nor `evidenceLocations`.
- Identity behaviour is unchanged: `passed !== true`, sha256 mismatch, and version
  mismatch still reject.

### F2 correction contract (testable)

In `releasePack`, after the build and destination computation, run
`physicalContainmentErrors(repoRoot, destination)` **before the first filesystem
mutation for that destination in both branches** — before `mkdirp` when the
destination is missing, and (as today) before `removeTree` when it exists. Keep
the post-`mkdirp` recheck before the marker write. Do not weaken the existing
deletion guard, marker regular-file check, or lexical `checkCleanTarget`.

Required regression coverage (real filesystem, in `tests/release/realfs.test.mjs`
style): a mocked build that introduces a symlinked artifacts ancestor while the
destination is initially missing must fail with the symlink error **and** the
outside candidate directory must not exist afterward (no directory, no marker).
All five existing real-filesystem tests must still pass, and removing the new
pre-`mkdirp` check must make the new test fail (state the mutation check in the
builder checkpoint, as the fixup builder did for `physicalContainmentErrors`).

### Acceptance required before landing

1. Full release suite passes on the exact corrected commit (89 existing tests plus
   the new F1/F2 regressions), run with subprocess permissions; any sandbox-only
   failure must be reported as such, never relabelled clean. `make sdk-check`
   passes (typecheck, lint with only the inherited warning, 204 unit, 34 property,
   5 API) or any deviation is named exactly.
2. `git diff --check` clean; corrected lineage contains no `dist-sdk/**` or
   `artifacts/**`; diff confined to the authorized scope above.
3. **Fresh independent re-review** by a new agent from a different company than
   the correction builder, on the exact corrected commit, reproducing F1 (real
   producer shape accepted; reject list still rejected) and F2 (no outside
   creation) and confirming R1/R2/declaration/digest have not regressed. Verdict
   must be PASS to land; NITS/FAIL returns to a human, not to another automatic
   repair round.
4. Coordinator combined gate after P-04 integration (P-04 is already on main):
   a real `release-verify`/`release-check` against the exact tarball using the
   actual `tests/readme/verify.mjs` must pass all stages including readme. Until
   that runs on the integrated tree, no combined release-check success may be
   claimed by the correction builder (injected-IO evidence only).
5. Landing, push, and any publication remain separately authorized; stop before
   `npm publish` for the human operator gate. Final 0.1.0/toolchain work remains
   P-06.

## Evidence and limits of this arbitration

Read: root and item instructions/checkpoints/coordination, P-05 and P-05-fixup
briefs/claims/STATE, original review 20cbece, second review at
`f258963:agent-work/items/P-05-fixup/review.md`, guard sources
(`policy.mjs`, `cli.mjs`, `process.mjs`), release tests, the real P-04 report at
`/tmp/p04-review-evidence/report.json`, and main's `tests/readme/verify.mjs`
producer. Independently reproduced F1 (direct `checkReadmeReport` on the real
report, plus the malformed-value matrix) and F2 (real-filesystem
`/tmp/p05-arb-f2.mjs`). The full Vitest release suite was not rerun here (no
`node_modules` in this worktree; no install performed) — suite counts above rely
on the second reviewer's recorded 89/89 run plus source inspection, and the
correction acceptance requires a fresh full run. No browser, pack, registry, or
publication action was performed. Durable lesson: validate location fields
separately from mixed execution evidence, and revalidate physical ancestry after
a build **before** the first mutation; coordinator may index this in
`docs/knowledge/` with this file as evidence. No reusable script is warranted;
reproductions are one-off files under `/tmp`.
