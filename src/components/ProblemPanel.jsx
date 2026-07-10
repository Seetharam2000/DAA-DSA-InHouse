import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function ProblemPanel({ problem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4 rounded-[28px] border border-border bg-bg-panel/80 p-5 shadow-glow">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {problem.tags.map((tag) => (
            <span key={tag} className={`rounded-full px-3 py-1 text-xs font-semibold ${tag.includes('XP') ? 'bg-coral/15 text-coral' : 'bg-bg-panel-2 text-text-muted'}`}>
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-semibold text-text">{problem.title}</h1>
        <p className="text-sm leading-7 text-text-muted">{problem.description}</p>
      </div>

      <div className="space-y-3">
        {problem.examples.map((example, index) => (
          <div key={index} className="rounded-2xl border border-border bg-bg-editor/90 p-4">
            <p className="mb-2 text-sm font-semibold text-mint">Example {index + 1}</p>
            <pre className="overflow-x-auto whitespace-pre-wrap font-code text-sm text-text">{example.input}</pre>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-code text-sm text-mint">{example.output}</pre>
            <p className="mt-2 text-sm text-text-muted">{example.explanation}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-bg-panel-2/60 p-4">
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between text-left text-sm font-semibold text-text">
          Ask for a nudge
          <span className="text-text-muted">{open ? '−' : '+'}</span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-sm leading-7 text-text-muted">{problem.hint}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
