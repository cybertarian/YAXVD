// page-hook/02-extractor.js
//
// Pure data-extraction logic: recursively walks a JSON response tree
// looking for tweet objects that carry video media. No fetch/XHR patching
// happens here - this file only defines a function and attaches it to the
// shared namespace, so 03-hook-control.js can call it once it's actually
// intercepting traffic.

(function () {
  const ns = window.__XDL__;
  if (!ns) return;

  // The same tweet can legitimately appear more than once in a single
  // GraphQL response - e.g. a video tweet shows up directly in the
  // timeline AND nested inside someone else's retweet/quote-tweet of it
  // elsewhere in the same batch of results. Each occurrence is a distinct
  // JS object even though the content is identical, so we collect URLs
  // into a Set per tweet ID to dedupe at the source (this is what fixed
  // the earlier double-download bug).
  function walkForVideos(obj, results, seen) {
    if (!obj || typeof obj !== 'object') return;
    if (seen.has(obj)) return;
    seen.add(obj);

    const idStr = obj.id_str || obj.rest_id;
    const media =
      (obj.legacy && obj.legacy.extended_entities && obj.legacy.extended_entities.media) ||
      (obj.extended_entities && obj.extended_entities.media) ||
      obj.media;

    if (idStr && Array.isArray(media) && media.length) {
      for (const m of media) {
        if (m.type !== 'video' && m.type !== 'animated_gif') continue;
        const variants = (m.video_info && m.video_info.variants) || [];
        const mp4s = variants.filter((v) => v.content_type === 'video/mp4');
        if (!mp4s.length) continue;
        mp4s.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
        if (!results.has(idStr)) results.set(idStr, new Set());
        results.get(idStr).add(mp4s[0].url);
      }
    }

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const val = obj[key];
      if (val && typeof val === 'object') walkForVideos(val, results, seen);
    }
  }

  /** Scans a GraphQL response and posts any discovered video URLs to content.js. */
  function announce(data) {
    const found = new Map();
    walkForVideos(data, found, new WeakSet());
    if (found.size === 0) return;

    const payload = {};
    for (const [id, urlSet] of found) payload[id] = Array.from(urlSet);
    window.postMessage({ source: 'xdl-page-hook', type: 'video-urls', data: payload }, '*');
  }

  ns.announce = announce;
})();
