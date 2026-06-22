// background/downloads.js

/** Removes duplicate URLs while preserving order. */
export function dedupe(arr) {
  return Array.from(new Set(arr));
}

/**
 * Saves each URL via chrome.downloads, naming files
 * "<subfolder>/<tweetId>.mp4" (or "_1", "_2", ... if there's more than one).
 */
export async function saveUrls(tweetId, urls, subfolder) {
  const downloadIds = [];

  for (let i = 0; i < urls.length; i++) {
    const suffix = urls.length > 1 ? `_${i + 1}` : '';
    const filename = `${subfolder}/${tweetId}${suffix}.mp4`;
    const id = await chrome.downloads.download({ url: urls[i], filename });
    downloadIds.push(id);
  }

  return downloadIds;
}
