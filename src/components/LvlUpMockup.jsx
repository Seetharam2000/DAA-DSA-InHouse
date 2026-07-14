import { useMemo, useState } from 'react';

const LANGUAGES = ['Python', 'JavaScript', 'Java', 'C++'];

const starterTemplates = {
  Python: 'def max_window_sum(nums, k):\n    current = sum(nums[:k])\n    best = current\n    for i in range(k, len(nums)):\n        current += nums[i] - nums[i - k]\n        best = max(best, current)\n    return best\n',
  JavaScript: 'function maxWindowSum(nums, k) {\n  let current = nums.slice(0, k).reduce((a, b) => a + b, 0);\n  let best = current;\n  for (let i = k; i < nums.length; i += 1) {\n    current += nums[i] - nums[i - k];\n    best = Math.max(best, current);\n  }\n  return best;\n}\n',
  Java: 'class Solution {\n  public int maxWindowSum(int[] nums, int k) {\n    int current = 0;\n    for (int i = 0; i < k; i++) current += nums[i];\n    int best = current;\n    for (int i = k; i < nums.length; i++) {\n      current += nums[i] - nums[i - k];\n      best = Math.max(best, current);\n    }\n    return best;\n  }\n}\n',
  'C++': 'int maxWindowSum(vector<int>& nums, int k) {\n  int current = accumulate(nums.begin(), nums.begin() + k, 0);\n  int best = current;\n  for (int i = k; i < nums.size(); i++) {\n    current += nums[i] - nums[i - k];\n    best = max(best, current);\n  }\n  return best;\n}\n',
};

const initialTests = [
  { id: 1, label: 'Example case 1', state: 'pending' },
  { id: 2, label: 'Example case 2', state: 'pending' },
  { id: 3, label: 'Edge case', state: 'pending' },
];

const failureHall = [
  {
    id: 'f1',
    author: 'Anonymous Slayer',
    label: 'The final window slipped away',
    type: 'Off-by-one',
    snippet: 'for (let i = 0; i < nums.length - k; i++) {\n  const sum = nums.slice(i, i + k).reduce((a, b) => a + b, 0);\n  best = Math.max(best, sum);\n}\n',
    comment: 'The last window starts at nums.length - k, not nums.length - k - 1.',
  },
  {
    id: 'f2',
    author: 'Brute Force Bard',
    label: 'Brute force, boss mode',
    type: 'Slow path',
    snippet: 'for (int i = 0; i < nums.length(); i++) {\n  int sum = 0;\n  for (int j = i; j < i + k; j++) sum += nums[j];\n  best = max(best, sum);\n}\n',
    comment: 'Nice thinking, but this can blow up on the bigger waves.',
  },
  {
    id: 'f3',
    author: 'One-Liner',
    label: 'Short and bad',
    type: 'Logic bug',
    snippet: 'return nums.reduce((max, _, idx) => Math.max(max, nums.slice(idx, idx + k).reduce((a, b) => a + b, 0)), 0);\n',
    comment: 'The last index can read past the end if you do not guard the window size.',
  },
];

const replays = [
  {
    id: 'r1',
    label: 'Top solver replay',
    summary: 'Turning a naive window sampler into a rolling sum and catching the last window edge case.',
    events: [
      {
        code: 'def max_window_sum(nums, k):\n  best = 0\n  for i in range(len(nums)):\n    window = nums[i:i+k]\n    best = max(best, sum(window))\n  return best\n',
      },
      {
        code: 'def max_window_sum(nums, k):\n  best = 0\n  for i in range(len(nums) - k + 1):\n    window = nums[i:i+k]\n    best = max(best, sum(window))\n  return best\n',
      },
      {
        code: 'def max_window_sum(nums, k):\n  current = sum(nums[:k])\n  best = current\n  for i in range(k, len(nums)):\n    current += nums[i] - nums[i - k]\n    best = max(best, current)\n  return best\n',
      },
    ],
  },
  {
    id: 'r2',
    label: 'Debugger play-by-play',
    summary: 'A second take with extra commentary on the final-window trap.',
    events: [
      {
        code: 'def max_window_sum(nums, k):\n  sums = [sum(nums[i:i+k]) for i in range(len(nums) - k + 1)]\n  return max(sums)\n',
      },
      {
        code: 'def max_window_sum(nums, k):\n  current = sum(nums[:k])\n  best = current\n  for i in range(k, len(nums)):\n    current += nums[i] - nums[i - k]\n    if current > best:\n      best = current\n  return best\n',
      },
    ],
  },
];

