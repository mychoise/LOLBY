# Lolby Backend

NestJS + Socket.io realtime API for the Lolby browser party-game platform.

## Description

The backend provides the realtime room/lobby shell and game infrastructure for Lolby:

- WebSocket gateway (Socket.io) for real-time room sync, join-by-code, and lobby/host controls.
- `MemeModule` — serves random meme templates (bounded to 2–7 players) used by the Make It Meme game mode.
- Drizzle ORM over PostgreSQL for persistence (e.g. meme image templates), with migrations managed by drizzle-kit.

## Tech Stack

- [NestJS](https://nestjs.com) 11 (with `@nestjs/platform-socket.io` and `@nestjs/websockets`)
- Socket.io (realtime rooms)
- [Drizzle ORM](https://orm.drizzle.team) + `pg` (PostgreSQL)
- `@nestjs/config` for environment configuration
- TypeScript, Jest (unit/e2e tests)

## Prerequisites

- Node.js (>= 18; current dependencies target Node 20+)
- A PostgreSQL instance reachable via `DATABASE_URL`

## Project Setup

```bash
cd backend
npm install
# create a .env file with DATABASE_URL (and optional PORT)
# no .env.example is committed — create .env manually (see Environment Variables)
```

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | — | Postgres connection string (used by Drizzle + `pg`) |
| `PORT` | no | `3000` | HTTP/WebSocket listen port |

## Database (Drizzle)

Schema lives at `src/drizzle/schema/index.ts` and migrations are generated into `./drizzle/migrations` (see `drizzle.config.ts`, dialect `postgresql`).

```bash
npx drizzle-kit generate   # generate SQL migrations from schema -> ./drizzle/migrations
npx drizzle-kit migrate    # apply pending migrations to the database
npm run start:dev          # seeds meme templates on startup via MemeService.onModuleInit()
```

Seeding runs automatically when the app boots — there is no standalone `npm run seed` script. The `MemeService` loads active meme templates from the database on `onModuleInit`.

## Run the project

```bash
npm run start:dev    # watch mode (recommended for development)
npm run start:prod   # node dist/main (after npm run build)
```

The server listens on `PORT` (default `3000`). CORS is allowed for `http://localhost:5173`, `http://192.168.1.71:5173`, and `https://lolby-4cnf.vercel.app`.

## Tests

```bash
npm run test      # unit tests (jest)
npm run test:e2e  # end-to-end tests
npm run test:cov  # coverage report
```

## API / Modules

- **WebSocket gateway** (`@nestjs/websockets` + Socket.io): realtime room/lobby events for join-by-code multiplayer.
- **`MemeModule`**: serves random meme templates. `MemeService.getRandomMemeTemplate(playerCount)` selects an active template and throws if `playerCount` is outside the supported 2–7 range.

> Only the endpoints/modules that exist in the repo are documented here. Other game modules are not yet implemented.

## License

UNLICENSED — All rights reserved.
