'use strict'
const path = require('path');
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "../dist/"),
    port: 8000,
    hot: false,
    overlay: true,
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: "/index.html" }]
    }
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          "css-loader", // 将 CSS 转化成 js 模块
          {
            loader: 'postcss-loader' // 配置在postcss.config.js
          },
          "sass-loader" // 将 Sass/Scss 编译成 CSS
        ]
      }
    ]
  },
  plugins: []
});
module.exports = devWebpackConfig;
