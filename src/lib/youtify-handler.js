import Youtify   from './youtify';
import * as util from './util';
import env       from '../.env.json';
import Analytics from './analytics';
//import Database  from './database';

let hostname = document.location.hostname;

export default class YoutifyHandler {

  constructor () {
    //this.db = new Database();

    this.youtify = new Youtify({
      redirectUri: env.REDIRECT_URI,
      clientId: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET
    });

    if (hostname === 'open.spotify.com') {
      document.body.classList.add('youtify-player');
      return;
    }

    this.ga = new Analytics();
    this.loadYoutify();
  }

  loadYoutify () {
    if (!document.location.href.match(util.ytRegex)) return;
    this.ga.sendPageView();

    let videoTitleElem = document.querySelector('#eow-title');
    if (!videoTitleElem) return false;

    let videoTitle             = videoTitleElem.textContent;
    let songInfo               = this.youtify.getInfoFromTitle(videoTitle);
    let categoryElems          = [].slice.call(document.querySelectorAll('.watch-info-tag-list li a'));
    let descriptionElem        = document.querySelector('#eow-description');
    let description            = descriptionElem.innerHTML;
    let guessYouTubeMusicVideo = this.youtify.guessYouTubeMusicVideo(description);
    let button                 = this.createButton(['youtify-open-button', 'disabled']);
    let spotifyUrl             = this.youtify.getSpotifyUrlFromDescription(descriptionElem);

    let isMusicCategory = categoryElems.some(elem => {
      return elem.getAttribute('data-ytid') === 'UC-9-kyTW8ZkZNDHQJ6FgpwQ';
    });

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

    this.youtify.search(videoTitle, 'track', util.getCountryCode()).then(data => {
      if (data.tracks.items && data.tracks.items[0]) {
        this.ga.sendSongInfo(data.tracks.items[0].uri);
        button.classList.remove('disabled');
        button.href = data.tracks.items[0].uri;
        this.updateButton(button, 'Open in Spotify');
        button.setAttribute('title', videoTitle);
        button.addEventListener('mousedown', () => {
          document.querySelector('.video-stream').pause();
          this.ga.sendButtonClick(data.tracks.items[0].uri);
        });
      } else {
        this.ga.sendSongNotFound();
        this.updateButton(button, 'Not available in Spotify');
      }
    });
  }

  createButton (classList, text, appendTo) {
    appendTo = appendTo || document.getElementById('watch7-subscription-container');

    let button = document.createElement('a');
    this.updateButton(button, text);

    for (let cssClass of classList) {
      button.classList.add(cssClass);
    }

    appendTo.parentNode.insertBefore(button, appendTo.nextSibling);
    return button;
  }

  updateButton (button, text) {
    button.innerHTML = text;
    return button;
  }
}
