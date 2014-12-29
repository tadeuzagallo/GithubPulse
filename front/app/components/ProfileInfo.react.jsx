var React = require('react');
var Link = require('react-router').Link;

require('../styles/ProfileInfo');

var ProfileInfo = React.createClass({
  propTypes: {
    picture: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    username: React.PropTypes.string.isRequired
  },
  render() {
    return (
      <div className="profile-info">
        <div>
          <img className="profile-info__picture" src={ this.props.picture + '&size=100' } />

          <div className="profile-info__data">
            <h1 className="profile-info__name">{this.props.name} <Link to="login"><span className="octicon octicon-sign-out" /></Link></h1>
            <h3 className="profile-info__username">@{ this.props.username }</h3>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ProfileInfo;
