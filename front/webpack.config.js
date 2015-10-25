var utils = {
  osx: '../javascript/utils.js',
  chrome: '../chrome_extension/js/utils.js'
};

module.exports = {
  entry: [utils[process.env.TARGET || 'osx'], '../javascript/main.jsx'],
  devtool: 'source-map',
  output: {
    publicPath: 'public/',
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.jsx$/, loader: 'babel-loader'},
      {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.ttf$/, loader: 'file-loader' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.styl' ]
  }
};
