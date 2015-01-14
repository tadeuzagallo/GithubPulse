window.Utils = (function () {
  var Utils = {};

  Utils.log = function () {
    console.log.apply(console, arguments);
  };

  Utils.save = function (key, value) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    value = JSON.stringify({
      time: Date.now(),
      data: value
    });

    localStorage.setItem(key, value);
  };

  Utils.fetch = function (key, expiration, callback) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    if (typeof expiration === 'function') {
      callback = expiration;
      expiration = undefined;
    }

    var value = localStorage.getItem(key);

    var item = value && JSON.parse(value);
    var time = null;

    if (expiration !== -1 && item && Date.now() - item.time > expiration) {
      item = null;
    } else if (item) {
      time = item.time;
      item = item.data;
    }

    if (key.indexOf('user_contributions') === 0 && item) {
      this.updateIcon(item.today);
    }

    callback(item, time);
  };

  Utils.raw = function (expression, callback) {
    //if (callback) {
      //fnName = expression.split('(').shift();
      //rawCallbacks[fnName] = callback;
    //}

    //Utils.redirect('osx:' + expression);
  };

  Utils.clear = function (key) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    if (key === 'username') {
      this.updateIcon(1);
    }

    localStorage.removeItem(key);
  };

  Utils.contributions = function (username, callback) {
    var request = new XMLHttpRequest();
    request.onload = function () {
      var parser = new DOMParser();
      var svg = parser.parseFromString(this.responseText, "image/svg+xml");
      var nodeCounts = svg.querySelectorAll('rect');
      var commits = [].map.call(nodeCounts, function (node) {
        return parseInt(node.getAttribute('data-count'), 10);
      });

      var today = commits[commits.length - 1];
      for (var i = commits.length - 1, streak = 0; i >= 0 && commits[i] > 0; i--, streak++);

      Utils.updateIcon(today);
      callback(true, today, streak, commits.slice(-30));
    };

    request.onerror = function () {
      callback(false, null, null, null);
      console.error(this.statusText);
    };

    request.open('GET', 'https://github.com/users/' + username + '/contributions', true);
    //request.open('GET', 'http://localhost:8081/contributions.svg', true);
    request.send(null);
  };

  Utils.updateIcon = function (commits) {
    var color = commits === 0 ? 'red' : 'blue';
    var imgs = {};
    [19, 38].forEach(function (size) {
      imgs[size] = '../images/' + color + '/icon' + size + '.png';
    });

    chrome.browserAction.setIcon({
      path: imgs
    });
  };

  return Utils;
})();
