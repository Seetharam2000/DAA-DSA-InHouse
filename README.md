# ByteBrawl

An interactive, gamified alternative to LeetCode — coding practice that feels like a game, not a chore.

## What makes it different

- **Boss-fight problems** — difficulty is an HP bar, not a badge. Clear test cases to defeat the boss.
- **AI-generated questions** — request problems by topic/difficulty instead of picking from a static bank.
- **XP, streaks, and levels** — visible progress loop instead of a plain solved/unsolved count.
- **Socratic hints** — a co-pilot that nudges you toward the insight instead of handing over the answer.

## Tech stack

- React + Vite
- Tailwind CSS
- Monaco Editor (code editing)
- Judge0 / Piston (code execution)
- `@react-three/fiber` (3D particle effects on login)
- Zustand (state)

## Getting started

```bash
git clone <repo-url>
cd lvlup
npm install
npm run dev
```

## Project structure

```
src/
  components/   UI components (arena, editor, boss card, login, etc.)
  store/        Zustand global state
  styles/       Design tokens / theme
```

## Status

 In development — core arena UI and login screen built, code execution and AI problem generation in progress.

