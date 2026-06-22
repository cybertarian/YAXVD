// background/syndication.js
import { getSyndicationToken } from './token.js';

function extractMp4Urls(tweetData) {
  const mediaList = tweetData.mediaDetails || [];
  const urls = [];

  for (const media of mediaList) {
    if (media.type !== 'video' && media.type !== 'animated_gif') continue;
    const variants = (media.video_info && media.video_info.variants) || [];
    const mp4s = variants.filter((v) => v.content_type === 'video/mp4');
    if (!mp4s.length) continue;
    mp4s.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
    urls.push(mp4s[0].url);
  }

  return Array.from(new Set(urls));
}

/**
 * Fetches tweet data from X's public, unauthenticated syndication CDN and
 * returns the best-quality .mp4 URL for each video/GIF found. Only works
 * for public tweets.
 */
export async function fetchViaSyndication(tweetId) {
  const token = getSyndicationToken(tweetId);
  const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&token=${token}&lang=en`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Syndication API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  return extractMp4Urls(data);
}
