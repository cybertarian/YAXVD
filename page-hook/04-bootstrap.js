// page-hook/04-bootstrap.js
//
// Wires everything together: reads the initial mode from localStorage
// (set by content.js, which has access to chrome.storage), applies it,
// and listens for real-time mode-change messages so switching modes in
// the popup takes effect immediately without a page reload.

(function () {
  const ns = window.__XDL__;
  if (!ns || ns.bootstrapped) return;
  ns.bootstrapped = true;

  const MODE_KEY = '__xdl_mode__';

  try {
    const stored = window.localStorage.getItem(MODE_KEY);
    if (stored) ns.mode = stored;
  } catch (e) {
    /* localStorage might be unavailable in rare sandboxed contexts */
  }

  if (ns.mode !== 'syndication-only') {
    ns.enableHook();
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const msg = event.data;
    if (!msg || msg.source !== 'xdl-content' || msg.type !== 'xdl-mode-change') return;

    ns.mode = msg.mode;
    if (msg.mode === 'syndication-only') {
      ns.disableHook();
    } else {
      ns.enableHook();
    }
  });
})();
