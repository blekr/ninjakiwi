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
if (!oldElement) {
  document.body.appendChild(createOverlap());
}
