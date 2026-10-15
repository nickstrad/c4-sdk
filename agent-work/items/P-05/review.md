# P-05 independent review — FAIL

- Reviewed exact builder commit: **bc3322946372d3346ace0483ac6ad50b5570d7e6**.
- Base: **a1929e4**; branch/worktree: review/p-05-sol, /tmp/c4-sdk-p-05-review.
- Reviewer: fresh independent Codex Sol, cross-family review of Claude Sonnet implementation; no delegation.
- Scope: full [brief](brief.md), [claims](claims.md), productionization plan section 4, Makefile, driver, tests, CI and runbook. Product files remained read-only.
- Review date: 2026-10-15. No real publication, tag, push, merge, authentication change or paid API use. Publication paths tested through injected IO only. Event skip applied.

## Blocking findings

### R1 — High: cleanup containment follows symlink ancestors outside the repository

Locations: work-scripts/node/release/cli.mjs:97–104; policy.mjs:269–285; process.mjs removeTree.

The cleanup guard checks lexical paths with resolve/relative; neither the artifacts root nor its ancestors are checked for symlinks. If repo/artifacts points outside the repository, a second pack follows that link, accepts the existing marker, and recursively deletes the external candidate directory. The marker does not establish containment. The same issue can redirect cleanup into source directories. This violates the explicit destructive-cleanup boundary.

Independent scratch reproduction used the actual releasePack and createIo filesystem adapter, replacing only gitState and process execution. repo/artifacts was a symlink to a sibling outside directory containing c4-sdk-0.1.0-aaaaaaaaaaaa/.c4-release-artifacts and precious. releasePack deleted precious before the mocked npm pack failed. Output:

    npm pack failed (exit 1): mock pack stop
    outsideCandidateDeletedByReleasePack: true

Exact local reproduction: node /tmp/p05-cleanup-driver.mjs. No repository or real external data was deleted; all data was created in one disposable /tmp fixture.

Fix: validate artifactsRoot before any writes/status exclusions, reject symlink ancestors or establish physical containment with filesystem checks, and recheck the exact cleanup target/marker immediately before deletion. Add a real-filesystem regression with an ancestor symlink, including an outside target and a protected source target. The current property tests exercise lexical containment only.

### R2 — High: ALLOW_DIRTY can create publishable clean evidence for a dirty build

Locations: work-scripts/node/release/cli.mjs:88–95 and 129–134.

ALLOW_DIRTY=1 disables the post-build dirty/SHA-change rejection, but the evidence records only before.dirty and before.sha. Starting clean, a build that changes source yields dirty:false tied to the old source SHA. releaseVerify does not check the working tree, and releasePublish trusts this false clean flag. A package consumer report's HEAD remains the same SHA when files are modified, so that report does not close the gap.

Independent injected-IO reproduction used the actual pack, verify and publish orchestrators. The mocked build changed io.state.dirty from false to true. All artifact/report identities matched, and the publication process was invoked (mocked, no network):

    {"sourceDirtyAfterBuild":true,"evidenceDirty":false,"sourceSha":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}
    mockPublishInvokedAfterDirtyBuild: true

Exact local reproduction: node /tmp/p05-provenance.mjs, using tests/release/fake-io.mjs. This is absent from the supplied tests; their build-mutation test only covers the default mode.

Fix: make every rehearsal with an override unpublishable, or conservatively include both pre/post dirty state and source-SHA changes in evidence and reject unstable provenance. Test the clean-before/dirty-after and changed-HEAD cases under ALLOW_DIRTY=1 through the mocked publish boundary. Align the runbook promise that this is a non-releasable rehearsal.

## Notes (not independent blockers)

