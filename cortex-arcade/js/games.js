/* Cortex Arcade — games catalogue page: chips, cards, filtering. */
(function () {
  'use strict';
  var games = window.CORTEX_GAMES || [];
  var grid = document.getElementById('grid');
  var chipsEl = document.getElementById('chips');
  var esc = window.CortexSearch.escapeHtml;
  var activeCategory = 'All';
  var activeQuery = '';

  function initials(name) {
    var words = name.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function visibleGames() {
    return games.filter(function (game) {
      var inCategory = activeCategory === 'All' || game.category === activeCategory;
      return inCategory && window.CortexSearch.matches(game, activeQuery);
    });
  }

  var randomCard = { slug: '__random', name: 'Random', category: 'Surprise me', blurb: 'Let the arcade choose for you.' };

  function cardHtml(game) {
    var isRandom = game.slug === '__random';
    var href = isRandom ? '#random' : window.CortexSearch.playUrl(game);
    var thumb = isRandom
      ? '<span class="random-mark" aria-hidden="true">?</span>'
      : '<img src="assets/thumbs/' + esc(game.slug) + '.svg" alt="" loading="lazy" ' +
        'onerror="this.remove();this.parentNode.classList.add(\'no-thumb\')">' +
        '<span class="thumb-mono" aria-hidden="true">' + esc(initials(game.name)) + '</span>';
    return '<article class="card' + (isRandom ? ' random-card' : '') + '" data-slug="' + esc(game.slug) + '">' +
      '<a class="thumb" href="' + href + '" aria-label="' + (isRandom ? 'Pick a random game' : 'Play ' + esc(game.name)) + '">' +
        thumb +
        '<span class="thumb-shine" aria-hidden="true"></span>' +
        '<span class="card-badge">' + esc(isRandom ? 'SURPRISE' : game.category.toUpperCase()) + '</span>' +
      '</a>' +
      '<div class="card-body">' +
        '<div class="card-name">' + esc(game.name) +
          '<span>' + esc(isRandom ? 'Let the arcade choose for you.' : (game.blurb || '')) + '</span>' +
        '</div>' +
        '<a class="play" href="' + href + '">' + (isRandom ? 'Pick one' : 'Play') + '</a>' +
      '</div>' +
    '</article>';
  }

  function render() {
    var list = visibleGames();
    var html = list.map(cardHtml).join('');
    if (!activeQuery) html = cardHtml(randomCard) + html;
    grid.innerHTML = html || '<div class="empty">Nothing here yet. Try a different word or category.</div>';
  }

  function renderChips() {
    var cats = window.CORTEX_CATEGORIES || ['All'];
    chipsEl.innerHTML = cats.map(function (cat) {
      return '<button type="button" class="chip' + (cat === activeCategory ? ' on' : '') + '" data-cat="' + esc(cat) + '" role="tab" aria-selected="' + (cat === activeCategory) + '">' + esc(cat) + '</button>';
    }).join('');
  }

  chipsEl.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    renderChips();
    render();
  });

  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (!card || card.dataset.slug !== '__random') return;
    if (!e.target.closest('a')) return;
    e.preventDefault();
    var pool = visibleGames();
    if (!pool.length) return;
    var choice = pool[Math.floor(Math.random() * pool.length)];
    window.location.href = window.CortexSearch.playUrl(choice);
  });

  var input = document.getElementById('gamesInput');
  var search = window.CortexSearch.attach(input, document.getElementById('gamesSuggest'), {
    emptyAll: 3,
    onPick: function (game) {
      var cat = game.category;
      if (cat !== activeCategory && (window.CORTEX_CATEGORIES || []).indexOf(cat) >= 0) {
        activeCategory = cat;
        renderChips();
      }
      input.value = game.name;
      activeQuery = game.name;
      render();
    }
  });

  input.addEventListener('input', function () {
    activeQuery = input.value.trim();
    render();
  });

  renderChips();
  render();
})();
