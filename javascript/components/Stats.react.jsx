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
          <div className="stat__count">{ this.props.repos }</div>
          <div className="stat__name">{ p('repo', this.props.repos) }</div>
        </div>

        <div className="stat">
          <div className="stat__count">{ this.props.followers }</div>
          <div className="stat__name">{ p('follower', this.props.followers) }</div>
        </div>

        <div className="stat">
          <div className="stat__count">{ this.props.streak }{ this.props.streak > 15 ? <span className="octicon octicon-flame notification" /> : '' }</div>
          <div className="stat__name">{ p('day', this.props.streak) } streak</div>
        </div>

        <div className="stat">
          <div className="stat__count">{ this.props.today }{ !this.props.today ? <span className="octicon octicon-stop notification" /> : '' }</div>
          <div className="stat__name">{ p('commit', this.props.today) } today</div>
        </div>
      </div>
    );
  }
});

module.exports = Stats;
