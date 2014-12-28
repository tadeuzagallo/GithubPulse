module.exports = {
  entry: "./js/main.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader?harmony'}
    ]
  }
};
