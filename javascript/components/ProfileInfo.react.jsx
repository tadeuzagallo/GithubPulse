var React = require('react');

require('../styles/ProfileInfo');

var ProfileInfo = React.createClass({
  propTypes: {
    picture: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    username: React.PropTypes.string.isRequired
  },
  render() {
    return (
      <div className="profile-info">
        <div>
          <img className="profile-info__picture" onClick={ this._gotoUsername } src={ this.props.picture + '&size=48' } />

          <div className="profile-info__data">
            <span className="profile-info__data__content">
              <div className="profile-info__name">
                <span onClick={ this._gotoUsername }>{this.props.name}</span>

                <span
                  onClick={ this._logout }
                  className="profile-info__logout octicon octicon-sign-out" />
              </div>
              <div className="profile-info__username" onClick={ this._gotoUsername }>
                @{ this.props.username }
              </div>
              <div className="profile-info__following" onClick={ this._showFollowing }>
                Show Users I&#39;m Following
              </div>
            </span>
          </div>
        </div>
      </div>
    );
  },
  _logout() {
    console.log(this.props);
    Utils.clear('username');
    this.props.history.pushState(null, '/');
  },
  _gotoUsername() {
    Utils.openURL('https://github.com/' + this.props.username);
  },
  _showFollowing() {
    this.props.history.pushState(null, `/compare/following/${this.props.username}`);
  },
});

module.exports = ProfileInfo;
