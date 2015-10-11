var hostname = document.location.hostname
var hash = document.location.hash

if (hostname == 'www.youtube.com' || hash == '#youtify') {
  var script = document.createElement('script')
  var style = document.createElement('link')
  style.rel = 'stylesheet'
  style.type = 'text/css'

  // needs semicolon
  script.src = chrome.extension.getURL('youtify.js');
  style.href = chrome.extension.getURL('youtify.css');

  document.head.appendChild(script)
  document.head.appendChild(style)
}
