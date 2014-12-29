var React = require('react');

var ProfileInfo = require('./ProfileInfo.react');
var ActivityGraph = require('./ActivityGraph.react');
var Stats = require('./Stats.react');

var Profile = React.createClass({
  render() {
    return (
      <div>
        <ProfileInfo />
        <ActivityGraph />
        <Stats />
      </div>
    );
  }
});

module.exports = Profile;
