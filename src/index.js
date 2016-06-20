import handle from './lib/youtify-handler';

let lastTitle = '';
setInterval(() => {
  const titleElem = document.querySelector('#eow-title');
  if (!titleElem) return;

  if (lastTitle !== titleElem.textContent) {
    handle();
    lastTitle = titleElem.textContent;
  }
}, 100);
