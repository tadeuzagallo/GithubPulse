var React = require('react');
var Router = require('react-router');

var GithubPulse = require('./GithubPulse.react');
var Login = require('./Login.react');
var Profile = require('./Profile.react');

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var routes = (
  <Route handler={GithubPulse}>
    <Route name="profile" path=":username" handler={Profile} />
    <DefaultRoute name="login" handler={Login} />
  </Route>
);

Router.run(routes, (Handler, state) => {
  var params = state.params;
  React.render(<Handler params={ params  } />, document.body);
});
