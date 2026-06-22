// background/token.js

/**
 * Reverse-engineered token formula used by X's public syndication/embed
 * pipeline (the same one used by libraries like Vercel's react-tweet to
 * embed tweets without the official paid API). If X changes this, the
 * syndication fetch will start failing and this is the first place to look.
 */
export function getSyndicationToken(tweetId) {
  return ((Number(tweetId) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
}
