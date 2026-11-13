/* Cortex Arcade — settings page. */
(function () {
  'use strict';
  var store = window.Cortex.store;
  var status = document.getElementById('settingsStatus');
  var titleInput = document.getElementById('tabTitle');
  var iconInput = document.getElementById('tabIcon');
  var MAX_ICON_BYTES = 300 * 1024;

  function say(message) {
    status.textContent = message;
  }

  function markToggles() {
    var pairs = [
      ['toggleBalls', store.get('cx_balls', 'on') === 'on'],
      ['toggleSuggest', store.get('cx_suggest', 'on') === 'on']
    ];
    pairs.forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      el.classList.toggle('on', pair[1]);
      el.setAttribute('aria-checked', String(pair[1]));
    });
  }

  function markIcons() {
    var saved = store.get('cx_tab_icon', '') || 'assets/logo.svg';
    document.querySelectorAll('.icon-btn').forEach(function (btn) {
      btn.classList.toggle('on', btn.dataset.icon === saved);
    });
  }

  function toggle(id) {
    var el = document.getElementById(id);
    el.addEventListener('click', function () {
      var next = !el.classList.contains('on');
      el.classList.toggle('on', next);
      el.setAttribute('aria-checked', String(next));
      if (id === 'toggleBalls') {
        store.set('cx_balls', next ? 'on' : 'off');
        if (next) window.location.reload();
        else {
          var layer = document.querySelector('.ball-layer');
          if (layer) layer.remove();
        }
        say(next ? 'Background restarted on reload.' : 'Background balls turned off.');
      } else {
        store.set('cx_suggest', next ? 'on' : 'off');
        say(next ? 'Suggestions on.' : 'Suggestions off.');
      }
    });
  }

  titleInput.value = store.get('cx_tab_title', '');

  document.querySelectorAll('.icon-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      store.set('cx_tab_icon', btn.dataset.icon);
      window.Cortex.applyTabDress();
      markIcons();
      say('Tab icon set to ' + btn.dataset.iconName + '.');
    });
  });

  document.getElementById('saveSettings').addEventListener('click', function () {
    store.set('cx_tab_title', titleInput.value.trim());
    var file = iconInput.files && iconInput.files[0];
    if (!file) {
      window.Cortex.applyTabDress();
      say('Saved. Tab title and icon applied on every page.');
      window.Cortex.toast('Settings saved');
      return;
    }
    if (file.size > MAX_ICON_BYTES) {
      say('That image is ' + Math.round(file.size / 1024) + ' KB — please pick one under 300 KB.');
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      store.set('cx_tab_icon', String(reader.result));
      store.set('cx_tab_title', titleInput.value.trim());
      window.Cortex.applyTabDress();
      markIcons();
      say('Saved with your custom icon.');
      window.Cortex.toast('Settings saved');
    };
    reader.onerror = function () { say('That file could not be read. Try another image.'); };
    reader.readAsDataURL(file);
  });

  document.getElementById('resetSettings').addEventListener('click', function () {
    ['cx_tab_title', 'cx_tab_icon', 'cx_theme', 'cx_balls', 'cx_suggest'].forEach(store.remove);
    window.location.reload();
  });

  markToggles();
  markIcons();
  toggle('toggleBalls');
  toggle('toggleSuggest');
})();
