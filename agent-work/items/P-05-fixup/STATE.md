# P-05 fixup checkpoint

Status: repair complete, awaiting fresh Sol re-review. Builder: fresh Sonnet 5.5. Base 20cbece, fix commit 3e8af96. Never published; no tag/push/merge/auth.

## Repairs (all review findings)

- R1 symlink cleanup: `physicalContainmentErrors` (process.mjs) walks every component of the artifacts root/destination with lstat, rejects symlinks and non-directories, and compares realpath. `releasePack` validates the root (lexical `checkArtifactsRoot` + physical) before build/status/write, re-checks the destination immediately before `removeTree` and after `mkdirp`, and requires the marker to be a regular file (lstat), not a symlink.
- R2 dirty provenance: evidence `dirty` = ALLOW_DIRTY || dirtyBefore || dirtyAfter || HEAD moved; also records dirtyBefore, dirtyAfter, sourceShaAfter, allowDirty. Every override run is unpublishable; publish rejects it (mocked-publish tests).
- Note: README evidence must be a nonempty string / nonempty array or object of valid locations (rejects "", false, 0, [], {}, nested empties).
- Note: relative declaration imports resolve only to a packed declaration counterpart (.d.mts/.d.cts), never a runtime .mjs/.cjs alone.
- Note: digest property test now mutates size to size+1.
- Runbook updated for both behaviours.

## Tests

- Release tests: 89/89 (was 79): new tests/release/realfs.test.mjs uses a real filesystem with symlinked artifacts root (outside target), symlinked ancestor to protected `src`, symlinked candidate dir, symlinked marker, plus the positive replace case. Mutation check: stubbing physicalContainmentErrors to `[]` fails 4 of those tests.
- make sdk-check passed (typecheck, lint, 204 unit, 34 property, 5 API, release 89).
- Real make release-pack at 3e8af96: version 0.1.0-beta.1, sha256 d7980de2c97d008e41c5ce6592eadfffea7eed36d3d8c4f6c214d0595edd33f8, evidence dirty:false. Declaration guard accepted the real tarball.
- Real make release-verify: consumer matrix passed, packaged browsers 10/10 on 4185/4186, then failed closed at missing tests/readme/verify.mjs (passed:false, readme failed). Expected P-04 integration gate; combined success not claimed. Log: /tmp/p05-fixup-verify.log.

## Knowledge / scripts assessment

Durable lessons (physical vs lexical containment; record post-build provenance and treat overrides as unpublishable) are recorded here and in the original review; coordinator may index them into docs/knowledge. No reusable script: the real-filesystem harness lives in tests/release/realfs.test.mjs. Nothing added to work-scripts or docs/knowledge.
