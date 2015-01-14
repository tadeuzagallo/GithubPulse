// jshint expr: true

var update = function (username) {
  var request = new XMLHttpRequest();
  request.onload = function () {
    var parser = new DOMParser();
    var svg = parser.parseFromString(this.responseText, "image/svg+xml");
    var commits = svg.querySelectorAll('rect:last-child');
    var today = parseInt(commits[commits.length - 1], 10);
    today = 0;
    var color = today === 0 ? 'red' : 'blue';
    var imgs = {};
    [19, 38].forEach(function (size) {
      imgs[size] = '../images/' + color + '/icon' + size + '.png';
    });

    chrome.browserAction.setIcon({
      path: imgs
    });
  };

  request.open('GET', 'https://github.com/users/' + username + '/contributions', true);
  request.send(null);
};

chrome.alarms.onAlarm.addListener(function (alarm) {
  console.log('received alarm', alarm);
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
