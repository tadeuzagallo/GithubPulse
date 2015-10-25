var React = require('react');
var Router = require('react-router');
var ReactDOM = require('react-dom');

var GithubPulse = require('./GithubPulse.react');
var Login = require('./Login.react');
var Profile = require('./Profile.react');
var Following = require('./Following.react');

var Route = Router.Route;
var IndexRoute = Router.IndexRoute;

var routes = (
  <Router.Router>
    <Route component={GithubPulse}>
      <Route path="/" component={Login} />
      <Route path="/:username" component={Profile} />
      <Route path="/compare/following/:username" component={Following} />
    </Route>
  </Router.Router>
);

ReactDOM.render(routes, document.getElementById('github-pulse'));
