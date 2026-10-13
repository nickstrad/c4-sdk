# Source ledger

Primary source: Vicent Martí, [“Git at any scale”](https://cursor.com/blog/git-at-any-scale), Cursor, 18 August 2026. **Documented** means stated in the article, not independently verified. **Inferred** marks our model; **illustrative** marks a teaching example; **unknown** marks details the source does not establish.

| Topic | Article section | Provenance and treatment |
| --- | --- | --- |
| Hosting constraints | [What's hard about Git?](https://cursor.com/blog/git-at-any-scale#whats-hard-about-git) | **Documented:** local Git assumptions create hosting challenges. |
| Objects and filesystems | [Git without packfiles](https://cursor.com/blog/git-at-any-scale#git-without-packfiles); [GitHub and filesystems](https://cursor.com/blog/git-at-any-scale#github-and-filesystems) | **Documented** background; not Continuity components. |
| Spokes baseline | [Spokes and Consistency](https://cursor.com/blog/git-at-any-scale#spokes-and-consistency) | **Documented:** synchronized repository copies; replica cost and placement/repair burden. |
| Push durability and visibility | [Continuity](https://cursor.com/blog/git-at-any-scale#continuity); [Consensus](https://cursor.com/blog/git-at-any-scale#consensus) | **Documented:** persist push to WAL (S3 in production) before acknowledgement; publish only after reference preparation and WAL-index update using CAS. |
| Local copies and placement | [Consensus](https://cursor.com/blog/git-at-any-scale#consensus) | **Documented:** normal local Git repositories are warm caches that may be discarded and rebuilt; rendezvous hashing ranks preferred nodes. Diagram placement is **inferred**. |
| Primary and replication | [Consensus](https://cursor.com/blog/git-at-any-scale#consensus); [Replication](https://cursor.com/blog/git-at-any-scale#replication) | **Documented:** any server may update via CAS; gossip prompts catch-up, while ETag checks establish freshness before reads. Sequence is **inferred**. |
| Compaction | [Compaction](https://cursor.com/blog/git-at-any-scale#compaction) | **Documented:** primary compacts; replicas follow compacted packs. |
| Scale | [Scale](https://cursor.com/blog/git-at-any-scale#scale) | **Documented:** reported measurements are dated claims, not guarantees; omit from topology. |
| History and product boundary | [WAL as truth](https://cursor.com/blog/git-at-any-scale#wal-as-truth); [Origin](https://cursor.com/blog/git-at-any-scale#origin) | **Documented:** WAL provenance and Origin's hosted-Git goals. Full product internals remain **unknown**. |

**Illustrative deployment:** generic clients, service boundary, object storage, and interchangeable repository caches explain the article. They are not a production inventory; assign no real counts, regions, languages, processes, or node identities.

**Unknown:** actual topology and service decomposition; storage, retention, backup, and security configuration; recovery objectives; exact Origin boundaries; workload-specific behavior. The article does not establish these.
