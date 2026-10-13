# C4-09a — safe project-copy policy

Build authorized. Sol builder and independent Sol reviewer, Codex-only until Twin confirms the reset. Read STATE, AGENTS, the plan's copy-policy sections and work-scripts/INDEX.md. Work in the assigned isolated worktree; maintain the item checkpoint. The lead owns shared state.

Own only the three modules work-scripts/node/copy-project/{policy,filesystem,types}.ts, three isolated policy test files and item records listed in claims. Existing Vitest unit discovery includes this test directory, including its fast-check properties. No SDK, app, content, config, dependency or index edits. Use Node APIs and existing dependencies.

Implement a pure manifest/planned-operation policy plus a scratch filesystem adapter. The manifest records its version, reviewed source commit, managed paths and SHA256 hashes. Restrict paths to the project-relative inventory; exclude .git, dependencies, build/browser artifacts, local-only files and generated public/consumer content. Preserve consumer-owned files. Never delete a whole pages tree. Reject traversal, duplicate paths, invalid hashes, symlink escapes and unmanaged target conflicts.

Refuse to overwrite or delete a previously managed file with local changes. Replace changed upstream files and delete only files in the previous managed inventory. A repeat copy must leave content and provenance unchanged. Treat missing previously managed files as local edits unless a safe recovery rule is explicitly documented. No implicit force option. Do not silently claim unmanaged files at a target path.

Preserve binary bytes and executable modes; document mode-change handling. Produce a reviewable diff plan before mutation. Revalidate assumptions before applying writes and publish provenance only after verified operations. Define recoverable failure behavior; tests must expose partial-write limitations honestly. This item does not add a CLI or mutate ts-db; C4-09 owns that later workflow.

Use meaningful unit and fast-check properties plus actual temporary filesystem tests under /tmp: idempotence, local edits, unmanaged preservation, upstream changes/deletions, malformed inventories, path/symlink conflicts, binary/mode preservation and failure handling. No artificial browser work. Run suites sequentially in this checkout to avoid Vitest cache races. Return an exact commit for independent review; the lead alone merges and pushes. Integration order remains03→04→09a even if this item finishes first.

Base: 3ea5789, reviewed preflight landed f4f7321. Exact claims below govern edits; request a claim update from the lead before editing an additional path.

The lead owns existing browser regression specs (context/navigation), root configuration, shared CSS, manifests/lock/index and shared state. Report any necessary adaptation; the lead will apply it serially in the appropriate worktree. Request the browser-run lease from the lead before starting a preview suite because both visual items use the same ports. Each worktree has separate node_modules; run unit and property commands sequentially.
