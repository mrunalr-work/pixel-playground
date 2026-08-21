# Pixel Playground V27 — Build QA

## Requested shell changes
- Fixed dashboard clearance on desktop so the game panel/menu begin below the fixed dashboard.
- Desktop game menu remains sticky while the page scrolls.
- Desktop game menu collapse now changes the grid column itself, giving the game panel the released horizontal space.
- Expanding the menu restores the original game/menu proportions.
- Mobile rules remain separate from the desktop shell rules.
- Existing game mechanics, game renderers, controls, background, dashboard, achievements, multiplayer, and visual aesthetic are preserved.

## No-clip policy
- The page owns vertical scrolling when content is taller than the viewport.
- The game screen is not an internal scroll container.
- The game stage is not forcibly scaled or clipped by the V27 shell patch.
- Wordle, 2048, and Tetris retain their centered composition rules.

## Code checks
- `node --check` passed for the arcade inline JavaScript.
- `python -m json.tool` passed for `DEFAULT_BUILD_CONFIG.json`.
- Source archive integrity checked before packaging.

## Legal / asset hardening
- Added `COPYRIGHT_AND_ASSET_AUDIT.md`.
- Added `THIRD_PARTY_NOTICES.txt`.
- Confirmed the project contains no bundled ROMs, ripped sprite sheets, third-party music, or extracted sound-effect files.
- Font licensing is documented for Press Start 2P and VT323.
- The supplied background is documented as a user/project-provided asset that must have commercial-use permission confirmed before launch.

## Important
This QA is an engineering/asset checklist, not a legal opinion or guarantee of non-infringement.
