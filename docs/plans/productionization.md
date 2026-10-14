# Final phase: productionize c4-sdk

Plan drafted 2026-10-12, source blob `47bfe622ca0ec5500ad36a0897dfc744320427d8`. Status: approved active track, 2026-10-14, after C4-10 completion and Nick's STE acceptance sign-off for C4-08/C4-10. P-01 is authorized to start; later items remain gated by its reviewed contract.

This is that plan's closing phase, not a competing roadmap. Nick's productionization request supersedes
its earlier publishing-parked decision. Deliver MIT licensing, npm release scaffolding, a deliberately
supported public API, CommonJS and ESM distribution, bundled declarations and a complete real-API README.
The approved implementation scope includes these changes through a tested release candidate and working
release commands. Actual registry publication is a later explicit release action requiring Nick present
for npm account login/2FA.

## Entry and completion gates

Begin only after the reviewed C4-10 acceptance report covers all seven diagram types, Cursor showcase,
and required tests; Nick's human STE sign-off closed its remaining acceptance gate on 2026-10-14. Reconcile
this design with the actually landed API and record the source commit. Keep any existing copied-project
consumer behavior working; do not silently migrate ts-db to npm. The root
package is private during C4-01–10; publishing configuration changes belong to this closing phase.

Completion means a fresh checkout can build, pack and validate one candidate without the source checkout
being available to consumers. Its MIT notice, metadata, runtime entry points, declarations, CSS/worker
assets and README are present and mutually consistent. No remaining item from the six requested areas is
merely a TODO. Name ownership and release permissions must be resolved before actual publication.

## 1. MIT and package identity

