export interface NavigationViewProps {
  readonly breadcrumbs: readonly { readonly id: string; readonly title: string; readonly current: boolean; readonly onSelect: () => void }[]
  readonly onBack: () => void; readonly onUp: () => void; readonly hasParent: boolean
  readonly related: readonly { readonly label: string; readonly onSelect: () => void }[]
}
export function NavigationView({ breadcrumbs, onBack, onUp, hasParent, related }: NavigationViewProps) {
  return <nav className="c4-navigation" aria-label="Diagram navigation"><div><button onClick={onBack}>Back</button><button onClick={onUp} disabled={!hasParent}>Up</button></div><ol>{breadcrumbs.map(item => <li key={item.id}><button onClick={item.onSelect} aria-current={item.current ? 'page' : undefined}>{item.title}</button></li>)}</ol>{related.map((item, i) => <button key={i} onClick={item.onSelect}>{item.label}</button>)}</nav>
}
