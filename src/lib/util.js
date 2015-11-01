export const ytRegex = /https?:\/\/www\.youtube\.com\/watch\?v=.*/g;

export function getCountryCode () {
  let re = /\'INNERTUBE_CONTEXT_GL\':.*"(\w{2})"}\)/ig;
  let match = re.exec(document.body.innerHTML);
  if (match && match[1]) return match[1];
  return false;
}
