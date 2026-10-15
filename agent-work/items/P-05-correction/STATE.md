# P-05 correction STATE

- Implementation commit: 2dbe6fc (policy.mjs, cli.mjs, tests/release/**). Base 173f12f.
- F1: `scanLocations`/`validEvidence` in policy.mjs; top-level `evidence.output` ignored; `evidence` and `evidenceLocations` unioned; any malformed present field rejects.
- F2: releasePack runs `physicalContainmentErrors` in the missing-destination branch before `mkdirp`; existing-branch guard and post-mkdirp recheck unchanged.
- Tests: release suite 95/95 (89 + 6 new) with subprocess permissions; `make sdk-check` exit 0 (typecheck, lint with only inherited button.tsx warning, 204 unit, 34 property, 5 API, 95 release).
- Mutation: removing the pre-mkdirp check fails the new realfs test (1 failed); removing the output-subtree skip fails 3 F1 tests; both restored.
- Not done: the real combined gate with actual tests/readme/verify.mjs and tarball is coordinator-owned; only injected-IO producer-shape evidence exists here. No publish/tag/push/merge.
- Next: fresh Sol cross-family review of the exact corrected commit; any non-PASS returns to a human.
