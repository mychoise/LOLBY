# Lolby

A browser-based party game platform. No sign-up, no app install — create a room, share the code, play with friends on your phones.

## Overview

Inspired by the Jackbox Party Pack format: one host creates a room, friends join via a code, host picks a game, everyone plays from their own device.

## Status

🚧 Pre-alpha. Core room/lobby shell not yet built. No games shipped yet.

## Features / Concept

One platform, multiple game modes, all sharing the same room infrastructure:

| Game | Format | Status |
| --- | --- | --- |
| Make It Meme | Caption or react to memes | Concept — rules undecided |
| Skribble | Draw & guess (skribbl.io-style) | Not started |
| TikTok Comments Section | TBD | Concept only |
| News | TBD | Concept only |
| Fake Reviews | TBD | Concept only |
| Imposter | Among Us-style hidden role/discussion | Not started |
| Guess the Lie | Fibbage-style bluffing game | Not started |

## Architecture

**Shared shell (build once, reuse for every game):**

- Room creation with a short join code
- Join-by-code, no auth required
- Lobby: player list, host controls
- Host selects which game to play
- Real-time sync via WebSockets (Socket.io)
- Reconnection handling (phone lock/tab background/wifi drop shouldn't kill a game)
- Host migration if host disconnects

**Per-game modules** plug into the shell and only implement their own round logic, state, and scoring.

## Tech Stack

- Backend: NestJS + Socket.io
- ORM/DB: Drizzle ORM + PostgreSQL (Neon)
- Cache/session state: Redis (planned)
- Object storage (meme templates, images): Cloudflare R2 (planned)
- Frontend: React + Vite
- Hosting: Backend on Railway, frontend on Vercel

This repo is a monorepo with two packages:

- `backend/` — NestJS + Socket.io + Drizzle (API & realtime)
- `frontend/` — React + Vite client

## Project Structure

    ```text
lolby/
├── backend/   # NestJS + Socket.io + Drizzle (API & realtime)
└── frontend/  # React + Vite client
```

## Prerequisites

- Node.js (>= 18; current dependencies target Node 20+)
- PostgreSQL instance (connection string via `DATABASE_URL`)
- Redis and Cloudflare R2 — not yet required (planned for later)

## Local Setup

1. Clone the repository.

2. Start the backend:

   ```bash
   cd backend
   npm install
   # create a .env file with DATABASE_URL (and optional PORT, default 3000)
   npm run start:dev   # listens on http://localhost:3000
   ```

   Example `.env`:

   ```bash
   DATABASE_URL=postgres://user:password@localhost:5432/lolby
   PORT=3000
   ```

   Database migrations and meme-template seeding run automatically on startup (see `backend/README.md`).

3. Start the frontend (in a separate terminal):

   ```bash
   cd frontend
   npm install
   npm run dev   # Vite dev server on http://localhost:5173
   ```

   The backend allows CORS from `http://localhost:5173` in development, so the frontend can talk to it directly.

## Build Order

1. Core room/lobby shell — room create/join, player list, host controls, reconnection — validated with a trivial placeholder mode before any real game is built
2. First real game module (simplest proven mechanic — candidates: Skribble, Imposter, or Guess the Lie)
3. Remaining games added one at a time into the same shell

## Open Decisions

- [ ] Make It Meme: exact game loop and win condition (currently undefined)
- [ ] TikTok Comments Section / News / Fake Reviews: no defined mechanics yet
- [ ] Game selection: does host pick a game per room, or is each game a separate room type/URL?
- [ ] Meme template source: self-hosted DB + Cloudflare R2 (decided) — seeding script not yet wired to an npm script

## License

UNLICENSED — All rights reserved.
