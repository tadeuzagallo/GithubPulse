module.exports = {
  entry: "../javascript/main.jsx",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      {test: /\.jsx$/, loader: 'jsx-loader?harmony'},
      {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
      {test: /\.json$/, loader: 'json-loader'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.styl' ]
  }
};
