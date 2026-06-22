// content/04-tweet-detector.js
//
// Pure DOM-reading helpers: given a tweet's <article> element, figure out
// its numeric tweet ID and whether it contains a video. No side effects.

(function () {
  const ns = window.__XDL_CONTENT__;
  if (!ns) return;

  function getTweetId(article) {
    const timeEl = article.querySelector('time');
    if (!timeEl) return null;
    const anchor = timeEl.closest('a[href*="/status/"]');
    if (!anchor) return null;
    const match = (anchor.getAttribute('href') || '').match(/status\/(\d+)/);
    return match ? match[1] : null;
  }

  function hasVideo(article) {
    return !!article.querySelector(
      'video, [data-testid="videoPlayer"], [data-testid="videoComponent"]'
    );
  }

  ns.getTweetId = getTweetId;
  ns.hasVideo = hasVideo;
})();
