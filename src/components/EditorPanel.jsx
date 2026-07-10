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
    <div className="rounded-[28px] border border-border bg-bg-panel/80 p-4 shadow-glow">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full border border-border bg-bg-panel-2 p-1">
          {languageOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setLanguage(option);
                setCode(starterCode[option] || starterCode.python);
              }}
              className={`rounded-full px-3 py-2 text-sm ${language === option ? 'bg-coral text-white' : 'text-text-muted'}`}
            >
              {option === 'python' ? 'Python' : option === 'javascript' ? 'JavaScript' : option === 'java' ? 'Java' : 'C++'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={handleRun} className="rounded-2xl border border-border bg-bg-panel-2 px-3 py-2 text-sm text-text">
            Run
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={handleRun} className="rounded-2xl bg-gradient-to-r from-coral to-[#ff6b8a] px-3 py-2 text-sm font-semibold text-white">
            Submit
          </motion.button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-border bg-bg-editor">
        <Editor
          height="320px"
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
