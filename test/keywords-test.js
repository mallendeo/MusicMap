import assert      from 'assert';
import keywords    from './keywords.json';
import { Youtify } from '../src/lib/youtify';
import should      from 'should';

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
