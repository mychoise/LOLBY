# Lolby

A browser-based party game platform. No sign-up, no app install — create a room, share the code, play with friends on your phones.

Inspired by the Jackbox Party Pack format: one host creates a room, friends join via a code, host picks a game, everyone plays from their own device.

## Status

🚧 Pre-alpha. Core room/lobby shell not yet built. No games shipped yet.

## Concept

One platform, multiple game modes, all sharing the same room infrastructure:

| Game | Format | Status |
|---|---|---|
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

## Planned Stack

- Backend: NestJS + Socket.io
- ORM/DB: Drizzle ORM + PostgreSQL (Neon)
- Cache/session state: Redis
- Object storage (meme templates, images): Cloudflare R2
- Frontend: React + Vite
- Hosting: Backend on Railway, frontend on Vercel

## Build Order

1. Core room/lobby shell — room create/join, player list, host controls, reconnection — validated with a trivial placeholder mode before any real game is built
2. First real game module (simplest proven mechanic — candidates: Skribble, Imposter, or Guess the Lie)
3. Remaining games added one at a time into the same shell

## Open Decisions

- [ ] Make It Meme: exact game loop and win condition (currently undefined)
- [ ] TikTok Comments Section / News / Fake Reviews: no defined mechanics yet
- [ ] Game selection: does host pick a game per room, or is each game a separate room type/URL?
- [ ] Meme template source: self-hosted DB + Cloudflare R2 (decided) — seeding script not yet written

## Local Setup

```bash
# TODO: fill in once the backend/frontend scaffolding exists
```

## License

TBD
