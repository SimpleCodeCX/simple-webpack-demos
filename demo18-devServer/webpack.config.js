const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development", // 开发模式
  entry: {
    app: "./src/app.js"
  },
  output: {
    publicPath: '/', // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[id].[name].[chunkhash:8].bundle.js", // 在development模式下,id为name
    chunkFilename: "[id].[name].[chunkhash:8].chunk.js"
  },
  devtool: "source-map", // 
  devServer: {
    contentBase: path.join(__dirname, "dist"),
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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 3000,
              publicPath: "fonts/",
              outputPath: "fonts/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ // 自动生成html,并且自动导入所有依赖同步包
      filename: "index.html",
      template: "./index.html",
      minify: {
        // collapseWhitespace: true // 压缩
      }
    }),
    new MiniCssExtractPlugin({
      filename: "[id].[name].[chunkhash:8].css",
      chunkFilename: "[id].[name].[chunkhash:8].css"
    }),
    new CleanWebpackPlugin(["dist"])
  ]
};
