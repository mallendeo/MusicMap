'use strict';
let Youtify = require('./youtify');
let env     = require('../.env.json');

let hostname = document.location.hostname;
const ytRegex = /https?:\/\/www\.youtube\.com\/watch\?v=.*/g;

let YoutifyHandler = function () {
  this.youtify = new Youtify({
    redirectUri: env.REDIRECT_URI,
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET
  });

  if (hostname === 'open.spotify.com') {
    document.body.classList.add('youtify-player');
    return;
  }

  this.loadGoogleAnalytics();
  this.loadYoutify();
};

YoutifyHandler.prototype.loadGoogleAnalytics = function () {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', env.G_ANALYTICS_CODE, 'auto');
  ga('set', 'checkProtocolTask', () => {});
  ga('require', 'displayfeatures');
};

YoutifyHandler.prototype.loadYoutify = function () {
  let self = this;
  if (!document.location.href.match(ytRegex)) return;
  ga('send', 'pageview');

  let videoTitle = document.querySelector('#eow-title').textContent,
      songInfo = self.youtify.getInfoFromTitle(videoTitle),
      categoryElems = [].slice.call(document.querySelectorAll('.watch-info-tag-list li a')),
      isMusicCategory = categoryElems.some(elem => {
        return elem.getAttribute('data-ytid') === 'UC-9-kyTW8ZkZNDHQJ6FgpwQ';
      }),
      descriptionElem = document.querySelector('#eow-description'),
      description = descriptionElem.innerHTML,
      guessYouTubeMusicVideo = self.youtify.guessYouTubeMusicVideo(description),
      button = self.createButton(['youtify-open-button','disabled']),
      spotifyUrl = self.youtify.getSpotifyUrlFromDescription(descriptionElem);

  videoTitle = [songInfo.artist, songInfo.title, songInfo.remix].join(' ');

  self.updateButton(button, 'Loading...');

  if (self.youtify.isMix(description)) {
    self.updateButton(button, 'Mix not available in Spotify');
    if (!spotifyUrl) return;

    self.updateButton(button, 'Open the tracklist on Spotify');
    button.classList.remove('disabled');
    button.href = spotifyUrl;
    button.target = '_blank';
    return;
  }

  if (!isMusicCategory && !guessYouTubeMusicVideo) {
    self.updateButton(button, 'Not in music category');
    return;
  }

  self.youtify.search(videoTitle, 'track').then(data => {
    if (data.tracks.items && data.tracks.items[0]) {
      button.classList.remove('disabled');
      button.href = data.tracks.items[0].uri;
      self.updateButton(button, 'Open in Spotify');

      button.addEventListener('click', () => {
        document.querySelector('.video-stream').pause();
        self.sendButtonClickGa(data.tracks.items[0].uri);
      });
    } else {
      self.updateButton(button, 'Not available in Spotify');
    }
  });
};

YoutifyHandler.prototype.createButton = function (classList, text, appendTo) {
  appendTo = appendTo || document.getElementById('watch7-subscription-container');

  let button = document.createElement('a');
  this.updateButton(button, text);

  for (let cssClass of classList) {
    button.classList.add(cssClass);
  }

  appendTo.parentNode.insertBefore(button, appendTo.nextSibling);
  return button;
};

YoutifyHandler.prototype.updateButton = function (button, text) {
  button.innerHTML = text;
  return button;
};

YoutifyHandler.prototype.sendButtonClickGa = function (button, text) {
  ga('send', {
    'hitType': 'event',
    'eventCategory': 'button-clicked',
    'eventAction': 'click',
    'eventLabel': document.location.href
  });
};

module.exports = YoutifyHandler;
