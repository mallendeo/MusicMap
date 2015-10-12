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

Youtify.prototype.getKeywords = function (videoTitle) {

  /**
   * FIXME use correct regex instead
   */

  // include remix/mix/version in the search terms
  var remixRegex = /[[(]([^[()\]]*?(?:mix|version)[^[()\]]*?)[\])]/ig
  var remix = remixRegex.exec(videoTitle)
  remix = remix && remix[0] ? remix[0] : ''

  if (remix.match(/.*?of{1,2}icial.*?/ig)) {
    remix = ''
  }

  return videoTitle

    // remove all brackets content and special characters
    .replace(/\w\.{2,4}/ig, ' ')
    .replace(/[\[\(].*?[\]\)]/ig, ' ')
    .replace(/[.,:"'!\&®]+?/g, '')
    .replace(/\-/g, ' ')

    // remove all single characters but 'I'
    .replace(/\s+?(?!I).\s+?/ig, ' ')
    .replace(/\s+\w\/\w\s?/ig, ' ')

    // most reggaeton/pop videos :/
    .replace(/\s+?(music\s+?video|20\d{2}|audio\s+?original|reggaeton)\s*?/ig, ' ')

    // remove some common words
    .replace(/\s+?(ft|feat(uring)?|hd|of{1,2}icial\w*|exclusiv[eo]|v[ií]deo\w*)\s*?/ig, ' ')
    .trim()
    .split(/\s+/g)
    .concat(remix)
    .join(' ')
    .trim()
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
