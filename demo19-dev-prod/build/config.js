'use strict'
const path = require('path');

module.exports = {
  dev: {
    publicPath: '/',
    filename: '[name].[chunkhash:8].bundle.js',
    chunkFilename: '[name].[chunkhash:8].chunk.js'
  },
  prod: {
    publicPath: './',
    filename: '[id].[name].[chunkhash:8].bundle.js',
    chunkFilename: '[id].[name].[chunkhash:8].chunk.js'
  }
}
