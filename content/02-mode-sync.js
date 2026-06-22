// content/02-mode-sync.js
//
// Mirrors the chosen mode (from chrome.storage.sync) into localStorage —
// so page-hook.js picks it up at document_start on the NEXT page load —
// and also postMessages it to the page immediately, so page-hook.js can
// hot-switch on the CURRENT page without needing a reload.

(function () {
  const ns = window.__XDL_CONTENT__;
  if (!ns) return;

  function applyMode(mode) {
    const m = mode || 'hybrid';
    try {
      window.localStorage.setItem(ns.MODE_KEY, m);
    } catch (e) {
      /* ignore - page-hook.js falls back to its own default */
    }
    window.postMessage({ source: 'xdl-content', type: 'xdl-mode-change', mode: m }, '*');
  }

  // Apply the current mode on load, so localStorage is always in sync.
  chrome.storage.sync.get(['mode'], (res) => applyMode(res.mode));

  // React to popup changes in real time, across ALL open x.com/twitter.com tabs.
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.mode) applyMode(changes.mode.newValue);
  });

  ns.applyMode = applyMode;
})();
