'use strict';
let assert   = require('assert');
let keywords = require('./keywords.json');
let Youtify  = require('../src/lib/youtify');
let should   = require('should');

let youtify = new Youtify();

describe('Keywords', () => {
  describe('check keywords', () => {
    it('should match the title keywords', () => {
      for (let i = 0; i < keywords.length; i++) {
        let songInfo = youtify.getInfoFromTitle(keywords[i].title);
        songInfo = [songInfo.artist, songInfo.title, songInfo.remix].join(' ').trim();
        songInfo.should.equal(keywords[i].keywords);
      }
    });
  });
});
