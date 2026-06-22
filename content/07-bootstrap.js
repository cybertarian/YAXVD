// content/07-bootstrap.js
//
// Wires everything together: scans the timeline for video tweets, injects
// the download button into each one, and keeps watching for new tweets as
// the page scrolls (X is a single-page app that lazily renders content).
// Loaded last, since it depends on every other content/*.js module having
// already attached its functions to the shared namespace.

(function () {
  const ns = window.__XDL_CONTENT__;
  if (!ns || ns.bootstrapped) return;
  ns.bootstrapped = true;

  function processTweet(article) {
    if (article.dataset.xdlProcessed) return;
    if (!ns.hasVideo(article)) return;

    const tweetId = ns.getTweetId(article);
    if (!tweetId) return;

    // The action bar is the row with reply / retweet / like / share icons.
    const actionBar = article.querySelector('div[role="group"]');
    if (!actionBar) return;

    article.dataset.xdlProcessed = 'true';

    const wrapper = document.createElement('div');
    wrapper.className = 'xdl-btn-wrapper';
    wrapper.appendChild(ns.createDownloadButton(tweetId, ns.startDownload));
    actionBar.appendChild(wrapper);
  }

  function scan() {
    document.querySelectorAll('article[data-testid="tweet"]').forEach(processTweet);
  }

  const observer = new MutationObserver(scan);
  observer.observe(document.body, { childList: true, subtree: true });

  scan();
})();
