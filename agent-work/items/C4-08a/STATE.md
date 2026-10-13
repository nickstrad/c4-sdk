# C4-08a state

Goal and scope: produce the concise source ledger and glossary draft defined in [brief.md](brief.md), with exact ownership in [claims.md](claims.md). Builder is Luna high; independent Sol review required. No merge or push.

Status: committed for independent review; verdict pending. Worktree `/tmp/c4-sdk-c4-08a`, branch `item/c4-08a-sources`, base `541e41ae289176a891372555f514e940bb9e0815`. The review target is the branch HEAD reported in the builder handoff; the coordinator recorded checkpoint closeout in a separate commit after the builder’s Git metadata write was denied.

Owned paths: `demos/git-at-any-scale/content/research/{README.md,source-ledger.md,glossary.md}` and this item's `brief.md`, `claims.md`, `STATE.md`, `review.md`. See claims for full boundaries.

Completed: read repository instructions, knowledge index, C4-08a plan, item brief/claims/checkpoint, coordination board, and event-log instructions. Coordination records that common-dir event publication failed read-only and Nick's exception allows skipping it. Read the primary article at https://cursor.com/blog/git-at-any-scale and the existing external-context demo. Authored the research README, section-linked source ledger, glossary, and pending review record. The ledger covers hosting background, Spokes, WAL persistence/publication via CAS, local cache placement and rebuilding, primary selection, freshness/replication, compaction, reported scale, WAL provenance, Origin boundary, and unknowns. Claims are separated from inferred and illustrative model details; no production topology is asserted.

Validation: opened all 11 cited article heading fragments against the primary page; all resolved to the article's sectioned content. A Node link check passed for all local Markdown links and required coverage/classification terms. `git diff --check` passed. No application logic or tests apply. The staged/committed path list contains only claimed item records and the three research Markdown files.

Next: independent Sol review of exact branch HEAD. Coordinator integrates C4-02 then C4-08a after review. No merge or push by builder.
