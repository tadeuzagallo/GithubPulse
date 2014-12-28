(function (window, document) {
  document.write('here');
  var loginForm = document.querySelector('.gh-login-form');
  var usernameInput = document.querySelector('.gh-username-input');
  var userData;

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var username = usernameInput.value.trim();
    GithubApi.get('users', username, function (err, result) {
      if (err) {
        alert(err);
      } else {
        userData = result;
        document.body.innerHTML = JSON.stringify(result);
      }
    });
  }, false);
})(window, document);
