// content/03-video-cache.js
//
// Listens for intercepted video URLs posted by page-hook.js and caches
// them by tweet ID, deduplicating defensively as a second line of defense
// (page-hook.js already dedupes at the source via a Set).

(function () {
  const ns = window.__XDL_CONTENT__;
  if (!ns) return;

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const msg = event.data;
    if (!msg || msg.source !== 'xdl-page-hook' || msg.type !== 'video-urls') return;

    for (const [id, urls] of Object.entries(msg.data)) {
      ns.videoUrlCache.set(id, Array.from(new Set(urls)));
      if (ns.videoUrlCache.size > ns.MAX_CACHE_SIZE) {
        ns.videoUrlCache.delete(ns.videoUrlCache.keys().next().value);
      }
    }
  });
})();
