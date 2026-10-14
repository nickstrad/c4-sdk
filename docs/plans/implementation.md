# c4-sdk implementation plan

Status: build authorized by Nick on 2026-10-12; execution starts with C4-01.
Date: 2026-10-12. Repository: [nickstrad/c4-sdk](https://github.com/nickstrad/c4-sdk).
Main checkout: `/root/Software/c4-sdk`. Plan branch: `plan/c4-react`.
Scaffold inspected at `486db29`; this document supersedes ts-db's earlier c4-react design plan.

## 1. Deliverables and constraints

Implement the C4 framework in this repository. Keep a general React SDK and its pure domain logic separate
from the applications that consume them. The existing Vite/React/TypeScript/Tailwind/shadcn scaffold is the
starting point, not something to recreate. Its current scripts are `dev`, `build`, `lint` and `preview`;
test commands in this plan are future additions, not commands claimed to exist today.

Deliver a working showcase under `demos/git-at-any-scale/`, based on the Cursor post read for this update,
and support ts-db's GitHub Pages application by copying this project into ts-db. **There is no npm package,
package tarball, registry publication or workspace-package distribution in this implementation.** Normal npm
installation of third-party dependencies remains necessary. Publishing is a later open decision.

JSON is the architecture-content contract. Zod validates runtime input. React components express all seven
C4 diagram types through presentation and composition, with no project content hard-coded into SDK JSX.
A reader can drill into detail, inspect explanations, use breadcrumbs/Back, and open diagram/element URLs.
All business rules should live in pure functions, with hooks providing the framework integration and dumb
views displaying the results. Logic changes carry unit tests and fast-check properties; visual slices carry Playwright checks throughout.
Nonvisual items use the validation that proves their deliverable, without artificial UI work.

Non-goals: a visual editor, collaborative authoring, a backend database, source reverse engineering,
executing user React/MDX from JSON, full UML, runtime telemetry, implementing the Cursor storage system,
or replacing ts-db's existing Mermaid/terminal docs. This planning update does not deploy a site, build
the SDK, change dependency manifests or begin the planned copy into ts-db.

### All seven types are first-class

| Diagram          | Scope and representation                                                              | React entry point   | Required acceptance fixture                              |
| ---------------- | ------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------- |
| System Landscape | People and systems across an organisation; optional group boundaries                  | `SystemLandscape`   | Two systems with different owners and shared callers     |
| System Context   | One software system and its people/external systems                                   | `SystemContext`     | Full FFI context conversion                              |
| Container        | Applications and data stores within one system, plus external collaborators           | `ContainerDiagram`  | Current server/reader/files and proposed statement lanes |
| Component        | Components within one container and its collaborators                                 | `ComponentDiagram`  | Current API components; proposed lane components         |
| Code             | Selected types/functions/tables inside a component; members and typed relationships   | `CodeDiagram`       | Current document-reader functions, grounded in source    |
| Dynamic          | Ordered interactions over model elements; numbered communication-diagram presentation | `DynamicDiagram`    | Cancel an FFI statement, then escalate if necessary      |
| Deployment       | Nested infrastructure nodes, concrete instances, infrastructure services, environment | `DeploymentDiagram` | An explicitly illustrative two-node FFI deployment       |

The four static levels and three supporting types follow the
[C4 diagram taxonomy](https://c4model.com/diagrams). Dynamic and deployment diagrams are alternate views, not
levels five and six of a drill-down tree. Code views support C4's selected implementation detail, not an
entire language grammar. [C4 code scope](https://c4model.com/diagrams/code).

## 2. Repository structure and copy-based consumption

Use one private root package and lockfile. Adapt existing paths without disturbing the scaffold's agent
protocol. There is no `packages/` publishing layout and no framework source in the ts-db repository of
record. `src/lib/utils.ts` remains the shadcn helper; keep C4-specific logic under its own directory.

```text
c4-sdk/
  package.json, package-lock.json, vite.config.ts, tsconfig*.json
  src/
    main.tsx, App.tsx              generic development/reference viewer
    components/ui/               existing shadcn primitives
    lib/utils.ts                 existing shadcn helper
    lib/c4/
      domain/                    pure TS model, validation, navigation, scene,
                                 legend, docs and dynamic-interaction rules
      schema/                    Zod runtime decoding and JSON Schema export
      ports/                     loader, layout, route and focus interfaces
      react/
        contracts/               presentation prop types
        hooks/                   framework lifecycle and port integration
        containers/              hooks + views
        views/                   props-only presentation
      adapters/
        loaders/                 fetch and resource limits
        router/                  browser/hash history integration
        react-flow/              canvas and node/edge adapters
        elk/                     worker client and layout implementation
      styles/                    scoped CSS and theme tokens
      index.ts                   source-level SDK entry; not an npm package
  public/                        generic viewer catalog/assets
  demos/
    git-at-any-scale/
      index.html, vite.config.ts
      src/                       thin showcase app importing SDK source
      public/catalog.json
      public/diagrams/continuity.json
      content/                   source map, technical glossary and STE review
      README.md
  fixtures/                      generic valid/invalid seven-type JSON
  tests/
    unit/, property/, hooks/
    browser/                     Playwright journeys and visual evidence
    copy-consumer/               clean copied-project consumer fixtures
  docs/
    plans/implementation.md      this authoritative implementation plan
    knowledge/                   durable index, decisions, gotchas, glossary
    authoring/, embedding/       future SDK/user guides
  agent-work/                    existing briefs, claims, reviews and events
  work-scripts/bash/, node/      indexed reusable helpers
```

The dependency direction is application → React/hooks/adapters → ports and domain. Domain modules never
import adapters or demo code. The schema decoder uses domain types but domain code does not import Zod.
Keep the SDK public boundary at `src/lib/c4/index.ts` and document its source API. The demo uses the same
entry point as a copied consumer. Its Vite config uses its own public directory and safe, repository-local
source aliases; it does not require a registry artifact. Configure TypeScript and lint to cover SDK, demo
and tests. Root scripts select the generic viewer or the demo explicitly (`dev:demo`/`build:demo` planned).

The SDK supplies scoped CSS/custom properties without a global reset. Tailwind and shadcn provide the
reference/demo shell. SDK views accept slots and tokens; they must not depend on app-only aliases or on
Tailwind discovering unshipped source. The copied project's explicit dependency and CSS setup is tested.

### ts-db integration: a deliberate crude copy

**Dispatch gate (2026-10-14): C4-09 is paused until ts-db FFI-06, FFI-07 and FFI-08 are all landed on
ts-db `main`.** When C4-09 resumes, ts-db owns a `pages/diagrams/` design surface (or a link to that
folder) that keeps the latest current C4 diagrams beside clearly distinguished candidate/proposed
alternatives. Use these diagrams more during feature design: side-by-side current and proposed views are
the sanctioned way to discuss alternatives. The folder is not a diagrams-only communication channel and
must not replace the Pages consumer data/content needed by the copy workflow below.

The consumer layout is `ts-db/pages/c4-sdk/` for an upstream tracked-project snapshot,
`ts-db/pages/content/` for ts-db-owned catalog/JSON, and `ts-db/pages/c4-sdk-source.json` for provenance.
The generic viewer accepts a catalog URL at its application boundary (for example
`VITE_C4_CATALOG_URL`); no ts-db IDs or paths are compiled into the SDK. The copied viewer is the Pages app.

The future copy operation has these steps:

1. Select a reviewed c4-sdk commit, stage its tracked project into an empty temporary directory, and record
   its SHA and managed-file inventory/checksums. Exclude `.git`, dependencies, build output, browser artifacts
   and local-only files. Do not package it with `npm pack` or use a Git/npm dependency.
2. Show the copy diff. Refuse to replace a previously copied file with local edits unless those edits have
   been explicitly reconciled. Replace only the recorded vendor subtree; consumer content lives outside it.
   Removed upstream files are removed only when they are in that previous inventory. Repeating the same copy
   produces no changes. Never delete the whole `pages/` directory.
3. Run `npm ci` inside the copied project using its lockfile. Stage ts-db's catalog/data into a designated
   generated `public/consumer/` directory, kept out of the upstream snapshot inventory. Point the viewer at
   it, set the production base to `/ts-db/`, and build. Only generated output is uploaded as the Pages artifact.
4. Run unit/property checks for copy/route logic and Playwright against the built site at that subpath:
   reload a deep link, traverse diagrams, inspect STE text, and verify CSS, fonts and layout worker URLs.
   Test a second copy with a changed source commit and unchanged consumer content.
5. Commit the copied source, consumer data and provenance in ts-db in its own integration task. SDK fixes
   originate in c4-sdk and are re-copied; local fork edits are not the default maintenance path.

The source license/attribution accompanies the copy. No publishing, npm versioning or release automation is
required. The authoritative plan stays here; ts-db retains only a relocation pointer and consumer-specific
instructions. Implement this workflow in the copy-consumer slice, not in this documentation update.

## 3. JSON contract

### 3.1 Model, diagrams and documents

Use a versioned, self-contained `ArchitectureBundle`. Model identities describe architecture; diagram
membership describes a view of it. Layout positions and React Flow IDs are derived state and never the
identity of a system or component. Two datasets can use the same logical IDs without sharing mutable state.

The following is the normative v1 schema design. The implementation item turns it into strict Zod objects,
checks its decoded output against the domain value types, and generates editor-facing JSON Schema. Required fields are listed first; `?` means
optional. Unspecified optional arrays default to empty during normalisation, without mutating input.

| Record        | Fields                                                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bundle        | `schemaVersion: 1`, `id: Id`, `title: string`, `revision: string`, `defaultDiagramId: Id`, `model: {elements: Element[], relationships: Relationship[]}`, `diagrams: Diagram[]`, `documents: Document[]`, `sources: Source[]`; optional `terms: Term[]`                   |
| Element base  | `id`, `kind`, `name`, `description`, `status`; optional `technology`, `parentId`, `tags: string[]`, `docIds: Id[]`, `sourceIds: Id[]`, `plannedNotes: string[]`                                                                                                           |
| Relationship  | `id`, `sourceId`, `targetId`, `label`, `status`; optional `technology`, `kind` (default `dependency`; also `association`, `inheritance`, `implementation`, `composition`), `docIds`, `sourceIds`, `plannedNotes`, `modelRelationshipId` (deployment only)                 |
| Diagram base  | `id`, `kind`, `title`, `status`, `nodes: Member[]`, `edges: EdgeRef[]`, `legend: LegendSpec`; optional `scopeId`, `parent: Target`, `related: Link[]`, `groups: Group[]`, `docIds`, `sourceIds`, `layout: LayoutSpec`                                                     |
| Member        | `elementId`; optional `detail: Target`, `related: Link[]`, `position: {x: finite number, y: finite number}`, `size: {width: positive number, height: positive number}`                                                                                                    |
| EdgeRef       | `relationshipId`; optional `displayNumber: positive integer` (source-document numbering, never dynamic execution order)                                                                                                                                                   |
| Target / Link | Target is `{diagramId, elementId?}` within this bundle; Link adds a required `label`                                                                                                                                                                                      |
| Group         | `id`, `label`, `memberIds: Id[]`, `status`; optional `parentGroupId`. This is a visual boundary, not another model element                                                                                                                                                |
| LayoutSpec    | `mode` is `auto` or `manual`; `direction` is `TB` or `LR`; optional bounded positive `spacing`. No arbitrary ELK option bag in content                                                                                                                                    |
| Document      | `id`, `title`, `plain: string`, `ste: {text: string, issue: string, reviewStatus: ReviewStatus, reviewer?: string, reviewedAt?: ISO-date}`; optional `termIds: Id[]`, `sourceIds`. ReviewStatus is `draft` or `reviewed`                                                  |
| Source        | `id`, `title`, `url` (HTTPS or safe relative resource); optional `revision`, `path`, `notes`. No credentials, local absolute paths or executable URLs                                                                                                                     |
| LegendSpec    | `title`, `entries: LegendEntry[]`                                                                                                                                                                                                                                         |
| LegendEntry   | `id`, `label`, `description`, `swatch: {shape?: Shape, tone: Tone, stroke: Stroke, arrow?: Arrow}`. Shape: `person`, `box`, `database`, `boundary`, `line`. Tone: `default`, `external`, `accent`, `muted`. Stroke: `solid`, `dashed`, `dotted`. Arrow: `none`, `forward` |

`Id` is a nonempty case-sensitive string matching `[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}`. IDs are unique within
their record collection; cross-reference fields identify the collection they target. `status` is
`existing | planned | mixed`. `mixed` requires nonempty `plannedNotes` on elements/relationships. A diagram
can be mixed because of its members. Existing entities with planned capabilities retain their identity; the
caption explicitly distinguishes current responsibility from proposed additions.

`Term` is `{id, text, definition, category}`, where category is `technicalNoun` or `technicalVerb`. Document
`termIds` reference the bundle terms. Content authors maintain these records in their dataset glossary; no
ts-db vocabulary ships in the framework.

`Element` is a discriminated union:

- `person`, `softwareSystem`: the base fields. Systems can carry the `external` tag.
- `container`: requires `parentId` of a software system and `technology`; optional `containerType` is
  `application | datastore` (default application).
- `component`: requires `parentId` of a container and `technology`.
- `code`: requires `parentId` of a component or code element, `symbolKind` from
  `class | interface | function | type | enum | table | module`, and optional `members` with name, signature
  and visibility. All members are text, not executable code.
- `deploymentNode`: requires `environment` and `technology`; optional parent is a deployment node in the same
  environment. `infrastructureNode` requires a deployment-node parent and technology.
- `instance`: requires `instanceOf` referencing a system or container, `parentId` referencing a deployment
  node, and `environment`. Two replicas are two instance IDs, not the same node repeated twice.

`Diagram` is a discriminated union with the base fields and these constraints:

| `kind`       | Additional fields and semantic checks                                                                                                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `landscape`  | No required scope; person/system members                                                                                                                                                                                               |
| `context`    | `scopeId` references a system present in `nodes`; person/system members                                                                                                                                                                |
| `container`  | `scopeId` references a system; its containers plus external persons/systems/containers as supporting members                                                                                                                           |
| `component`  | `scopeId` references a container; its components plus supporting external elements                                                                                                                                                     |
| `code`       | `scopeId` references a component; code members within it plus explicitly tagged external symbols                                                                                                                                       |
| `dynamic`    | `scenario: Step`; optional `scopeId`; participating systems/containers/components/persons. Edges are static relations used by the scenario                                                                                             |
| `deployment` | `environment: string`; nodes are deployment/infrastructure nodes and instances in that environment. Edges have instance/infrastructure endpoints; optional `modelRelationshipId` on those relationships ties them to the logical model |

`Step` is recursive: `{kind:"sequence", id, children: Step[]}`, `{kind:"parallel", id, branches: Step[]}` or
`{kind:"interaction", id, relationshipId, direction:"forward"|"reverse", label}`. Step IDs are unique within
their diagram. Sequence array order is meaningful; parallel branches have no invented total order. Repeated
calls reuse a model relationship with distinct interaction IDs. An explicit reverse interaction represents a
response, not a permanently bidirectional relationship. A communication-style renderer with numbered
interactions satisfies v1; a UML sequence renderer can be added later through the same scene port.
[C4 dynamic diagrams](https://c4model.com/diagrams/dynamic).

Deployment nesting and instances are necessary semantics, not just boxes labelled “server”. Selecting an
instance can link to the logical container's component diagram while retaining the instance breadcrumb.
Infrastructure edges do not have to invent corresponding logical dependencies.
[C4 deployment diagrams](https://c4model.com/diagrams/deployment).

### 3.2 Validation pipeline and evolution

1. Load a catalog-selected resource or a caller-provided object. Bound bytes before parsing when fetching;
   initial defaults: 5 MiB/bundle, 5,000 model elements, 10,000 relationships, 200 diagrams, nesting depth 32.
   These are proposed guardrails, not benchmarked limits. Allow host configuration with explicit ceilings.
2. Validate strict Zod shape: supported version, enum fields, finite numbers, bounded strings/arrays, URL
   schemes and required fields. Reject unknown core keys; reserve a JSON-only `extensions` namespace only if
   an actual extension requires it in a later schema revision.
3. Pure semantic validation builds indexes and checks missing/duplicate references, parent cycles, legal
   containment, diagram scopes, visible edge endpoints, group membership, instance environment, step
   references and navigation targets. `detail` targets must identify the corresponding next scope, not an
   unrelated diagram. Canonical diagram parents form a forest. Cyclic related links are legal.
4. Return structured diagnostics `{code, path, severity, message}`. Structural/reference errors reject the
   bundle; C4 clarity warnings (missing protocol, incomplete legend, overly large view) remain visible. The
   milestone gate treats its configured C4 warnings as failures. Never silently drop invalid nodes.
5. Build immutable indexes and scene inputs only after success. An invalid replacement leaves the last valid
   dataset visible with a clear error, never a partially mixed model.

Container/component scope checks allow external supporting elements but do not treat all arbitrary level
mixing as valid. The conversion review must label intentional external abstractions. Every rendered edge must
have both endpoints in the view; v1 does not automatically invent ancestor-to-ancestor edges.

Group members occur in at most one direct group per diagram. Parent groups contain child groups and form a
tree; they do not create duplicate model nodes. Manual layout requires positions for every member; auto mode
initially rejects partial fixed-position constraints instead of silently ignoring them.

Zod shape validation and semantic validation are separate. Exported JSON Schema helps editors validate shape,
but cannot replace cross-reference checks. Unknown major versions are rejected with an upgrade message; later
versions need explicit pure migrations and fixture tests, never a best-effort cast.
[Zod JSON Schema support](https://zod.dev/json-schema).

### 3.3 Worked JSON: FFI context with a valid detail destination

This is a complete illustrative bundle under the proposed schema, not generated product code. It maps the
seven elements and six numbered relationships from the FFI context source and adds a deliberately small
container detail view so the drill-down target resolves. The milestone conversion must include the complete
source container/component views, not stop at this example. Statuses make source descriptions of future
additions explicit. The STE text is a draft, not a compliance certification.

```json
{
  "schemaVersion": 1,
  "id": "tsdb-ffi-proposal",
  "title": "Document DB: proposed FFI execution",
  "revision": "ffi-context-bc1a1b5-example-1",
  "defaultDiagramId": "ffi-context",
  "sources": [
    {
      "id": "ffi-context-source",
      "title": "FFI System Context proposal",
      "url": "https://github.com/nickstrad/ts-db/blob/bc1a1b55e368a730fc1d8300e14cae566d246a31/docs/plans/ffi/c4-context-ffi.github.md",
      "revision": "bc1a1b55e368a730fc1d8300e14cae566d246a31"
    }
  ],
  "documents": [
    {
      "id": "context-explanation",
      "title": "What this proposal changes",
      "plain": "The existing API and registry remain. The proposal adds isolated statement lanes and placement metadata. WAL shipping is a later phase.",
      "ste": {
        "text": "The API receives a request. The registry identifies the tenant. The proposed lane executes the statement. This design is not installed.",
        "issue": "ASD-STE100 Issue 9",
        "reviewStatus": "draft"
      },
      "sourceIds": ["ffi-context-source"]
    },
    {
      "id": "platform-explanation",
      "title": "Statement execution",
      "plain": "The proposed Deno child processes load libsqlite3 through FFI. Long statements use nonblocking calls and an interrupt path. The existing DuckDB child continues to serve event-log analysis.",
      "ste": {
        "text": "The proposed lane loads the SQLite library. A separate thread executes a long statement. The deadline monitor can stop the statement.",
        "issue": "ASD-STE100 Issue 9",
        "reviewStatus": "draft"
      }
    }
  ],
  "model": {
    "elements": [
      {
        "id": "developer",
        "kind": "person",
        "name": "App developer",
        "description": "Defines schemas and named handlers.",
        "status": "existing"
      },
      {
        "id": "caller",
        "kind": "person",
        "name": "Application caller",
        "description": "Calls the authenticated document API.",
        "status": "existing"
      },
      {
        "id": "operator",
        "kind": "person",
        "name": "Platform operator",
        "description": "Manages tenants and backups.",
        "status": "existing"
      },
      {
        "id": "platform",
        "kind": "softwareSystem",
        "name": "Document DB platform",
        "description": "Serves document requests and event-log analysis.",
        "status": "mixed",
        "plannedNotes": ["Statement lanes use Deno FFI to libsqlite3."],
        "docIds": ["platform-explanation"]
      },
      {
        "id": "registry",
        "kind": "softwareSystem",
        "name": "Central registry and placement",
        "description": "Stores tenants, credentials and sessions.",
        "status": "mixed",
        "technology": "Postgres",
        "plannedNotes": ["Add tenant placement, leases and epochs."]
      },
      {
        "id": "objects",
        "kind": "softwareSystem",
        "name": "Object storage",
        "description": "Stores immutable snapshots and manifests.",
        "status": "mixed",
        "tags": ["external"],
        "plannedNotes": ["Store WAL frames in phase two."]
      },
      {
        "id": "analytics",
        "kind": "softwareSystem",
        "name": "Analytics consumer",
        "description": "Reads named results or derived event-log data.",
        "status": "existing",
        "tags": ["external"]
      },
      {
        "id": "api",
        "kind": "container",
        "parentId": "platform",
        "name": "API process",
        "description": "Authenticates and routes requests.",
        "technology": "Deno",
        "status": "mixed",
        "plannedNotes": ["Route to statement lanes and supervise them."]
      },
      {
        "id": "lanes",
        "kind": "container",
        "parentId": "platform",
        "name": "Statement lane",
        "description": "Executes SQLite statements with resource limits.",
        "technology": "Deno child process and FFI",
        "status": "planned"
      },
      {
        "id": "reader",
        "kind": "container",
        "parentId": "platform",
        "name": "Reader process",
        "description": "Ingests and queries the event log.",
        "technology": "Deno and DuckDB",
        "status": "existing"
      }
    ],
    "relationships": [
      {
        "id": "r1",
        "sourceId": "developer",
        "targetId": "platform",
        "label": "Provides schemas and named handlers",
        "technology": "TypeScript",
        "status": "existing"
      },
      {
        "id": "r2",
        "sourceId": "caller",
        "targetId": "platform",
        "label": "Sends authenticated document requests",
        "technology": "HTTP JSON; bearer; X-Trace-Id",
        "status": "mixed",
        "plannedNotes": ["The receiving node can forward to the owner."]
      },
      {
        "id": "r3",
        "sourceId": "operator",
        "targetId": "platform",
        "label": "Manages tenants and backups",
        "technology": "Admin HTTP / CLI",
        "status": "mixed",
        "plannedNotes": ["Add placement-move operations."]
      },
      {
        "id": "r4",
        "sourceId": "platform",
        "targetId": "registry",
        "label": "Reads tenant and authentication data",
        "technology": "Postgres protocol",
        "status": "mixed",
        "plannedNotes": ["Look up placement and renew leases."]
      },
      {
        "id": "r5",
        "sourceId": "platform",
        "targetId": "objects",
        "label": "Publishes snapshots and manifests",
        "technology": "S3 HTTPS or local files",
        "status": "mixed",
        "plannedNotes": ["Publish WAL frames in phase two."]
      },
      {
        "id": "r6",
        "sourceId": "platform",
        "targetId": "analytics",
        "label": "Provides query results and derived event-log rows",
        "status": "existing"
      },
      {
        "id": "lane-ipc",
        "sourceId": "api",
        "targetId": "lanes",
        "label": "Dispatches statements and cancellation",
        "technology": "JSON-lines IPC",
        "status": "planned"
      },
      {
        "id": "reader-ipc",
        "sourceId": "api",
        "targetId": "reader",
        "label": "Requests ingest and named analysis",
        "technology": "JSON-lines IPC",
        "status": "existing"
      }
    ]
  },
  "diagrams": [
    {
      "id": "ffi-context",
      "kind": "context",
      "title": "System Context: proposed FFI execution",
      "status": "mixed",
      "scopeId": "platform",
      "nodes": [
        { "elementId": "developer" },
        { "elementId": "caller" },
        { "elementId": "operator" },
        { "elementId": "platform", "detail": { "diagramId": "ffi-containers" } },
        { "elementId": "registry" },
        { "elementId": "objects" },
        { "elementId": "analytics" }
      ],
      "edges": [
        { "relationshipId": "r1", "displayNumber": 1 },
        { "relationshipId": "r2", "displayNumber": 2 },
        { "relationshipId": "r3", "displayNumber": 3 },
        { "relationshipId": "r4", "displayNumber": 4 },
        { "relationshipId": "r5", "displayNumber": 5 },
        { "relationshipId": "r6", "displayNumber": 6 }
      ],
      "groups": [
        {
          "id": "platform-boundary",
          "label": "Document DB platform organisation",
          "memberIds": ["platform", "registry"],
          "status": "existing"
        }
      ],
      "docIds": ["context-explanation"],
      "sourceIds": ["ffi-context-source"],
      "layout": { "mode": "auto", "direction": "TB" },
      "legend": {
        "title": "Diagram key",
        "entries": [
          {
            "id": "people",
            "label": "Person",
            "description": "A user or operator role.",
            "swatch": { "shape": "person", "tone": "default", "stroke": "solid" }
          },
          {
            "id": "systems",
            "label": "System",
            "description": "A software system.",
            "swatch": { "shape": "box", "tone": "default", "stroke": "solid" }
          },
          {
            "id": "external",
            "label": "External system",
            "description": "A system outside the platform boundary.",
            "swatch": { "shape": "box", "tone": "external", "stroke": "solid" }
          },
          {
            "id": "boundary",
            "label": "Organisation boundary",
            "description": "Groups systems managed together.",
            "swatch": { "shape": "boundary", "tone": "muted", "stroke": "solid" }
          },
          {
            "id": "mixed",
            "label": "Existing with planned changes",
            "description": "Solid element plus an explicit planned-change note.",
            "swatch": { "shape": "box", "tone": "accent", "stroke": "solid" }
          },
          {
            "id": "relationship",
            "label": "Directed relationship",
            "description": "The label states the operation and protocol; mixed links include a planned-change note.",
            "swatch": { "shape": "line", "tone": "default", "stroke": "solid", "arrow": "forward" }
          }
        ]
      }
    },
    {
      "id": "ffi-containers",
      "kind": "container",
      "title": "Container: abbreviated FFI detail example",
      "status": "mixed",
      "scopeId": "platform",
      "parent": { "diagramId": "ffi-context", "elementId": "platform" },
      "nodes": [{ "elementId": "api" }, { "elementId": "lanes" }, { "elementId": "reader" }],
      "edges": [{ "relationshipId": "lane-ipc" }, { "relationshipId": "reader-ipc" }],
      "docIds": ["platform-explanation"],
      "legend": {
        "title": "Status and notation",
        "entries": [
          {
            "id": "container",
            "label": "Container",
            "description": "A running application or data store.",
            "swatch": { "shape": "box", "tone": "default", "stroke": "solid" }
          },
          {
            "id": "mixed",
            "label": "Existing with planned changes",
            "description": "Current process with explicitly listed additions.",
            "swatch": { "shape": "box", "tone": "accent", "stroke": "solid" }
          },
          {
            "id": "planned",
            "label": "Planned container",
            "description": "Not implemented; dashed outline and planned label.",
            "swatch": { "shape": "box", "tone": "default", "stroke": "dashed" }
          },
          {
            "id": "link",
            "label": "Existing relationship",
            "description": "Directed, labelled communication.",
            "swatch": { "shape": "line", "tone": "default", "stroke": "solid", "arrow": "forward" }
          },
          {
            "id": "planned-link",
            "label": "Planned relationship",
            "description": "Proposed communication; dashed line and planned label.",
            "swatch": { "shape": "line", "tone": "default", "stroke": "dashed", "arrow": "forward" }
          }
        ]
      }
    }
  ]
}
```

This example intentionally treats the registry and Document DB as two systems inside an organisation boundary,
following the source context's abstraction. It does not claim that a runtime Postgres process is a second
logical system in every other view. The full conversion records such abstraction choices.

## 4. Mandatory view, hook and container architecture

### Domain logic is independent of React

Business logic here means the rules of the architecture model: valid containment and references, C4 scope,
semantic status, navigation transitions, diagram membership, legend coverage, documentation selection and
interaction ordering. Put these in `src/lib/c4/domain/` as pure TypeScript functions over immutable values.
They must import no React, router, Zod, Effect, React Flow, browser globals, filesystem, network or clock.
Domain errors are typed data, not UI toasts or thrown framework objects. Test the domain in a Node process
without jsdom. Inject timestamps, IDs or dimensions as values whenever a calculation needs them.

Framework logic is subscription, React state, fetching, DOM measurement, focus, worker lifecycle and drawing.
Hooks translate events to domain commands and apply returned state/effect descriptions. Pure reducers must
not hide calls to `fetch`, `history`, `Date.now` or mutable singleton stores. The hook is an interpreter for
those descriptions; it is not the home of the business rules. Zod decodes unknown input at `schema/`, then
passes domain values to semantic validators. Keep the domain's interfaces authoritative and compile-check
Zod output compatibility so the two cannot quietly diverge.

Example domain signatures (design contracts, not new source files):

```ts
validateArchitecture(bundle: ArchitectureBundle): Diagnostic[]
resolveDetail(model: ModelIndex, route: Route, elementId: Id): Result<Target, NavigationError>
transitionNavigation(state: NavigationState, command: NavigationCommand, index: ModelIndex): Transition
projectDiagram(index: ModelIndex, diagramId: Id): Result<Scene, Diagnostic[]>
selectDocumentation(index: ModelIndex, selection: Selection): DocumentSelection
applyLayout(scene: Scene, geometry: LayoutResult): Result<Scene, LayoutError>
```

`Transition` contains the next value plus explicit requests such as `pushRoute`, `replaceRoute` or
`restoreFocus`. A hook calls the route/focus ports after accepting the transition. Browser history remains
the source of route truth; the reducer has no independent hidden browser stack. Unit tests cover concrete
commands and failures; fast-check generates valid and adversarial model/command sequences. Hook tests
exercise adapters and cleanup, not a second implementation of these domain rules.

Views receive complete presentation props and callbacks. They contain no fetching, context access,
state/effect hooks, route parsing, graph traversal, validation, layout, selection decisions or status
classification. Declarative iteration and displaying supplied values are presentation, not domain logic. Do
not hide event semantics in a node's `onClick`; pass the final callback from its hook/adapter.

Hooks bind pure functions to React, effects and injected ports. Containers only call their hook and compose
views. Dependency rules enforce that `views/` cannot import `hooks/`, `domain/navigation`, app code or router
APIs. Third-party React Flow internals are isolated behind an adapter container; they do not justify stateful
first-party views.

| Area           | Props-only views                                                                                | Containers and hooks                                                                                   | Pure functions                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Diagram        | `DiagramView`, `NodeView`, `BoundaryView`, `RelationshipView`, `CodeSymbolView`, `InstanceView` | `DiagramContainer`, seven typed wrappers; `useDiagramRenderer`, `useMeasuredNodes`, `useDiagramLayout` | `projectDiagram`, `buildScene`, `toLayoutGraph`, `applyLayout`, `resolvePresentation`  |
| Canvas adapter | Views above supplied as node/edge slots                                                         | `FlowCanvasContainer`, `FlowNodeContainer`; `useFlowCanvas`, `useFlowNodeProps`                        | `toFlowNodes`, `toFlowEdges`, coordinate conversion                                    |
| Navigation     | `NavigationView`, `BreadcrumbView`, `DetailLinkView`                                            | `NavigationContainer`; `useViewerController`, `useNavigation`, `useRouteSync`                          | `parseRoute`, `formatRoute`, `navigationReducer`, `resolveTarget`, `selectBreadcrumbs` |
| Documentation  | `DocumentationView`, `SourceListView`, `StatusView`                                             | `DocumentationContainer`; `useDocumentation`                                                           | `selectDocuments`, `resolveTerms`, safe text/Markdown preparation                      |
| Legend         | `Legend`, `LegendEntryView`, `LegendSwatchView`                                                 | Optional `LegendContainer`; `useLegend`                                                                | `resolveLegend`, `validateLegendCoverage`                                              |
| Dynamic        | `StepListView`, `StepControlsView`                                                              | `DynamicControlsContainer`; `useDynamicSteps`                                                          | `flattenScenario`, `selectActiveInteractions`, step-transition reducer                 |
| Loading/errors | `LoadingView`, `DiagnosticView`, `EmptyView`                                                    | Viewer provider/app loader; `useArchitectureBundle`                                                    | normalisation, indexes, validation and diagnostics                                     |

Concrete composition (API sketch in the plan, not a code scaffold):

```tsx
function DiagramContainer() {
  const { viewProps, canvasProps } = useDiagramRenderer();
  return <DiagramView {...viewProps} canvas={<FlowCanvasContainer {...canvasProps} />} />;
}

function DiagramView({ title, statusText, canvas, descriptionSlot }: DiagramViewProps) {
  return (
    <section aria-label={title}>
      <h1>{title}</h1>
      <p>{statusText}</p>
      {canvas}
      {descriptionSlot}
    </section>
  );
}

function NavigationContainer() {
  const props = useNavigation();
  return <NavigationView {...props} />;
}

function NavigationView({ crumbs, onBack, onUp, canBack, canUp }: NavigationViewProps) {
  return (
    <nav aria-label="Diagram navigation">
      <button onClick={onBack} disabled={!canBack}>Back</button>
      <button onClick={onUp} disabled={!canUp}>Up one diagram</button>
      <BreadcrumbView items={crumbs} />
    </nav>
  );
}
```

One `ArchitectureProvider` calls `useViewerController` once. Both hooks above consume that same controller;
they must not independently create navigation state. `useDiagramRenderer` selects the validated view, requests
layout, derives status labels and supplies callbacks through the canvas adapter. `useNavigation` derives
breadcrumbs and Back/Up actions from the same route and model indexes. Reducers/selectors contain the
navigation rules; hooks handle subscriptions, focus and effect cleanup.

The public API supports `<ArchitectureViewer bundle={validatedBundle} ... />` and lower-level composition with
a provider, diagram, legend, docs and navigation containers. Each named diagram wrapper verifies its expected
`kind` and shares the projection pipeline. Users can replace presentational slots without reimplementing
validation or navigation. They can instantiate `Legend` independently with their own props.

## 5. Navigation and drill-down

Use route state as the authority for the selected dataset, diagram, element and step. Avoid a private
navigation stack that disagrees with browser Back. Pure domain functions accept route values and return transition descriptions; hooks use an injected
route port. The reference app can implement that port with React Router. Hash routing is the initial static-host default:

```text
/ts-db/#/architectures/tsdb-current/diagrams/context
/ts-db/#/architectures/tsdb-ffi-proposal/diagrams/ffi-context/elements/platform
/ts-db/#/architectures/tsdb-ffi-proposal/diagrams/ffi-cancel?step=interrupt
```

IDs are encoded and decoded through one pure route codec. Hosts can select browser-path routing with the same
logical paths if they provide SPA rewrites. Respect Vite's configured base URL. Reloading a deep link loads
the bundle before resolving IDs; a missing diagram shows Not Found, and an element not in that diagram shows a
diagnostic with a link to the diagram, never silently selecting an unrelated node.

Interaction rules:

- Clicking a node with a single `detail` target follows that target. Clicking a node without one selects it
  and opens its explanation. Every node also has an explicit Inspect action, so linked elements still expose
  their own documentation without forcing drill-down. All actions work by keyboard.
- A detail link normally follows context → container → component → code. Supporting views use labelled Related
  links. A system can have several container views; only one is the default detail, the rest are named
  choices. The framework never guesses a child by display name.
- Canonical breadcrumbs come from `parent`, so they work on a direct URL. `Up` navigates to that parent and
  selects its `elementId`. `Back` follows actual browser history within the viewer; if there is no viewer
  history entry, fall back to Up, then the dataset root. Do not send a new visitor off-site.
- Cross-links may produce a different Back path from the canonical breadcrumb trail. This is intentional.
  Nested deployment nodes expand/collapse inside a view; that gesture is not a level change.
- A click on the empty canvas clears selection; an explicit Up button leaves the diagram. Panning and zooming
  the viewport never change the architecture level. Escape closes a transient panel first.
- Preserve viewport/focus per dataset revision and diagram in session state. Do not put every pan event in
  browser history. Restore focus to the drilled-from element on Up and announce the new diagram title.
- A dynamic-step selection is deep-linkable. Playback, if later added, uses `replace`, not hundreds of history
  entries. Parallel interactions can be active together. Reduced-motion mode disables transitions.

Load/layout races use request generations and abort signals. Navigation to B while A is loading must not allow
A's late response or layout to overwrite B. Unmount cancels subscriptions and releases workers.
[React Router route composition](https://reactrouter.com/start/declarative/routing).

## 6. Rendering, layout and accessibility

Choose React Flow for viewport controls, interactive nodes/edges and keyboard foundations; custom views render
the C4-specific content. Disable editing, connection creation and persistence of drag positions in v1. The
internal scene is framework-independent so React Flow is an adapter, not the JSON schema.
[Custom nodes](https://reactflow.dev/learn/customization/custom-nodes),
[accessibility facilities](https://reactflow.dev/learn/advanced-use/accessibility).

Use ELK layered layout in a Web Worker for compound boundaries, directed edges and labels. React Flow is not
itself an automatic layout engine. Sort inputs by stable IDs, pin engine/options, pass measured node sizes,
and cache by bundle revision, diagram ID, sizes and layout settings. Determinism is a tested property for
pinned versions, not a promise across all ELK releases.
[React Flow layout choices](https://reactflow.dev/learn/layouting/layouting),
[ELK JavaScript implementation](https://github.com/kieler/elkjs).

Measurement runs in a hook using a bounded two-pass strategy: provisional sizes, then one stable relayout
after fonts and node dimensions settle. Prevent resize/layout feedback loops. The worker adapter owns
timeouts/restarts; discarding stale results alone does not stop worker CPU consumption. Validate finite
geometry and group containment before publication. On failure, preserve the last valid scene or show an error
with an accessible element/relationship list; do not fabricate an apparently correct arrangement.

C4 boundaries are compound layout groups, separate from diagram navigation. React Flow parent-relative
coordinates must be translated by pure adapter functions and tested for nested groups and cross-boundary
edges. Dynamic diagrams use the same spatial graph with numbered interaction overlays and an ordered text
panel. Code symbols show selected member compartments. Deployment nodes contain instance cards and
infrastructure nodes. [React Flow nesting](https://reactflow.dev/learn/layouting/sub-flows).

Initial supported-view target: 200 visible nodes and 400 edges, with larger models split into views. Proposed
performance gate on a recorded reference machine: layout completes within 2 seconds for that fixture and
selection does not cause a relayout. Measure production builds; tune the gate after the layout spike instead
of making untested claims. Show progress and retain cancellation when loading large data.

Every view has a title, explicit element types, relationship labels and visible status text. Planned
elements/edges are dashed and labelled “planned”; mixed elements show planned-change notes. Colour alone never
communicates status. Supply a tabular/text alternative that exposes the same links and descriptions, visible
focus, generous hit targets and diagram-title announcements. On narrow screens, docs use a shadcn Sheet rather
than crushing the canvas. Verify desktop and mobile layouts, 200% zoom, keyboard-only use, screen-reader
names, high contrast and reduced motion. Automated accessibility checks supplement manual keyboard and
screenshot review.

## 7. Legend and documentation primitives

### Legend

`Legend` takes `{title, entries, compact?}` and renders provided swatches, labels and explanations. It does
not inspect a global store or infer a project's meaning from colours. `useLegend` can resolve a diagram's JSON
into those props. Hosts can render it beside the canvas or in a panel; it remains available without selecting
a node.

A default preset covers C4 shapes, relationship arrows and lifecycle status. Each diagram explicitly
instantiates its key and can add project-specific entries such as “read-only connection” or “FFI call”. Use
the same swatch renderer and theme tokens as nodes/edges so a legend cannot drift from the canvas. V1 limits
swatches to the enumerated safe shapes/tokens; arbitrary SVG/HTML strings are not accepted. Semantic
validation checks that every used non-default notation is explained. The milestone must resolve coverage
warnings. C4 is notation-independent but explicitly recommends a key for each diagram; its open choice of
notation is precisely why this is a primitive.
[C4 notation and legends](https://c4model.com/diagrams/notation).

### STE100 and plain explanations

Each diagram and each element can reference multiple documents. Display diagram documentation initially;
inspection selects element-specific documentation while retaining the diagram's title and context. Tabs select
Plain explanation or STE100 text. An element without documentation displays an honest empty state and its
short description, not generated prose. The generic library permits missing docs; the milestone requires both
forms for every converted diagram and element, including planned ones.

STE is controlled vocabulary plus writing rules, not just short sentences. Store the issue and human review
status with each text; for `reviewed`, require reviewer and date. Maintain a project glossary of technical
nouns/verbs under `content/`, including C4, lane, FFI, tenant, WAL and interrupt. Schema validation checks
metadata and references; it cannot certify language compliance. Add authoring checks for sentence length and
terminology as advisory diagnostics, followed by human review against the chosen standard. Never label a draft
as certified. Use the current official Issue 9 material as the authoring reference, and preserve its licensing
instead of bundling the whole dictionary into the SDK.
[ASD explanation of STE](https://www.asd-ste100.org/about_STE.html),
[official standard downloads](https://www.asd-ste100.org/STE_downloads.html).

Document bodies are Markdown strings stored inside JSON, with a small supported subset: paragraphs, headings,
lists, inline code and safe links. No MDX, raw HTML, embedded scripts or remote images in v1. Choose a
Markdown renderer with HTML disabled and explicit link-scheme filtering; loading architecture JSON must never
execute content. Inline prose in the JSON keeps the runtime bundle self-contained; authors may use a later
build-time content packer without changing the runtime contract.

## 8. Existing stack and added libraries

Preserve the existing Vite/React/TypeScript/Tailwind/shadcn setup and root lockfile. The scaffold already
includes Zod, Effect and fast-check. Being installed does not mean a dependency belongs in the pure domain.
New dependencies are added only by an implementation slice that needs them, with its manifest/lockfile
ownership claimed. Verify compatible versions against the scaffold rather than importing ts-db pins.

| Choice | Implementation decision | Boundary |
| --- | --- | --- |
| React, TypeScript, Vite | Retain; SDK source, generic viewer and demo builds | No React types or browser globals in pure domain rules |
| Tailwind and shadcn/ui | Retain; shell and accessible controls | No app aliases/global CSS inside SDK contracts |
| Zod | Use for decoding unknown JSON and exporting editor schema | Explicit domain types and pure semantic validation remain separate |
| Effect | Already installed; not required in the initial domain or public SDK API | Start with AbortController and injected ports for browser effects; use Effect in an adapter only if lifecycle/retry complexity justifies it, never to hide business rules in hooks |
| fast-check | Required for logic properties from the first slice | Generators for valid and invalid graphs/commands; seeds and replay paths retained |
| React Flow | Add behind canvas adapter when interaction requires it | Disable editing; its state/types do not define JSON or domain identity |
| ELK | Add in the compound-layout slice as a worker-backed port | Deterministic adapter input, timeout, stale-result protection; no layout engine imports in domain |
| Router | Use React Router at the application/adapter boundary if it earns its place over the small route port | Hash routing remains Pages default; pure route codec and reducer are independent |
| Vitest, Testing Library | Add unit/property/hook runners in the first slice | Domain tests run without React/jsdom; hooks get separate integration tests |
| Playwright, axe-core | Add immediately and use throughout every slice | Real browser workflows and screenshots; automation does not replace visual/keyboard review |
| react-markdown or equivalent | Add for constrained documentation rendering | No raw HTML, MDX or unsafe links; presentation cannot execute JSON content |
| Global state store, D3, animation library | Not needed initially | One controller plus pure reducers; native/CSS reduced-motion-aware transitions |

Sources: [Vite builds](https://vite.dev/guide/build),
[shadcn Vite setup](https://ui.shadcn.com/docs/installation/vite),
[Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite),
[fast-check](https://fast-check.dev/docs/introduction/), [Vitest](https://vitest.dev/guide/),
[react-markdown](https://github.com/remarkjs/react-markdown),
[Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).

## 9. Showcase and consumer milestones

### Milestone A: Cursor “Git at any scale” showcase

The post was fetched and read on 2026-10-12, before planning the demo. Source:
[Vicent Martí, Git at any scale, Cursor, 2026-08-18](https://cursor.com/blog/git-at-any-scale).

The article describes Continuity behind Origin: ordinary local Git repositories act as caches; S3 holds
WAL entries and an index. Upload alone does not publish a push: index publication is coordinated by CAS.
Rendezvous hashing favours likely hosts. Gossip accelerates replica updates, while conditional index reads
check freshness before serving. Cold copies can be rebuilt; compaction results are shared through storage.
These are the article's architectural claims, not independently verified implementation facts.

The demo models that system, not Cursor's editor or the SDK itself. Its planned views are context,
containers, an illustrative component decomposition, deployment and dynamic push/read/compaction stories.
Use article-grounded labels for clients, the hosting system, storage and local copies. Distinguish durable
state from disposable state, the publication boundary from data transfer, and correctness checks from
optimisations. Do not infer real process boundaries, node counts, implementation language or source types
from a conceptual article. Link every architectural claim to its source section.

Build `demos/git-at-any-scale/` as a small Vite project importing the source SDK. Store diagrams as runtime
JSON in its public directory and both STE100 and plain text in bundle documents. Keep the glossary,
source-to-ID inventory, reading/review notes and copyright attribution in its `content/` directory. Author
original explanations and diagrams; do not copy the article or its interactive assets. Do not present our
illustrative deployment as the company's actual production map.

Content development happens alongside slices: start with a small context diagram, add real drill-down,
then enrich relationships and scenarios as those features work. Tag each diagram/document with evidence
status in provenance notes: documented, inferred decomposition, or illustrative. Source changes should be
reviewable without changing SDK components. The demo must load through the same validation and navigation
paths as other consumers. A concise README gives launch/build commands, a guided reading path, source and
review dates, and the distinction between the model and a running simulation.

Use the demo to test authoring and navigation quality: a newcomer can open the architecture, inspect the
key, read a diagram/element write-up, follow a detail link, step through a scenario, and return via a copied
URL. No simulator, cloud account, Git server or live data access is needed. A separate generic or ts-db
source-grounded code fixture proves the seventh-type support; do not invent Cursor code internals merely
to fill a code-level screen. Unit/property tests cover the model and navigation invariants; Playwright
covers those reading journeys from the first useful screen, with screenshots reviewed at desktop/mobile
sizes and STE draft/reviewed status visible.

### Milestone B: ts-db Pages consumer and source fidelity

Pin content to these inspected source snapshots; branches are not interchangeable with landed behavior:

| Dataset/source | Revision                                                                  | Conversion scope                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Current ts-db  | `e808983cefcabe9ba1fe28ce7ea54fb6725a7e0c` (`main`)                       | Four diagram pairs: context, platform containers, observability containers, server components; root usage docs and relevant implementation files |
| FFI diagrams   | `bc1a1b55e368a730fc1d8300e14cae566d246a31` (`docs/ffi-c4`)                | Three pairs under `docs/plans/ffi/`: context, containers, lane components; README's four flows                                                   |
| FFI rationale  | `d97bcf8f145e94279b882665c70412eabdaba775` (`research/fable-lang-switch`) | `docs/architecture/lang-switch-fable.md`; explanation of nonblocking FFI, cancellation, process lanes and the limits of its measurements         |

Do not merge these branches merely to read their content. Use commit-pinned source links and a conversion
inventory with source node/edge number → JSON ID → documentation IDs. Compare Mermaid and terminal versions
and their prose; discrepancies become explicit review notes. For current architecture, verify against the
pinned implementation, particularly document reads bypassing the DuckDB child. For proposed architecture, keep
“planned” on lanes, placement, FFI and WAL shipping; retain phase-two distinctions.

The FFI source combines abstraction levels in places. A shared library is not an independently running C4
container: represent libsqlite3 as an implementation dependency/component detail of a lane, or an explicitly
labelled supporting element, with a conversion note. Its existing logger implementation does not imply an
existing deployed lane logger. Record planned instantiation separately from code reuse. Preserve all
relationships through the mapping inventory, even if they move to a more appropriate detail view.

Source timing claims are historical observations, not guarantees. Put measured numbers and host/version
context in documentation with provenance, not permanent node labels. The source's synchronous “bounded
statement” classification must be presented as a proposal; a point lookup does not by itself prove a hard
wall-clock limit under I/O stalls. Neither a diagram nor an STE rewrite should strengthen those claims.

Beyond the seven existing source diagrams, create the missing type examples deliberately:

- A landscape view of the modelled people/systems, without inventing new running systems.
- A code view of current `platform/document_reader.ts` functions under its owning component, source-linked.
- Dynamic views for the FFI point read, deadline/interrupt, forwarded mutation, and kill/restart flows.
  Branching failure paths are separate named scenarios or explicitly parallel/sequence steps, not fake
  measurements or a claim that both outcomes occur.
- One illustrative FFI deployment with two data nodes and lane instances, marked proposed/illustrative; it is
  not a claim about the actual droplet topology.

The Cursor showcase is the independent project; retain small generic fixtures for conformance. The ts-db consumer milestone is complete when all seven types render,
current and proposed datasets have complete mapping inventories and both documentation modes,
context-to-detail navigation works through available levels, and links to alternate views are discoverable. Do
not fabricate code-level FFI classes to manufacture a fourth drill-down level for unbuilt code.

## 10. Vertical implementation slices

This is an actionable implementation plan for c4-sdk, but this update authorises documentation work only.
The coordinator begins the next agreed slice in a later build session. Each slice adds a usable capability
through JSON/domain logic, hooks, views, demo content and tests as needed. Do not build all models, then all
hooks, then all screens. Thin cross-cutting setup is included in the first working screen.

### Dispatch and ownership protocol

Port ts-db's brief → build → independent review → land protocol, with its agent-work records and isolated
worktrees, rather than copying its old model restrictions. Follow this repo's `AGENTS.md`:

1. Coordinator creates `agent-work/items/<id>/{brief,claims,review}.md`, listing prerequisites, acceptance,
   builder/reviewer, exact Owns/Reads paths and permitted concurrent peers. Record branch/base SHA/worktree
   in `agent-work/COORDINATION.md`. Assign one owner to each shared file before dispatch.
2. Builder works on `item/c4-NN-slug` in its own worktree, for example `/tmp/c4-sdk-work/c4-NN-slug`.
   It edits only Owns paths; discovery of a shared contract change returns to the coordinator for a claim
   change and serialization. Worktrees isolate checkouts, not conflicting changes to the same file.
3. Each vertical item includes its meaningful tests and a logical commit. Independent reviewer inspects
   the exact commit against acceptance and ownership and returns PASS/NITS/FAIL. Fix and re-review NITS/FAIL.
4. Only coordinator integrates approved commits, in the batch order below, when landing is authorized.
   Rebase onto the latest landed prerequisite; rerun affected checks on the combined tree. Semantic conflict
   resolution requires review of the resulting commit, not reuse of a pre-conflict PASS.
5. Coordinator alone updates shared STATE, coordination board and knowledge index. Builders return knowledge
   notes in their own task records; coordinator reconciles them at integration. Poll events/status during
   concurrent work and maintain the agreed stopping point. An event or review never grants merge authority.

**Sol (`gpt-6.1-sol`) is the default builder and reviewer.** Use Astra (`gpt-6-astra`) only when the brief
explains a particularly difficult problem; C4-04 qualifies because compound coordinates, asynchronous
measurement and worker cancellation interact. Luna (`gpt-6-luna`, high effort) handles well-defined,
tightly scoped work, including C4-08a below. Luna may build tightly scoped production work. Work is regular agent-work or sq-* side quests only. Equivalent
family labels are Sonnet, Opus 5.5 and Haiku ≥5.5 respectively. Every reviewer is independent of its builder;
C4-04 has an Astra reviewer. Escalate other reviews only for a concrete difficult finding.

Each item brief expands the table's path families into exact claims. Most items are vertical slices;
C4-08a and C4-09a are bounded nonvisual prerequisites with direct validation. They exist because their
outputs are independently useful, not to separate all business logic from its UI implementation.

| Slice / builder | User-visible increment and scope | Unit and fast-check evidence | Browser or other acceptance evidence |
| --- | --- | --- | --- |
| C4-01 — open a JSON context, Sol/Sonnet | From the existing scaffold, add minimal source SDK boundary, runtime schema decoder, pure indexes/diagnostics, a fixed-layout context view, legend and short Plain/STE write-up. Load a small Cursor context from `demos/git-at-any-scale/`. Own exact files in domain/schema/ports/react plus demo entry and test configs; add test scripts and initial copy-consumer test discovery in this slice | Unit: good/bad input and diagnostic paths. Properties: ID/reference validation, input immutability and projection preserves declared membership | Launch demo; valid JSON renders labelled elements/key/docs; invalid JSON gives a useful error. Inspect first desktop and mobile screenshots. No placeholder-only acceptance |
| C4-02 — drill and return, Sol/Sonnet | Add container view, pure route/transition rules, shared navigation hook and dumb controls. Extend the Cursor demo with one real detail view. Canonical Up and actual Back work from URLs. Before parallel dispatch, fix the scene/layout-port and documentation-slot contracts needed by C4-03/04; include those small seams in this working viewer | Unit: detail/Inspect/Up/Back and invalid routes. Properties: route codec round trips; parent forest terminates; transition sequences preserve valid selection | Click and keyboard drill, inspect linked node, reload deep element URL, Back/Forward and Up without history; verify focus restoration and base URL |
| C4-03 — explain a component, Sol/Sonnet | Add component presentation from existing contracts, selectable rich docs, sources, terms and review state. Introduce only explicitly inferred Cursor components; use dumb views and pure document/legend selectors | Unit: doc selection, empty states, source filtering. Properties: selection cannot return another element's docs; status/legend coverage remains consistent across generated views | Inspect component, switch Plain/STE, follow safe source links, reject unsafe content, use keyboard and responsive docs sheet; review screenshots |
| C4-04 — navigate a readable nested diagram, Astra/Opus | Add compound auto-layout and viewport adapter to the existing viewer; groups, labels and nested boundary edges work. Own scene geometry rules, ELK worker port/adapter, measurement hook and canvas containers | Unit: coordinate transforms and timeout/fallback. Properties: finite geometry, bounded nesting, endpoint/membership preservation; deterministic input for pinned engine | Real worker at demo base path; nested edges/long labels readable; rapid navigation cannot publish stale layout; resize/zoom and reduced motion; screenshots at two widths |
| C4-05 — follow a dynamic story, Sol/Sonnet | Add interaction AST/rules, pure step selectors, hooks/controls and communication view. Extend Cursor scenarios with source-linked steps; do not hard-code scenario execution in components | Unit: repeated/reversed interactions, sequence/parallel semantics. Properties: IDs/order preserved, valid active interactions and no invented total order for parallel branches | Step forward/back, load step URL, inspect participants, change diagrams mid-step; verify numbered overlays and text alternative |
| C4-06 — inspect a deployment instance, Sol/Sonnet | Add environment/instance rules, nested deployment presentation and link to logical element detail. Add a clearly illustrative Cursor deployment | Unit: instanceOf, parent/environment mismatches. Properties: replicas keep distinct IDs, cycle rejection, no cross-environment leakage | Expand/collapse infrastructure, select distinct replicas, drill to logical detail and return to the right instance; visual review of nesting |
| C4-07 — finish seven-type coverage, Sol/Sonnet | Add landscape entry and selected code-symbol view. Use grounded ts-db code or a generic fixture for code, not fabricated Cursor internals. Document each named React wrapper | Unit: code membership/relationships and landscape scopes. Properties: all seven projections retain visible endpoints; symbol/member IDs do not collide | Navigate landscape to system; render class/function/table fixtures with accessible members; run browser matrix over all seven kinds |
| C4-08a — source ledger, Luna/Haiku ≥5.5 (high) | After C4-01, inventory the Cursor article into a source ledger and glossary draft under `demos/git-at-any-scale/content/research/`; distinguish source statements, inference and unknowns. No runtime JSON or SDK edits | Validate section links, inventory completeness and provenance classifications against the article; no new logic means no artificial property tests | Nonvisual: source-fidelity review and Markdown/link validation; no new browser journey required |
| C4-08 — finish the independent showcase, Sol/Sonnet | Complete `demos/git-at-any-scale/` JSON, STE/plain texts, key, guided path and source ledger using working SDK features. No demo-specific renderer branches. Own demo content/docs and corresponding tests | Unit: content inventory, links and review metadata. Properties: generated catalog selections always resolve without changing framework state across datasets | End-to-end reading journeys, fresh-load links and narrow-screen layout; inspect final screenshots; record STE review and source-fidelity review |
| C4-09a — validate project-copy policy, Sol/Sonnet | After C4-02, implement pure copy-manifest policy and scratch filesystem adapter in `work-scripts/node/copy-project/`, with isolated tests in `tests/copy-consumer/policy/`. No app, SDK, root configuration or consumer content changes | Unit and properties: idempotence, reject local edits, preserve unmanaged files, delete only managed paths; test actual scratch files and invalid manifests | Nonvisual: run validation against temporary source/consumer trees. Use established test discovery; coordinator pre-registers helper in work-scripts INDEX before dispatch |
| C4-09 — consume the copied project in ts-db, Sol/Sonnet | **Paused until FFI-06, FFI-07 and FFI-08 are all landed on ts-db `main`.** Then use C4-09a copy policy for the copy/provenance workflow and isolated production consumer fixture; convert current/FFI content for ts-db Pages. c4-sdk owns generic copier/consumer tests and guides; a separately claimed ts-db task owns `pages/` content/copy/provenance and the current-plus-candidate `pages/diagrams/` design surface. No npm packaging | Unit: manifest scope, checksums and base URL. Properties: repeat copy idempotent, unmanaged files preserved, source deletion affects only managed files; original domain suite runs on copied source | Serve copied production build at `/ts-db/`; load both datasets; deep reload/worker/CSS/font/docs checks; re-copy version and preserve consumer content |
| C4-10 — harden the complete reader, Sol/Sonnet | Start now against the landed c4-sdk and Cursor consumer while C4-09 is paused. Resolve measured limits, accessibility, lifecycle/error cases and source API docs; no large feature backlog hidden in a final test-only task. Final acceptance against the second consumer remains a separate resumed gate after C4-09 lands; do not claim both consumers are hardened before then | Full unit/property regression, stress fixtures, replay shrunk failures; enforce no forbidden domain imports | Run complete suite on supported browsers, keyboard/axe and production builds; verify resource-limit errors and worker cleanup; inspect final visual evidence and publish an acceptance report, not a site. Repeat affected checks on ts-db Pages after C4-09 resumes |

### Explicit concurrency and integration gates

Every plan in this repo must name concurrent items, dependencies, disjoint ownership and integration order;
“parallel where possible” alone is not a concurrency plan. This plan permits the following batches:

| Batch | May run concurrently | Prerequisites / integration gate |
| --- | --- | --- |
| A | C4-01 alone | First working context plus test harness; review and land before B |
| B | C4-02 and C4-08a | Both read landed C4-01. C4-08a owns research Markdown only; C4-02 owns navigation/container feature and runtime demo JSON. Integrate 02 then 08a |
| C | C4-03, C4-04 and C4-09a | Land 02 first and inspect its contracts. 03 owns component/document feature; 04 owns layout/canvas feature; 09a owns copy helper/policy tests. Integrate 03, 04, then 09a with combined regression checks |
| D | C4-05, then C4-06, then C4-07 (serial) | Land 03/04 before 05. These evolve shared diagram unions/dispatch/route semantics, so they are not advertised as concurrent |
| E | C4-08 and C4-09 | All feature slices through 07 plus 08a/09a landed. 08 owns Cursor content/demo acceptance; 09 owns copy integration and ts-db content in separate claimed repo/worktree. Integrate 08 then 09 |
| F | C4-10 alone | Both consumers integrated; validate the combined tree and report remaining limits |

Batch C ownership is a required preflight, not an assumption that these interfaces already exist:

- C4-03: component schema/projection/wrapper, documentation selectors/hooks/views, component fixtures and
  its unit/property/browser tests. It owns the diagram schema dispatcher and source export entry during
  this batch. It uses the existing canvas and changes no geometry/worker/canvas modules.
- C4-04: scene geometry validation, ELK worker/client, layout hook and canvas adapter, layout fixtures and
  its tests. It consumes C4-02's scene/layout ports and changes no model/schema/navigation/docs modules.
  Coordinator pre-assigns the renderer's existing layout seam to 04. No new public exports are required.
- C4-09a: copy-policy helper directory and isolated policy tests only. It uses existing test discovery and
  existing Node APIs; it does not add dependencies or modify the manifest/lockfile.
- C4-03 and 04 use separate test datasets rather than both editing `continuity.json`. Their Playwright
  suites load those datasets through the same working viewer. C4-08 later consolidates final showcase data.

Before batch C, coordinator serially installs/pins any dependencies required by 03/04 and claims the
manifest, lockfile, test/build configs and work-scripts index. Review that setup and rerun build/harness
checks before releasing builders; it is an integration substep of those slices, not an unowned edit.
If preflight reveals a missing shared contract, amend and review C4-02 first, or serialize 03 then 04.
Never promise concurrent edits to one schema file, public barrel, demo catalog, root entry or lockfile.
The integration review verifies actual exact-file claims, not just these directory descriptions.

In batch E, 08 changes only Cursor JSON/content and `tests/browser/showcase/`; 09 changes copy guides,
helper integration and `tests/copy-consumer/integration/`, with ts-db files in a separate task. Root build
configuration changes for copying belong to 09; 08 consumes the landed demo build contract without editing
it. If either needs a shared change, coordinator serializes that change before their acceptance runs.
The ts-db task remains subject to ts-db's own protocol and landing authority; report its milestone
incomplete if only the isolated consumer can be completed. Neither this plan nor a cross-repo test grants
permission to edit unclaimed paths or merge either main branch.

### Tests and checkpoint maintenance

**Playwright is used throughout visual slices, not reserved for C4-10.** Add or extend runnable journeys
and inspect screenshots when presentation changes. New/changed pure logic needs unit tests and fast-check
properties. A nonvisual item uses schema, content, link, unit/property or other validation that proves its
output; it does not need a fake screen or browser journey. Rerun affected existing browser tests if a
nonvisual change can alter browser behavior. Later slices retain earlier checks as regression coverage.

Maintain root `STATE.md` throughout every planning and build session. Read it at restart, reconcile it with
Git and task records, and update it at dispatch, decisions/scope changes, review/integration milestones and
before pause, handoff or completion. Record requirements, branch/worktree/SHAs, claims, active agents,
changes, validation actually run, pending reviews, blockers and exact next actions. Coordinator owns the
shared file; concurrent builders maintain item-local state and report deltas. Do not mistake historical
status for current authorization. `docs/knowledge/` holds durable lessons; STATE is the current handoff.

## 11. Verification, knowledge and open decisions

### Three complementary test layers

Use planned scripts such as `test:unit`, `test:prop`, `test:browser` and `check` after C4-01 adds them.
`check` combines typecheck, existing lint/build commands, unit/property tests and relevant Playwright tests;
CI also runs a scheduled/full browser matrix. Exact script names become concrete in the slice brief and
README. No browser suite is deferred merely because the domain unit suite passes.

| Layer | What it proves | What it does not prove |
| --- | --- | --- |
| Pure unit tests | Examples and failure modes for schema decoding, scope/reference validation, scene projection, document/legend selection, route/step transitions and copy policy | DOM integration or visual readability |
| fast-check properties | Broad generated valid/adversarial graphs and command sequences preserve invariants; shrinking produces small reproducible failures | Architecture/source truth or a uniquely correct diagram layout |
| Playwright | Real Vite/production pages, loading, workers, URL/history, focus, interactions, safe docs, copy-based consumer behavior, responsiveness and accessibility checks | Human visual quality or formal STE compliance without review |

Domain tests run in Node with no React/browser setup. Hook integration tests use fake ports and real
lifecycle scheduling. Playwright uses the real browser adapters and real layout worker, not a wholly mocked
viewer. Avoid sleeps: await observable UI state. Store traces/screenshots on failure; record browser,
viewport, build/source SHA and commands in each review. Keep deterministic property seeds for CI and record
seed/replay path on failure; add regressions for discovered counterexamples. Assert relational invariants
and contracts rather than restating implementation branches.

Important properties: route formatting/parsing round trips; every reachable canonical breadcrumb chain
terminates; Up restores its parent anchor; related-link cycles are safe; projection preserves declared
members/edge endpoints; invalid references cannot enter a scene; selection cannot leak docs across datasets;
layout values remain finite and groups contain children; repeated copy preserves unmanaged content.
Scenario properties test partial ordering, not fictitious total ordering. Use curated screenshots for
visual layout, never randomized screenshot snapshots as the main proof.

Every slice with UI changes needs desktop/mobile screenshot inspection, keyboard navigation, focus order,
legible labels/relationships, and the relevant axe checks. Test 200% zoom and reduced motion as features
land. The final gate covers all seven types, both ts-db datasets and the Cursor demo, with no claim that
unrun STE/visual reviews passed. Initial target is 200 visible nodes/400 edges; record the reference machine
and benchmark real production builds before adopting the proposed layout budget.

### Durable knowledge: adapted from ts-db, already scaffolded

The repository already has `docs/knowledge/index.md`, `decisions.md`, `gotchas.md` and `glossary.md`, plus
an AGENTS.md instruction to read the index before planning. Preserve that port instead of copying ts-db's
project-specific history into it. This plan update populates the new repo's actual decisions and terms.

The index links this authoritative plan, current work records and findings. Decisions record dated choices
and rationale; gotchas record verified symptoms, cause, resolution and evidence; the glossary defines
shared domain/work terms. Use Markdown only: no kb CLI, RAG system or database for project memory. Do not
confuse the droplet's separate environment kb with the repository's knowledge store. Link rather than
repeat plan content; mark superseded entries, keep history, and never record secrets. A slice is not done
until durable findings and changed terminology have been recorded and its brief/claims/review reflect them.

### Risks and later decisions

| Risk / decision | Implementation default and gate |
| --- | --- |
| Copied code drifts in the consumer | Pin upstream SHA and inventory; refuse unreviewed local edits; fixes originate here and re-copy; test upgrades in C4-09 |
| Schema and domain types drift | Compile-check Zod outputs against domain contracts, round-trip fixtures and semantic properties |
| Business logic accumulates in hooks | Import-boundary checks plus review: hooks interpret ports/effects; pure functions own domain decisions |
| Compound layout has poor labels/boundaries | C4-04 spike and visual evidence before scaling content; timeout/fallback must work |
| Source article does not expose internals | Label inference and illustrative deployment; omit unsupported source code details; no invented production guarantees |
| STE text mistaken for certified compliance | Draft/reviewed metadata, identified reviewer and issue; no certification claims from length checks |
| Copy pulls project-private state | Export reviewed tracked files only; no .git, credentials, local data, dependencies or artifacts |
| CSS/worker URLs break under Pages | Explicit subpath production-build Playwright gate in every affected slice and in copied consumer |
| Effect is installed but not needed in domain | Keep it at an adapter boundary only when justified; do not build parallel state machines or expose it in source API |
| npm packaging/publishing later | Open item after source-copy consumers work: namespace, license, exports, semver, peer deps, worker/CSS bundling and migration from copies. No packaging/publishing work now |
| Site hosting/deployment | Build and validate artifacts now when implementing; deployment requires its own explicit task/authority |

## 12. This planning update

The implementation plan lives in c4-sdk. The ts-db design document becomes a relocation pointer rather
than a second plan to maintain. This update changes documentation, durable knowledge and required task
records only. It does not scaffold demos, change the app/dependencies, implement the SDK or copy it into
Pages. The existing scaffolding work and other agents' claims remain untouched.

Validation for this update: check Markdown whitespace, verify local document links and worked JSON
syntax/references, confirm coverage of the user's requirements, and request independent review of the
exact plan commit. The future unit/property/Playwright requirements apply to the relevant build slices; they
are not test results claimed for this documentation-only edit. Event publication was denied by the sandbox;
it is skipped under the user's earlier instruction, with no fabricated event or review verdict.
