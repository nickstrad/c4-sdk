# c4-sdk

A React C4 SDK with a generic reference viewer and a small Cursor-based showcase. This first vertical slice renders system contexts; the [implementation plan](docs/plans/implementation.md) tracks later diagram kinds.

## Run and validate

```sh
npm install
npm run dev                 # generic viewer, own sample catalog
npm run dev:demo            # Git at any scale showcase
npm run build
npm run build:demo
npm run typecheck           # SDK, both apps, configs and tests
npm run lint
npm run test:unit           # Node unit tests and jsdom hook tests
npm run test:prop           # fast-check, seed 4012026, 150 runs/property
npx playwright install chromium
npm run test:browser        # actual production builds, desktop/mobile Chromium
npm run check               # all of the above checks and builds
```

Browser tests build the demo at `/c4-preview/`, serve it with that base, and test the generic production app separately. They cover valid/invalid resources, preserved last-valid state, keyboard focus, axe, reduced motion and 200% zoom. Screenshots and failure traces go to ignored `test-results/`; a human must inspect the screenshots. Tests use local ports 4173/4174. No hosting or publication occurs.

Vitest discovers future `tests/copy-consumer/policy/**/*.test.ts` and `tests/hooks/**/*.test.{ts,tsx}`. Pure tests run in Node; hooks use jsdom. Existing Vite/React/Tailwind/shadcn primitives are preserved. Effect is installed by the scaffold but is not used in domain logic.

## Source SDK API

Import from `src/lib/c4/index.ts` and import `src/lib/c4/styles/c4.css` once in the host. The CSS is scoped under `.c4-sdk`, has no global reset, and provides `--c4-ink`, `--c4-muted`, `--c4-surface`, `--c4-border`, `--c4-accent` and `--c4-external` tokens. React, React DOM and Zod are runtime dependencies; Tailwind is used by the generic host, not required by SDK views.

```tsx
import { decodeArchitecture, ArchitectureViewer, Legend } from './src/lib/c4'
import './src/lib/c4/styles/c4.css'

const decoded = decodeArchitecture(json)
if (decoded.ok) {
  const viewer = <ArchitectureViewer validatedBundle={decoded.value} />
  const independentKey = <Legend {...decoded.value.bundle.diagrams[0].legend} />
}
```

`decodeArchitecture(unknown)` returns either a whole immutable validated value with indexes and warnings, or structured diagnostics with code/path/severity/message. `SystemContext` is the typed wrapper. `projectDiagram`, `selectDocumentation`, `resolveLegend`, `validateArchitecture` and `buildIndex` are pure functions; callers should index only successfully validated data. `architectureSchema` and `architectureJsonSchema` expose the runtime shape and editor schema; reference, URL safety and metadata checks additionally run in the decoder.

`CatalogViewer` accepts a `catalogUrl`, optional loader port and title. `createFetchLoader` reads a strict `{entries:[{id,title,url}]}` catalog, resolves relative URLs against its location, bounds catalog bytes at 256 KiB and bundle bytes at 5 MiB before JSON parsing, and forwards AbortSignals. Failed replacements retain the entire last valid dataset. Stale requests cannot replace a newer resource or catalog. The generic app accepts `VITE_C4_CATALOG_URL` at its application boundary; the SDK contains no consumer-specific resource paths.

This is source-copy consumption, with one private root package and lockfile. There is no npm package publication. See the plan for the later reviewed copy/provenance workflow.

## Supported contract and current limits

Version 1 uses separate model identities and diagram membership. This slice supports person/softwareSystem elements; dependency/association relationships; context scopes, manual positions/sizes or deterministic auto LR/TB arrangements; legend swatches; sources, technical terms and Plain/STE documents. Unsupported element/diagram kinds, relationship kinds, groups, containment, navigation targets, arbitrary HTML/SVG and unknown keys are rejected explicitly. See `fixtures/context.json` for a complete input. Optional arrays normalize to empty without mutating caller data.

Validation rejects duplicate IDs/members/edges, invalid scopes, hidden edge endpoints, absent document/source/term references, mixed entities without planned notes, reviewed STE without reviewer/date, unsafe sources and incomplete manual positions. Missing protocols, missing key notation and large views are visible warnings. Proposed limits are 5,000 elements, 10,000 relationships, 200 diagrams and input depth 32; these are guardrails, not performance benchmarks.

Auto layout is fixed and deterministic, without graph routing or ELK. Complex geometry, navigation and later C4 kinds belong to subsequent slices. The canvas scrolls on narrow screens; the complete directed relationship list remains available below it. Documentation currently renders safe literal text with preserved paragraphs, rather than interpreting Markdown/HTML. STE100 text is explicitly draft unless human review metadata exists; schema validation does not certify language compliance.

## Project workflow

[AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), [coordination](agent-work/COORDINATION.md), [event log](agent-work/event-log.md) and [work-script index](work-scripts/INDEX.md) define repository work and review.
