import type { DocumentationViewProps, SourceListProps } from '../contracts/views'
export function SourceListView({ sources }: SourceListProps) {
  return sources.length ? <div className="c4-sources"><h3>Sources</h3><ul>{sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>{source.notes && <p>{source.notes}</p>}</li>)}</ul></div> : null
}
export function DocumentationView({ selection, mode, onPlain, onSte }: DocumentationViewProps) {
  return <section className="c4-documentation" aria-label="Explanation">
    <p className="c4-eyebrow">Inspect</p><h2>{selection.title}</h2>{selection.statusText && <p className="c4-status">{selection.statusText}</p>}{selection.description && <p>{selection.description}</p>}{selection.plannedNotes.map(note => <p key={note}>Planned: {note}</p>)}
    <div className="c4-text-switch" role="group" aria-label="Explanation format"><button aria-pressed={mode === 'plain'} onClick={onPlain}>Plain explanation</button><button aria-pressed={mode === 'ste'} onClick={onSte}>STE100 text</button></div>
    {selection.documents.length ? selection.documents.map(doc => <article key={doc.id}><h3>{doc.title}</h3>{mode === 'ste' && <p className="c4-review">{doc.ste.issue} · {doc.ste.reviewStatus}{doc.ste.reviewer ? ` · ${doc.ste.reviewer}` : ''}{doc.ste.reviewedAt ? ` · ${doc.ste.reviewedAt}` : ''}</p>}<p className="c4-prose">{mode === 'plain' ? doc.plain : doc.ste.text}</p></article>) : <p>No explanation is provided for this element.</p>}
    {selection.terms.length > 0 && <div><h3>Technical terms</h3><dl>{selection.terms.map(term => <div key={term.id}><dt>{term.text}</dt><dd>{term.definition}</dd></div>)}</dl></div>}
    <SourceListView sources={selection.sources} />
  </section>
}
