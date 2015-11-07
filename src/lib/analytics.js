import env       from '../.env.json';
import * as util from './util';

export default class Analytics {
  constructor () {
    this.loadGoogleAnalytics();
  }

  getYoutubeId () {
    return (util.extractVideoId(document.location.href) || '');
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

  sendButtonClick () {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'button-clicked',
      'eventAction': 'click',
      'eventLabel': this.getYoutubeId()
    });
  }

  sendSongInfo (spotifyUri) {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'song-info',
      'eventAction': 'info',
      'eventLabel': this.getYoutubeId() + ' - ' + spotifyUri
    });
  }

  sendSongNotFound (spotifyUri) {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'song-not-found',
      'eventAction': 'info',
      'eventLabel': this.getYoutubeId()
    });
  }
}
