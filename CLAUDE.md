# CLAUDE.md

Repository conventions for Claude Code. Coordination and project structure live in [`AGENTS.md`](AGENTS.md); this file does not repeat those rules.

## Project and commands

This repository contains a C4 diagram SDK/framework and a React demo built with Vite, TypeScript, and Tailwind CSS. Existing npm commands are:

- `npm run dev` starts the Vite development server.
- `npm run build` runs the TypeScript project build and creates the Vite production output.
- `npm run lint` runs oxlint.
- `npm run preview` serves the production output locally.

Use the commands already defined in `package.json`. Do not assume a test runner, formatter, or additional package script exists; check the package manifest before relying on one.

## Session boundaries

For documentation-only or scaffolding work, keep changes to the paths named in the task brief. Treat `src/`, `public/`, `package.json`, `package-lock.json`, and build configuration as out of scope unless the brief explicitly owns them. A task that requires product implementation belongs in a work item with explicit path claims.

## Branch and worktree etiquette

Use the branch and worktree assigned to the task. Before editing, read the task's `brief.md` and `claims.md`, then check `agent-work/COORDINATION.md` for shared-file conflicts. Do not edit paths claimed by another active task. If scope must change, update the claims record and coordinate the change first. Only the coordinator lands or pushes work unless the task explicitly assigns that responsibility.

## Commit style

Make one logical change per commit. Use `<area>: <imperative summary>` for the subject, such as `docs: add agent coordination scaffold`. Keep generated output and unrelated local files out of commits.
