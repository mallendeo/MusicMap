import youtubeParser from '../src/lib/parsers/youtube';
import keywords from './keywords.json';
import test from 'ava';

test('[Youtube] Should match the keywords', t => {
  const youtube = youtubeParser();
  for (let i = 0; i < keywords.length; i++) {
    let songInfo = youtube.getInfoFromTitle(keywords[i].title);
    songInfo = [songInfo.artist, songInfo.title, songInfo.remix].join(' ').trim();
    t.is(songInfo, keywords[i].keywords);
  }
});