Add root `LICENSE` with the complete standard MIT text, the actual copyright holder and correct year;
confirm the holder from repository ownership rather than leaving a template placeholder. Set package
`license` to `MIT`. Include LICENSE and README in the tarball and copied-project distribution. Preserve
required notices for bundled dependencies and assets; the project's MIT license does not relicense the
Cursor article or third-party artwork. The showcase keeps its existing source attribution. Acceptance
checks compare the license text to the standard and inspect the packed files.
[MIT reference](https://opensource.org/license/mit).

Candidate package identity is the unscoped `c4-sdk`. Nick's 2026-10-14 approval note relayed that
this exact name was verified available on 2026-10-12. This documentation fixup made no npm registry
query and proves neither present-day availability nor account ownership. P-02 must revalidate current
registry availability before building its package artifact; actual publication waits for Nick's npm
account login/2FA. Keep one root publishable SDK package and separate library output from the Vite app/demo
build. No monorepo migration is required. Choose the initial version and support matrix explicitly at P-01; use a prerelease while API acceptance is incomplete. Pin
release tools in the lockfile, record Node/npm versions, and set `engines` only to versions exercised by
consumer tests. Do not promise every React or TypeScript version.

Metadata includes name, version, description, MIT license, author/contributors, repository, homepage, bugs,
keywords, explicit files allowlist, main/module/types/exports, supported engines and peer dependency ranges.
React and React DOM are external peer dependencies (and dev dependencies for local tests), including JSX
runtime subpaths; never bundle a second React. Classify actual SDK runtime imports as dependencies and app,
font, build/test utilities as dev-only where appropriate. Audit the installed scaffold rather than shipping
all of its app dependencies. Narrow side-effect declarations must retain shipped CSS.
[npm manifest reference](https://docs.npmjs.com/cli/configuring-npm/package-json/).

## 2. Public API contract

P-01 inventories the landed source entry and decides the smallest supported surface before release. Record
symbols, signatures, ownership, error behavior and compatibility in `docs/api/public-api.md`, plus an API
snapshot checked in CI. The following is the target surface, subject to documented reconciliation with code:

| Entry | Public contract | Excluded internals |
| --- | --- | --- |
| `c4-sdk` | `ArchitectureViewer`, provider and supported diagram/navigation/docs containers; all seven named diagram wrappers; reusable `Legend`; their props and slot contracts | React Flow internals, private contexts, app shell, unstable hooks and renderer implementation |
| `c4-sdk/core` | Versioned bundle/diagram/element/document types, runtime decode+semantic-validation facade, structured diagnostics and pure navigation/projection functions actually intended for hosts | Zod/Effect types, DOM/global state, React and host filesystem dependencies |
| `c4-sdk/styles.css` | Explicit scoped stylesheet/theme custom properties | Tailwind build dependency, global reset, demo fonts |
| `c4-sdk/layout-worker.js` | Self-contained browser module-worker asset, used through documented worker factory/URL configuration | Node worker claims, unsupported direct worker message API |

Freeze exact exported names and signatures from landed implementations, not this table's placeholders.
Specify unknown-JSON decoding versus already-validated bundle inputs, diagnostic/result unions, controlled
selection and callbacks, injected route/layout/focus ports, async cancellation/disposal and immutable data.
Use structural types instead of class identity as a compatibility boundary. No host needs `src/`, `dist/`
deep imports or private `@/` aliases. Do not expose everything just because a source barrel currently does.

Importing either JS entry must not access window/document, start a worker, inject CSS or fetch content.
The core entry works in Node without React/browser dependencies in its import graph. UI rendering remains a
browser feature unless SSR behavior is separately demonstrated; import safety alone is not an SSR claim.
Document unsupported features, schema-version policy and package SemVer separately. Changes to public
props, callbacks, diagnostics, exported types, CSS tokens or worker configuration require compatibility
review and changelog entries. Keep experimental helpers unexported rather than promising stable internals.

## 3. ESM, CommonJS and bundled types

Build library output independently of `dist` for the demo, for example `dist-sdk/`. Emit real `.cjs` and
`.mjs` entry files, with named exports equivalent in both modes. Do not advertise `require` by pointing it
to ESM and relying on a new Node interop feature. Node conditional exports select explicit module targets.
[Node package exports](https://nodejs.org/api/packages.html#conditional-exports).

Prefer one canonical CJS implementation for each runtime module with thin ESM named-export wrappers. This
keeps provider/context identity shared when import and require meet in one process. Pure structural values
still need no global registry. Validate browser bundling of that layout; do not promise tree shaking before
measuring it. If the landed build tool cannot produce this correctly, P-02 must document and test an
alternative that preserves identity before passing, not silently publish two incompatible React contexts.
Audit transitive ESM-only dependencies: bundle permitted non-peer code into the CJS artifact or select a
compatible adapter; no reachable `require()` may target ESM-only code on the supported Node matrix.
[Dual-package identity example](https://github.com/nodejs/package-examples/blob/main/guide/07-dual-packages/README.md).

Generate declarations from the public TS source; do not maintain handwritten type copies. Emit matching
ESM `.d.mts` and CJS `.d.cts` entry declarations and ensure their entire relative import graph resolves to
correctly typed module files. A declaration bundler or separate typed facades may be necessary; renaming
one file while leaving broken imports is not sufficient. Public declarations must not reference private
source aliases or unshipped files. Put the `types` condition before runtime `default` within each branch.
[TypeScript dual declarations](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html).

Illustrative manifest subset, **not a manifest to install unchanged**; dependencies, engines and metadata
are completed from the implemented support matrix. Both core and UI get separate declarations:

```json
{
  "name": "c4-sdk",
  "type": "module",
  "license": "MIT",
  "main": "./dist-sdk/index.cjs",
  "module": "./dist-sdk/index.mjs",
  "types": "./dist-sdk/index.d.mts",
  "files": ["dist-sdk", "LICENSE", "README.md", "THIRD_PARTY_NOTICES.md"],
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": {
      "import": {"types": "./dist-sdk/index.d.mts", "default": "./dist-sdk/index.mjs"},
      "require": {"types": "./dist-sdk/index.d.cts", "default": "./dist-sdk/index.cjs"}
    },
    "./core": {
      "import": {"types": "./dist-sdk/core.d.mts", "default": "./dist-sdk/core.mjs"},
      "require": {"types": "./dist-sdk/core.d.cts", "default": "./dist-sdk/core.cjs"}
    },
    "./styles.css": "./dist-sdk/styles.css",
    "./layout-worker.js": "./dist-sdk/layout-worker.js"
  }
}
```

No wildcard export exposes internals. CSS and worker are assets, not CJS runtime entry points. Ship all
worker chunks or bundle the worker self-contained; no source-relative or repo-root URL may escape into
output. Avoid `import.meta.url` in CJS. Support an explicit host worker factory/URL and document a tested
Vite asset-import recipe plus a static-host recipe. Instantiate lazily through the existing layout port;
terminate on disposal. Validate at a non-root base path, including failure/fallback and cancellation.
Do not make consumers run Tailwind to see nodes, edges, legend and docs correctly.

## 4. Release driver and candidate validation

Add a root Makefile as a thin entry point over npm/Node scripts, with CI invoking the same commands.
Commands below are planned, not currently configured. Scripts perform pure manifest/inventory/version
validation separately from filesystem/process effects. Add unit/property tests where release logic has
meaningful invariants; do not property-test static license prose or mirror the implementation.

| Target | Behavior and acceptance |
| --- | --- |
| `make sdk-check` | Typecheck, lint, public API snapshot, relevant unit/fast-check checks; reject unapproved exports or unresolved declarations |
| `make sdk-build` | Clean only SDK generated output, then produce both formats, declarations, CSS and worker; preserve app builds/source |
| `make release-pack` | Build once and `npm pack --json` into a designated artifacts directory; capture exact tarball path, SHA-256, version and source SHA |
| `make release-verify TARBALL=...` | Inspect and install that exact tarball into clean ESM, CJS, TS and browser consumers outside the repo; never resolve through workspaces, aliases or npm link |
| `make release-check` | Run sdk-check → pack → verify in order; CI gate, no network publication or Git tagging |
| `make release-publish TARBALL=... TAG=...` | Explicit separate operator action; verify artifact hash/report/version/registry and publish that already-tested tarball, without rebuilding |

A default `make` must run checks/help, never publish. Release verification fails closed on missing evidence,
wrong artifact hash, version mismatch or unexpected packed files. Do not publish during tests, on import,
from postinstall, or merely because a branch was pushed. Avoid lifecycle recursion (`prepack` invoking
pack); `prepack` may build/check, while the release driver records the final resulting artifact once. Keep
credentials out of repo/scripts. Choose current npm authentication/provenance setup at release execution;
no auth configuration or actual registry write is part of this plan-writing task.

Inspect actual `npm pack` file inventory, not just a dry-run guess. Allowlist only runtime/declaration assets,
required metadata/docs/notices; exclude demos, agent-work, STATE, tests, local data and source maps with
private paths. If maps are included deliberately, verify their sources. A changelog and release report
record API/schema/support changes. Publish tags/version are explicit, never auto-promote a prerelease to
latest. Failed publication does not justify rebuilding a different artifact under the same report.
[npm pack reference](https://docs.npmjs.com/cli/v11/commands/npm-pack/).

Required candidate matrix:

- Node ESM import and CJS require of every JS entry on the declared supported Node versions; identical
  exported names and representative validation/navigation results. Core requires no browser or React.
- Mixed import/require context-identity check; a provider from one path works with consumers from the other.
- TypeScript `.mts` and `.cts` consumers using NodeNext, plus bundler-resolution React TSX; compile with
  `skipLibCheck: false`, minimum supported TS and current supported TS, including intentional misuse errors.
  Every export condition's JS/type target exists inside the tarball. No source-checkout path resolution.
- Vite React app installs the tarball with only declared peers/dependencies, imports CSS and worker through
  public paths, renders all seven fixture types and exercises navigation/legend/STE documentation. Playwright
  checks production subpath assets, keyboard/focus, worker startup/disposal, no console errors and screenshots.
  A CJS-based browser build fixture also proves the require branch can render; Node require smoke alone does
  not establish UI compatibility. Declare precisely which bundlers were tested.
- Existing copied ts-db consumer and Cursor showcase regression checks remain green. Packaging must not
  accidentally switch their imports to an unpublished registry version.

## 5. README that is proved against the artifact

Replace scaffold prose with the actual package README after the public API and candidate work. It must
include purpose and all seven types; install command and peer/version requirements; complete runnable
quick start with valid JSON, decode/error handling, viewer and CSS; a legend/detail-navigation example;
documentation/STE example; ESM and CJS imports; worker setup and static base-path guidance; supported
Node/React/TS/bundler matrix; API reference links; demo instructions; test/release commands; MIT notice;
known limitations, schema evolution and contribution/bug links. Distinguish npm consumption from copying
the repository and do not claim the package is published before it is.

Keep examples in executable fixtures such as `examples/readme/`, using only public imports. The README
snippets are extracted from or checked against those files; validate JSON data and compile both module
examples against the packed candidate. Playwright runs the full README browser example. No ellipsis may
replace code needed to make the quick start run; no illustrative API name survives unless exported by the
actual candidate. Read the rendered README and inspect its links as part of review. If the documentation
changes after packing, produce and revalidate a new candidate so the published README is the tested one.

## 6. Closing items and explicit concurrency

Use the existing AGENTS protocol: exact Owns/Reads in item briefs, separate `item/p-NN-slug` branches and
worktrees, independent exact-commit reviews, serialized integration and maintained STATE. Sol is the
default. No item automatically needs Astra; escalate only if a concrete unresolved compatibility problem
warrants it. Reviewers are independent. The path families below become exact claims after C4-10.

| Item / builder | Complete increment and ownership | Acceptance |
| --- | --- | --- |
| P-01 public contract / Sol | Inventory landed API; finalize exported facade files and `docs/api/public-api.md`, support matrix and API snapshot tests. Name/version decision recorded; no release driver yet | Pure public-entry tests, structural type contracts, boundary checks; existing viewer Playwright regression if facade changes behavior |
| P-02 install the SDK / Sol | Own root manifest/lock, library build/declaration configs, SDK output wiring, asset packaging and `tests/package/`; install dual-format typed tarball into real consumer fixtures | Entire module/types matrix and packaged-browser Playwright; public import parity, shared context, worker/CSS and subpath evidence |
| P-03 MIT and notices / Luna high | Own `LICENSE`, `THIRD_PARTY_NOTICES.md` and `docs/release/licenses.md` only; inventory actual bundled dependencies and original assets | Complete MIT text/holder, attribution inventory and notice checks. No UI or artificial properties |
| P-04 documented consumer / Sol | Own root `README.md`, `examples/readme/` and dedicated README tests; compose complete examples against P-02 artifact | Snippets compile/run, valid data, ESM/CJS usage and real-browser example pass; rendered README review |
| P-05 repeatable release / Sol | Own Makefile, release driver under `work-scripts/node/release/`, release tests, CI release-check wiring and `docs/release/runbook.md`; reads frozen manifest without editing it | One command produces/validates exact artifact; failure-path unit/property tests; publication target stays separate; README fixture rerun by driver |
| P-06 final candidate / Sol | Serial integration/release report and bounded fixes with explicit reclaimed files; rerun copied and installed consumers | Clean-checkout rehearsal, all six requirements signed off, API/docs/license/artifact agree. No registry publication required for phase completion |

Concurrency and gates:

1. C4-10 is a hard prerequisite to **every** productionization implementation item. Plan writing now does
   not authorize early packaging work. P-01 runs alone and freezes the facade/support contract.
2. P-02 and P-03 may run concurrently after P-01. P-02 alone owns metadata/license field, lockfile,
   exports/build/test config. P-03 edits only notice files; P-02 uses the frozen expected notice paths and
   includes P-03's landed content before candidate acceptance. Integrate 03, then validate/land 02.
3. P-04 and P-05 may run concurrently after 02/03. P-04 owns README/examples and its test directory; P-05
   owns driver/CI/tests/runbook. P-02 pre-establishes generic consumer-test discovery so neither edits the
   root runner config. Coordinator serially registers new helpers in work-scripts INDEX before dispatch.
   Agree the README test command first; integrate 04, then 05 and rerun the combined release check.
4. P-06 runs alone after all previous items. Any required manifest/API change during parallel work returns
   to coordinator for serialization and downstream revalidation. Separate worktrees do not excuse shared
   file edits. Coordinator owns STATE, coordination board and knowledge index throughout.

Most items deliver an externally usable capability. License/driver work uses the direct validation its
nonvisual output needs. Playwright remains required for consumer-facing changes throughout this phase,
not just at final signoff. Update docs/knowledge for durable API/distribution choices; update STATE with
actual candidate hash, checks, pending decisions and next authorized action at handoff/completion.
