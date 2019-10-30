function createOverlap() {
  const overlap = document.createElement('iframe');
  overlap.id = 'ubala-root';
  overlap.style.position = 'fixed';
  overlap.style.left = '0';
  overlap.style.top = '0';
  overlap.style.width = '100%';
  overlap.style.height = '100%';
  overlap.style.zIndex = '100000000';
  overlap.style.border = 'none';
  overlap.setAttribute('src', chrome.extension.getURL('dialog.html'));
  return overlap;
}

const oldElement = document.querySelector('iframe#ubala-root');
if (oldElement) {
  oldElement.contentWindow.postMessage('WIN_EV_FORWARD', '*');
} else {
  const overlay = createOverlap();
  document.body.appendChild(overlay);
  window.addEventListener(
    'message',
    ev => {
      if (ev.data === 'WIN_EV_CLOSE') {
        overlay.remove();
      }
    },
    { once: true }
  );
}
