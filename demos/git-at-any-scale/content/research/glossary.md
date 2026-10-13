# Draft glossary

Use these terms consistently in the plain-language and STE explanations. Definitions summarize the cited article; they are not independent implementation documentation.

| Term | Meaning in this showcase |
| --- | --- |
| **Packfile** | Git's packed representation of repository objects, used for storage and network transfer. |
| **Write-ahead log (WAL)** | The durable sequence of pushes and maintenance events described as Continuity's source of truth. |
| **Persist** | Store a push in the WAL so it survives before acknowledging the push. Persistence alone does not make the push visible. |
| **Publish** | Make a pushed commit reachable by advancing its references after the reference transaction and WAL-index update. |
| **Compare-and-swap (CAS)** | An atomic conditional update used to serialize competing WAL-index changes. |
| **WAL index** | The stored pointer state that identifies the published WAL history for a repository. |
| **Primary** | The server handling a repository update or compaction. Selection may change; it is not permanent ownership. |
| **Replica** | A local repository copy that follows WAL updates and checks freshness before serving reads. |
| **Materialize** | Recreate a local repository copy from the durable WAL when a cache is absent. |
| **Compaction** | Consolidate WAL or Git pack data to keep restore and object lookup work manageable. |
| **Linearizable** | A concurrent operation appears to take effect at one ordered point; here the article applies this to pushes. |
| **Origin** | Cursor's hosted Git platform as named by the article; its complete internal boundary is unspecified. |

For this draft, say “the article describes” for source claims, “the model shows” for inferred structure, and “for example” for illustrative nodes. Avoid wording that presents the diagram as a production inventory or a compliance statement.
