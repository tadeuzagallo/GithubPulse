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

    var data = {};
    data[key] = value;
    chrome.storage.sync.set(data);
  };

  Utils.fetch = function (key, expiration, callback) {
    if (Array.isArray(key)) {
      key = key.join('/');
    }

    if (typeof expiration === 'function') {
      callback = expiration;
      expiration = undefined;
    }

    chrome.storage.sync.get(key, function (r) {
      var value = r[key];

      var item = value && JSON.parse(value);
      var time = null;

      if (expiration !== -1 && item && Date.now() - item.time > expiration) {
        item = null;
      } else if (item) {
        time = item.time;
        item = item.data;
      }

      if (key.indexOf('user_contributions') === 0 && item) {
        Utils.updateIcon(item.today);
      }

      callback(item, time);
    });
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

    chrome.storage.sync.remove(key);
  };

  Utils.openURL = function (url) {
    chrome.tabs.create({ url: url });
  };

  Utils.contributions = function (username, callback, skipUpdateIcon) {
    var request = new XMLHttpRequest();
    request.onload = function () {
      var parser = new DOMParser();
      var svg = parser.parseFromString(this.responseText, "image/svg+xml");
      var nodeCounts = svg.querySelectorAll('rect');
      var commits = [].map.call(nodeCounts, function (node) {
        return parseInt(node.getAttribute('data-count'), 10);
      });

      var today = commits[commits.length - 1];
      for (var i = commits.length - 2, streak = today ? 1 : 0; i >= 0 && commits[i] > 0; i--, streak++);

      if (!skipUpdateIcon) {
        Utils.updateIcon(today);
      }

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

  chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'Cookie') {
        details.requestHeaders.splice(i, 1);
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  }, {
    urls: ['https://github.com/users/*/contributions']
  }, ['blocking', 'requestHeaders']);

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

  Utils.terminate = function () {
    chrome.management.setEnabled(chrome.i18n.getMessage("@@extension_id"), false);
    window.close();
  };

  Utils.quit = function () {
    chrome.notifications.create('bye', {
      type: 'basic',
      iconUrl: '../images/icons/icon128.png',
      title: 'Github Pulse is being disabled...',
      message: 'To re-enable it navigate to chrome:extensions',
      priority: 2,
      buttons: [{ title: 'cancel' }, { title: 'OK' }]
    }, function (id) { });

    chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
      if (notificationId === 'bye') {
        if (buttonIndex === 1) {
          Utils.terminate();
        } else {
          chrome.notifications.clear('bye', function () {});
        }
      }
    });
  };

  document.body.className = 'chrome';

  return Utils;
})();
