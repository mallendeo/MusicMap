var assert   = require('assert')
var keywords = require('./keywords.json')
var Youtify  = require('../lib/youtify')
var should   = require('should')

var youtify = new Youtify()

describe('Keywords', function() {
  describe('check keywords', function() {
    it('should match the title keywords', function() {
      for (var i = 0; i < keywords.length; i++) {
        youtify.getKeywords(keywords[i].title).should.equal(keywords[i].keywords)
      }
    })
  })
})
