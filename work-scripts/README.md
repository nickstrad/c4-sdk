# work-scripts/

Keep reusable scripts created during project work here so later contributors can inspect and reuse them. This repository uses `bash/` for shell helpers and `node/` for JavaScript/TypeScript helpers. Use the runtime and dependencies already present in the project; do not invent package commands or add a dependency for a one-off script.

## Placement and rules

| Work shape | Location | Invocation |
| --- | --- | --- |
| Shell automation, Git helpers, simple checks | `work-scripts/bash/<name>.sh` | `bash work-scripts/bash/<name>.sh` or execute the script if it is marked executable |
| JavaScript helper | `work-scripts/node/<name>.mjs` | `node work-scripts/node/<name>.mjs` |
| TypeScript helper using erasable syntax | `work-scripts/node/<name>.ts` | `node --experimental-strip-types work-scripts/node/<name>.ts` (Node 22.23.2 in the scaffold environment) |

- Read [`INDEX.md`](INDEX.md) before adding a script and add one row for every new script in the same change.
- Use descriptive kebab-case names. Bash scripts start with `#!/usr/bin/env bash` and `set -euo pipefail`.
- Document required environment variables and scratch/output paths. Never commit secrets or credentials.
- Keep scripts runnable and record validation commands in the associated task claims.
- Keep TypeScript scripts within syntax Node can erase directly; enums, namespaces, and parameter properties require a build step and are outside this convention.
- No new npm script, runtime dependency, or formatter is introduced by this scaffold.

See [`node/README.md`](node/README.md) for a runnable TypeScript example.
