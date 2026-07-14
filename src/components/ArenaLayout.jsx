import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import BossCard from './BossCard';
import EditorPanel from './EditorPanel';
import HallOfDeaths from './HallOfDeaths';
import ProblemPanel from './ProblemPanel';
import ReplayTheater from './ReplayTheater';
import TopBar from './TopBar';

const initialTests = [
  { id: 1, label: 'Example case 1', state: 'pending' },
  { id: 2, label: 'Example case 2', state: 'pending' },
  { id: 3, label: 'Edge case', state: 'pending' },
];

export default function ArenaLayout() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const currentProblem = useAppStore((state) => state.currentProblem);
  const xp = useAppStore((state) => state.xp);
  const streak = useAppStore((state) => state.streak);
  const setXp = useAppStore((state) => state.setXp);
  const setStreak = useAppStore((state) => state.setStreak);
  const resetProblem = useAppStore((state) => state.resetProblem);
  const [hp, setHp] = useState(currentProblem.hp);
  const [view, setView] = useState('challenge');
  const [tests, setTests] = useState(initialTests);
  const [status, setStatus] = useState('Ready');
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    document.title = 'ByteBrawl · Arena';
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  const runTests = async () => {
    setStatus('Running tests…');
    const updated = [...tests];

    for (let index = 0; index < updated.length; index += 1) {
      updated[index] = { ...updated[index], state: 'pending' };
      setTests([...updated]);
      await new Promise((resolve) => setTimeout(resolve, 380));
      updated[index] = { ...updated[index], state: 'pass' };
      setTests([...updated]);
    }

    const newHp = Math.max(0, hp - 34);
    setHp(newHp);
    setStatus('All tests passed');

    if (newHp === 0) {
      setVictory(true);
      setXp(xp + currentProblem.xpReward);
      setStreak(streak + 1);
      await new Promise((resolve) => setTimeout(resolve, 650));
      const nextProblem = resetProblem();
      setHp(nextProblem.hp);
      setTests(initialTests);
      setStatus('Ready');
      setVictory(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04030b] px-4 py-6 text-text sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-5">
        <TopBar />
        <div className="flex flex-col gap-3 rounded-[32px] border border-[#2b254d] bg-[#07050f]/90 px-4 py-4 shadow-glow sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'challenge', label: 'Challenge' },
              { id: 'mutation', label: 'Mutation boss attack' },
              { id: 'deaths', label: 'Hall of Glorious Deaths' },
              { id: 'replay', label: 'Replay theater' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  view === tab.id
                    ? 'bg-gradient-to-r from-[#7c61ff] to-[#2ee0ff] text-[#0b0710] shadow-[0_0_0_1px_rgba(124,97,255,0.24)]'
                    : 'border border-[#2f2349] bg-[#0b0814] text-text-muted hover:border-[#7c61ff]/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-text-muted">Select a mode to open it in the arena.</p>
        </div>
        <AnimatePresence>
          {victory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="rounded-[28px] border border-[#2d3f4f] bg-[#12232d] px-5 py-4 text-sm text-cyan"
            >
              Boss defeated! +{currentProblem.xpReward} XP · streak extended
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.85fr]">
          <div className="space-y-5">
            {view === 'challenge' && <ProblemPanel problem={currentProblem} />}
            {view === 'mutation' && (
              <div className="rounded-[32px] border border-[#352d5a] bg-[#171224] p-6 shadow-glow">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-text-muted">Mutation boss attack</p>
                    <h1 className="text-3xl font-semibold text-text">{currentProblem.mutationCase?.prompt || 'No mutation attack available'}</h1>
                  </div>
                  <span className="rounded-full border border-[#2f2449] bg-[#0b0814] px-3 py-1 text-xs uppercase tracking-[0.25em] text-text-muted">
                    Mutation mode
                  </span>
                </div>
                {currentProblem.mutationCase ? (
                  <>
                    <p className="mb-6 text-sm leading-7 text-text-muted">Tackle this altered case without collapsing under the mutated input.</p>
                    <div className="rounded-[28px] border border-[#2e2447] bg-[#0d0816] p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Mutation test case</p>
                      <pre className="mt-4 whitespace-pre-wrap rounded-[24px] bg-[#11081c] p-4 text-sm font-code text-text leading-6">
{currentProblem.mutationCase.input}
                      </pre>
                      <p className="mt-4 text-sm text-mint">Expected: {currentProblem.mutationCase.output}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-text-muted">No mutation attack is ready for this challenge yet.</p>
                )}
              </div>
            )}
            {view === 'deaths' && <HallOfDeaths failures={currentProblem.failureHall} />}
            {view === 'replay' && <ReplayTheater replays={currentProblem.replays} />}
          </div>
          <div className="space-y-5">
            <BossCard problem={currentProblem} hp={hp} />
            <EditorPanel
              onSubmit={runTests}
              tests={tests}
              status={status}
              setTests={setTests}
              setStatus={setStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
