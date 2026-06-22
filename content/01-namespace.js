// content/01-namespace.js
//
// Shared state for the isolated-world content script modules. This object
// lives on the content script's OWN window, which is separate from the
// page's window (isolated worlds have their own global object even though
// they share the DOM) - so it's safe to use a plain property here without
// any risk of colliding with X's own page code.
//
// Loaded first (declared first in manifest.json's content_scripts.js
// array); the other content/*.js files all assume this has already run.

(function () {
  if (window.__XDL_CONTENT__) return;

  window.__XDL_CONTENT__ = {
    MODE_KEY: '__xdl_mode__',
    videoUrlCache: new Map(), // tweetId -> [mp4 urls], filled by page-hook
    MAX_CACHE_SIZE: 500,
    bootstrapped: false,
  };
})();
