'use strict'
const path = require("path");
const isDev = /^dev/.test(process.env.npm_lifecycle_event);
const config = require('./config');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: isDev ? "development" : "production", // 开发模式
  entry: {
    app: "./src/app/app.ts"
  },
  output: {
    publicPath: isDev ? config.dev.publicPath : config.prod.publicPath, // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "..", "dist"), // 打包后的输出目录
    filename: isDev ? config.dev.filename : config.prod.filename,// 在development模式下,id为name
    chunkFilename: isDev ? config.dev.chunkFilename : config.prod.chunkFilename
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' },
      {
        test: /\.(jpg|png|gif|bmp|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20000, // size <= 20KB
              name: '[name].[hash].[ext]', // 属于file-loader的属性
              publicPath: "imgs/",  // 属于file-loader的属性
              outputPath: "imgs/"  // 属于file-loader的属性
            }
          }
        ]
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ // 自动生成html,并且自动导入所有依赖同步包
      filename: "index.html",
      template: path.resolve(__dirname, "../src", "index.html"),
      minify: {
        collapseWhitespace: true // 压缩
      }
    }),
    new CleanWebpackPlugin()
  ]
};
