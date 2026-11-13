/* Cortex Arcade — shared live-search box used by the home page and the games page. */
(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[ch];
    });
  }

  function matches(game, query) {
    if (!query) return true;
    var haystack = (game.name + ' ' + game.category + ' ' + (game.blurb || '')).toLowerCase();
    return query.toLowerCase().split(/\s+/).every(function (word) { return haystack.indexOf(word) >= 0; });
  }

  function playUrl(game) { return 'play.html?g=' + encodeURIComponent(game.slug); }

  /* Attach a suggestion list to a search input.
     options.onPick(game)  — called when a row is chosen (defaults to navigating)
     options.emptyAll      — rows shown while the box is empty (default 4) */
  function attach(input, container, options) {
    var opts = options || {};
    var games = window.CORTEX_GAMES || [];
    var activeIndex = -1;
    var rows = [];

    function close() { container.hidden = true; container.innerHTML = ''; activeIndex = -1; rows = []; }

    function open(list) {
      if (!list.length) {
        container.innerHTML = '<div class="empty">No game matches that. Try another word.</div>';
        container.hidden = false;
        rows = [];
        return;
      }
      container.innerHTML = list.map(function (game, i) {
        return '<div class="suggest-row" data-index="' + i + '" role="option">' +
          '<span><strong>' + escapeHtml(game.name) + '</strong> <small>· ' + escapeHtml(game.category) + '</small></span>' +
          '<small>Enter ⏎</small></div>';
      }).join('');
      container.hidden = false;
      rows = list;
      activeIndex = -1;
    }

    function pick(game) {
      close();
      if (opts.onPick) opts.onPick(game);
      else window.location.href = playUrl(game);
    }

    function refresh() {
      var query = input.value.trim();
      var list = games.filter(function (game) { return matches(game, query); });
      if (!query) list = list.slice(0, opts.emptyAll || 4);
      list = list.slice(0, 8);
      rows = list;
      if (window.Cortex.store.get('cx_suggest', 'on') !== 'on') { close(); return; }
      if (!query && document.activeElement !== input) close();
      else open(list);
    }

    function highlight(delta) {
      if (!rows.length) return;
      activeIndex = (activeIndex + delta + rows.length) % rows.length;
      container.querySelectorAll('.suggest-row').forEach(function (row, i) {
        row.style.background = i === activeIndex ? 'var(--surface-3)' : '';
      });
    }

    input.addEventListener('input', refresh);
    input.addEventListener('focus', refresh);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); highlight(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(-1); }
      else if (e.key === 'Enter') {
        var game = activeIndex >= 0 ? rows[activeIndex] : rows[0];
        if (game) { e.preventDefault(); pick(game); }
      } else if (e.key === 'Escape') close();
    });

    container.addEventListener('click', function (e) {
      var row = e.target.closest('.suggest-row');
      if (!row) return;
      var game = rows[Number(row.dataset.index)];
      if (game) pick(game);
    });

    document.addEventListener('click', function (e) {
      if (!container.contains(e.target) && e.target !== input) close();
    });

    window.Cortex.bindSlash(input);
    return { close: close, playUrl: playUrl, matches: matches };
  }

  window.CortexSearch = { attach: attach, escapeHtml: escapeHtml, playUrl: playUrl, matches: matches };
})();
