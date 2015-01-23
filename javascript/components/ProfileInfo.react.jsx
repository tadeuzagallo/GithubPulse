var React = require('react');
var Router = require('react-router');

var Link = Router.Link;

require('../styles/ProfileInfo');

var ProfileInfo = React.createClass({
  mixins: [ Router.Navigation ],
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
            </span>
          </div>
        </div>
      </div>
    );
  },
  _logout() {
    Utils.clear('username');
    this.transitionTo('login');
  },
  _gotoUsername() {
    Utils.openURL('https://github.com/' + this.props.username);
  }
});

module.exports = ProfileInfo;
