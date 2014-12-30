var Utils = (function () {
  var Utils = {};

  Utils.save = function (key, value) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    value = JSON.stringify({
      time: Date.now(),
      data: value
    });

    window.location = 'osx:set(' + key + '%%' + value + ')';
  };

  var callbacks = {};
  window.get = function (key, value, expiration) {
    window.location = 'log:get(' + key + ') = ' + value;
    var item = value && JSON.parse(value);
    var time = null;

    if (expiration !== -1 && item && Date.now() - item.time > expiration) {
      item = null;
    } else if (item) {
      item = item.data;
      time = item.time;
    }

    var callback = callbacks[key];
    callbacks[key] = null;
    callback(item, time);
  };

  Utils.fetch = function (key, expiration, callback) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    if (typeof expiration === 'function') {
      callback = expiration;
      expiration = undefined;
    }


    callbacks[key] = callback;
    window.location = encodeURI('osx:get(' + key + '%%' + (expiration || -1) + ')');
  };

  Utils.clear = function (key) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    window.location = 'osx:remove(' + key + ')';
  };

  return Utils;
})();

module.exports = Utils;
