var assert   = require('assert')
var keywords = require('./keywords.json')
var Youtify  = require('../src/youtify')
var should   = require('should')

var youtify = new Youtify()

describe('Keywords', function() {
  describe('check keywords', function() {
    it('should match the title keywords', function() {
      for (var i = 0; i < keywords.length; i++) {
        var songInfo = youtify.getInfoFromTitle(keywords[i].title)
        console.log(songInfo)
        songInfo = [songInfo.artist, songInfo.title, songInfo.remix].join(' ').trim()
        songInfo.should.equal(keywords[i].keywords)
      }
    })
  })
})
