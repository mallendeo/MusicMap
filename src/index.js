import YoutifyHandler from './lib/youtify-handler';
import { ytRegex }    from './lib/util';

let lastTitle = '';
setInterval(_ => {
  let titleElem = document.querySelector('#eow-title');
  if (!titleElem) return;

  if (lastTitle !== titleElem.textContent) {
    new YoutifyHandler();
    lastTitle = titleElem.textContent;
  }
}, 100);
