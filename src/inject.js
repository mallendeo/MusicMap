'use strict';

let hostname = document.location.hostname;
let hash = document.location.hash;

if (hostname == 'www.youtube.com' || hash == '#youtify') {
  let script = document.createElement('script');
  let style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';

  script.src = chrome.extension.getURL('youtify.js');
  style.href = chrome.extension.getURL('youtify.css');

  document.head.appendChild(script);
  document.head.appendChild(style);
}
