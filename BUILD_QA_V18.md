# Pixel Playground V18 — NO-CLIP QA

Key layout decision: the browser page is now the scroll container. The game viewport never clips, crops, or auto-scales gameplay. If a game is taller/wider than the current window, the page can scroll so the entire game boundary remains reachable.

01. Wordle
02. Asteroids
03. Rock Paper Scissors
04. Guess the Number
05. Tic-Tac-Toe
06. Memory Card Match
07. Whack-a-Mole
08. Button Dodger
09. Pac-Man
10. Typing Speed Game
11. Snake
12. Pong
13. Breakout
14. Flappy Bird Clone
15. Minesweeper
16. 2048
17. Tetris

Automated checks:
- [PASS] 17 games registered
- [PASS] No game viewport clipping
- [PASS] No automatic game scaling
- [PASS] Whole page can scroll horizontally and vertically
- [PASS] Game screen does not own clipping
- [PASS] Whack full 560x320 field
- [PASS] Dodger full 600x300 field
- [PASS] Small game header
- [PASS] Controls remain present
- [PASS] Global keyboard scroll guard
- [PASS] Render health endpoint

Render: npm install / npm start / health check /health
