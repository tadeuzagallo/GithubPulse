window.GithubApi = (function () {
  var GithubApi = {};
  GithubApi.host = 'https://api.github.com';

  var request = function (method, path, callback) {
    var request = new XMLHttpRequest();
    request.onload = function () {
      var result = request.responseText;
      if (~request.getResponseHeader('content-type').indexOf('json')) {
        result = JSON.parse(result);
      }
      callback(null, result);
    };
    request.onerror = function (err) {
      callback(err, null);
    };
    request.open(method, GithubApi.host + '/' + path, true);
    request.send();
  };

  GithubApi.get = function () {
    var args = [].slice.call(arguments);
    var callback = args.pop();
    var path = args.join('/');
    request('GET', path, callback);
  };

  GithubApi.contributions = function (username, callback) {
    window.contributions = function(response) {
      callback(null, response);
    };
    window.location = 'osx:contributions/' + username;
  };

  return GithubApi;
})();

module.exports = GithubApi;
