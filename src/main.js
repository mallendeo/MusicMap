import musicmap from './lib/musicmap';

let lastTitle = '';

function load() {
  const titleElem = document.querySelector('#eow-title');
  if (!titleElem) return;

  if (lastTitle !== titleElem.textContent) {
    musicmap().load();
    lastTitle = titleElem.textContent;
  }
}

load();
setInterval(load, 100);
