# SOS Board Game (GAMEZONE)

A small TypeScript + React playground with a paper-and-ink aesthetic that implements the classic SOS grid game and scaffolding for a Tombola experience. The app provides options to play vs Computer or vs a Friend and includes a puzzles section; Tombola and Daily Puzzles are marked "Coming Soon".

## Features
- Clean paper-style UI (Tailwind + custom CSS)
- Play SOS:
  - VS COMPUTER (AI mode)
  - VS FRIENDS (local multiplayer)
- Puzzles data included (src/data/puzzles.ts)
- Tombola pages scaffolded (auth, lobby, room, game) — currently not fully implemented

## Stack
- Languages: TypeScript, CSS, small JS/HTML
- Framework / runtime: React (via Vite)
- Notable libraries:
  - react, react-dom
  - react-router-dom (routing)
  - tailwindcss + postcss (styling)
  - sonner (toasts)
  - lucide-react (icons)

## Getting started (development)
1. Clone the repository
   - git clone https://github.com/sravan99k/sos-bord-game.git
2. Install dependencies
   - npm install
3. Start the dev server
   - npm run dev
   Vite will print the local dev URL (e.g., http://localhost:5173).

## Build & preview
- Build production bundle:
  - npm run build
- Preview production build locally:
  - npm run preview

## Scripts (from package.json)
- dev — start Vite dev server
- build — run TypeScript compile then Vite build
- preview — preview the production build
- lint — run ESLint

Example:
```bash
npm install
npm run dev

url-sos-bord-game.vercel.app
