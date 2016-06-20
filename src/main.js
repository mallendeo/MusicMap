import tunemap from './lib/tunemap';
import analytics from './lib/analytics';
import env from './.env.js';

const ga = analytics(env.G_ANALYTICS_CODE);
let lastTitle = '';
setInterval(() => {
  const titleElem = document.querySelector('#eow-title');
  if (!titleElem) return;

  if (lastTitle !== titleElem.textContent) {
    tunemap().load(ga);
    lastTitle = titleElem.textContent;
  }
}, 100);
