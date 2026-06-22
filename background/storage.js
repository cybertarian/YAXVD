// background/storage.js
import { STORAGE_KEYS, DEFAULTS } from '../shared/constants.js';

/** Reads the user's settings, applying defaults and filename sanitization. */
export async function getSettings() {
  const res = await chrome.storage.sync.get([STORAGE_KEYS.SUBFOLDER, STORAGE_KEYS.MODE]);
  const rawSubfolder = res[STORAGE_KEYS.SUBFOLDER] || DEFAULTS.SUBFOLDER;
  return {
    subfolder: rawSubfolder.replace(/[\\/:*?"<>|]/g, '_'),
    mode: res[STORAGE_KEYS.MODE] || DEFAULTS.MODE,
  };
}
