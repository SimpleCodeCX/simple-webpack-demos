'use strict'
const merge = require('webpack-merge');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const baseWebpackConfig = require('./webpack.base.conf')

const prodWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader, // 将css提取为单独的文件
          "css-loader", // 将 CSS 转化成 js 模块
          {
            loader: 'postcss-loader',// 配置在postcss.config.js
          },
          "sass-loader" // 将 Sass/Scss 编译成 CSS
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: "single", // webpack运行时代码单独提取为一个包
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        async: {
          chunks: "async",
          maxInitialRequests: 3, // 设置最大的请求数
          automaticNameDelimiter: '~',
          priority: 9
        },
        vendors: {
          chunks: "all", // 使用 all 模式
          test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 下的模块
          name: "vendors", // 包命名，最终的命名要结合 output 的 chunkFilename
          priority: 10 // 设置优先级
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[id].[name].[chunkhash:8].css",
      chunkFilename: "[id].[name].[chunkhash:8].css"
    })
  ]
});

module.exports = prodWebpackConfig;




