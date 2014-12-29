var React = require('react');
var Link = require('react-router').Link;

require('../styles/ProfileInfo');

var ProfileInfo = React.createClass({
  render() {
    return (
      <div className="profile-info">
        <div>
          <img className="profile-info__picture" src="https://avatars3.githubusercontent.com/u/764414?v=3&s=100" />

          <div className="profile-info__data">
            <h1 className="profile-info__name">Tade Zagallo <Link to="login"><img width="16" src="images/sign-out.svg" /></Link></h1>
            <h3 className="profile-info__username">@tadeuzagallo</h3>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ProfileInfo;
