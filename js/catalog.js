/* Cortex Arcade — the game catalogue.
   Add a game by pushing one object. `src` may point at a bundled file in
   games/ (the six below) or at any URL you are allowed to embed, e.g.
   { slug: 'my-game', name: 'My Game', category: 'Arcade', src: 'https://example.com/game' }.
   `portrait: true` renders the frame in a 9:16 phone-shaped stage. */
window.CORTEX_GAMES = [
  {
    slug: 'snake',
    name: 'Neon Snake',
    category: 'Arcade',
    blurb: 'Grow the snake, dodge your own tail.',
    src: 'games/snake.html'
  },
  {
    slug: '2048',
    name: '2048',
    category: 'Puzzle',
    blurb: 'Slide the tiles, reach 2048.',
    src: 'games/2048.html'
  },
  {
    slug: 'breakout',
    name: 'Brick Breaker',
    category: 'Arcade',
    blurb: 'Clear every brick without losing the ball.',
    src: 'games/breakout.html'
  },
  {
    slug: 'flappy',
    name: 'Flappy Dart',
    category: 'Skill',
    blurb: 'One button, infinite pipes.',
    src: 'games/flappy.html',
    portrait: true
  },
  {
    slug: 'memory',
    name: 'Memory Match',
    category: 'Puzzle',
    blurb: 'Find every matching pair before the clock runs out.',
    src: 'games/memory.html'
  },
  {
    slug: 'reaction',
    name: 'Reaction Grid',
    category: 'Skill',
    blurb: 'Tap the lit square as fast as you can.',
    src: 'games/reaction.html'
  }
];

/* The catalogue page groups by category and the chips are built from this list,
   so adding a new category name above is enough. */
window.CORTEX_CATEGORIES = ['All', 'Arcade', 'Puzzle', 'Skill'];
