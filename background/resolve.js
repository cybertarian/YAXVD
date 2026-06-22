// background/resolve.js
import { getSettings } from './storage.js';
import { fetchViaSyndication } from './syndication.js';
import { dedupe, saveUrls } from './downloads.js';
import { MODES } from '../shared/constants.js';

/**
 * Decides how to get a downloadable URL for a tweet, based on the user's
 * chosen mode, then saves it.
 *
 *   hybrid            - use directUrls (from page interception) if present,
 *                        otherwise fall back to the syndication API.
 *   intercept-only    - use directUrls only; throw if empty (no fallback).
 *   syndication-only  - always use the syndication API (directUrls will be
 *                        empty anyway, since page-hook.js never installs
 *                        its network patch in this mode).
 */
export async function resolveAndDownload(tweetId, directUrls) {
  const { subfolder, mode } = await getSettings();

  let urls = [];
  let source = '';

  if (mode !== MODES.SYNDICATION_ONLY && Array.isArray(directUrls) && directUrls.length) {
    urls = dedupe(directUrls);
    source = 'page-intercept';
  }

  if (!urls.length) {
    if (mode === MODES.INTERCEPT_ONLY) {
      throw new Error(
        'No cached video URL for this tweet yet. Try reopening it (so the page re-fetches its data), or switch to Hybrid/Syndication mode in the popup.'
      );
    }
    urls = await fetchViaSyndication(tweetId);
    source = 'syndication-fallback';
  }

  if (!urls.length) {
    throw new Error('No downloadable video found for this tweet (it may be private or deleted)');
  }

  const ids = await saveUrls(tweetId, urls, subfolder);
  return { ids, source };
}
