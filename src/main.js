import musicmap from './lib/musicmap';

let lastTitle = '';
setInterval(() => {
  const titleElem = document.querySelector('#eow-title');
  if (!titleElem) return;

  if (lastTitle !== titleElem.textContent) {
    musicmap().load();
    lastTitle = titleElem.textContent;
  }
}, 100);
