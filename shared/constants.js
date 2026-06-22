// shared/constants.js
// Plain ES module - only importable from background/* (the service worker
// supports "type": "module"). Content scripts and the MAIN-world page hook
// can't use import/export, so they keep their own small local copies of the
// one or two constants they need (e.g. the localStorage key name) - not
// worth a build step just to share two string literals across contexts
// that can't import anyway.

export const STORAGE_KEYS = {
  MODE: 'mode',
  SUBFOLDER: 'downloadSubfolder',
};

export const DEFAULTS = {
  MODE: 'hybrid',
  SUBFOLDER: 'XVideos',
};

export const MODES = {
  HYBRID: 'hybrid',
  INTERCEPT_ONLY: 'intercept-only',
  SYNDICATION_ONLY: 'syndication-only',
};
