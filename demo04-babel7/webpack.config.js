module.exports = {
  mode: 'production' || 'development',
  entry: {
    app: "./src/app.js"
  },
  output: {
    filename: "app.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
