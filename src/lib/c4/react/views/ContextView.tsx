import type { ContextViewProps } from '../contracts/views'
export function ContextView({ markerId: arrowId, scene, nodes, onDiagramSelect }: ContextViewProps) {
  return <section className="c4-diagram" aria-label={scene.diagram.title}>
    <header className="c4-diagram-heading"><div><p className="c4-eyebrow">System context · {scene.statusText}</p><h1>{scene.diagram.title}</h1></div><button onClick={onDiagramSelect}>Diagram explanation</button></header>
    <p className="c4-hint">Select an element to inspect its explanation. Scroll the diagram on narrow screens.</p>
    <div className="c4-canvas-scroll" role="region" aria-label="Context diagram canvas" tabIndex={0}>
      <div className="c4-canvas" style={{ width: scene.width, height: scene.height }}>
        <svg className="c4-connections" width={scene.width} height={scene.height} aria-hidden="true">
          <defs><marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
          {scene.edges.map(edge => <g key={edge.relationship.id}>
            <line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="currentColor" strokeWidth="2" strokeDasharray={edge.stroke === 'dashed' ? '7 5' : undefined} markerEnd={`url(#${arrowId})`} />
            <foreignObject x={edge.labelX - 135} y={edge.labelY} width="270" height="68"><div className="c4-edge-label">{edge.number ? `${edge.number}. ` : ''}{edge.relationship.label}<small>{edge.relationship.technology}</small></div></foreignObject>
          </g>)}
        </svg>
        {nodes.map(node => <button key={node.element.id} className={`c4-node c4-tone-${node.tone} c4-stroke-${node.stroke}`} style={{ left: node.x, top: node.y, width: node.width, height: node.height }} onClick={node.onSelect} aria-pressed={node.selected}>
          <span className="c4-node-kind">{node.element.kind === 'person' ? '● ' : ''}{node.kindLabel}</span><strong>{node.element.name}</strong><span>{node.element.description}</span><small>{node.statusText}</small>
        </button>)}
      </div>
    </div>
    <details className="c4-relationships" open><summary>Relationships ({scene.edges.length})</summary><ul>{scene.edges.map(edge => <li key={edge.relationship.id}><strong>{edge.source.element.name} → {edge.target.element.name}</strong><span>{edge.number ? `${edge.number}. ` : ''}{edge.relationship.label} · {edge.relationship.technology ?? 'Protocol not specified'} · {edge.relationship.status}</span>{edge.relationship.plannedNotes.map(note => <span key={note}>Planned: {note}</span>)}</li>)}</ul></details>
  </section>
}
