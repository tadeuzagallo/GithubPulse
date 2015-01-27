var React = require('react');

require('../styles/UserLine')

var UserLine = React.createClass({
  render() {
    var todayClass = this.props.user.today > 0 ? '' : 'user-line__today-zero';
    var streakClass = this.props.user.streak > 0 ? '' : 'user-line__bar-streak-zero';
    var usernameClass = this.props.user.streak > 0 ? '' : 'user-line__username-zero';
    var widthPercent = Math.round((this.props.user.streak / this.props.maxStreak) * 55) + 45;
    if (isNaN(widthPercent)) { widthPercent = 45; }

    return (
      <div className="user-line" onClick={ this._profile }>
        <div className="user-line__bar">
          <div className={ "user-line__bar-streak " + streakClass } style={ { width: widthPercent + '%' } }>
            <span>{ 'streak ' + (typeof this.props.user.streak !== 'undefined' ? this.props.user.streak : '-') }</span>
          </div>
        </div>
        <div className={ "user-line__username " + usernameClass }>@{ this.props.user.login }</div>
        <div className={ "user-line__today " + todayClass }>
          { typeof this.props.user.today !== 'undefined' ? this.props.user.today : '-' }
        </div>
        <div className="user-line__today-label">today</div>
        <img className="user-line__picture" src={ this.props.user.avatar_url + '&size=36' }/>
      </div>
    );
  },
  _profile() {
    Utils.openURL('https://github.com/' + this.props.user.login);
  }
});

module.exports = UserLine;
