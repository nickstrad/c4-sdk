# Release runbook

Owner: P-05 (repeatable release). Final `0.1.0` candidate, toolchain bump and six-area report belong to P-06. Nothing here publishes by itself; registry writes happen only through `make release-publish` with explicit operator input.

## Targets

All targets are thin wrappers over `node work-scripts/node/release/cli.mjs <command>` and are the same commands CI runs (`.github/workflows/release-check.yml`).

| Target | Effect |
| --- | --- |
| `make` / `make help` | Prints help. Builds and publishes nothing. |
| `make sdk-check` | `npm run sdk:check` (typecheck, lint, unit, property, API snapshot) then the release unit/property tests (`tests/release`). |
| `make sdk-build` | Runs `node sdk-build.mjs`; cleans only `dist-sdk`. |
| `make release-pack` | Requires a clean tree (or `ALLOW_DIRTY=1`, recorded as `dirty: true` and unpublishable). Builds once, `npm pack --json --ignore-scripts` once into `artifacts/release/<name>-<version>-<sha12>/`, inspects the exact tarball, and writes `<tarball>.evidence.json`. |
| `make release-verify TARBALL=<abs path>` | Never builds or packs. Re-hashes and re-inspects the tarball against its evidence, then runs `tests/package/verify.mjs` (ESM/CJS/NodeNext/bundler consumers), the packaged browser tests on ports 4185/4186, and `tests/readme/verify.mjs` with `README_REPORT` (ports 4187/4188). Writes `<tarball>.verify.json`. |
| `make release-check` | `sdk-check` then `release-pack` then `release-verify` on the freshly packed artifact. CI gate. No network publication, no tags. |
| `make release-publish TARBALL=… TAG=… REGISTRY=… CONFIRM=…` | Operator action, see below. Never builds. `DRY_RUN=1` passes `--dry-run` to npm. |

## Files beside a tarball

`<name>-<version>.tgz`, `.evidence.json` (sha256/sha1/integrity, size, version, source SHA, dirty flag, per-file inventory with hashes, inventory digest, Node/npm versions), `.verify.json` (stage results, bound to the tarball hash and the evidence file's hash), `.readme.json` (P-04 report). Artifacts live under `artifacts/release/` (add `/artifacts/` to `.gitignore`); a directory is only ever replaced when it carries the driver's `.c4-release-artifacts` marker and sits strictly inside that root.

## What verification rejects (fail closed)

- Missing evidence, tarball hash/size/version/name mismatch, per-file inventory mismatch, evidence from a dirty tree (for publish).
- Any packed file outside the allowlist (`package.json`, `LICENSE`, `README.md`, `THIRD_PARTY_NOTICES.md`, `dist-sdk/{index,core}.{cjs,mjs,d.cts,d.mts}`, `styles.css`, `layout-worker.js`, hashed `shared-*.cjs` chunks), source maps, links, executables, unsafe paths.
- Export map keys other than `.`, `./core`, `./styles.css`, `./layout-worker.js`; wildcard exports; targets outside `dist-sdk` or absent from the tarball; consumer-visible install/publish lifecycle scripts; non-registry dependency specifiers.
- Declarations with unresolved relative imports or imports of packages the manifest does not declare.
- A missing or failing `tests/readme/verify.mjs`, or a README/package report whose hash, version or source SHA differs from the evidence.
- Lifecycle recursion: the driver sets `C4_RELEASE_ACTIVE` for its children and refuses to start when it is already set. npm runs with `--ignore-scripts`, and non-publication children never receive `NODE_AUTH_TOKEN`/`NPM_TOKEN`.

## Operator gate for publication

Publication is a separate, human-approved action; the driver cannot be satisfied by CI alone.

1. Preconditions: `make release-check` passed on the final candidate commit (P-06), review/landing complete, the exact tarball and its three sidecar files are unchanged.
2. Authenticate with npm yourself (`npm login`; 2FA/OTP is entered at npm's own prompt). Credentials never go into the repo, Makefile, scripts or command-line arguments; do not pass an OTP on the command line.
3. Run, with every value explicit:

   ```
   make release-publish TARBALL=/abs/path/c4-sdk-0.1.0.tgz TAG=<dist-tag> \
     REGISTRY=https://registry.npmjs.org/ CONFIRM="publish c4-sdk@0.1.0 <first 12 hex of sha256>"
   ```

   `TAG` has no default, a prerelease version can never use `latest`, and `REGISTRY` must be https (loopback http only for a local mock registry). The driver refuses if the version already exists on the registry or the lookup cannot confirm it is absent.
4. A failed publication does not justify rebuilding: the same evidence cannot describe a different tarball. Fix the cause, then repeat pack and verify to get a new artifact and new evidence.
5. Git tags, GitHub releases and pushes are separate, manual steps and are never performed by the driver.

## Tested tools

Recorded in each evidence file (`tools`) and by the checkpoint [`agent-work/items/P-05/STATE.md`](../../agent-work/items/P-05/STATE.md): Node `22.23.2` (must equal `engines.node`), npm `10.9.8`, GNU tar and GNU Make 4.3 on Linux, rolldown `1.2.13` / rolldown-plugin-dts `0.28.6` for the preliminary beta artifact (final candidate is rebuilt by P-06 with `1.2.14` / `0.28.8`).
