var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

require('../styles/GithubPulse');

var GithubPulse = React.createClass({
  render() {
    return (
      <div className="github-pulse">
        <RouteHandler {...this.props} />
      </div>
    );
  }
});

module.exports = GithubPulse;
