import youtify from '../src/lib/youtify';
import keywords from './keywords.json';
import test from 'ava';

test('[Youtify] Should match the keywords', t => {
  for (let i = 0; i < keywords.length; i++) {
    let songInfo = youtify.getInfoFromTitle(keywords[i].title);
    songInfo = [songInfo.artist, songInfo.title, songInfo.remix].join(' ').trim();
    t.is(songInfo, keywords[i].keywords);
  }
});
