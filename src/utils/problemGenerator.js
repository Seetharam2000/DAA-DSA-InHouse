function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choose(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function maxWindowSum(nums, k) {
  let current = nums.slice(0, k).reduce((sum, value) => sum + value, 0);
  let best = current;
  for (let i = k; i < nums.length; i += 1) {
    current += nums[i] - nums[i - k];
    best = Math.max(best, current);
  }
  return best;
}

function buildExample(nums, k) {
  const output = maxWindowSum(nums, k);
  return {
    input: `nums = [${nums.join(', ')}], k = ${k}`,
    output: `${output}`,
    explanation: `The largest sum of any contiguous subarray of length ${k} is ${output}.`,
  };
}

function createMutationCase(n, k) {
  const prefix = Array.from({ length: n - k }, () => randInt(0, 5));
  const suffix = Array.from({ length: k }, () => randInt(6, 12));
  const nums = [...prefix, ...suffix];
  const output = maxWindowSum(nums, k);
  return {
    input: `nums = [${nums.join(', ')}], k = ${k}`,
    output: `${output}`,
    explanation: `The highest window sum happens at the end of the array, so this catches off-by-one bugs on the final window.`,
    keywords: ['end', 'last', 'final', 'suffix'],
  };
}

export function createProblem() {
  const n = randInt(8, 12);
  const k = randInt(2, Math.min(5, n - 2));
  const nums = Array.from({ length: n }, () => randInt(0, 12));
  const target = maxWindowSum(nums, k);

  const title = choose(['Sliding Window Strike', 'Window Warrior', 'Rolling Sum Raid']);
  const difficulty = choose(['Boss tier: 3', 'Elite: 3', 'Challenge: 3']);

  const examples = [
    buildExample(nums.slice(0, n - 2).map((v) => (v % 2 === 0 ? v : v + 1)), k),
    buildExample(Array.from({ length: n }, () => randInt(0, 12)), k),
  ];

  const mutationCase = createMutationCase(n, k);

  return {
    id: `sliding-window-${Date.now()}`,
    title,
    difficulty,
    hp: randInt(100, 120),
    xpReward: 80,
    tags: ['Sliding Window', 'Array', `XP+${80}`],
    description: `Given an array of integers and a fixed window size ${k}, return the maximum sum of any contiguous subarray of length ${k}. This challenge regenerates every retry so you can’t memorize a single answer.`,
    examples,
    hint: 'Keep a rolling sum and slide the window by subtracting the outgoing element and adding the incoming one.',
    mutationCase: {
      prompt:
        'Boss revenge attack: a subtle off-by-one mutation was injected into your solution. Write a test showing the maximum window sum occurs at the end of the array.',
      ...mutationCase,
    },
    failureHall: [
      {
        id: 'f1',
        author: 'Anonymous Slayer',
        label: 'Close, but the window slid wrong',
        type: 'Off-by-one',
        snippet: 'for (let i = 0; i < nums.length - k; i++) {\n  const sum = nums.slice(i, i + k).reduce((a, b) => a + b, 0);\n  best = Math.max(best, sum);\n}\n',
        comment: 'Forgot that the final window starts at nums.length - k, not nums.length - k - 1.',
      },
      {
        id: 'f2',
        author: 'Code Rogue',
        label: 'Tried brute force on boss mode',
        type: 'TLE-ish',
        snippet: 'let best = 0;\nfor (let i = 0; i < nums.length; i++) {\n  for (let j = i; j < i + k; j++) {\n    current += nums[j];\n  }\n  best = Math.max(best, current);\n}\n',
        comment: 'Nice idea, but this feels too slow when the boss invites bigger arrays.',
      },
      {
        id: 'f3',
        author: 'The One-Liner',
        label: 'The shortcut that stalls',
        type: 'Logic bug',
        snippet: 'return nums.reduce((max, _, idx) => {\n  const sum = nums.slice(idx, idx + k).reduce((s, n) => s + n, 0);\n  return Math.max(max, sum);\n}, 0);\n',
        comment: 'Good thinking, but this mines past the end of the array on the last index.',
      },
    ],
    replays: [
      {
        id: 'r1',
        label: 'Top solver replay',
        summary: 'Watch how the solver converts a naive window into a rolling sum and catches the edge case at the end.',
        events: [
          { code: 'def max_window_sum(nums, k):\n  best = 0\n  for i in range(len(nums)):\n    window = nums[i:i+k]\n    best = max(best, sum(window))\n  return best\n' },
          { code: 'def max_window_sum(nums, k):\n  best = 0\n  for i in range(len(nums) - k + 1):\n    window = nums[i:i+k]\n    best = max(best, sum(window))\n  return best\n' },
          { code: 'def max_window_sum(nums, k):\n  current = sum(nums[:k])\n  best = current\n  for i in range(k, len(nums)):\n    current += nums[i] - nums[i - k]\n    best = max(best, current)\n  return best\n' },
        ],
      },
      {
        id: 'r2',
        label: 'Debugger play-by-play',
        summary: 'A second view with extra comments focused on the final-window trap.',
        events: [
          { code: 'def max_window_sum(nums, k):\n  sums = [sum(nums[i:i+k]) for i in range(len(nums) - k + 1)]\n  return max(sums)\n' },
          { code: 'def max_window_sum(nums, k):\n  current = sum(nums[:k])\n  best = current\n  for i in range(k, len(nums)):\n    current += nums[i] - nums[i - k]\n    if current > best:\n      best = current\n  return best\n' },
        ],
      },
    ],
    targetValue: `${target}`,
  };
}
