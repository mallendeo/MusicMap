/* global ga */
export default function Analytics(code) {
  function loadGoogleAnalytics() {
    /* eslint-disable */
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
    /* eslint-enable */

    ga('create', code, 'auto');
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
    ga('send', 'pageview', window.location.pathname);
  }

  function sendButtonClick(id, spotifyUri) {
    sendEvent('button-clicked', 'click', `${id} - ${spotifyUri}`);
  }

  function sendSongInfo(id, spotifyUri) {
    sendEvent('song-info', 'info', `${id} - ${spotifyUri}`);
  }

  function sendSongNotFound(id) {
    sendEvent('song-not-found', 'info', id);
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
