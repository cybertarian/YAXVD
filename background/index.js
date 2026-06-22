// background/index.js
// Entry point declared in manifest.json's background.service_worker.
// Only responsibility: listen for download requests from content.js and
// delegate to resolveAndDownload(). All the actual logic lives in the
// focused modules it imports.
import { resolveAndDownload } from './resolve.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== 'download') return false;

  resolveAndDownload(message.tweetId, message.videoUrls)
    .then(({ ids, source }) => {
      sendResponse({ ok: true, count: ids.length, source });
    })
    .catch((err) => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon128.png'),
        title: 'Download failed',
        message: err.message,
      });
      sendResponse({ ok: false, error: err.message });
    });

  return true; // keep the message channel open for the async response
});
