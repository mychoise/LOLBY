# Lolby Frontend

React + Vite + Socket.io client for the Lolby browser party-game platform.

## Description

The frontend is the browser client for Lolby. Players open it on their phones or laptops, join a room by code, and play in real time. It connects to the Lolby backend over `socket.io-client` for room/lobby and game events.

## Tech Stack

- React 19
- Vite 8
- TypeScript
- socket.io-client (realtime connection to the backend)
- ESLint

## Prerequisites

- Node.js (>= 18; current dependencies target Node 20+)
- A running Lolby backend (see `backend/README.md`) for realtime gameplay

## Setup

```bash
cd frontend
npm install
npm run dev      # Vite dev server on http://localhost:5173
```

## Build

```bash
npm run build    # tsc -b && vite build -> dist/
npm run preview  # preview the production build locally
```

## Lint

```bash
npm run lint
```

## Connecting to backend

- In development, the backend allows CORS from `http://localhost:5173`, so the Vite dev server can talk to `http://localhost:3000` directly.
- The Socket.io client setup lives in `src/socket.ts`.
- For production, the backend allows the hosted URL `https://lolby-4cnf.vercel.app`.

## License

UNLICENSED — All rights reserved.
