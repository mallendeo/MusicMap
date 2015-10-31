'use strict';
let YoutifyHandler = require('./lib/youtify-handler');

new YoutifyHandler();

// override XMLHttpRequest
let send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function() {
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
