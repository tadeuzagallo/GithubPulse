var React = require('react');

require('../styles/Stats');

var Stats = React.createClass({
  propTypes: {
    repos: React.PropTypes.number.isRequired,
    followers: React.PropTypes.number.isRequired,
    streak: React.PropTypes.number.isRequired,
    today: React.PropTypes.number.isRequired
  },
  render() {
    return (
      <div className="stats">
        <div className="stat">
          <h3 className="stat__count">{ this.props.repos }</h3>
          <small>repos</small>
        </div>

        <div className="stat">
          <h3 className="stat__count">{ this.props.followers }</h3>
          <small>followers</small>
        </div>

        <div className="stat">
          <h3 className="stat__count">{ this.props.streak }</h3>
          <small>days streak</small>
        </div>

        <div className="stat">
          <h3 className="stat__count">{ this.props.today }</h3>
          <small>commits today</small>
        </div>
      </div>
    );
  }
});

module.exports = Stats;
