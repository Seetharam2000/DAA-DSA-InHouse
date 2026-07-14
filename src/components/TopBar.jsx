import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

export default function TopBar() {
  const navigate = useNavigate();
  const xp = useAppStore((state) => state.xp);
  const streak = useAppStore((state) => state.streak);
  const user = useAppStore((state) => state.user);
  const settings = useAppStore((state) => state.settings);
  const logout = useAppStore((state) => state.logout);

  const statusText = useMemo(() => (settings.enabled ? 'Audio + AI active' : 'Silent mode'), [settings.enabled]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-[#2b254d] bg-[#07040e]/95 px-5 py-4 shadow-glow">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#1c1434] text-xl font-semibold text-white shadow-[0_0_0_1px_rgba(124,97,255,0.18)]">
          L
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-white">ByteBrawl</p>
          <p className="text-sm text-text-muted">{statusText}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="rounded-full border border-[#1e1632] bg-[#0b0814] px-4 py-2 text-sm text-text-muted transition hover:border-[#7c61ff]/40 hover:text-white"
        >
          Settings
        </button>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="rounded-full border border-[#1e1632] bg-[#0b0814] px-4 py-2 text-sm text-text-muted transition hover:border-[#ffffff]/20 hover:text-white"
        >
          Logout
        </button>

        <div className="rounded-full border border-[#271f41] bg-[#0b0814] px-4 py-2 text-sm text-text-muted">
          {streak} day streak
        </div>

        <div className="min-w-[180px] rounded-full border border-[#1e1632] bg-[#0b0814] px-4 py-2">
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-text-muted">
            <span>lvl 5</span>
            <span>{xp} XP</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#110919]">
            <motion.div animate={{ width: `${Math.min(100, xp / 5)}%` }} className="h-full rounded-full bg-gradient-to-r from-[#7c61ff] to-[#30e0d8]" />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-[#1e1632] bg-[#0b0814] px-4 py-2 text-sm text-text-muted">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2e1e53] text-sm font-semibold text-white">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="space-y-0.5 text-left">
            <p className="text-sm text-white">{user?.name || 'You'}</p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-text-muted">Arena agent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
