import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import BossCard from './BossCard';
import EditorPanel from './EditorPanel';
import ProblemPanel from './ProblemPanel';
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
  const [tests, setTests] = useState(initialTests);
  const [status, setStatus] = useState('Ready');
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    document.title = 'LVL.UP · Arena';
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  const runTests = async () => {
    setStatus('Running tests…');
    const updated = [...tests];

    for (let index = 0; index < updated.length; index += 1) {
      updated[index] = { ...updated[index], state: 'pending' };
      setTests(updated);
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
    <div className="min-h-screen bg-bg-base px-3 py-3 text-text sm:px-5 lg:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <TopBar />
        <AnimatePresence>
          {victory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="rounded-[24px] border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint"
            >
              🏆 Boss defeated! +{currentProblem.xpReward} XP · streak extended
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <ProblemPanel problem={currentProblem} />
          <div className="space-y-4">
            <BossCard problem={currentProblem} hp={hp} setHp={setHp} />
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
