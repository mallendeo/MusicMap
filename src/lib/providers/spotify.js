export default function Spotify() {
  const SPOTIFY_URI = 'https://api.spotify.com/v1';

  function search(text, type, countryCode) {
    let url = `${SPOTIFY_URI}/search?`;
    url += `&market=${countryCode || ''}`;
    url += `&q=${encodeURIComponent(text)}`;
    url += `&type=${type || ''}`;

    return fetch(url).then(res => res.json());
  }

  return {
    search,
  };
}
