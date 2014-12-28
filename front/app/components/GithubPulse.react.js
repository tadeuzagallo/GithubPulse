var React = require('react');

var ProfileInfo = require('./ProfileInfo.react');
var ActivityGraph = require('./ActivityGraph.react');
var Stats = require('./Stats.react');

var GithubPulse = React.createClass({
  render() {
    return (
      <div className="github-pulse">
        <ProfileInfo />
        <ActivityGraph />
        <Stats />
      </div>
    );
  }
});

module.exports = GithubPulse;
