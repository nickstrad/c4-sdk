# P-05 fixup independent re-review — FAIL

Reviewed exact **5203fb3e2978a3173dfd7d279f903dfce2219752**, including repair **3e8af966b207f3afb8e9ed5fb12cf255483998bd**, against original FAIL **20cbece**. Fresh independent Codex Sol review of Sonnet repair, 2026-10-15; branch `review/p-05-fixup-sol`, worktree `/tmp/c4-sdk-p-05-fixup-review`. Read root/item instructions, state, claims, coordination, knowledge index, event index, original review and P-04/P-05 shared contract. Owns only this review and `review-STATE.md`. No product edits, delegation, actual publication, tag, push, merge or auth changes. Event skip applies. Final version/toolchain remains P-06.

## Blocking findings

### F1 — High: stricter README evidence guard rejects the real P-04 report

`work-scripts/node/release/policy.mjs:206–219` recursively requires **every** leaf of `evidence` to be a nonempty string. The supplied `/tmp/p04-review-evidence/report.json` is a successful P-04 report with matching hash/version, a consumer path, eight screenshot paths, and execution results including `evidence.output.esm[0].nodes: 4`. Numeric execution results make `validLocations` reject the entire evidence object. This prevents successful combined release verification after P-04 integration.

This is a concrete interface defect, not a complaint about P-04 being absent from this review checkout. Both briefs require passed:true, matching sha256/version and evidence locations; neither forbids additional structured execution evidence. Main's P-04 verifier (`/root/Software/c4-sdk/tests/readme/verify.mjs:106–119`, introduced by `e4d9500cdde4020c3f0863f6ccaaa9103a85a5d9`) explicitly emits `evidence: { consumer, output: { esm, cjs }, screenshots }`.

Independent direct reproduction from the reviewed checkout:

```sh
node --input-type=module <<'JS'
import { readFileSync } from 'node:fs';
import { checkReadmeReport } from './work-scripts/node/release/policy.mjs';
const r = JSON.parse(readFileSync('/tmp/p04-review-evidence/report.json', 'utf8'));
console.log(checkReadmeReport(r, { sha256: r.sha256, version: r.version }));
JS
```

Result: `README report names no valid evidence locations (expected nonempty strings, arrays or objects of them)`. Actual report hash is `bfdfaf8c3404e139360d08df07972f33f9e42361d6bc04c034071f98ed704263`, version `0.1.0-beta.1`, passed:true. Deleting only `evidence.output` produces `[]`; neither identity nor evidence paths change. Recorded in `/tmp/p05-rereview-p04.json`.

Also exercised the actual `releaseVerify` orchestrator with injected process IO and this real evidence shape (only identity adapted to the fake tarball). It wrote passed:false, inventory/package/browser passed, readme failed with the same error; mocked publication then refused the failed verification. Repro: `node /tmp/p05-rereview-p04-orchestrator.mjs`; output `/tmp/p05-rereview-p04-orchestrator.log`. No real browser or registry action in this reproduction.

Arbitration should resolve validation of supported location fields while preserving rejection of empty/malformed evidence. The current tests only cover invented location-only evidence and miss the actual producer shape. Adding `evidenceLocations` alone would also be ineffective when `evidence` remains present because of the nullish fallback.

### F2 — Medium: post-build symlink is checked after filesystem mutation

`work-scripts/node/release/cli.mjs:101–112` rechecks physical ancestry before deleting an existing destination, but for a missing destination it calls `mkdirp(destination)` **before** the next physical check. A build can introduce a symlink after the initial root validation. With an initially missing artifacts root, a mocked successful build that creates `repo/artifacts -> outside` leaves git state clean (artifacts are excluded); releasePack creates `outside/c4-sdk-0.1.0-aaaaaaaaaaaa`, then reports the symlink error.

Independent real-filesystem repro: `node /tmp/p05-rereview-build-symlink.mjs`, using actual `releasePack` and `createIo`; only git state/process execution replaced. Output:

```text
unsafe artifacts destination: .../repo/artifacts is a symbolic link; refusing to follow it
outsideCandidateCreatedBeforeRejection: true
```

All data was created in one disposable /tmp fixture and removed afterward. No deletion or marker/tarball write occurred. This is a deterministic build-boundary change, not a concurrent race. The fixup brief requires rejecting symlinked ancestors before mutation; this branch of the repair does not meet that requirement. Revalidate the destination before mkdirp as well as afterward. Do not weaken the existing deletion guard.

