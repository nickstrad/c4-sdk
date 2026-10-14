# Git at any scale: an independent reading model

Run `npm run dev:demo` from the repository root. `npm run build:demo` creates `dist-demo/`. The thin app imports the common source SDK, loads its public catalog and runtime JSON, and uses its normal documentation, navigation and rendering pipeline.

This showcase interprets Vicent Martí’s [Git at any scale](https://cursor.com/blog/git-at-any-scale), Cursor, 18 August 2026. The article describes Continuity behind Origin: ordinary local Git repositories are disposable caches; the S3 WAL is authoritative. These are source claims, not independent implementation verification. Our diagrams and explanations are original; no article animation, image or long passage is reproduced.

## Guided reading path

1. Start at **Continuity and its collaborators**. Read the Diagram key and diagram explanation. Inspect Continuity to read its own write-up; the main node link drills into logical containers.
2. In **Continuity: logical containers**, inspect the local repository and S3. Distinguish disposable cache from durable history. Drill into Continuity server for four **inferred responsibilities**. They describe behavior, not source classes, implementation language or separate processes. Up restores the canonical parent; Back follows actual visited history.
3. Follow **Push: durable publication**. Select `durable-preparation` to see unordered upload and local-write branches; select `publish-cas` to locate visibility. Upload alone does not publish. Selection numbers are tree positions, not a total execution order or a simulator. CAS retry is discussed as an alternative, not combined with successful publication.
4. Compare **Read: freshness already matches** (304) with **Read: catch up before serving** (200). These are separate successful paths. **Gossip: optional catch-up notification** explains the optimization; conditional freshness remains necessary if gossip is lost.
5. Read **Rebuild: missing local cache** and **Compaction: reuse compacted packs**. Placement may change, caches may disappear, and replicas reuse the primary’s compacted packs. No recovery-time or throughput guarantee is asserted.
6. Open **Continuity: illustrative deployment**. Expand/collapse hypothetical hosts, inspect distinct replicas and drill to logical detail. Region, hosts, counts, placements and process boundaries are teaching examples, not Cursor’s production inventory. `planned` is SDK lifecycle notation for this illustration, not evidence that Cursor plans these hosts.
7. Switch **Plain explanation** / **STE100 text**, read sources and technical terms, and use the relationship list or scenario text alternative. On narrow screens, **Open explanation** opens the responsive sheet; Escape closes it. Copy the current URL and open it in a fresh tab to preserve diagram, element and scenario selection. Example: `#/architectures/cursor-continuity/diagrams/push?step=publish-cas`.

Every view links to the remaining reading path through common SDK related links. The showcase intentionally has no code view: the article does not establish source symbols. The generic reference fixture demonstrates all seven SDK kinds.

## Provenance and review

Source checked by the builder: **2026-10-14**. [Source ledger](content/research/source-ledger.md) records section claims and unknowns; [source-to-ID inventory](content/research/source-map.json) maps every diagram, element and relationship to documents, sources, evidence status and review state. [Glossary](content/research/glossary.md) explains the terms used in the bundle.

Evidence labels are separate from SDK lifecycle status. **Documented** means the article states the behavior; **inferred decomposition** means our logical boundary; **illustrative** means invented teaching topology. Actual source classes, complete Origin internals, security/retention configuration and real host topology remain unknown. Reported source measurements are historical observations and are omitted from the diagrams.

All original STE explanations are **ASD-STE100 Issue 9 drafts**. No human language review or certification is claimed; diagnostics are advisory. Independent source-fidelity and implementation review remain pending until the C4-08 review record reports an actual verdict. See [item checkpoint](../../agent-work/items/C4-08/STATE.md) for exact validation, screenshot evidence and limitations.

The catalog’s **Invalid resource** deliberately contains a missing relationship target. It is a diagnostic teaching example, not another architecture: the SDK retains the last complete valid dataset on failure.

## Validation

`npm run test:unit` checks content inventories/provenance; `npm run test:prop` generates reading selections and checks route/document isolation. `npm run test:browser -- tests/browser/showcase --workers=1` builds production assets at `/c4-preview/`, exercises desktop/mobile reading, keyboard, fresh deep links and zoom, and captures screenshots for inspection. No cloud account, Git server or live repository is required.
