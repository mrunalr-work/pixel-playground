# Pixel Playground V23 QA

Baseline: V22

Changes:
- Breakout paddle movement speed increased by 25% (7 -> 8.75 units/frame factor).
- Snake remains stationary in its original position until an arrow key is pressed; WASD remains available after start.
- Typing Speed now uses long paragraph prompts and displays elapsed time as MM:SS.
- Footer branding changed to `DEVELOPED BY MRUNAL`.
- Added responsive mobile/desktop rules so game canvases and typing content fit the available game column on smaller screens while preserving the V22 desktop/no-clip baseline.

Checks:
- arcade.html inline JavaScript syntax: PASS
- server.js syntax: PASS
- 17-game registry present: PASS
- Breakout paddle factor 8.75 present: PASS
- Snake idle/start state present: PASS
- Paragraph typing prompts present: PASS
- Footer branding updated in arcade + home: PASS
