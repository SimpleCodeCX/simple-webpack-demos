const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development', // 使用development模式，方便看到各个包名中的 [name]，以区分各个包，在production模式下，[name]会被转化为0 1 2...
  entry: {
    app: "./src/app.js",
  },

  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[name].[chunkhash].bundle.js", // 每个包包含 chunkhash
    chunkFilename: "[id].[chunkhash].chunk.js"
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        async: {
          chunks: "async",
          minChunks: 1, // 代码块至少被引用的次数
          maxInitialRequests: 3, // 设置最大的请求数
          minSize: 0, // 设置每个 chunk 最小的大小 (默认30000)，这里设置为 0，以方便测试
          automaticNameDelimiter: '~',
          priority: 9
        },
        vendors: {
          chunks: "all", // 使用 all 模式
          test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 下的模块
          name: "vendors", // 包命名，最终的命名要结合 output 的 chunkFilename
          minChunks: 1,
          minSize: 30000,
          priority: 10 // 设置优先级
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
