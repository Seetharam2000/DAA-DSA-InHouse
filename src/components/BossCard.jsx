import { motion } from 'framer-motion';

export default function BossCard({ problem, hp, setHp }) {
  return (
    <div className="rounded-[24px] border border-border bg-bg-panel-2/90 p-4 shadow-glow">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber">Boss card</p>
          <h2 className="mt-1 text-xl font-semibold text-text">Shadow Serpent</h2>
        </div>
        <div className="rounded-full border border-coral/20 bg-coral/10 px-3 py-1 text-sm font-medium text-coral">
          {problem.difficulty}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-sm text-text-muted">
        <span>HP</span>
        <span>{hp}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-bg-editor">
        <motion.div
          initial={false}
          animate={{ width: `${hp}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          className="h-full rounded-full bg-gradient-to-r from-coral via-[#ff6b8a] to-mint"
        />
      </div>
    </div>
  );
}
