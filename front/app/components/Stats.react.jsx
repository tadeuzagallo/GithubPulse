var React = require('react');

require('../styles/Stats');

var p = (l, n) => n === 1 ? l : l + 's';

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
          <small>{ p('repo', this.props.repos) }</small>
        </div>

        <div className="stat">
          <h3 className="stat__count">{ this.props.followers }</h3>
          <small>{ p('follower', this.props.followers) }</small>
        </div>

        <div className="stat">
          <h3 className="stat__count">{ this.props.streak }{ this.props.streak > 15 ? <span className="octicon octicon-flame notification" /> : '' }</h3>
          <small>{ p('day', this.props.streak) } streak</small>
        </div>

        <div className="stat">
          <h3 className="stat__count">{ this.props.today }{ !this.props.today ? <span className="octicon octicon-stop notification" /> : '' }</h3>
          <small>{ p('commit', this.props.today) } today</small>
        </div>
      </div>
    );
  }
});

module.exports = Stats;
