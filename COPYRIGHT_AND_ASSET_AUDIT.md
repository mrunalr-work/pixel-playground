# Pixel Playground — Copyright / Asset Risk-Hardening Audit (V27)

## Scope
This is a practical asset and copyright-risk checklist for the current build. It is **not legal advice** and cannot guarantee that a website is legally risk-free in every jurisdiction.

## What is original / controlled in this build
- Pixel Playground interface code and layout are project code.
- Game implementations are original browser implementations written for this project.
- Game art used by the game renderers is drawn with Canvas/CSS primitives rather than copied sprite sheets.
- Game audio is synthesized with the Web Audio API; no third-party sound files are bundled.
- `public/background.png` is the supplied/user-provided background asset. Confirm that the project owner has the right to use it commercially before launch.
- The project does not bundle ROMs, extracted game sprites, screenshots, game music, or third-party game soundtracks.

## Third-party font notice
The project uses **Press Start 2P** and **VT323** through Google Fonts. Both are distributed under the SIL Open Font License (OFL) 1.1. The current deployment references Google Fonts rather than bundling modified font binaries.

Before commercial launch, keep a copy of the applicable font license/attribution notices with the deployment records and review the current font license terms.

## Game titles / trademark caution
Names such as Wordle, Asteroids, Pac-Man, Breakout, Pong, 2048, Tetris, and Flappy Bird are names associated with third-party games. Copyright law generally does not protect game ideas, methods of play, or titles by copyright, but names can have trademark rights and the expressive presentation of a game can be protected.

For a commercial launch, do not imply affiliation, sponsorship, or endorsement. Prefer original descriptions, original artwork, original sound, and original branding. If the project is marketed using third-party game names, perform a trademark clearance review for the countries in which the site will operate.

## Launch checklist
- Confirm ownership/license for the supplied background image.
- Keep font license notices and source records.
- Keep a dated archive of original source files and creation history.
- Do not add copied sprites, ROM assets, game music, logos, character art, screenshots, or ripped sound effects from the named games.
- Add a site Terms/Privacy page before collecting accounts, analytics, or multiplayer data.
- Obtain legal review before commercial launch if the site will use third-party game titles prominently or be monetized.
