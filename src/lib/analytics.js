/* global ga */

import env from '../.env.json';
import * as util from './util';

export default function Analytics() {
  function getYoutubeId() {
    return (util.extractVideoId(document.location.href) || '');
  }

  function loadGoogleAnalytics() {
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
          m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', env.G_ANALYTICS_CODE, 'auto');
    ga('set', 'checkProtocolTask', () => {});
    ga('require', 'displayfeatures');
  }

  function sendEvent(category, action, label) {
    ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
    });
  }

  function sendPageView() {
    ga('send', 'pageview', '/');
  }

  function sendButtonClick() {
    sendEvent('button-clicked', 'click', getYoutubeId());
  }

  function sendSongInfo(spotifyUri) {
    sendEvent('song-info', 'info', `${getYoutubeId()} - ${spotifyUri}`);
  }

  function sendSongNotFound() {
    sendEvent('song-not-found', 'info', getYoutubeId());
  }

  loadGoogleAnalytics();

  return {
    sendEvent,
    sendPageView,
    sendButtonClick,
    sendSongInfo,
    sendSongNotFound,
  };
}
