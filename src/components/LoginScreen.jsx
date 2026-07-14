import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    document.title = mode === 'login' ? 'ByteBrawl · Log in' : 'ByteBrawl · Sign up';
  }, [mode]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 900));

    if (!form.email || !form.password || (mode === 'signup' && !form.name)) {
      setError('A quick check: your email, password, and name are needed to get in.');
      setLoading(false);
      return;
    }

    setUser({ name: form.name || 'Mina', email: form.email, remember: form.remember });
    navigate('/arena');
  };

  return (
    <div className="login-shell">
      <GlitterBackground />
      <div className="login-frame">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="login-card"
        >
          <div className="brand-panel">
            <span className="brand-eyebrow">ByteBrawl</span>
            <h1>Train like a boss, not a bot.</h1>
            <p>Continue your streak with a feel-good login page and smooth 3D glitter behind it.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-pill">
              <strong>Fast practice</strong>
              <span>Jump into challenges quickly.</span>
            </div>
            <div className="feature-pill">
              <strong>Shared progress</strong>
              <span>Celebrate every attempt, even the funny ones.</span>
            </div>
          </div>

          <div className="auth-panel">
            <div className="tabs-row">
              {['login', 'signup'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMode(tab)}
                  className={tab === mode ? 'tab active' : 'tab'}
                >
                  {tab === 'login' ? 'Log in' : 'Sign up'}
                </button>
              ))}
            </div>

            <form className="auth-form" onSubmit={handleAuth}>
              {mode === 'signup' && (
                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />

              <div className="form-meta">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={() => setForm({ ...form, remember: !form.remember })}
                  />
                  Remember me
                </label>
                <button type="button" className="link-button">Forgot password?</button>
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Booting session…' : mode === 'login' ? 'Log in' : 'Create account'}
              </button>
            </form>

            <div className="alt-login">
              <span>or continue with</span>
              <div className="social-buttons">
                <button type="button">GitHub</button>
                <button type="button">Google</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .login-shell {
          position: relative;
          min-height: 100vh;
          background: radial-gradient(circle at 15% 18%, rgba(124, 97, 255, 0.16), transparent 22%),
            radial-gradient(circle at 80% 12%, rgba(14, 211, 255, 0.08), transparent 20%),
            radial-gradient(circle at 80% 84%, rgba(255, 255, 255, 0.04), transparent 16%),
            #04030b;
          color: #f8f6ff;
          font-family: Inter, sans-serif;
          overflow: hidden;
        }
        .login-frame {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 32px;
        }
        .login-card {
          width: min(100%, 1040px);
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 24px;
          padding: 36px;
          border-radius: 36px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(8, 5, 15, 0.92);
          box-shadow: 0 46px 120px rgba(0,0,0,0.42);
          backdrop-filter: blur(24px);
        }
        .brand-panel {
          display: grid;
          gap: 26px;
          padding: 14px 0;
        }
        .brand-panel h1 {
          margin: 0;
          font-size: clamp(2.2rem, 2.2vw, 3.6rem);
          line-height: 0.98;
          max-width: 16ch;
        }
        .brand-eyebrow {
          display: inline-block;
          margin-bottom: 14px;
          color: #9e90ff;
          text-transform: uppercase;
          letter-spacing: 0.32em;
          font-size: 0.78rem;
        }
        .brand-panel p {
          margin-top: 8px;
          line-height: 1.9;
          color: #cfc7ff;
          max-width: 34rem;
        }
        .feature-grid {
          display: grid;
          gap: 16px;
          margin-top: 18px;
        }
        .feature-pill {
          padding: 20px;
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(16, 11, 24, 0.95);
        }
        .feature-pill strong {
          display: block;
          color: #f5f1ff;
          margin-bottom: 8px;
        }
        .feature-pill span {
          color: #c9c3f5;
          line-height: 1.85;
        }
        .auth-panel {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .tabs-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .tab {
          padding: 13px 20px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(14, 10, 20, 0.85);
          color: #c9c3f5;
          font-weight: 600;
          cursor: pointer;
          transition: all 180ms ease;
        }
        .tab.active {
          background: rgba(124, 97, 255, 0.18);
          color: #f8f6ff;
          border-color: rgba(124,97,255,0.24);
        }
        .auth-form {
          display: grid;
          gap: 18px;
        }
        .auth-form input {
          width: 100%;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(12, 9, 18, 0.96);
          color: #f8f6ff;
          padding: 18px 20px;
          font-family: JetBrains Mono, monospace;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }
        .auth-form input:focus {
          border-color: #7c61ff;
          box-shadow: 0 0 0 4px rgba(124,97,255,0.14);
        }
        .form-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #c7c0e7;
          font-size: 0.95rem;
        }
        .checkbox-row input {
          width: 16px;
          height: 16px;
          accent-color: #7c61ff;
        }
        .link-button {
          border: none;
          background: transparent;
          color: #a89bf0;
          font-size: 0.95rem;
          cursor: pointer;
          transition: color 180ms ease;
        }
        .link-button:hover {
          color: #f2ebff;
        }
        .form-error {
          color: #ffd18f;
          background: rgba(255,209,143,0.12);
          border: 1px solid rgba(255,209,143,0.2);
          border-radius: 20px;
          padding: 14px 18px;
        }
        .submit-button {
          width: 100%;
          padding: 18px 20px;
          border-radius: 26px;
          background: linear-gradient(135deg, #7c61ff 0%, #32d6ff 100%);
          color: #0b0710;
          border: none;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: transform 160ms ease, filter 160ms ease;
        }
        .submit-button:hover {
          transform: translateY(-1px);
          filter: saturate(1.05);
        }
        .alt-login {
          display: grid;
          gap: 16px;
          text-align: center;
          color: #b9b0f4;
          font-size: 0.92rem;
        }
        .social-buttons {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .social-buttons button {
          padding: 16px 18px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(17, 12, 24, 0.98);
          color: #e7e3ff;
          cursor: pointer;
        }
        @media (max-width: 980px) {
          .login-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
