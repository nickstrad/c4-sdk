# P-06 checkpoint

## Published; productionization track closed — 2026-10-15

Per Twin's handoff in `/root/c4-lead-published.md` (2026-10-15, approximately 07:40 CDT), Nick published the retained `c4-sdk@0.1.0` candidate from vm-1 after the 2FA web-auth flow. Twin verified the registry packument: `latest = 0.1.0`, 15 files, and `dist.shasum = c92d3d195384380d67b95604df3c4750617ad3ba`, matching the verified tarball (SHA-256 `6b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084`). This coordinator records Twin's verification; it did not republish or perform a new registry verification.

The registry also contains `0.0.0-stage`, described as "Temporary package placeholder for staged publishing", under maintainer `nickstrad`. Twin reported that early `npm view` reads briefly exposed only this stub during replication; the confirmed `latest` tag targets `0.1.0`, so the stub does not affect default installs.

P-01 through P-06 and the productionization track are complete and closed. Twin has triggered the npm module swap on the ts-db side; that work is separately owned. The publication-pending instructions below are historical and superseded. Existing browser limitations and Nick's mobile component-docs exception remain documented in the release report.


## Coordinator completion — 2026-10-15

Landed9743c93 after bounded correctiond7ee5ef and fresh Sol PASS290f51e/checkpoint3d4b229, superseding original review FAIL2938f95. Integration206unit/34property/5API/108release/typecheck/lint PASS. See [final review](../P-06-browser-fix/review.md) and [release report](../../../docs/release/0.1.0.md). All six areas ready; mobile component-docs remains explicitly nonblocking per Nick, historical focus uncertainty disclosed. Builder/correction/review worktrees cleaned; exact artifact and evidence retained. No publication/tag/registrywrite. Separate explicit publish instruction remains required.


Status: builder complete 2026-10-15; awaiting fresh independent cross-family review. Nothing published, tagged, pushed or merged.

- Branch `item/p-06-final-candidate`, worktree `/tmp/c4-sdk-p-06`, base `316c4b6`.
- Release-input commit (built and verified): `fb74a91c539614542769e97e3ebbfe0677dcc356`. Report commit `74e9639`. Knowledge/checkpoint commit follows (see `git log`); neither built the tarball.
- Tarball `c4-sdk-0.1.0.tgz` SHA-256 `6b22bbe7cff52dafb358261072b9237daa8de38dbf0e4e8674ece2142fc05084`, 15 files, retained with sidecars, logs and screenshots at `/tmp/c4-sdk-release-0.1.0/` (exact copied bytes).
- Clean-clone `make release-check` exit 0: 206 unit, 34 property, 5 API, 108 release, package matrix, 10 package-browser, 6 README-browser. Source build/build:demo pass; source Playwright 65 passed/1 intended skip serially; intermittent timeouts under parallel load also seen on baseline `316c4b6` (see `docs/release/0.1.0.md`).
- Toolchain: rolldown 1.2.14, rolldown-plugin-dts 0.28.8, TS 6.0.3, Vite 8.3.4. Inventory identical, notices unchanged.
- Commands: `npm ci`; `make release-check` in a fresh `git clone` at `fb74a91`; `npx playwright test` (default and `--workers=1`).
- Coordinator edits to `agent-work/COORDINATION.md` and `P-06/brief.md` (mobile-docs ruling) were present uncommitted in this worktree and were left untouched, so the worktree was NOT cleaned.
- Next: fresh Sol review of the final SHA; coordinator lands. Publication needs separate explicit human instruction. Possible follow-up item: harden load-sensitive Playwright specs.
