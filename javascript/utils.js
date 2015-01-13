window.Utils = (function () {
  var Utils = {};

  var queue = [];
  var running = false;
  var pop = function () {
    if (queue.length) {
      setTimeout(function() {
        window.location = encodeURI(queue.shift());
        pop();
      }, 0);
    } else {
      running = false;
    }
  };

  Utils.redirect = function (url) {
    queue.push(url);
    if (!running) {
      running = true;
      pop();
    }
  };

  Utils.log = function () {
    Utils.redirect('log:' + [].join.call(arguments, '  '));
  };

  Utils.save = function (key, value) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    value = JSON.stringify({
      time: Date.now(),
      data: value
    });

    Utils.redirect('osx:set(' + key + '%%' + value + ')');
  };

  var callbacks = {};
  window.get = function (key, value, expiration) {
    key = decodeURI(key);
    value = decodeURI(value);

    var item = value && JSON.parse(value);
    var time = null;

    if (expiration !== -1 && item && Date.now() - item.time > expiration) {
      item = null;
    } else if (item) {
      time = item.time;
      item = item.data;
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
    Utils.redirect('osx:get(' + key + '%%' + (expiration || -1) + ')');
  };

  var rawCallbacks = {};
  window.raw = function (fnName) {
    var args = [].slice.call(arguments, 1);
    var callback = rawCallbacks[fnName];
    rawCallbacks[fnName] = null;
    callback.apply(null, args);
  };

  Utils.raw = function (expression, callback) {
    if (callback) {
      fnName = expression.split('(').shift();
      rawCallbacks[fnName] = callback;
    }

    Utils.redirect('osx:' + expression);
  };

  Utils.clear = function (key) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    Utils.redirect('osx:remove(' + key + ')');
  };

  Utils.contributions = function (username, callback) {
    window.contributions = callback;
    Utils.redirect('osx:contributions(' + username + ')');
  };

  return Utils;
})();
