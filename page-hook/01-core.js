// page-hook/01-core.js
//
// Runs with "world": "MAIN" - inside the PAGE's own JS context, sharing the
// same window object X's React app uses. This is the first of four files
// that together make up the page hook; they're loaded in this order
// (declared in manifest.json) and share state via window.__XDL__, since
// content scripts can't use import/export.
//
// This file's only job: create the shared namespace and save the original,
// un-patched fetch/XHR references. Reading these is a no-op with zero
// observable side effects - safe to do unconditionally regardless of mode.

(function () {
  if (window.__XDL__) return; // already initialized

  window.__XDL__ = {
    origFetch: window.fetch,
    origXHROpen: XMLHttpRequest.prototype.open,
    origXHRSend: XMLHttpRequest.prototype.send,
    hookActive: false,
    mode: 'hybrid',
    bootstrapped: false,
  };
})();
