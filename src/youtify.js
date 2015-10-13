var Promise = require('bluebird')
var request = require('superagent')

var SPOTIFY_URI = 'https://api.spotify.com/v1'

function Youtify(opts) {
  opts = opts || {}
  this.clientId = opts.clientId || ''
  this.clientSecret = opts.clientSecret || ''
  this.redirectUri = opts.redirectUri || ''
  this.scopes = opts.scopes || ''
}

Youtify.prototype.search = function (text, type) {
  return new Promise(function(resolve, reject) {
    var url = SPOTIFY_URI + '/search?'
    url += '&q=' + encodeURIComponent(text)
    url += type ? '&type=' + type : ''

    request(url).end(function(err, res){
      if (err) {
        reject(err)
        return
      }

      resolve(res.body)
    })
  })
}

Youtify.prototype.guessYouTubeMusicVideo = function (description) {
  return description.match(/soundcloud|spotify|itunes|bandcamp/igm)
}

Youtify.prototype.checkIfMix = function (description) {
  var regex = /track\s?list/igm
  return description.match(regex) ? true : false
}

Youtify.prototype.getSpotifyUrlFromDescription = function (description) {
  var elems = description.children
  var spotifyUrl = false
  for (var i = 0; i < elems.length; i++) {
    var elem = elems[i]
    var isLink = elem.tagName === 'A'
    if (isLink && elem.textContent.match(/\/\/.*?spoti/i)) {
      spotifyUrl = elem.textContent
    }
  }
  return spotifyUrl
}

Youtify.prototype.getInfoFromTitle = function (videoTitle) {

  /**
   * FIXME use correct regex instead
   */

  // Include remix/mix/version in the search terms
  var remixRegex = /[[(]([^[()\]]*?(?:mix|version)[^[()\]]*?)[\])]/ig
  var remix = remixRegex.exec(videoTitle)
  remix = remix && remix[1] ? remix[1] : ''

  if (remix.match(/.*?of{1,2}icial.*?/ig)) {
    remix = ''
  }

  var keywords = videoTitle

    // Remove all brackets content and special characters
    .replace(/\w\.{2,4}/ig, '  ')
    .replace(/[\[\(].*?[\]\)]/ig, '  ')
    .replace(/[:"'_!\&®]+?/g, '  ')
    .replace(/[.,]+?/g, '')

    // Remove all single characters but 'I'
    // and hyphens
    .replace(/\s(?![I-\s]).\s/ig, ' ')
    .replace(/\s+\w\/\w\s?/ig, ' ')
    .replace(/(\w)-(\w)/, '$1 $2')

    // Most reggaeton/pop videos :/
    .replace(/\s+?(music\s+?video|20\d{2}|audio\s+?original|reggaeton)\s*?/ig, ' ')

    // Remove some common words
    .replace(/\s+?(ft|feat(uring)?|hd|of{1,2}icial\w*|exclusiv[eo]|v[ií]deo\w*)\s*?/ig, ' ')
    .trim()
    .split(/\s+/g)

  var gotHyphen = false

  keywords.forEach(function(keyword, i){
    if (keyword === '-') {
      if (gotHyphen) {
        keywords.splice(i, 1)
      }
      gotHyphen = true
    }
  })

  var splitKeywords = keywords.join(' ').split(/\s-(.+)?/)
  splitKeywords = splitKeywords.map(function(s) { return s.trim() })

  var songInfo = {
    artist: splitKeywords[0] || '',
    title: splitKeywords[1] || '',
    remix: ''
  }

  // Check if artist is in both, the song title
  // and the remix match, and if not merge the remix
  // with the search terms.
  // Example here https://www.youtube.com/watch?v=OOevVQwQ-LM
  var remixArtist = remix.split(/\s+/g)
  remixArtist = remixArtist[0] ? remixArtist[0] : remixArtist

  var removeRemix = songInfo.artist.split(/\s+/g).some(function(keyword) {
    return remixArtist === keyword
  })

  if (removeRemix) return songInfo

  songInfo.remix = remix
  return songInfo
}

Youtify.prototype.getToken = function (token, refresh) {
  var self = this
  return new Promise(function(resolve, reject) {
    var req = request
      .post('https://accounts.spotify.com/api/token')
      .type('form')
      .send({ redirect_uri: self.redirectUri })
      .auth(self.clientId, self.clientSecret)

    if (refresh) {
      req.send({
        grant_type: 'refresh_token',
        refresh_token: token
      })
    } else {
      req.send({
        grant_type: 'authorization_code',
        code: token
      })
    }

    req.end(function(err, res){
      if (err) {
        reject(err)
        return
      }

      resolve(res.body)
    })
  })
}
module.exports = Youtify