## Original findings disposition

- **R1 original destructive cleanup: repaired for the reproduced cases.** Independently reran the original outside-symlink driver against the repair: root rejected before building, `outsideCandidateDeletedByReleasePack:false`. All five real-filesystem tests passed: outside root, protected source ancestor, candidate and marker links, positive replacement and path helper behavior. F2 above is the remaining pre-mutation gap.
- **R2 dirty provenance: repaired.** Independently reran the original clean-before/dirty-after ALLOW_DIRTY pack → mocked verify → mocked publish path. Evidence now records dirty:true; publication rejects dirty source and no publish call occurs. Suite also covers moved HEAD, clean override, and normal clean evidence with one injected publish call.
- **README evidence note: malformed-value acceptance repaired, but F1 introduces an integration blocker.** Empty strings, booleans, numbers, nested empties rejected by tests; real producer report rejected too.
- **Declaration note: repaired.** Runtime-only .mjs/.cjs no longer resolves as a declaration. Declaration counterpart regression passes; independently inspected the real committed tarball and its declarations with no policy errors.
- **Digest property note: repaired.** Size mutation is now `files[index].size + 1`, a different valid integer. Property suite passes.

## Additional scope observation

Exact final checkpoint `5203fb3`, beyond repair `3e8af96`, commits generated `dist-sdk/**` plus `artifacts/release/**` (tarball/evidence/failed verification): over 138,000 added lines. These paths are outside fixup ownership and conflict with the instruction to keep generated output out of commits. Coordinator/arbitrator should disposition this scope deviation before landing. `git diff --check 20cbece 3e8af96` is clean; extending to `5203fb3` reports four generated index.cjs trailing-whitespace sites. No generated files were removed or changed by this reviewer.

## Independent validation and limits

- `npm ci --prefer-offline --no-audit --no-fund`: succeeded, 543 packages; `/tmp/p05-rereview-install.log`. Node 22.23.2 / npm 10.9.8.
- `make sdk-check`: typecheck and lint passed (inherited button.tsx fast-refresh warning); unit/hooks **204/204**, properties **34/34**, API **5/5**. Release phase **88/89** under sandbox, failing the same node -e empty-output adapter test documented in original review. Log `/tmp/p05-rereview-sdk-check.log`.
- Reran unchanged release suite with subprocess permissions: `node node_modules/vitest/vitest.mjs run --config tests/release/vitest.config.ts`, **89/89 passed**, including real-filesystem and mocked-publication cases. Log `/tmp/p05-rereview-release-tests-elevated.log`. The sandboxed make command itself exited 2; do not represent that command as clean.
- Independently inspected and hashed the committed real tarball at `artifacts/release/c4-sdk-0.1.0-beta.1-3e8af966b207/c4-sdk-0.1.0-beta.1.tgz`: **15 files**, **859203 bytes**, SHA256 **d7980de2c97d008e41c5ce6592eadfffea7eed36d3d8c4f6c214d0595edd33f8**. Actual inventory, declarations and requireClean evidence comparison all returned no errors. This verifies existing bytes, not a fresh pack at target HEAD; evidence correctly identifies its earlier build source `3e8af96`.
- No fresh build/pack or full browser/consumer matrix rerun: the repair changes guards, covered above; F1 is reproducible with the supplied successful producer report. Builder's prior package/browser evidence is not relabeled independent. No combined release-check success claimed. Ports 4185/4186 were unused and may be released.

## Handoff and knowledge assessment

This is the **second FAIL**. Send exact target/diff, original verdict and this verdict to a **fresh Muse Wonder Full arbitrator** under the global protocol. This reviewer does not delegate, repair, land or authorize landing. Both repro scripts use absolute imports into this assigned checkout; after cleanup, restore that exact target at the same path to rerun them, or adjust imports. Logs and one-off scripts remain in /tmp.

Durable lessons: validate location-bearing fields separately from mixed execution evidence; revalidate physical ancestry after a build and before the first filesystem mutation. Existing physical containment/provenance lessons remain useful. Coordinator may index these with this review as evidence; reviewer owns no knowledge/index paths. No reusable script warranted: scratch reproductions are one-off, and existing regression harness is the appropriate future home. Environment search388 feedback was attempted but failed because kb could not open its SQLite index; no environment store writes made.
