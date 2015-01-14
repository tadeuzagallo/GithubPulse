// jshint expr: true

var notify = function () {
  chrome.notifications.create('gotta_commit', {
    type: 'basic',
    iconUrl: '../images/icons/icon128.png',
    title: 'You haven\'t commited today yet...',
    message: 'Rush to keep your streak going!'
  }, function (id) { });
};

var checkShouldNotify = function () {
  var d = new Date();

  if (d.getHours() < 18) {
    return;
  }

  chrome.storage.sync.get('last_notification', function (r) {
    d.setHours(1);
    d.setMinutes(0);

    if (r.last_notification &&
      r.last_notification > d.getTime()) {
      return;
    }

    notify();
    chrome.storage.sync.set({
      last_notification: Date.now()
    });
  });
};

var update = function (username) {
  var request = new XMLHttpRequest();
  request.onload = function () {
    var parser = new DOMParser();
    var svg = parser.parseFromString(this.responseText, "image/svg+xml");
    var commits = svg.querySelectorAll('rect:last-child');
    var today = parseInt(commits[commits.length - 1], 10);
    var color = today === 0 ? 'red' : 'blue';
    var imgs = {};
    [19, 38].forEach(function (size) {
      imgs[size] = '../images/' + color + '/icon' + size + '.png';
    });

    chrome.browserAction.setIcon({
      path: imgs
    });

    if (today === 0) {
      checkShouldNotify();
    }
  };

  request.open('GET', 'https://github.com/users/' + username + '/contributions', true);
  request.send(null);
};

chrome.alarms.onAlarm.addListener(function (alarm) {
  chrome.storage.sync.get('username', function (r) {
    var item = r.username && JSON.parse(r.username);
    item && item.data && update(item.data);
  });
});


chrome.alarms.clearAll(function () {
  chrome.alarms.create('check_contributions', {
    delayInMinutes: 0.25,
    periodInMinutes: 15
  });
});
