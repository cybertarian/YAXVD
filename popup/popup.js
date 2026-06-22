// popup/popup.js
const subfolderInput = document.getElementById('subfolder');
const status = document.getElementById('status');
const modeRadios = document.querySelectorAll('input[name="mode"]');

chrome.storage.sync.get(['downloadSubfolder', 'mode'], (res) => {
  subfolderInput.value = res.downloadSubfolder || 'XVideos';
  const mode = res.mode || 'hybrid';
  modeRadios.forEach((radio) => {
    radio.checked = radio.value === mode;
  });
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const subfolder = subfolderInput.value.trim() || 'XVideos';
  let mode = 'hybrid';
  modeRadios.forEach((radio) => {
    if (radio.checked) mode = radio.value;
  });

  chrome.storage.sync.set({ downloadSubfolder: subfolder, mode }, () => {
    status.textContent =
      'Saved. Mode changes apply immediately on open tabs, or on next load for new tabs.';
    status.style.color = '#00ba7c';
  });
});
