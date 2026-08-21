# Pixel Playground — Copyright & Asset Audit (V28)

## V28 changes
The public-facing game names were changed to original generic names to reduce unnecessary trademark/brand association:

| Previous display name | V28 display name |
|---|---|
| Wordle | Word Grid |
| Asteroids | Cosmic Drift |
| Pac-Man | Maze Chomper |
| Pong | Paddle Duel |
| Breakout | Brick Bounce |
| Flappy Bird Clone | Sky Hopper |
| Minesweeper | Mine Grid |
| 2048 | Tile Merge |
| Tetris | Falling Blocks |

The multiplayer protocol keys remain internal implementation identifiers where required for backwards compatibility; they are not presented as product names in the UI.

## Original expressive assets
- Game sprites are drawn procedurally with Canvas in the application; no third-party sprite sheet is bundled.
- Maze Chomper's player and enemy sprites were specifically redesigned for V28 and no longer use the familiar yellow-chomper/ghost silhouettes.
- Audio is generated at runtime using Web Audio oscillators. No third-party recordings, game ROM audio, or extracted sound effects are bundled.
- The CRT treatment, UI, background treatment, animations and game-specific canvas drawings are part of this project.

## Fonts
The project currently references Press Start 2P and VT323 from Google Fonts. Before commercial distribution, self-host the exact licensed font files and retain their license notices in the distribution.

## Legal scope
This audit is a practical risk-reduction checklist, not a legal opinion or a guarantee that the site is free from every possible intellectual-property claim. Copyright generally does not protect game ideas, methods of play, or titles, but it can protect original expressive artwork, text, software expression, and sound recordings. Trademark law can protect source-identifying words, symbols, designs, and other marks.

For a commercial launch, perform a trademark search for the final product/game names in the countries where the site will be marketed and have counsel review the final art, names, fonts, music/sound, and third-party services.
