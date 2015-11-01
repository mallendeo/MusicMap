import YoutifyHandler from './lib/youtify-handler';
import { ytRegex }    from './lib/util';

new YoutifyHandler();

// override XMLHttpRequest
let send = window.XMLHttpRequest.prototype.send;
window.XMLHttpRequest.prototype.send = function() {
  let callback = this.onreadystatechange;
  this.onreadystatechange = function() {
    if (this.readyState == 4) {
      let responseURL = this.responseURL;
      if (responseURL.match(ytRegex)) {
        new YoutifyHandler();
      }
    }

    if (callback) callback.apply(this, arguments);
  };
  send.apply(this, arguments);
};
