var React = require('react');

require('../styles/GithubPulse');

var GithubPulse = React.createClass({
  render() {
    return (
      <div className="github-pulse">
        { this.props.children }
      </div>
    );
  }
});

module.exports = GithubPulse;
