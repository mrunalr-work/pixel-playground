# Pixel Playground V21 — Final QA

## Requested changes
- PIXEL PLAYGROUND is a yellow button in the fixed dashboard.
- Player username remains fixed on the right side of the dashboard.
- Legacy PIXEL PLAYGROUND / HOME heading above the game list is suppressed.
- Wordle composition is centered and its instruction text wraps instead of overlapping the game boundary.
- 2048 board is centered as a complete composition.
- Tetris board + side information are centered as one complete composition.
- Existing mechanics, games, multiplayer architecture, CRT styling, controls, and no-clip page scrolling are preserved.

## No-clip rule
No game-stage `overflow:hidden` or transform scaling is introduced by V21. The browser/page remains responsible for scrolling when a game is wider or taller than the viewport.
