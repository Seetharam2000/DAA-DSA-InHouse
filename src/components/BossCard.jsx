import { motion } from 'framer-motion';

export default function BossCard({ problem, hp }) {
  return (
    <div className="rounded-[32px] border border-[#3a2f62] bg-[#1e1632] p-5 shadow-glow">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Boss card</p>
          <h2 className="mt-2 text-2xl font-semibold text-text">Shadow Serpent</h2>
        </div>
        <div className="rounded-full bg-[#28192a] px-3 py-2 text-xs font-semibold uppercase tracking-[0.23em] text-coral">
          Boss tier: 3
        </div>
      </div>

      <div className="rounded-[28px] border border-[#2b2044] bg-[#110919] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">HP</p>
            <p className="text-lg font-semibold text-text">{hp}%</p>
          </div>
          <div className="rounded-full bg-[#0f0716] px-3 py-1 text-xs uppercase tracking-[0.2em] text-text-muted">
            {problem.xpReward} XP reward
          </div>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-[#15101f]">
          <motion.div
            initial={false}
            animate={{ width: `${hp}%` }}
            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
            className="h-full rounded-full bg-gradient-to-r from-coral via-[#ff72a2] to-mint"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-[28px] border border-[#2d2447] bg-[#140c24] p-4 text-sm text-text-muted">
        <div className="flex items-center justify-between">
          <span>Active challenge</span>
          <span className="text-text">{problem.difficulty}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Mutation hazard</span>
          <span className="text-coral">High</span>
        </div>
      </div>
    </div>
  );
}
