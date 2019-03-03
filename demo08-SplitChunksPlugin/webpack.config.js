const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: 'production' || 'development',
  entry: {
    app1: "./src/app1.js",
    app2: "./src/app2.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js"
  },
  optimization: {
    // runtimeChunk: "single", // 使用single模式，可以避免每一个包都包含webpack的运行文件
    splitChunks: {
      cacheGroups: {
        modules: {
          chunks: "async" || "initial" || "all", // 三选一
          minChunks: 1, // 代码块至少被引用的次数
          maxInitialRequests: 3, // 设置最大的请求数
          minSize: 0, // 设置每个chunk最小的大小，只有大于这个值，才会被打包进一个chunk
          automaticNameDelimiter: '~'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ // 自动生成html
      filename: "index.html",
      template: "./index.html"
    }),
  ]
};
