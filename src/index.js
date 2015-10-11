var request = require('superagent')
var Promise = require('bluebird')
var Youtify = require('./youtify')
var env     = require('./.env.json')

var hostname = document.location.hostname
var ytRegex = /https?:\/\/www\.youtube\.com\/watch\?v=.*/g

if (hostname === 'open.spotify.com') {
  document.body.classList.add('youtify-player')
  return
}

var youtify = new Youtify({
  redirectUri: env.REDIRECT_URI,
  clientId: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET
})

var loadInfo = function () {
  if (!document.location.href.match(ytRegex)) return

  var videoTitle = document.querySelector('#eow-title').textContent
  videoTitle = youtify.getKeywords(videoTitle)

  var categoryElems = [].slice.call(document.querySelectorAll('.watch-info-tag-list li a'))
  var isMusicCategory = categoryElems.some(function(elem) {
    return elem.getAttribute('data-ytid') === 'UC-9-kyTW8ZkZNDHQJ6FgpwQ'
  })

  var subsButton = document.getElementById('watch7-subscription-container')
  var button = document.createElement('a')
  button.classList.add('youtify-open-button')
  button.classList.add('disabled')
  button.textContent = 'Loading...'
  subsButton.parentNode.insertBefore(button, subsButton.nextSibling)

  button.addEventListener('click', function(){
    document.querySelector('.video-stream').pause()
  })

  if (!isMusicCategory) {
    button.textContent = 'Not in music category'
    return
  }

  youtify.search(videoTitle, 'track').then(function(data){
    if (data.tracks.items && data.tracks.items[0]) {
      button.classList.remove('disabled')
      button.href = data.tracks.items[0].uri
      button.textContent = 'Open in Spotify'
    } else {
      button.textContent = 'Not available in Spotify'
    }
  })
}

loadInfo()

var send = XMLHttpRequest.prototype.send
XMLHttpRequest.prototype.send = function () {
  var callback = this.onreadystatechange
  this.onreadystatechange = function() {
    if (this.readyState == 4) {
      var responseURL = this.responseURL
      if (responseURL.match(ytRegex)) {
        loadInfo()
      }
    }

    if (callback) callback.apply(this, arguments)
  }
  send.apply(this, arguments)
}
