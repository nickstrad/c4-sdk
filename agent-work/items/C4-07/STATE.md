# C4-07 checkpoint

Builder: fresh Claude Sonnet 5.5, no subagents. Branch `item/c4-07-seven-types`, worktree `/tmp/c4-sdk-c4-07`, base `11913f0`. Brief: [brief](brief.md); claims: [claims](claims.md); review: [review](review.md) (pending; coordinator dispatches an independent cross-company reviewer). Root STATE/COORDINATION untouched.

## Delivered

- Domain/schema: `landscape` (person/system members, optional visible system scope) and `code` views; `code` elements (parent component or code, bounded acyclic depth 32; symbolKind class/interface/function/type/enum/table/module; text-only members name/signature/visibility); relationship kinds inheritance/implementation/composition (code endpoints only; implementation targets interface/type; no self inheritance); code-view scope ancestry with `external` symbols; native landscape→context and component→code detail rules; code elements rejected from context/container/component/dynamic views. Pure rules live in `domain/codeview.ts`.
- Stable identities: `symbolKey`/`memberKey` from element ID + member index (valid IDs never contain `#`), never from member text.
- React: member compartments (accessible list inside the card, same list in the text alternative and the measurement probes), relationship kind in edge labels/text alternative.
- Composition: `ArchitectureProvider` (single route/navigation/session controller), `DiagramNavigation`, `DiagramView`, `DiagramLegend`, `DiagramDocumentation`, `useViewerController`, replaceable `navigationSlot`/`legendSlot`/`documentationSlot`. Seven named wrappers in `NamedDiagrams.tsx` share `ArchitectureViewer` with `expectedKind`, checked against the ROUTED diagram (route port, direct URL, drill link). README documents wrappers, composition, code views; the README example block is asserted equal to `tests/hooks/composition-example.tsx`.
- Fixture: generic invented `fixtures/seven-types.json` (also `public/diagrams/seven-types.json` + generic catalog entry). No Cursor code internals; the demo showcase JSON is unchanged.

## Validation (worktree, production builds)

- `npx tsc -b` PASS; `npm run lint` only the pre-existing button fast-refresh warning.
- `npm run test:unit` 189/189 (22 files, includes 55-case table-driven wrapper test and README sync); `npm run test:prop` 29/29.
- Full `npm run test:browser -- --workers=1`: 56 PASS, 1 existing skip, **1 FAIL**: mobile component-docs (27.6s, `.c4-documentation:visible` text expectation). Isolated rerun of `tests/browser/component-docs`: 2/2 PASS (desktop 5.7s, mobile 10.9s). Treat as an intermittent timing failure, not a clean full run. Not reproduced; not investigated further.
- New seven-types spec: 5 journeys x desktop/mobile PASS (all seven direct URLs with node counts/legend/explanation; every code member and visibility/signature accessible, no clipped compartment; landscape→context and component→code drill with real Back/Up; direct element URL; generic 4174 viewer by URL). axe serious/critical none on code page.
- Screenshots inspected: `/tmp/c4-07-evidence2/*/code-compartments.png`, `/tmp/c4-07-full/seven-types-*/{landscape,...,deployment}.png`. Desktop class boxes read well. **Limitation seen:** on mobile the initial canvas viewport (x=20,y=20,zoom 1) of the wide code layout can show an empty region; nodes need pan/Fit View; the full text alternative lists every relationship. Left for C4-10 (viewport framing), not changed here.
- Earlier `/tmp/c4-07-evidence` run had a test bug (fixture lacked `members` key for EmptyModule); fixed and rerun.

## Operational notes

- Fresh worktree had no node_modules; `npm ci --prefer-offline` from the lockfile (no manifest change).
- Browser runs used direct `npm run test:browser` with Playwright output dirs; no stalls. No provider limit hit.
- Event publication not attempted (common-dir publish is read-only per root STATE).

## Commits

Filled at handoff (implementation, knowledge/script decision, checkpoint).
