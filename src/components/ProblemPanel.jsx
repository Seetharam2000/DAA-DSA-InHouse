import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function ProblemPanel({ problem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 rounded-[32px] border border-[#352d5a] bg-[#171224] p-6 shadow-glow">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${tag.includes('XP') ? 'bg-coral/15 text-coral' : 'bg-[#1f1732] text-text-muted'}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-text">{problem.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-text-muted">{problem.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {problem.examples.map((example, index) => (
          <div key={index} className="rounded-[28px] border border-[#2e2447] bg-[#0d0816] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-muted">
                Example {index + 1}
              </p>
              <span className="rounded-full bg-[#1f1732] px-3 py-1 text-xs uppercase tracking-[0.22em] text-text-muted">
                test case
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-[0.95fr_0.6fr]">
              <pre className="whitespace-pre-wrap rounded-3xl border border-[#2e2447] bg-[#11081c] p-4 text-sm font-code text-text leading-6">
{example.input}
              </pre>
              <div className="rounded-3xl border border-[#2e2447] bg-[#111119] p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Output</p>
                <p className="mt-3 text-lg font-semibold text-mint">{example.output}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-text-muted">{example.explanation}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-[#362f5b] bg-[#140d24] p-5">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-text"
        >
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
              <p className="mt-4 text-sm leading-7 text-text-muted">{problem.hint}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
