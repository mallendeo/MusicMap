var hostname = document.location.hostname
var hash = document.location.hash

if (hostname == 'www.youtube.com' || hash == '#youtify') {
  var script = document.createElement('script')
  //var icomoon = document.createElement('script')
  var style = document.createElement('link')
  style.rel = 'stylesheet'
  style.type = 'text/css'

  // needs semicolon
  //icomoon.src = chrome.extension.getURL('https://i.icomoon.io/public/temp/4587aab48e/youtify/svgembedder.js');
  script.src = chrome.extension.getURL('youtify.js');
  style.href = chrome.extension.getURL('youtify.css');

  //document.head.appendChild(icomoon)
  document.head.appendChild(script)
  document.head.appendChild(style)
}
