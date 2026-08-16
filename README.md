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

## V13 Product Baseline

- The supplied `public/background.png` is the default visual background.
- The Arcade Hub now separates **Solo Games** and **Multiplayer** into tabs.
- Multiplayer contains **Create Room**, invite-link sharing, room-code join, friend search, and open rooms.
- Profile, live leaderboard, achievements, and daily challenge are included.
- Future builds must preserve all existing game mechanics and the arcade layout unless explicitly requested otherwise.
- `DEFAULT_BUILD_CONFIG.json` is the baseline source of truth.


## V14 Product Baseline

- Persistent top navigation is always visible in the game view.
- Homepage uses the supplied Retro BG artwork as its visual background.
- Homepage includes ENTER ARCADE, QUICK PLAY, and RANDOM GAME.
- Quick Play / Random Game select a solo game after login.
- Breakout increases ball speed by 5% on every paddle hit.
- CRT scanlines, subtle flicker, pixel particles, button press motion, coin-in messaging, and a short READY countdown are part of the default arcade presentation.
- Achievement set expanded to 12 achievements with event-based unlock hooks for Snake, Breakout, Asteroids, 2048, Minesweeper, and Tetris.
- `DEFAULT_BUILD_CONFIG.json` remains the source of truth for future builds.


## V17 Product Baseline

- Quick Play removed; **RANDOM GAME** is the single random-launch action.
- Random Game uses the former Quick Play primary-button styling.
- The six dashboard categories are rendered once, in a fixed top navigation bar.
- The internal duplicate dashboard tab row was removed.
- Game panels use a responsive viewport so the selected game and its controls fit the window more consistently.
- Breakout playfield is vertically expanded and the paddle remains near the bottom with more separation from the brick field.
- Breakout paddle hits increase current ball speed by 5%.
- Responsive breakpoints improve desktop, tablet, and mobile scaling.
- V17 visual polish keeps the same retro aesthetic while tightening borders, spacing, hierarchy, and focus states.
