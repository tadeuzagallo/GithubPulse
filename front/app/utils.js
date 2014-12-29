var Utils = (function () {
  var Utils = {};

  Utils.save = function (key, value) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    localStorage.setItem(key, JSON.stringify({
      time: Date.now(),
      data: value
    }));
  };

  Utils.fetch = function (key, expiration) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    var item = JSON.parse(localStorage.getItem(key));

    if (expiration !== undefined && item && Date.now() - item.time > expiration) {
      item = null;
    } else if (item) {
      item = item.data;
    }

    return item;
  };

  Utils.clear = function (key) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    localStorage.removeItem(key);
  };

  return Utils;
})();

module.exports = Utils;
