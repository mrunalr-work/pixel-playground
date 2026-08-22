# Pixel Playground V29 — QA Notes

## Requested fixes
- Mobile hub no longer reveals the underlying game selector through the modal.
- Word Grid uses a compact five-cell board and a touch-friendly QWERTY keyboard on mobile.
- Memory Card Match cards always show a visible back marker (`?`) instead of appearing empty.
- Whack-a-Mole target label is constrained to prevent clipping.
- Brick Bounce mobile controls are centered; paddle movement speed is increased by 20% (10.5 px/frame baseline vs 8.75).
- Falling Blocks removes the Next Piece window; gameplay is centered and the controls panel remains visible below the game.
- Desktop behavior remains unchanged except for the requested Brick Bounce paddle-speed change and the visible Memory Card backs.
- Multiplayer/Profile/Achievements/Daily hub views do not expose the underlying game selector on mobile.

## Validation
- JavaScript syntax checked with `node --check public/arcade.html` (extracting inline script separately where required).
- JSON configuration remains valid.
- ZIP archive integrity checked after packaging.
