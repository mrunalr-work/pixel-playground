# Pixel Playground 2.0

A retro 16-game browser arcade with a real-time multiplayer foundation.

## Multiplayer
Server-authoritative multiplayer is implemented for:
- Rock Paper Scissors
- Tic-Tac-Toe
- Pong

The server handles:
- usernames / online presence
- username search
- room creation
- room capacity
- invite links
- friend invitations
- RPS result resolution
- Tic-Tac-Toe turn validation
- Pong physics and paddle state

## Run locally

Requirements: Node.js 18+

```bash
npm install
npm start
```

Open:
http://localhost:3000

## Deploy

Deploy the entire project to a Node-compatible host such as Render, Railway, Fly.io, or a VPS.

Set the port from the platform's PORT environment variable (the server already does this).

For production:
1. Use HTTPS.
2. Restrict CORS to your own domain.
3. Add Redis if you run multiple server instances.
4. Add PostgreSQL/Supabase for persistent accounts, profiles, friends, and leaderboards.
5. Add rate limiting and server-side input validation.
6. Use a persistent session/authentication system instead of ephemeral usernames.

## Recommended production architecture

Browser -> HTTPS load balancer -> Node/Socket.IO -> Redis adapter -> PostgreSQL/Supabase

The current build is deliberately simple enough to run as one Node process while establishing the correct multiplayer model.
