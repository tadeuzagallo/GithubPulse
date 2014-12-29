require('./styles/main');
require('./components/Routes.react');

require('./github-api').contributions('tadeuzagallo', console.log.bind(console));
