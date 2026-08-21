# Pixel Playground V28 — QA

## Requested changes
- Replaced potentially brand-associated game display names with original generic names:
  - Word Grid
  - Cosmic Drift
  - Maze Chomper
  - Paddle Duel
  - Brick Bounce
  - Sky Hopper
  - Mine Grid
  - Tile Merge
  - Falling Blocks
- Replaced the Maze Chomper player/enemy canvas silhouettes with original sprites.
- Kept all game mechanics intact except Maze Chomper difficulty, which is now Easy.
- Maze Chomper uses fewer enemies, a slower update interval, and less aggressive path selection.
- Start/end audio remains synthesized in-browser; the cue timbre was changed and no external sound recordings are bundled.
- Desktop dashboard is collapsible.
- Collapsed dashboard reduces the reserved vertical space so the game panel moves up without intersecting the dashboard.
- Desktop game menu is sticky and its internal list is independently scrollable. The menu itself does not move with the game content.
- Mobile dashboard/menu behavior remains under the existing mobile-only rules.

## Verification
- `public/arcade.html` JavaScript extracted and passed `node --check`.
- No missing solo renderer detected by the built-in `validateGameRenderers()` check.
- ZIP integrity verified after packaging.

## IP note
This is an implementation/asset cleanup, not a legal guarantee. Copyright generally does not protect game ideas or methods of play, while expressive art/software/audio can be protected; trademarks can protect source-identifying names/designs. Final commercial clearance should still be reviewed by an IP professional.
