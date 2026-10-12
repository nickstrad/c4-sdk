# Agent event schema

Events are immutable Markdown files, one per event. The header has a fixed shape:

````markdown
# Agent event

```text
timestamp: 2026-10-12T12:34:56Z
actor: codex-scaffold
branch: scaffold/agent-work-patterns
type: task_started
summary: scaffold-2026-10-12 started
```

Optional detail follows after a blank line.
````

The fields are plain text, not YAML. Readers parse the fixed header only; detail can contain Markdown or header-like text.

- `timestamp`: UTC RFC 3339 timestamp to seconds.
- `actor`: 1–80 ASCII letters, digits, dots, underscores, or hyphens; must start with a letter or digit. Prefer `--actor` or `AGENT_ACTOR` over the per-invocation fallback.
- `branch`: nonempty and contains no control characters. Use `detached-<sha>` for detached work.
- `type`: one of the six values below.
- `summary`: one nonblank line without control characters. Include the task ID.

| Type | Meaning |
| --- | --- |
| `task_started` | An actor begins or resumes named work. |
| `task_completed` | Work is finished; include result, validation, and commit SHA when applicable. This does not imply landing. |
| `landed` | A coordinator verified the destination branch and landed SHA. |
| `review_verdict` | Summary begins with PASS, NITS, or FAIL; detail names the reviewed SHA and findings. |
| `blocker` | Work cannot proceed; name the cause and needed unblock action. |
| `decision_needed` | A human/coordinator choice is needed; name the options and decision owner. |

Filenames are `YYYY-MM-DDTHH-MM-SSZ-<actor>-<random>.md`. The random suffix prevents filename collisions; filenames do not establish causal order. Never edit, delete, rename, or reformat published events. Report corrections in a new event referencing the earlier filename. Events are status records, not locks or approvals. Never include secrets.

See [`../event-log.md`](../event-log.md) for publication, reading, and archive procedures.
