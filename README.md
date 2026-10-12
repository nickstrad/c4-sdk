# c4-sdk

A C4-diagram framework/SDK (React components + library) and a demo app that consumes it.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 with shadcn/ui (`components.json`, components under `src/components/ui`)
- zod, effect, fast-check

## Layout

- `src/lib/` — framework core (`utils.ts` is the shadcn helper)
- `src/components/` — UI components (`ui/` is shadcn-generated)
- `src/pages/` — demo app pages
- `public/diagrams/` — sample diagram JSON data

## Scripts

- `npm run dev` — dev server
- `npm run build` — typecheck (`tsc -b`) and production build
- `npm run lint` — oxlint

## Working with agents

- [`AGENTS.md`](AGENTS.md) describes coordination, task ownership, experiments, and durable project knowledge.
- [`CLAUDE.md`](CLAUDE.md) contains repository conventions for Claude Code.
- [`agent-work/COORDINATION.md`](agent-work/COORDINATION.md) is the current work status; [`agent-work/event-log.md`](agent-work/event-log.md) explains shared event reporting.
- [`work-scripts/INDEX.md`](work-scripts/INDEX.md) lists reusable investigation and maintenance scripts.
