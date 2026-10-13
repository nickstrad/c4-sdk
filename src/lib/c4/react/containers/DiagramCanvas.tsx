// Replaceable canvas/layout adapter reserved for C4-04; shared schema/navigation remain outside this file.
import type { DiagramCanvasProps } from '../contracts/views'
export function DiagramCanvas({ markerId: arrowId, scene, nodes, onDiagramSelect }: DiagramCanvasProps) {
  return (
    <div className="c4-canvas-scroll" role="region" aria-label={`${scene.diagram.kind === 'context' ? 'Context' : 'Container'} diagram canvas`} tabIndex={0}>
      <div className="c4-canvas" style={{ width: scene.width, height: scene.height }} onClick={event => { if (event.target === event.currentTarget) onDiagramSelect() }}>
        <svg className="c4-connections" width={scene.width} height={scene.height} aria-hidden="true">
          <defs><marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
          {scene.edges.map(edge => <g key={edge.relationship.id}>
            <line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="currentColor" strokeWidth="2" strokeDasharray={edge.stroke === 'dashed' ? '7 5' : undefined} markerEnd={`url(#${arrowId})`} />
            <foreignObject x={edge.labelX - 135} y={edge.labelY} width="270" height="68"><div className="c4-edge-label">{edge.number ? `${edge.number}. ` : ''}{edge.relationship.label}<small>{edge.relationship.technology}</small></div></foreignObject>
          </g>)}
        </svg>
        {nodes.map(node => <div key={node.element.id} className="c4-node-shell" style={{ left: node.x, top: node.y, width: node.width, height: node.height }}>
          <button data-element-id={node.element.id} className={`c4-node c4-tone-${node.tone} c4-stroke-${node.stroke}`} onClick={node.onSelect} aria-pressed={node.selected} aria-label={`${node.hasDetail ? 'Open detail for' : 'Inspect'} ${node.element.name}`}>
            <span className="c4-node-kind">{node.element.kind === 'person' ? '● ' : ''}{node.kindLabel}</span><strong>{node.element.name}</strong><span>{node.element.description}</span><small>{node.statusText}{node.hasDetail ? ' · Open detail →' : ''}</small>
          </button>
          {node.hasDetail && <button className="c4-inspect" onClick={node.onInspect} aria-label={`Inspect ${node.element.name}`}>Inspect</button>}
        </div>)}
      </div>
    </div>
  )
}
