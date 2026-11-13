/* Cortex Arcade — home page wiring. */
(function () {
  'use strict';
  window.CortexSearch.attach(
    document.getElementById('homeInput'),
    document.getElementById('homeSuggest'),
    { emptyAll: 4 }
  );
})();
