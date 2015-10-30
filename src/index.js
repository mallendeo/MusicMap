var Youtify = require('./youtify')
var env     = require('./.env.json')

var hostname = document.location.hostname
var ytRegex = /https?:\/\/www\.youtube\.com\/watch\?v=.*/g

if (hostname === 'open.spotify.com') {
  document.body.classList.add('youtify-player')
  return
}

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', env.G_ANALYTICS_CODE, 'auto');
ga('set', 'checkProtocolTask', function(){});
ga('require', 'displayfeatures');
ga('send', 'pageview');

var youtify = new Youtify({
  redirectUri: env.REDIRECT_URI,
  clientId: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET
})

var loadInfo = function () {
  if (!document.location.href.match(ytRegex)) return

  var videoTitle = document.querySelector('#eow-title').textContent
  var songInfo = youtify.getInfoFromTitle(videoTitle)
  //var spotifySVG = '<svg class="icon icon-spotify"><use xlink:href="#icon-spotify"></use></svg>'
  var spotifySVG = ''

  videoTitle = [songInfo.artist, songInfo.title, songInfo.remix].join(' ')

  var categoryElems = [].slice.call(document.querySelectorAll('.watch-info-tag-list li a'))
  var isMusicCategory = categoryElems.some(function(elem) {
    return elem.getAttribute('data-ytid') === 'UC-9-kyTW8ZkZNDHQJ6FgpwQ'
  })

  var subsButton = document.getElementById('watch7-subscription-container')
  var button = document.createElement('a')
  button.classList.add('youtify-open-button')
  button.classList.add('disabled')
  button.innerHTML = spotifySVG + 'Loading...'
  subsButton.parentNode.insertBefore(button, subsButton.nextSibling)


  var descriptionElem = document.querySelector('#eow-description')
  var description = descriptionElem.innerHTML
  var guessYouTubeMusicVideo = youtify.guessYouTubeMusicVideo(description)

  var isMix = youtify.checkIfMix(description)
  var spotifyUrl = youtify.getSpotifyUrlFromDescription(descriptionElem)

  if (isMix) {
    button.innerHTML = spotifySVG + spotifySVG + 'Mix not available in Spotify'
    if (!spotifyUrl) return

    button.innerHTML = spotifySVG + 'Open the tracklist on Spotify'
    button.classList.remove('disabled')
    button.href = spotifyUrl
    button.target = '_blank'
    return
  }

  if (!isMusicCategory && !guessYouTubeMusicVideo) {
    button.innerHTML = spotifySVG + 'Not in music category'
    return
  }

  youtify.search(videoTitle, 'track').then(function(data){
    if (data.tracks.items && data.tracks.items[0]) {
      button.classList.remove('disabled')
      button.href = data.tracks.items[0].uri
      button.innerHTML = spotifySVG + 'Open in Spotify'

      button.addEventListener('click', function(){
        document.querySelector('.video-stream').pause()
        sendButtonClickGa(data.tracks.items[0].uri)
      })
    } else {
      button.innerHTML = spotifySVG + 'Not available in Spotify'
    }
  })
}

function sendButtonClickGa(spotifyUri) {
  ga('send', {
    'hitType': 'event',
    'eventCategory': 'button-clicked',
    'eventAction': 'click',
    'eventLabel': document.location.href
  });
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
