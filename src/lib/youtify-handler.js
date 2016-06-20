import youtify from './youtify';
import * as util from './util';
import analytics from './analytics';

const hostname = document.location.hostname;

export default function YoutifyHandler() {
  function createButton(
    classList,
    text,
    appendTo = document.getElementById('watch7-subscription-container')) {
    const button = document.createElement('a');
    button.textContent = text;

    for (const cssClass of classList) {
      button.classList.add(cssClass);
    }

    appendTo.parentNode.insertBefore(button, appendTo.nextSibling);

    function update(msg, href = '#', enabled = false) {
      button.textContent = msg;
      button.href = href;

      if (enabled) {
        button.classList.remove('disabled');
        return;
      }

      button.classList.add('disabled');
    }

    return {
      disable(msg, href) {
        update(msg, href, false);
      },
      enable(msg, href) {
        update(msg, href, true);
      },
      elem: button,
    };
  }

  function loadYoutify(ga) {
    if (!document.location.href.match(util.ytRegex)) return;
    ga.sendPageView();

    const videoTitleElem = document.querySelector('#eow-title');
    if (!videoTitleElem) return;

    let videoTitle = videoTitleElem.textContent;

    const songInfo = youtify.getInfoFromTitle(videoTitle);
    const categoryElems = [].slice.call(document.querySelectorAll('.watch-info-tag-list li a'));
    const descriptionElem = document.querySelector('#eow-description');
    const description = descriptionElem.innerHTML;
    const guessYouTubeMusicVideo = youtify.guessYouTubeMusicVideo(description);
    const button = createButton(['youtify-open-button', 'disabled']);
    const spotifyUrl = youtify.getSpotifyUrlFromDescription(descriptionElem);

    const isMusicCategory = categoryElems.some(elem =>
      elem.getAttribute('data-ytid') === 'UC-9-kyTW8ZkZNDHQJ6FgpwQ');

    videoTitle = [songInfo.artist, songInfo.title, songInfo.remix].join(' ');
    button.disable('Loading...');

    if (youtify.isMix(description)) {
      button.disable('Mix not available in Spotify');
      if (!spotifyUrl) return;

      button.enable('Open the tracklist on Spotify', spotifyUrl);
      return;
    }

    if (!isMusicCategory && !guessYouTubeMusicVideo) {
      button.disable('Not in music category');
      return;
    }

    youtify
      .search(videoTitle, 'track', util.getCountryCode())
      .then(data => {
        if (data.tracks.items && data.tracks.items[0]) {
          ga.sendSongInfo(data.tracks.items[0].uri);
          button.enable('Open in Spotify', data.tracks.items[0].uri);
          button.elem.addEventListener('mousedown', () => {
            document.querySelector('.video-stream').pause();
            ga.sendButtonClick(data.tracks.items[0].uri);
          });
        } else {
          ga.sendSongNotFound();
          button.disable('Not available in Spotify');
        }
      });
  }

  function init() {
    if (hostname === 'open.spotify.com') {
      document.body.classList.add('youtify-player');
      return;
    }

    loadYoutify(analytics());
  }

  init();
}
