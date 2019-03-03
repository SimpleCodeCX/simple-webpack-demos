const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 以<style>标签形式引用css
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 15360, // size <= 15KB, 改成15257(<14.9KB)试试?  
              name: "[name]-[hash:5].min.[ext]", // 设置文件名(>limit的情况)
              publicPath: "static/", // 设置资源文件的引用根路径
              outputPath: "static/" // publicPath/outputPath/[name].[ext]
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
  ]
};
