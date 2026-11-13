/* Cortex Arcade — shared behaviour: theme, tab dress-up, background balls,
   visit stats, toasts. Loaded by every page before its page-specific script. */
(function () {
  'use strict';

  var SITE = 'Cortex Arcade';
  var THEMES = ['pink', 'purple', 'blue', 'green', 'orange', 'mono'];
  var store = {
    get: function (key, fallback) {
      try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
    },
    remove: function (key) {
      try { localStorage.removeItem(key); } catch (e) { /* private mode */ }
    }
  };

  function defaultFavicon() {
    var base = document.body.dataset.base || '';
    return base + 'assets/logo.svg';
  }

  function faviconLink() {
    var link = document.getElementById('siteFavicon');
    if (!link) {
      link = document.createElement('link');
      link.id = 'siteFavicon';
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    return link;
  }

  function applyTheme(theme) {
    var chosen = THEMES.indexOf(theme) >= 0 ? theme : 'pink';
    document.documentElement.dataset.theme = chosen;
    store.set('cx_theme', chosen);
    document.querySelectorAll('[data-theme-choice]').forEach(function (btn) {
      btn.classList.toggle('on', btn.dataset.themeChoice === chosen);
    });
  }

  function applyTabDress() {
    var title = store.get('cx_tab_title', '');
    if (title.trim()) document.title = title.trim();
    var icon = store.get('cx_tab_icon', '');
    faviconLink().href = icon || defaultFavicon();
  }

  function fallingBalls() {
    if (store.get('cx_balls', 'on') !== 'on') return;
    if (document.querySelector('.ball-layer')) return;
    var layer = document.createElement('div');
    layer.className = 'ball-layer';
    layer.setAttribute('aria-hidden', 'true');
    var count = window.innerWidth < 760 ? 14 : 26;
    for (var i = 0; i < count; i++) {
      var ball = document.createElement('span');
      ball.className = 'ball';
      var size = 7 + Math.random() * 20;
      var duration = 13 + Math.random() * 13;
      var drift = function (s) { return (Math.random() * 2 * s - s).toFixed(1) + 'px'; };
      ball.style.cssText =
        '--x:' + (Math.random() * 100).toFixed(2) + '%;' +
        '--size:' + size.toFixed(1) + 'px;' +
        '--duration:' + duration.toFixed(2) + 's;' +
        '--delay:' + (-Math.random() * duration).toFixed(2) + 's;' +
        '--opacity:' + (0.16 + Math.random() * 0.44).toFixed(2) + ';' +
        '--blur:' + (Math.random() < 0.3 ? 1.2 : 0) + 'px;' +
        '--dx1:' + drift(30) + ';--dx2:' + drift(45) + ';--dx3:' + drift(38) + ';--dx4:' + drift(55) + ';';
      layer.appendChild(ball);
    }
    document.body.prepend(layer);
  }

  /* Visit stats are real counts kept in this browser's localStorage: one visit
     per calendar day per browser, plus a peak of concurrent tabs. The site is
     static, so there is no server-side global counter behind these numbers. */
  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function touchStats() {
    var day = todayKey();
    var readings = { day: day, total: 0, peak: 0, streak: 0 };
    try { readings = JSON.parse(store.get('cx_stats', '{}')) || readings; } catch (e) { /* ignore */ }
    if (readings.day !== day) {
      readings.day = day;
      readings.total = 0;
      readings.peak = 0;
      readings.streak = Number(readings.streak) || 0;
    }

    var seenKey = 'cx_seen_' + day;
    if (!store.get(seenKey, '')) {
      store.set(seenKey, '1');
      readings.total += 1;
    }
    if (store.get('cx_last_day', '') !== day) {
      store.set('cx_last_day', day);
      readings.streak = (Number(readings.streak) || 0) + 1;
    }

    var now = Date.now();
    store.set('cx_tick', String(now));
    var open = 0;
    [0, 1, 2, 3, 4, 5].forEach(function (slot) {
      var t = Number(store.get('cx_tab_' + slot, '0')) || 0;
      if (now - t < 20000) open += 1;
    });
    var mySlot = store.get('cx_slot', '') || String(Math.floor(Math.random() * 6));
    store.set('cx_slot', mySlot);
    store.set('cx_tab_' + mySlot, String(now));
    open = Math.max(1, open);
    readings.peak = Math.max(Number(readings.peak) || 0, open);

    store.set('cx_stats', JSON.stringify(readings));
    renderStats(readings, open);
  }

  function renderStats(readings, open) {
    var map = {
      statNow: open,
      statPeak: readings.peak,
      statTotal: readings.total,
      statDay: new Date(readings.day + 'T12:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = String(map[id]);
    });
  }

  function pingStats() {
    var now = Date.now();
    var mySlot = store.get('cx_slot', '0');
    store.set('cx_tab_' + mySlot, String(now));
    var open = 0;
    [0, 1, 2, 3, 4, 5].forEach(function (slot) {
      if (now - (Number(store.get('cx_tab_' + slot, '0')) || 0) < 20000) open += 1;
    });
    var el = document.getElementById('statNow');
    if (el) el.textContent = String(Math.max(1, open));
  }

  var toastTimer = null;
  function toast(message) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    requestAnimationFrame(function () { el.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2400);
  }

  /* Keyboard shortcut used by both search boxes. */
  function bindSlash(input) {
    if (!input) return;
    document.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '');
      if (e.key === '/' && !typing) {
        e.preventDefault();
        input.focus();
      }
    });
  }

  function init() {
    applyTheme(store.get('cx_theme', 'pink'));
    applyTabDress();
    fallingBalls();
    touchStats();
    setInterval(pingStats, 15000);
    document.querySelectorAll('[data-theme-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () { applyTheme(btn.dataset.themeChoice); });
    });
    window.addEventListener('storage', function (e) {
      if (e.key === 'cx_theme') applyTheme(store.get('cx_theme', 'pink'));
      if (e.key === 'cx_tab_title' || e.key === 'cx_tab_icon') applyTabDress();
    });
  }

  window.Cortex = {
    SITE: SITE,
    THEMES: THEMES,
    store: store,
    applyTheme: applyTheme,
    applyTabDress: applyTabDress,
    renderStats: renderStats,
    toast: toast,
    bindSlash: bindSlash
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
