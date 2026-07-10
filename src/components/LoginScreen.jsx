import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlitterBackground from './GlitterBackground';
import useAppStore from '../store/useAppStore';

export default function LoginScreen() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', remember: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = mode === 'login' ? 'LVL.UP · Log in' : 'LVL.UP · Sign up';
  }, [mode]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 900));

    // TODO: replace with real auth call
    if (!form.email || !form.password || (mode === 'signup' && !form.name)) {
      setError('A quick check: your email, password, and name are needed to get in.');
      setLoading(false);
      return;
    }

    setUser({ name: form.name || 'Mina', email: form.email, remember: form.remember });
    navigate('/arena');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base text-text">
      <GlitterBackground />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[410px] rounded-[28px] border border-border/80 bg-bg-panel/85 p-6 shadow-glow backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">LVL.UP</p>
              <p className="text-sm text-text-muted">Train like a boss, not a bot.</p>
            </div>
            <div className="rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-xs font-medium text-coral">
              {mode === 'login' ? 'Daily warmup' : 'New run'}
            </div>
          </div>

          <div className="mb-5 inline-flex rounded-full border border-border bg-bg-panel-2 p-1">
            {['login', 'signup'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${mode === tab ? 'bg-coral text-white shadow' : 'text-text-muted'}`}
              >
                {tab === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 rounded-2xl border border-amber/20 bg-amber/10 px-3 py-2 text-sm text-amber"
              >
                🔥 Don&apos;t lose it — 12 day streak at risk if you skip today
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-3" onSubmit={handleAuth}>
            {mode === 'signup' && (
              <input
                className="w-full rounded-2xl border border-border bg-bg-editor/80 px-3 py-3 text-sm outline-none ring-0"
                placeholder="Name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            )}

            <input
              type="email"
              className="w-full rounded-2xl border border-border bg-bg-editor/80 px-3 py-3 text-sm outline-none ring-0"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <input
              type="password"
              className="w-full rounded-2xl border border-border bg-bg-editor/80 px-3 py-3 text-sm outline-none ring-0"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />

            <div className="flex items-center justify-between text-sm text-text-muted">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={() => setForm({ ...form, remember: !form.remember })}
                  className="h-4 w-4 rounded border-border bg-bg-editor"
                />
                Remember me
              </label>
              <button type="button" className="text-coral">
                Forgot password?
              </button>
            </div>

            {error ? <p className="text-sm text-amber">{error}</p> : null}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-coral to-[#ff6b8a] px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-coral/20"
            >
              {loading ? 'Booting session…' : mode === 'login' ? 'Log in' : 'Create account'}
            </motion.button>
          </form>

          <div className="my-4 flex items-center gap-3 text-sm text-text-dim">
            <div className="h-px flex-1 bg-border" />
            or continue with
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-2">
            <button className="rounded-2xl border border-border bg-bg-panel-2 px-3 py-3 text-sm text-text">GitHub</button>
            <button className="rounded-2xl border border-border bg-bg-panel-2 px-3 py-3 text-sm text-text">Google</button>
          </div>

          <p className="mt-4 text-center text-sm text-text-muted">
            {mode === 'login' ? 'New here?' : 'Already in the arena?'}{' '}
            <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-coral">
              {mode === 'login' ? 'Create an account' : 'Log in instead'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
