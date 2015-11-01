import env from '../.env.json';

export default class Analytics {
  constructor () {
    this.loadGoogleAnalytics();
  }

  loadGoogleAnalytics () {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', env.G_ANALYTICS_CODE, 'auto');
    ga('set', 'checkProtocolTask', () => {});
    ga('require', 'displayfeatures');
  }

  sendPageView () {
    ga('send', 'pageview', '/');
  }

  sendButtonClickGa () {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'button-clicked',
      'eventAction': 'click',
      'eventLabel': document.location.href
    });
  }

  sendSongInfoGa (spotifyUri) {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'song-info',
      'eventAction': 'info',
      'eventLabel': document.location.href + ' - ' + spotifyUri
    });
  }

  sendSongNotFoundGa (spotifyUri) {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'song-not-found',
      'eventAction': 'info',
      'eventLabel': document.location.href
    });
  }
}
