export const ytRegex = /https?:\/\/www\.youtube\.com\/watch\?v=.*/g;

export function getRegexValue(regex, text) {
  const match = regex.exec(text);
  if (match && match[1]) return match[1];
  return null;
}

export function getCountryCode() {
  return getRegexValue(/'INNERTUBE_CONTEXT_GL':\s*"(\w{2})"/ig, document.body.innerHTML);
}

export function extractVideoId(url) {
  return getRegexValue(/(?:watch\?v=|\.be\/)\b(.+?)\b.*?/ig, url);
}
