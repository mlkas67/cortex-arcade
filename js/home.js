/* Cortex Arcade — home page wiring. */
(function () {
  'use strict';
  var games = window.CORTEX_GAMES || [];
  var tagline = document.getElementById('homeTagline');
  if (tagline && games.length) {
    var words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    tagline.textContent = (words[games.length] || games.length) + ' original games, zero installs. pick one.';
  }

  window.CortexSearch.attach(
    document.getElementById('homeInput'),
    document.getElementById('homeSuggest'),
    { emptyAll: 4 }
  );
})();
