import { motion } from 'framer-motion';
import useAppStore from '../store/useAppStore';

export default function TopBar() {
  const xp = useAppStore((state) => state.xp);
  const streak = useAppStore((state) => state.streak);
  const user = useAppStore((state) => state.user);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-border bg-bg-panel/80 px-4 py-3 shadow-glow">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-coral to-[#ff6b8a] text-lg font-semibold text-white">
          L
        </div>
        <div>
          <p className="font-display text-lg font-semibold">LVL.UP</p>
          <p className="text-sm text-text-muted">Arena ready</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-amber/20 bg-amber/10 px-3 py-2 text-sm text-amber">
          🔥 {streak} day streak
        </div>
        <div className="min-w-[140px] rounded-full border border-border bg-bg-panel-2 px-3 py-2">
          <div className="mb-1 flex items-center justify-between text-xs text-text-muted">
            <span>Lvl 5</span>
            <span>{xp} XP</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg-editor">
            <motion.div animate={{ width: `${Math.min(100, xp / 5)}%` }} className="h-full rounded-full bg-gradient-to-r from-coral to-mint" />
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-bg-panel-2 px-3 py-2 text-sm text-text-muted">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber to-coral text-sm font-semibold text-white">
            {user?.name?.[0] || 'U'}
          </div>
          {user?.name || 'You'}
        </div>
      </div>
    </div>
  );
}
