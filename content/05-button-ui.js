// content/05-button-ui.js
//
// Builds the download button element (with its click handler delegated to
// a callback) and manages its visual state (loading / success / error).
// Knows nothing about tweet detection or the download flow itself - just
// the button's appearance and state transitions.

(function () {
  const ns = window.__XDL_CONTENT__;
  if (!ns) return;

  function createDownloadButton(tweetId, onClick) {
    const btn = document.createElement('div');
    btn.className = 'xdl-download-btn';
    btn.setAttribute('role', 'button');
    btn.title = 'Download video';
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">' +
      '<path d="M12 16.5l-5.5-5.5 1.4-1.4L11 12.7V4h2v8.7l3.1-3.1 1.4 1.4L12 16.5zM5 18h14v2H5z"/>' +
      '</svg>';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(tweetId, btn);
    });

    return btn;
  }

  function setButtonState(btn, state) {
    btn.classList.remove('loading', 'success', 'error');
    if (state) btn.classList.add(state);
  }

  ns.createDownloadButton = createDownloadButton;
  ns.setButtonState = setButtonState;
})();
