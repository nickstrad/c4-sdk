/** Deliberate browser-free data facade. Keep schema engines and renderer helpers private. */
export { decodeArchitecture } from '../lib/c4/schema/decode'
export { architectureJsonSchema } from './public/editor-schema'
export { buildScene } from '../lib/c4/domain/scene'
export { selectDocumentation, resolveLegend } from '../lib/c4/domain/documentation'
export { parseRoute, formatRoute, validateRoute, transition, breadcrumbs } from '../lib/c4/domain/navigation'
export type { DecodeLimits } from '../lib/c4/schema/decode'
export type {
  Id, Status, Diagnostic, References, SymbolKind, Visibility, CodeMember, RelationshipKind,
  Element, Target, Link, Relationship, Member, Group, EdgeRef, Swatch, LegendEntry, LegendSpec,
  LandscapeDiagram, ContextDiagram, ContainerDiagram, ComponentDiagram, CodeDiagram,
  InteractionStep, Step, DynamicDiagram, DeploymentDiagram, Diagram, Document, Source, Term,
  ArchitectureBundle, ModelIndex, Result, ValidatedArchitecture,
} from '../lib/c4/domain/model'
export type { SceneInput } from '../lib/c4/domain/scene'
export type { Scene, SceneNode, SceneEdge, SceneGroup, Bounds, Point, Size, EdgeSection } from '../lib/c4/domain/geometry'
export type { DocumentSelection } from '../lib/c4/domain/documentation'
export type { Route, NavigationAction, NavigationEffect } from '../lib/c4/domain/navigation'
export type { RoutePort, RouteSnapshot } from '../lib/c4/ports/route'
export type { LayoutPort, LayoutRequest, LayoutResponse, LayoutMeasurements } from '../lib/c4/ports/layout'
export type { GeometryLimits } from '../lib/c4/domain/layout'
export type { ArchitectureLoader, Catalog, CatalogEntry } from '../lib/c4/ports/loader'
