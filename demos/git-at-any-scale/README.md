# Git at any scale: context and container navigation

Run `npm run dev:demo` from the repository root. `npm run build:demo` creates `dist-demo/`. The application imports the same source SDK entry as a consumer and loads its own public catalog and JSON; its content never lives in SDK JSX.

The small external context interprets [Vicent Martí’s Cursor article, Git at any scale](https://cursor.com/blog/git-at-any-scale), published 2026-08-18. The article identifies Continuity as Cursor’s Git storage system and S3 as the production object store. “Git developer” is an actor abstraction. The container view groups the described server responsibilities and local Git repository into **inferred logical C4 boundaries**. It does not assert separate deployable services, process boundaries, host counts or production topology. The article’s descriptions of reference transactions, local NVMe repositories and the S3 WAL ground these responsibilities. The full source ledger and detailed showcase are later slices C4-08a/C4-08.

Every displayed element and diagram have original short Plain and STE100 text. STE metadata says ASD-STE100 Issue 9, **draft**; no compliance certification or human language review is claimed. Document text is rendered literally and cannot execute markup.

The catalog also includes deliberately invalid JSON with a missing relationship target. Select it to inspect precise diagnostics while the complete previous validated architecture remains visible. The invalid fixture is a test example, not a second architecture.

`npm run test:browser` checks production assets under `/c4-preview/` at desktop and mobile sizes, including keyboard, axe, reduced motion and 200% zoom. Open Continuity’s detail to enter the container view, or use its explicit Inspect button to read the system explanation. Up selects Continuity in the context; Back follows visited routes. Deep links use `#/architectures/cursor-continuity/diagrams/containers/elements/repository`. See C4-02’s claims/checkpoint for inspected screenshot evidence and current review status.
