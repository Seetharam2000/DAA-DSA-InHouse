import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  xp: 320,
  streak: 12,
  currentProblem: {
    id: 'two-sum',
    title: 'Two Sum Spark',
    difficulty: 'Boss tier: 3',
    hp: 100,
    xpReward: 80,
    tags: ['Array', 'Hash Map', 'XP+80'],
    description:
      'Find two numbers that add up to the target. Keep the solution efficient and explain your reasoning in the editor comments.',
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: '2 + 7 = 9, so we return indices 0 and 1.',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: '2 + 4 = 6, so the answer is indices 1 and 2.',
      },
    ],
    hint: 'Try thinking in terms of complements. What do you need to know about a value once you see it?',
  },
  setUser: (user) => set({ user }),
  setXp: (xp) => set({ xp }),
  setStreak: (streak) => set({ streak }),
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
}));

export default useAppStore;