export default function ByteBrawlMockup() {
  const [language, setLanguage] = useState('Python');
  const [code, setCode] = useState(starterTemplates.Python);
  const [hintOpen, setHintOpen] = useState(false);
  const [passedCount, setPassedCount] = useState(0);
  const [xp, setXp] = useState(320);
  const [status, setStatus] = useState('Ready');
  const [tests, setTests] = useState(initialTests);
  const [victory, setVictory] = useState(false);
  const [selectedReplay, setSelectedReplay] = useState(0);
  const [replayStep, setReplayStep] = useState(0);

  const currentReplay = replays[selectedReplay];
  const replayCode = currentReplay.events[replayStep]?.code || '';

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(starterTemplates[lang]);
  };

  const handleRun = async () => {
    setStatus('Running tests…');
    setPassedCount(0);
    setVictory(false);
    setTests(initialTests.map((test, index) => ({ ...test, state: index === 0 ? 'pending' : 'pending' })));

    await new Promise((resolve) => setTimeout(resolve, 400));
    let passed = 0;
    const nextTests = tests.map((test, index) => {
      const passedTest = index < 2;
      if (passedTest) passed += 1;
      return { ...test, state: passedTest ? 'pass' : index === 2 ? 'fail' : 'pending' };
    });
    setTests(nextTests);
    setPassedCount(passed);
    setStatus(passed === 3 ? 'All tests passed' : 'Mutation challenge triggered');
    if (passed === 3) {
      setVictory(true);
      setXp((current) => current + 80);
    }
  };

  const handleReplayStep = (direction) => {
    setReplayStep((current) => {
      const next = current + direction;
      return Math.max(0, Math.min(currentReplay.events.length - 1, next));
    });
  };

  const progress = currentReplay.events.length > 1 ? Math.round((replayStep / (currentReplay.events.length - 1)) * 100) : 0;

  return (
    <div className="bytebrawl-shell">
      <div className="mockup-grid">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">Shared boss raid</span>
            <h1>ByteBrawl arena</h1>
            <p>Practice with a boss battle flow, mutation tests, and a public feed of glorious failures.</p>
          </div>
          <div className="metrics-card">
            <div>
              <p className="metric-label">XP</p>
              <p className="metric-value">{xp}</p>
            </div>
            <div>
              <p className="metric-label">Streak</p>
              <p className="metric-value">12</p>
            </div>
            <div>
              <p className="metric-label">Boss HP</p>
              <p className="metric-value">84%</p>
            </div>
          </div>
        </section>

        <section className="challenge-panel">
          <div className="panel-header">
            <div>
              <p className="panel-tag">Sliding Window Strike</p>
              <h2>Find the max contiguous window sum</h2>
            </div>
            <button className="pill">Boss tier: 3</button>
          </div>

          <div className="panel-body">
            <p>Build a rolling sum solution that can survive changing inputs every retry and catch subtle last-window bugs.</p>
            <div className="example-box">
              <strong>Example</strong>
              <pre>nums = [2, 7, 5, 2, 8, 4], k = 3</pre>
              <p>Output: 15</p>
            </div>

            <div className="hint-bar">
              <button type="button" onClick={() => setHintOpen((value) => !value)}>
                {hintOpen ? 'Hide hint' : 'Show hint'}
              </button>
              <span>Mutation minigame ready</span>
            </div>
            {hintOpen && <p className="hint-copy">Subtract the outgoing number and add the incoming number as the window slides.</p>}
          </div>

          <div className="editor-shell">
            <div className="toolbar">
              <div className="language-tabs">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageChange(lang)}
                    className={lang === language ? 'active' : ''}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <div className="run-group">
                <button type="button" onClick={handleRun}>Run</button>
                <button type="button" onClick={handleRun} className="primary">Submit</button>
              </div>
            </div>
            <textarea value={code} onChange={(event) => setCode(event.target.value)} />
          </div>

          <div className="status-strip">
            <p>{status}</p>
            <div className="progress-bar">
              <div style={{ width: `${passedCount / 3 * 100}%` }} />
            </div>
          </div>

          <div className="battle-feed">
            <div className="feed-column">
              <h3>Hall of Glorious Deaths</h3>
              {failureHall.map((item) => (
                <div key={item.id} className="failure-card">
                  <div className="failure-meta">
                    <span>{item.author}</span>
                    <span>{item.type}</span>
                  </div>
                  <p className="failure-label">{item.label}</p>
                  <pre>{item.snippet}</pre>
                  <p className="failure-comment">{item.comment}</p>
                </div>
              ))}
            </div>
            <div className="feed-column">
              <h3>Replay Theater</h3>
              <div className="replay-card">
                <div className="replay-meta">
                  <span>{currentReplay.label}</span>
                  <small>{currentReplay.summary}</small>
                </div>
                <pre>{replayCode}</pre>
                <div className="replay-controls">
                  <button type="button" onClick={() => handleReplayStep(-1)}>&larr;</button>
                  <span>{progress}%</span>
                  <button type="button" onClick={() => handleReplayStep(1)}>&rarr;</button>
                </div>
                <div className="replay-select">
                  {replays.map((replay, index) => (
                    <button
                      type="button"
                      key={replay.id}
                      onClick={() => {
                        setSelectedReplay(index);
                        setReplayStep(0);
                      }}
                      className={index === selectedReplay ? 'active' : ''}
                    >
                      {replay.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .bytebrawl-shell {
          min-height: 100vh;
          padding: 32px;
          background: radial-gradient(circle at top left, rgba(255, 61, 113, 0.16), transparent 22%),
            radial-gradient(circle at bottom right, rgba(110, 255, 196, 0.08), transparent 18%),
            #0f0b1a;
          color: #f5f1ff;
          font-family: Inter, sans-serif;
        }
        .mockup-grid {
          display: grid;
          gap: 28px;
          grid-template-columns: 1.05fr 1.3fr;
        }
        .hero-panel,
        .challenge-panel {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(22, 13, 35, 0.85);
          box-shadow: 0 36px 120px rgba(0,0,0,0.4);
          border-radius: 32px;
          padding: 28px;
          backdrop-filter: blur(12px);
        }
        .hero-copy .eyebrow {
          display: inline-flex;
          margin-bottom: 18px;
          font-size: 0.8rem;
          letter-spacing: 0.24em;
          color: #b39ddb;
          text-transform: uppercase;
        }
        .hero-copy h1 {
          margin: 0;
          font-size: clamp(3rem, 2.2vw, 4.4rem);
          line-height: 0.9;
          letter-spacing: -0.06em;
        }
        .hero-copy p {
          margin-top: 18px;
          max-width: 42rem;
          color: #c7beff;
          line-height: 1.85;
        }
        .metrics-card {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 32px;
        }
        .metrics-card div {
          background: rgba(23, 17, 40, 0.9);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 20px;
        }
        .metric-label {
          margin: 0;
          color: #9f91c4;
          font-size: 0.76rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .metric-value {
          margin: 10px 0 0;
          font-size: 2rem;
          font-weight: 700;
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 22px;
        }
        .panel-tag {
          margin: 0 0 8px;
          color: #9f91c4;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }
        .panel-body p {
          color: #c7beff;
          line-height: 1.8;
        }
        .pill {
          border: 1px solid rgba(255,255,255,0.14);
          padding: 12px 18px;
          border-radius: 999px;
          background: rgba(255, 61, 113, 0.12);
          color: #ff7aa4;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }
        .example-box {
          margin-top: 20px;
          background: rgba(8, 5, 13, 0.95);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 18px;
        }
        .example-box strong {
          display: block;
          margin-bottom: 10px;
          color: #e2d6ff;
        }
        .example-box pre {
          margin: 0;
          background: rgba(17, 10, 29, 0.95);
          border-radius: 16px;
          padding: 14px;
          overflow-x: auto;
          font-family: JetBrains Mono, monospace;
          font-size: 0.92rem;
        }
        .hint-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 18px;
          gap: 16px;
        }
        .hint-copy {
          margin-top: 12px;
          color: #b1abcf;
          border-left: 3px solid #ff3d71;
          padding-left: 14px;
          line-height: 1.7;
        }
        .hint-bar button,
        .run-group button,
        .replay-controls button,
        .replay-select button,
        .language-tabs button {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          background: rgba(19, 11, 30, 0.95);
          color: #e8e2ff;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 180ms ease;
        }
        .hint-bar button:hover,
        .run-group button:hover,
        .replay-controls button:hover,
        .replay-select button:hover,
        .language-tabs button:hover {
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
        .language-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .language-tabs button.active,
        .replay-select button.active {
          background: #ff3d71;
          color: #0f0b1a;
          border-color: rgba(255,255,255,0.18);
        }
        .run-group {
          display: flex;
          gap: 12px;
        }
        .run-group button.primary {
          background: linear-gradient(135deg, #ff3d71 0%, #ff8a9f 100%);
          color: #fff;
          border: none;
        }
        .editor-shell {
          margin-top: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          overflow: hidden;
          background: rgba(11, 7, 21, 0.98);
        }
        .editor-shell textarea {
          width: 100%;
          min-height: 320px;
          border: none;
          outline: none;
          resize: vertical;
          padding: 22px;
          font-family: JetBrains Mono, monospace;
          font-size: 0.95rem;
          color: #f2efff;
          background: transparent;
          line-height: 1.62;
        }
        .status-strip {
          margin-top: 18px;
          display: grid;
          gap: 14px;
        }
        .status-strip p {
          margin: 0;
          color: #dcd6ff;
        }
        .progress-bar {
          height: 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .progress-bar > div {
          height: 100%;
          background: linear-gradient(90deg, #6effc4 0%, #ff3d71 100%);
          border-radius: 999px;
          transition: width 240ms ease;
        }
        .battle-feed {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          margin-top: 28px;
        }
        .feed-column {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          background: rgba(15, 10, 28, 0.96);
          padding: 22px;
        }
        .feed-column h3 {
          margin-top: 0;
          margin-bottom: 18px;
          font-size: 1.05rem;
        }
        .failure-card,
        .replay-card {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 18px;
          background: rgba(11, 7, 21, 0.95);
          margin-bottom: 16px;
        }
        .failure-meta {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
          color: #aba3d1;
          font-size: 0.85rem;
        }
        .failure-label {
          margin: 0 0 10px;
          font-weight: 600;
          color: #fff;
        }
        .failure-card pre,
        .replay-card pre {
          margin: 0;
          background: rgba(19, 11, 30, 0.95);
          border-radius: 16px;
          padding: 14px;
          overflow-x: auto;
          font-family: JetBrains Mono, monospace;
          font-size: 0.85rem;
          line-height: 1.65;
        }
        .failure-comment {
          margin-top: 10px;
          color: #b8b0e0;
          font-size: 0.92rem;
        }
        .replay-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }
        .replay-meta span {
          font-weight: 600;
          color: #fff;
        }
        .replay-meta small {
          color: #b8b0e0;
        }
        .replay-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 14px;
        }
        .replay-select {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }
        @media (max-width: 1080px) {
          .mockup-grid {
            grid-template-columns: 1fr;
          }
          .battle-feed {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
