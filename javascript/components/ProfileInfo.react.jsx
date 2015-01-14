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
          <img className="profile-info__picture" src={ this.props.picture + '&size=100' } />

          <div className="profile-info__data">
            <h1 className="profile-info__name">
              {this.props.name}
              &nbsp;
              <a className="profile-info__logout" onClick={ this._logout }>
                <span className="octicon octicon-sign-out" />
              </a>
            </h1>
            <h3 className="profile-info__username">@{ this.props.username }</h3>
          </div>
        </div>
      </div>
    );
  },
  _logout() {
    Utils.clear('username');
    this.transitionTo('login');
  }
});

module.exports = ProfileInfo;
