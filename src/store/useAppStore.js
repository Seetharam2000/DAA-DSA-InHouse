import { create } from 'zustand';
import { createProblem } from '../utils/problemGenerator';

const useAppStore = create((set) => ({
  user: null,
  xp: 320,
  streak: 12,
  currentProblem: createProblem(),
  settings: {
    enabled: true,
    masterVolume: 75,
    soundPack: 'Pulse',
    aiProvider: 'OpenAI',
    aiModel: 'gpt-4o-mini',
    apiKeySaved: false,
    autoSummary: true,
  },
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  setXp: (xp) => set({ xp }),
  setStreak: (streak) => set({ streak }),
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  resetProblem: () => {
    const problem = createProblem();
    set({ currentProblem: problem });
    return problem;
  },
  updateSettings: (changes) => set((state) => ({ settings: { ...state.settings, ...changes } })),
}));

export default useAppStore;
