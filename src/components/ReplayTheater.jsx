import { useMemo, useState } from 'react';

export default function ReplayTheater({ replays }) {
  const [selected, setSelected] = useState(0);
  const [position, setPosition] = useState(0);

  const currentReplay = replays?.[selected];
  const events = currentReplay?.events || [];
  const progress = events.length ? Math.round((position / (events.length - 1)) * 100) : 0;

  const codeSnapshot = useMemo(() => {
    if (!events.length) return '';
    return events[Math.min(position, events.length - 1)].code;
  }, [events, position]);

  if (!replays || replays.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-border bg-bg-panel/90 p-5 shadow-glow">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-text-dim">Replay theater</p>
          <h2 className="text-xl font-semibold text-text">Watch the solver&apos;s flow</h2>
        </div>
        <span className="rounded-full border border-text-muted/30 bg-bg-panel-2 px-3 py-1 text-xs uppercase tracking-[0.3em] text-text-muted">
          {currentReplay?.label}
        </span>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[0.8fr_0.4fr]">
        <div className="overflow-hidden rounded-3xl border border-border bg-bg-editor/95 p-4">
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words font-code text-sm text-text">{codeSnapshot}</pre>
        </div>
        <div className="space-y-3 rounded-3xl border border-border bg-bg-panel-2 p-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-text">Replay notes</p>
            <p className="text-sm text-text-muted">{currentReplay?.summary}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-text-dim">Progress</p>
            <div className="h-2 overflow-hidden rounded-full bg-bg-editor">
              <div className="h-full bg-mint" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-text-muted">{progress}% through keystrokes</p>
          </div>
          <button
            type="button"
            onClick={() => setPosition((prev) => Math.max(0, prev - 1))}
            className="w-full rounded-2xl border border-border bg-bg-panel px-3 py-2 text-sm text-text transition hover:bg-bg-editor"
          >
            Step back
          </button>
          <button
            type="button"
            onClick={() => setPosition((prev) => Math.min(events.length - 1, prev + 1))}
            className="w-full rounded-2xl border border-border bg-bg-panel px-3 py-2 text-sm text-text transition hover:bg-bg-editor"
          >
            Step forward
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="range"
          min="0"
          max={Math.max(0, events.length - 1)}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="w-full"
        />
        <div className="flex items-center justify-between gap-3 text-sm text-text-muted">
          <span>Start</span>
          <span>{events.length ? `Step ${position + 1} / ${events.length}` : 'No replay data'}</span>
          <span>End</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {replays.map((replay, index) => (
          <button
            key={replay.id}
            type="button"
            onClick={() => {
              setSelected(index);
              setPosition(0);
            }}
            className={`rounded-full px-3 py-2 text-sm transition ${index === selected ? 'bg-text text-[#0f0b1a]' : 'border border-border bg-bg-panel-2 text-text-muted hover:text-text'}`}
          >
            {replay.label}
          </button>
        ))}
      </div>
    </div>
  );
}
