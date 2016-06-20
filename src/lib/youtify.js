const SPOTIFY_URI = 'https://api.spotify.com/v1';

function search(text, type, countryCode) {
  let url = `${SPOTIFY_URI}/search?`;
  url += `&market=${countryCode || ''}`;
  url += `&q=${encodeURIComponent(text)}`;
  url += `&type=${type || ''}`;

  return fetch(url).then(res => res.json());
}

function guessYouTubeMusicVideo(description) {
  return description.match(/soundcloud|spotify|itunes|bandcamp/igm);
}

function isMix(description) {
  return description.match(/track\s?list/igm);
}

function getSpotifyUrlFromDescription(description) {
  const elems = description.children;
  let spotifyUrl = false;
  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    const isLink = elem.tagName === 'A';
    if (isLink && elem.textContent.match(/\/\/.*?spoti/i)) {
      spotifyUrl = elem.textContent;
    }
  }
  return spotifyUrl;
}

function cleanTitle(title) {
  return title
    // Remove all brackets content and special characters
    .replace(/\w\.{2,4}/ig, '  ')
    .replace(/[[({].*?[})\]]/ig, '  ')
    .replace(/[:_!&®]+?/g, '  ')
    .replace(/[.,"]+?/g, '')

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
}

function getInfoFromTitle(videoTitle) {
  const songInfo = {
    title: null,
    artist: null,
    remix: null,
  };

  const keywords = cleanTitle(videoTitle);

  // Include remix/mix/version in the search terms and
  // remove common words that may interfere with search results
  const remixRegex = /[[({]([^[()\]]*?(?:mix|version|mashup)[^[()\]]*?)[})\]]/ig;
  let remix = remixRegex.exec(videoTitle);
  remix = remix && remix[1] ? remix[1] : '';
  remix = remix.replace(/\b(\w*?step|trap|the)\b/i, ' ');
  remix = remix.replace(/\d{4}/g, '');
  remix = remix.replace(/version|mashup/i, '');
  remix = remix.trim().replace(/\s{1,}/g, ' ');

  if (remix.match(/.*?of{1,2}icial.*?/ig)) {
    remix = '';
  }

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
  splitKeywords = splitKeywords.map(s => s.trim());

  songInfo.artist = splitKeywords[0] || '';
  songInfo.title = splitKeywords[1] || '';
  songInfo.remix = '';

  // Check if artist is in both, the song title
  // and the remix match, and if not merge the remix
  // with the search terms.
  // Example here https://www.youtube.com/watch?v=OOevVQwQ-LM
  let remixArtist = remix.split(/\s+/g);
  remixArtist = remixArtist[0] ? remixArtist[0] : remixArtist;

  const removeRemix = songInfo.artist
    .split(/\s+/g)
    .some(keyword => remixArtist === keyword);

  if (removeRemix) return songInfo;

  songInfo.remix = remix;
  return songInfo;
}

export default {
  search,
  guessYouTubeMusicVideo,
  isMix,
  getSpotifyUrlFromDescription,
  cleanTitle,
  getInfoFromTitle,
};