- README_REPORT guard (policy.mjs:207–208) accepts evidence:"", evidence:false, and evidence:0 as evidence locations. Independent checkReadmeReport with passed:true and matching hash/version returned [] for an empty string. Require a nonempty supported location structure; add malformed-value tests. P-04's absence itself is expected, not a defect.
- Declaration resolution (policy.mjs:138–139) treats a runtime JS target as sufficient even when the corresponding declaration file is absent. For example export * from './missing.mjs' with paths containing only dist-sdk/missing.mjs returns no errors. The later TypeScript consumer matrix remains the substantive safeguard; strengthen the policy guard if it is intended to establish declaration resolution on its own.
- The inventory digest property test mutates size to a function (size: f => f), rather than a different valid integer. Replace this with a valid numeric mutation so it proves the advertised size invariant.
- CI uses the same make release-check pipeline, read-only repository permissions and artifact upload; publication remains a separate explicit action. The default make prints help. Process arguments are passed without a shell and Make operator inputs are exported through the environment. Existing injected publication tests meaningfully cover hash/report/version/tag/registry/confirmation failures and prevent actual publication.
- The script index reservation and artifacts ignore rule are coordinator-owned integration follow-ups already identified by the builder. Final 0.1.0 and toolchain changes remain serialized P-06 work.

## Independent validation

- Locked dependencies installed with npm ci --prefer-offline --no-audit --no-fund. Node 22.23.2, npm 10.9.8. Sandboxed install was stopped after stalling; elevated install succeeded.
- make sdk-check: typecheck passed; lint passed with the inherited button.tsx fast-refresh warning; unit/hooks 204/204, properties 34/34, API 5/5 passed. Release tests initially returned 78/79 because sandboxed node -e execution returned empty output. Re-running node node_modules/vitest/vitest.mjs run --config tests/release/vitest.config.ts with subprocess permissions passed **79/79**. No source changes between runs.
- Default make printed help only; git diff --check a1929e4 bc33229 passed.
- Independent make release-pack (elevated npm cache access after sandbox pack exit 226): one SDK build, one npm pack; **15 files**, version **0.1.0-beta.1**, source **bc3322946372d3346ace0483ac6ad50b5570d7e6**, size **859203** bytes, SHA-256 **d7980de2c97d008e41c5ce6592eadfffea7eed36d3d8c4f6c214d0595edd33f8**. inspectCandidate returned no errors. Evidence recorded dirty:false.
- Appending six bytes to a scratch copy produced hash 77076506192c0b43e8f6aabc3e2f8027f55f7b477ab62091b3ffe1038be58f1f and size 859209; checkEvidence rejected both mismatches. A real release-verify on this altered copy also failed before consumer execution (GNU tar rejected trailing garbage); /tmp/p05-review-tamper.log records that separate archive guard.
- Exact-tarball release-verify: clean external consumer ESM/CJS/import identity, NodeNext/bundler TypeScript and both Vite build modes passed. **Packaged browsers 10/10 passed** (desktop/mobile ESM and CJS, worker lifecycle, static subpath host). The command then failed exactly at missing tests/readme/verify.mjs and wrote passed:false with inventory/package/browser passed and readme failed. This is the expected P-04 integration gate; combined release-check success is not claimed.
- Logs retained outside the cleaned worktree: /tmp/p05-review-install-escalated.log, /tmp/p05-review-sdk-check.log, /tmp/p05-review-release-tests.log, /tmp/p05-review-pack.log, /tmp/p05-review-verify.log. Adversarial commands: node /tmp/p05-cleanup-driver.mjs; node /tmp/p05-provenance.mjs; node /tmp/p05-adversarial.mjs (restore exact reviewed checkout at the original path to rerun after cleanup).

## Repair / handoff

Return R1 and R2 to a fresh builder in a fresh worktree, then obtain fresh cross-family re-review on the exact repaired commit. This FAIL grants no landing authorization. Integrate P-04 before the eventual combined release-check; do not start its ports 4187/4188 during this concurrent review.

## Knowledge / scripts assessment

The durable lessons are physical versus lexical cleanup containment and recording post-build provenance, documented with evidence above. Coordinator may index these after repair; this reviewer owns no knowledge/index paths. No reusable helper is needed: the adversarial scripts are one-off review reproductions kept in /tmp, not added to work-scripts. Only this review and its checkpoint are committed.
