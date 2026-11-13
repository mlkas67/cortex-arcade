/* Cortex Arcade — play shell: loads the chosen game in an iframe. */
(function () {
  'use strict';
  var games = window.CORTEX_GAMES || [];
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('g') || '';
  var game = games.filter(function (g) { return g.slug === slug; })[0];

  var frame = document.getElementById('gameFrame');
  var stage = document.getElementById('stage');
  var nameEl = document.getElementById('playName');
  var catEl = document.getElementById('playCategory');
  var base = document.body.dataset.base || '';

  function notFound() {
    nameEl.textContent = 'Game not found';
    catEl.textContent = 'Unavailable';
    stage.innerHTML = '<div class="empty" style="display:grid;place-items:center;height:100%">' +
      'No game matches “' + (slug ? window.CortexSearch.escapeHtml(slug) : 'this link') + '”. ' +
      '<a class="btn btn-primary" href="games.html" style="margin-top:14px">Browse all games</a></div>';
    document.getElementById('playReload').disabled = true;
    document.getElementById('playFull').disabled = true;
  }

  if (!game) {
    notFound();
    return;
  }

  document.title = game.name + ' · Cortex Arcade';
  nameEl.textContent = game.name;
  catEl.textContent = game.category;
  if (game.portrait) stage.classList.add('portrait');
  frame.src = game.src;

  // Games listen for keys on their own document, so the frame needs focus or
  // nothing happens until the player clicks inside it.
  function focusGame() {
    try { frame.focus({ preventScroll: true }); } catch (e) { frame.focus(); }
  }

  frame.addEventListener('load', function () { focusGame(); });
  stage.addEventListener('pointerdown', focusGame);
  frame.addEventListener('mouseenter', focusGame);

  document.getElementById('playReload').addEventListener('click', function () {
    frame.src = game.src;
    window.Cortex.toast('Reloaded ' + game.name);
  });

  document.getElementById('playFull').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (stage.requestFullscreen) stage.requestFullscreen();
  });

  document.addEventListener('fullscreenchange', function () {
    document.getElementById('playFull').textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen';
  });
})();
