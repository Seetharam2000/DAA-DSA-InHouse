import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import ConsolePanel from './ConsolePanel';

const starterCode = {
  python: 'def two_sum(nums, target):\n    seen = {}\n    for idx, value in enumerate(nums):\n        need = target - value\n        if need in seen:\n            return [seen[need], idx]\n        seen[value] = idx\n    return []\n',
  javascript: 'function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i += 1) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n',
  java: 'class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    return new int[]{};\n  }\n}\n',
  cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n  return {};\n}\n',
};

export default function EditorPanel({ onSubmit, tests, status, setTests, setStatus }) {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(starterCode.python);
  const [isRunning, setIsRunning] = useState(false);

  const languageOptions = useMemo(() => ['python', 'javascript', 'java', 'cpp'], []);

  const handleRun = async () => {
    setIsRunning(true);
    setStatus('Running tests…');
    setTests((items) => items.map((item, index) => ({ ...item, state: index === 0 ? 'pending' : item.state })));
    await onSubmit();
    setIsRunning(false);
  };

  return (
    <div className="rounded-[32px] border border-[#3d2e57] bg-[#171224] p-5 shadow-glow">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Solution lab</p>
          <p className="mt-2 text-sm text-text-muted">Run your code, keep the boss bleeding, and watch the failure feed.</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={handleRun} className="rounded-full border border-[#2f2349] bg-[#0f0815] px-4 py-2 text-sm text-text-muted transition hover:border-coral/40 hover:text-white">
            Run
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={handleRun} className="rounded-full bg-gradient-to-r from-coral to-[#ff7a96] px-4 py-2 text-sm font-semibold text-white shadow-glow">
            Submit
          </motion.button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 rounded-full border border-[#2f2349] bg-[#0d0816] p-1">
        {languageOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setLanguage(option);
              setCode(starterCode[option] || starterCode.python);
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${language === option ? 'bg-coral text-black' : 'text-text-muted hover:text-white'}`}
          >
            {option === 'python' ? 'Python' : option === 'javascript' ? 'JavaScript' : option === 'java' ? 'Java' : 'C++'}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#2f2349] bg-[#09060e] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        <Editor
          height="360px"
          language={language === 'javascript' ? 'javascript' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'python'}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{ minimap: { enabled: false }, fontFamily: 'JetBrains Mono', fontSize: 14, automaticLayout: true }}
        />
      </div>

      <div className="mt-4">
        <ConsolePanel tests={tests} status={status || (isRunning ? 'Running tests…' : 'Ready')} />
      </div>
    </div>
  );
}
