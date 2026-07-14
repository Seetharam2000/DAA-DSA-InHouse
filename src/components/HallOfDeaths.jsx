export default function HallOfDeaths({ failures }) {
  if (!failures || failures.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-border bg-bg-panel/90 p-5 shadow-glow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-text-dim">Hall of Glorious Deaths</p>
          <h2 className="text-xl font-semibold text-text">Top wrong submissions</h2>
        </div>
        <span className="rounded-full border border-text-muted/30 bg-bg-panel-2 px-3 py-1 text-xs uppercase tracking-[0.3em] text-text-muted">
          shared fails
        </span>
      </div>

      <div className="space-y-3">
        {failures.map((failure) => (
          <div key={failure.id} className="rounded-3xl border border-border bg-bg-editor/90 p-4 transition hover:border-coral/30 hover:bg-bg-panel-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text">{failure.label}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-text-dim">{failure.author}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-text-muted">{failure.type}</span>
            </div>
            <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap break-words font-code text-sm text-text">{failure.snippet}</pre>
            <p className="mt-3 text-sm leading-6 text-text-muted">{failure.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
