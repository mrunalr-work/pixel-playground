# Pixel Playground — Final

Retro 16-game arcade with Node.js + Socket.IO multiplayer.

## Multiplayer
Rock Paper Scissors, Tic-Tac-Toe and Pong use a server-authoritative room model. Players can create a room, copy an HTTPS invite URL, search online usernames, accept invitations, or join an open room.

## Deploy on Render
- Runtime: Node
- Root Directory: blank
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: Free

The server listens on `process.env.PORT` and exposes `/health`.

## Production notes
For a larger public launch, add persistent authentication/database, Redis for multi-instance Socket.IO, rate limiting, analytics, moderation, and durable match history. The current single-instance deployment is designed for a small free-tier arcade.

## Default Build Baseline

`DEFAULT_BUILD_CONFIG.json` is the source of truth for the current Pixel Playground configuration.
Future builds must preserve the game mechanics and arcade layout in that file unless the user explicitly requests a change.
