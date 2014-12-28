window.GithubApi = (function () {
  var GithubApi = {};
  GithubApi.host = 'https://api.github.com';

  var jsonRequest = function (method, path, callback) {
    var request = new XMLHttpRequest();
    request.onload = function () {
      callback(null, JSON.parse(request.responseText));
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
    jsonRequest('GET', path, callback);
  };

  return GithubApi;
})();
