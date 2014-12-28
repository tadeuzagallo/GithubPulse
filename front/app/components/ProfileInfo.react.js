var React = require('react');

var ProfileInfo = React.createClass({
  render() {
    return (
      <div>
        <img src="https://avatars3.githubusercontent.com/u/764414?v=3&s=460" />
        <div>
          <h1>Tade Zagallo</h1>
          <h3>@tadeuzagallo</h3>
        </div>
      </div>
    );
  }
});

module.exports = ProfileInfo;
