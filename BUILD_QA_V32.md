# Pixel Playground — V32 QA

## Scope
Mobile-only Falling Blocks layout correction. Desktop layout and game mechanics are unchanged.

## Verified source changes
- Falling Blocks gameplay board is centered on mobile.
- READY status line is hidden on mobile and no longer reserves layout space.
- Mobile controls sit directly below the gameplay board.
- Controls remain a 2-column layout: LEFT / RIGHT, then ROTATE / SOFT DROP.
- Control panel is width-constrained to the mobile game container and uses box sizing to prevent horizontal clipping.
- Existing stats remain inside the gameplay frame.
- No changes were made to other games or desktop CSS.

## Packaging
Source baseline: `pixel_playground_FINAL_V31(1).zip`
Output: `pixel_playground_FINAL_V32_mobile_falling_blocks.zip`
