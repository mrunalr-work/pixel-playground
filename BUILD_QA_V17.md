# Pixel Playground V17 — Layout QA

The V17 build addresses the clipping problem at its root:
- Dedicated game stage with overflow hidden.
- Every game's actual rendered content is measured before display.
- Complete game content is uniformly scaled down when necessary.
- A 2% safety margin is applied whenever scaling is required.
- Controls are now a compact collapsible tab so they do not steal game space.
- Arrow/WASD page-scroll prevention remains globally active.

Games checked in the source:
01. Wordle — SOLO
02. Asteroids — SOLO
03. Rock Paper Scissors — MULTIPLAYER
04. Guess the Number — SOLO
05. Tic-Tac-Toe — MULTIPLAYER
06. Memory Card Match — SOLO
07. Whack-a-Mole — SOLO
08. Button Dodger — SOLO
09. Pac-Man — SOLO
10. Typing Speed Game — SOLO
11. Snake — SOLO
12. Pong — MULTIPLAYER
13. Breakout — SOLO
14. Flappy Bird Clone — SOLO
15. Minesweeper — SOLO
16. 2048 — SOLO
17. Tetris — SOLO

Automated source checks:
- [PASS] 17 games registered
- [PASS] All solo renderer functions present
- [PASS] Game stage has no internal scrolling
- [PASS] Adaptive fit system present
- [PASS] Controls moved to collapsible tab
- [PASS] Global Arrow/WASD scroll guard present
- [PASS] 17-game build config
- [PASS] Render health endpoint
- [PASS] Render deployment manifest

Render deployment:
- Build command: npm install
- Start command: npm start
- Health check: /health

Deployment note: the package is Render-ready. I cannot push it directly into the user's Render account from this environment.
