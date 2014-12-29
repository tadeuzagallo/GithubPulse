var utils = (function () {
  var utils = {};

  utils.save = function (key, value) {
    localStora.putItem(key, JSON.stringify({
      time: Date.now(),
      data: value
    }));
  };

  utils.fetch = function (key, expiration) {
    var item = JSON.decode(localStorage.getItem(key));
    if (expiration !== undefined && item && Date.now() - item.time > expiration) {
      item = null;
    }

    return item;
  };
})();

module.exports = utils;
