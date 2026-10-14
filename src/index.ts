/** Supported UI facade. Styles and the worker are separate package assets in P-02. */
export {
  ArchitectureViewer, ArchitectureProvider, DiagramNavigation, DiagramView,
  DiagramLegend, DiagramDocumentation,
} from './lib/c4/react/containers/ArchitectureViewer'
export {
  SystemLandscape, SystemContext, ContainerDiagram, ComponentDiagram,
  CodeDiagram, DynamicDiagram, DeploymentDiagram,
} from './lib/c4/react/containers/NamedDiagrams'
export { CatalogViewer } from './lib/c4/react/containers/CatalogViewer'
export { Legend } from './lib/c4/react/views/Legend'
export { useViewerController } from './lib/c4/react/hooks/useViewerController'
export { createFetchLoader } from './lib/c4/adapters/loaders/fetch'
export { createHashRoutePort } from './lib/c4/adapters/router/hash'
export { createElkLayoutPort } from './lib/c4/adapters/layout/client'
export type { ArchitectureViewerProps, ArchitectureProviderProps, NamedDiagramProps } from './lib/c4/react/containers/ArchitectureViewer'
export type { CatalogViewerProps } from './lib/c4/react/containers/CatalogViewer'
export type { LegendProps, NavigationSlot, LegendSlot, DocumentationSlot, DocumentationViewProps, DestinationLinkProps } from './lib/c4/react/contracts/views'
export type { NavigationViewProps } from './lib/c4/react/views/NavigationView'
export type { FetchLoaderLimits } from './lib/c4/adapters/loaders/fetch'
export type { ElkLayoutLimits, LayoutWorker } from './lib/c4/adapters/layout/client'
