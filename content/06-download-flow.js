// content/06-download-flow.js
//
// Orchestrates a single download: looks up any cached URL for the tweet,
// asks background.js to resolve+save it, and updates the button's visual
// state based on the result.

(function () {
  const ns = window.__XDL_CONTENT__;
  if (!ns) return;

  function startDownload(tweetId, btn) {
    ns.setButtonState(btn, 'loading');
    const cachedUrls = ns.videoUrlCache.get(tweetId); // may be undefined - that's fine

    chrome.runtime.sendMessage(
      { action: 'download', tweetId, videoUrls: cachedUrls },
      (response) => {
        if (chrome.runtime.lastError) {
          ns.setButtonState(btn, 'error');
          console.error('[x-video-dl]', chrome.runtime.lastError.message);
          setTimeout(() => ns.setButtonState(btn, null), 2500);
          return;
        }

        ns.setButtonState(btn, response && response.ok ? 'success' : 'error');
        if (response && response.ok) {
          console.log('[x-video-dl] downloaded via', response.source);
        } else {
          console.error('[x-video-dl] failed:', response && response.error);
        }
        setTimeout(() => ns.setButtonState(btn, null), 2500);
      }
    );
  }

  ns.startDownload = startDownload;
})();
