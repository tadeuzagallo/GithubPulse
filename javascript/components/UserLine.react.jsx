var React = require('react');

require('../styles/UserLine');

var UserLine = React.createClass({
  render() {
    var cx = React.addons.classSet;

    var hasToday = this.props.user.today > 0;
    var hasStreak = this.props.user.streak > 0;

    var todayClass = cx({'user-line__today': true, 'user-line__today-zero': !hasToday});
    var streakClass = cx({'user-line__bar-streak': true, 'user-line__bar-streak-zero': !hasStreak});
    var usernameClass = cx({'user-line__username': true, 'user-line__username-zero': !hasStreak});

    var widthPercent = Math.round((this.props.user.streak / this.props.maxStreak) * 55) + 45;
    if (isNaN(widthPercent)) { widthPercent = 45; }

    return (
      <div className="user-line" onClick={ this._profile }>
        <div className="user-line__bar">
          <div className={ streakClass } style={ { width: widthPercent + '%' } }>
            <span>{ 'streak ' + (typeof this.props.user.streak !== 'undefined' ? this.props.user.streak : '-') }</span>
          </div>
        </div>
        <div className={ usernameClass }>@{ this.props.user.login }</div>
        <div className={ todayClass }>
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
