import { Youtify } from './youtify';
import { ytRegex } from './util';
import env         from '../.env.json';

let hostname = document.location.hostname;

export class YoutifyHandler {
  constructor() {
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
  }

  loadGoogleAnalytics() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', env.G_ANALYTICS_CODE, 'auto');
    ga('set', 'checkProtocolTask', () => {});
    ga('require', 'displayfeatures');
  }

  loadYoutify() {
    if (!document.location.href.match(ytRegex)) return;
    ga('send', 'pageview');

    let videoTitle = document.querySelector('#eow-title').textContent,
        songInfo = this.youtify.getInfoFromTitle(videoTitle),
        categoryElems = [].slice.call(document.querySelectorAll('.watch-info-tag-list li a')),
        isMusicCategory = categoryElems.some(elem => {
          return elem.getAttribute('data-ytid') === 'UC-9-kyTW8ZkZNDHQJ6FgpwQ';
        }),
        descriptionElem = document.querySelector('#eow-description'),
        description = descriptionElem.innerHTML,
        guessYouTubeMusicVideo = this.youtify.guessYouTubeMusicVideo(description),
        button = this.createButton(['youtify-open-button','disabled']),
        spotifyUrl = this.youtify.getSpotifyUrlFromDescription(descriptionElem);

    videoTitle = [songInfo.artist, songInfo.title, songInfo.remix].join(' ');

    this.updateButton(button, 'Loading...');

    if (this.youtify.isMix(description)) {
      this.updateButton(button, 'Mix not available in Spotify');
      if (!spotifyUrl) return;

      this.updateButton(button, 'Open the tracklist on Spotify');
      button.classList.remove('disabled');
      button.href = spotifyUrl;
      button.target = '_blank';
      return;
    }

    if (!isMusicCategory && !guessYouTubeMusicVideo) {
      this.updateButton(button, 'Not in music category');
      return;
    }

    this.youtify.search(videoTitle, 'track').then(data => {
      if (data.tracks.items && data.tracks.items[0]) {
        button.classList.remove('disabled');
        button.href = data.tracks.items[0].uri;
        this.updateButton(button, 'Open in Spotify');

        button.addEventListener('click', () => {
          document.querySelector('.video-stream').pause();
          this.sendButtonClickGa(data.tracks.items[0].uri);
        });
      } else {
        this.updateButton(button, 'Not available in Spotify');
      }
    });
  }

  createButton(classList, text, appendTo) {
    appendTo = appendTo || document.getElementById('watch7-subscription-container');

    let button = document.createElement('a');
    this.updateButton(button, text);

    for (let cssClass of classList) {
      button.classList.add(cssClass);
    }

    appendTo.parentNode.insertBefore(button, appendTo.nextSibling);
    return button;
  }

  updateButton(button, text) {
    button.innerHTML = text;
    return button;
  }

  sendButtonClickGa(button, text) {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'button-clicked',
      'eventAction': 'click',
      'eventLabel': document.location.href
    });
  }
}
