import request from 'superagent';

const SPOTIFY_URI = 'https://api.spotify.com/v1';

export class Youtify {
  constructor (opts = {}) {
    this.clientId = opts.clientId || '';
    this.clientSecret = opts.clientSecret || '';
    this.redirectUri = opts.redirectUri || '';
    this.scopes = opts.scopes || '';
  }

  search (text, type) {
    return new Promise((resolve, reject) => {
      let url = SPOTIFY_URI + '/search?';
          url += '&q=' + encodeURIComponent(text);
          url += type ? '&type=' + type : '';

      request(url).end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res.body);
      });
    });
  }

  guessYouTubeMusicVideo (description) {
    return description.match(/soundcloud|spotify|itunes|bandcamp/igm);
  }

  isMix (description) {
    let regex = /track\s?list/igm;
    return description.match(regex) ? true : false;
  }

  getSpotifyUrlFromDescription (description) {
    let elems = description.children;
    let spotifyUrl = false;
    for (let i = 0; i < elems.length; i++) {
      let elem = elems[i];
      let isLink = elem.tagName === 'A';
      if (isLink && elem.textContent.match(/\/\/.*?spoti/i)) {
        spotifyUrl = elem.textContent;
      }
    }
    return spotifyUrl;
  }

  getInfoFromTitle (videoTitle) {

    /**
     * FIXME use correct regex instead
     */

    // Include remix/mix/version in the search terms and
    // remove common words that may interfere with search results
    let remixRegex = /[[(]([^[()\]]*?(?:mix|version)[^[()\]]*?)[\])]/ig;
    let remix = remixRegex.exec(videoTitle);
        remix = remix && remix[1] ? remix[1] : '';
        remix = remix.replace(/\s((?:dub|drum|chill)step|trap)\s/i, ' ');

    if (remix.match(/.*?of{1,2}icial.*?/ig)) {
      remix = '';
    }

    let keywords = videoTitle

      // Remove all brackets content and special characters
      .replace(/\w\.{2,4}/ig, '  ')
      .replace(/[\[\(].*?[\]\)]/ig, '  ')
      .replace(/[:_!\&®]+?/g, '  ')
      .replace(/[.,'"]+?/g, '')

      // Remove all single characters but 'I' and hyphens
      .replace(/\s(?![I-\s]).\s/ig, '  ')
      .replace(/\s+\w\/\w\s?/ig, '  ')
      .replace(/(\w)-(\w)/, '$1 $2')

      // Most reggaeton/pop videos :/
      .replace(/\s+?(music\s+?video|20\d{2}|audio\s+?original|reggaeton)\s*?/ig, ' ')

      // Remove some common words
      .replace(/\s+?(ft|feat(uring)?|hd|of{1,2}icial\w*|exclusiv[eo]|v[ií]deo\w*)\s*?/ig, ' ')
      .trim()
      .split(/\s+/g);

    let gotHyphen = false;

    keywords.forEach((keyword, i) => {
      if (keyword === '-') {
        if (gotHyphen) {
          keywords.splice(i, 1);
        }
        gotHyphen = true;
      }
    });

    let splitKeywords = keywords.join(' ').split(/\s-(.+)?/);
    splitKeywords = splitKeywords.map(s => { return s.trim(); });

    let songInfo = {
      artist: splitKeywords[0] || '',
      title: splitKeywords[1] || '',
      remix: ''
    };

    // Check if artist is in both, the song title
    // and the remix match, and if not merge the remix
    // with the search terms.
    // Example here https://www.youtube.com/watch?v=OOevVQwQ-LM
    let remixArtist = remix.split(/\s+/g);
        remixArtist = remixArtist[0] ? remixArtist[0] : remixArtist;

    let removeRemix = songInfo.artist.split(/\s+/g).some(keyword => {
      return remixArtist === keyword;
    });

    if (removeRemix) return songInfo;

    songInfo.remix = remix;
    return songInfo;
  }

  getToken (token, refresh) {
    return new Promise((resolve, reject) => {
      let req = request
        .post('https://accounts.spotify.com/api/token')
        .type('form')
        .send({ redirect_uri: this.redirectUri })
        .auth(this.clientId, this.clientSecret);

      if (refresh) {
        req.send({
          grant_type: 'refresh_token',
          refresh_token: token
        });
      } else {
        req.send({
          grant_type: 'authorization_code',
          code: token
        });
      }

      req.end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res.body);
      });
    });
  }
}
