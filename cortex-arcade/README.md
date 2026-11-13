# Cortex Arcade

A small browser-arcade site dressed up as a browser window: glossy tabs, a fake
omnibox, neon glow, falling balls and a catalogue of eleven self-contained games.
Everything is plain HTML, CSS and JavaScript — no build step, no dependencies, no
network calls.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero logo, search with suggestions, local session stats |
| `games.html` | Full catalogue: category chips, live search, Random card |
| `play.html?g=<slug>` | Play shell: game title, Reload, Fullscreen, iframe stage |
| `settings.html` | Themes, tab title/icon dressing, background and suggestion toggles |

## Games

`games/snake.html` (Neon Snake), `2048.html`, `breakout.html` (Brick Breaker),
`flappy.html` (Flappy Dart), `memory.html` (Memory Match), `reaction.html`
(Reaction Grid), `pong.html` (Paddle Duel), `mines.html` (Minefield),
`tictactoe.html` (Three in a Row), `simon.html` (Colour Echo) and `whack.html`
(Mole Rush). Each is a standalone page (own canvas or grid, own input handling) so it
can be opened directly or embedded in any other page.

Cards show `assets/thumbs/<slug>.svg`; if a thumbnail is missing the card falls back
to the game's initials, so adding a game never leaves a broken image.

## Run it

Any static file server works. From this folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/
```

Opening `index.html` straight from disk also works, but a server is recommended so the
play shell can embed the games (`file://` iframes are blocked by some browsers).

## Add a game

1. Drop the game page in `games/` (a single self-contained HTML file is enough).
2. Add one entry to `window.CORTEX_GAMES` in `js/catalog.js`:

```js
{ slug: 'my-game', name: 'My Game', category: 'Arcade',
  blurb: 'One line shown on the card.', src: 'games/my-game.html' }
```

`src` may also be any embeddable URL. Add `portrait: true` for a 9:16 phone-shaped
stage (good for one-thumb games). New categories only need their name in
`window.CORTEX_CATEGORIES`.

## Notes

* The stats block on the home page is counted in your own browser from `localStorage`
  (tabs open now, busiest today, days visited). A static site cannot see other people's
  traffic, so these are your own numbers, not a worldwide total.
* Settings write to `localStorage` under the `cx_` prefix (`cx_theme`, `cx_tab_title`,
  `cx_tab_icon`, `cx_balls`, `cx_suggest`). "Reset" clears them all.
* Every asset is local: the logo is `assets/logo.svg`, themes live in `style.css`.
