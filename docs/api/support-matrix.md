# Candidate support proposal

Date: 2026-10-14. Source inventory: `a585d97`; contract: [public-api.md](public-api.md).
This proposes the smallest support target backed by current source evidence. Package support is not
established until P-02 installs and tests the exact tarball. There is no registry publication in P-01.

## Identity and version

> **Superseded 2026-10-15 (P-06):** Nick directed that the first published version is `0.1.0`, not
> `0.1.0-beta.1`; the manifest is `c4-sdk@0.1.0`, built with rolldown `1.2.14` and rolldown-plugin-dts
> `0.28.8` (TypeScript `6.0.3` and Vite `8.3.4` unchanged). The version text below is retained as
> P-01 history; the supported-version targets in the matrix are unchanged. npm login (`nickstrad`) was
> verified by Twin; publication remains a separate human action. See
> [`docs/release/0.1.0.md`](../release/0.1.0.md).

Recommend the unscoped `c4-sdk` with first published version `0.1.0`, keeping API/distribution
acceptance explicitly pre-1.0. Nick's 2026-10-14 approval note relayed verification that this exact
name was available on 2026-10-12. This documentation fixup made no npm registry query and proves neither
present-day availability nor account ownership; no account login or package access was attempted.
P-02 must revalidate current registry availability before building its package artifact. The repository
manifest is currently private `c4-sdk@0.0.0`; this fixup does not change it. Actual publication remains a
later explicit action with Nick present for npm account login/2FA. Changing identity afterward needs
coordinator agreement and regeneration of all consumer evidence, not a silent manifest substitution.

## Evidence and target matrix

The installed versions below are read from the existing node_modules package metadata (not inferred from
manifest ranges). P-01 reuses those dependencies without a network install. C4-10's browser evidence is
in [acceptance.md](acceptance.md); it describes source-built apps rather than installed packages.

| Area | Current source evidence | P-02 proposed acceptance target | Unverified / outside initial promise |
| --- | --- | --- | --- |
| Node | 22.23.2 Linux x64; source core tests, typecheck/build tools; transformed UI imports | Node22.23.2 exact version: every packed JS entry via ESM and CJS; core without React/browser; mixed UI context identity | Other Node22 patches, Node20/24/26, other OS/CPU, raw source Node import |
| React / React DOM | Both installed19.3.0; current hook tests and C4-10 production browser journeys | React19.3.0 + React DOM19.3.0 as matching external peers, including JSX runtime; packaged ESM and CJS browser render | React18, manifest minimum19.2.8, other19.x releases, server render/hydration |
| TypeScript | Installed6.0.3; source app uses bundler resolution and skipLibCheck:true; P-01 structural fixture explicitly compiled | Minimum/current candidate6.0.3; `.mts`/`.cts` NodeNext and React TSX bundler consumers with skipLibCheck:false | TS5.x, manifest6.0.2, older declaration syntax/compiler combinations |
| Vite | Installed8.3.4; existing generic and Cursor production app builds | Vite8.3.4 installed tarball app at a non-root base path; public CSS/worker imports | Other Vite versions, Next.js, webpack, Rollup-only builds, CDN import maps |
| CJS browser bundler | No current package evidence | P-02 must name and pin an available bundler and prove require-branch UI rendering | No bundler support claim until this test passes; Node require alone is insufficient |
| Browser | Playwright1.64.0/Chromium156.0.8078.4 on desktop and Pixel7 emulation in C4-10 | The available Chromium revision on desktop and mobile emulation; all7 kinds, routes/docs/keys and worker lifecycle | Firefox/WebKit/Safari, native mobile hardware, human screen-reader audit |
| Worker | ELK0.12.0 source module-worker, abort/error/timeout tests and production lifecycle evidence | Self-contained packed browser module-worker; explicit host factory/static URL, non-root assets, cancellation/disposal/failure | Node workers, private direct messages, unspecified asset-loader recipes |
| CSS | Six theme tokens and source `.c4-*` styles; renderer imports CSS transitively | Explicit packed stylesheet with required React Flow/SDK rules; no host Tailwind, demo reset/fonts, or JS style injection | Packed scope/reset isolation until inspected/tested; arbitrary host class selectors |

The initial target intentionally uses exact exercised versions. P-02 should record actual candidate
versions and choose manifest engines/peer ranges from its passing minimum/current tests. A broad range
does not become verified because the source manifest contains it. Additional supported versions require
recorded consumer evidence and a reviewed matrix update; P-02 can request reclaimed contract-doc paths
from the coordinator when that evidence changes this proposal.

## Distribution acceptance gaps

The following are required P-02 gates, not completed support claims: actual `.mjs`/`.cjs` output and
export-name parity; shared context identity across import/require; Node-safe root CSS extraction;
React-free core graph in the artifact; bundled `.d.mts`/`.d.cts` declarations with no private aliases or
unshipped imports; artifact-only consumers with no workspace/link/source resolution; full asset inventory;
installed browser all-kind journeys; and registration of the P-01 snapshot/structural checks in SDK CI.
No tree-shaking, bundle-size or first-load timing guarantee follows from the chosen output format.

The historical `projectDiagram`, raw Zod schema, index builder, renderer internals and specialized
scenario/deployment/code helpers remain available only through existing source paths where currently
used. They are excluded from the new package surface. No existing source consumer is silently migrated.
The removed C4-09 copy-consumer experiment is not evidence of a second installed consumer; future ts-db
module ingestion remains separately coordinated.

MIT/notices are P-03, executable package README examples are P-04, release/artifact verification is
P-05/P-06. Actual npm publication remains a later explicit action with Nick present for login/2FA.
