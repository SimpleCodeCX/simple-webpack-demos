const path = require("path");

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
        test: /\.scss$/,
        // 以<style>标签形式引用css
        use: [
          {
            loader: "style-loader",  // 将 JS 字符串生成为 style 节点
            options: {
              singleton: true // 处理为单个style标签,注释掉试试看?
            }
          },
          "css-loader", // 将 CSS 转化成 CommonJS 模块
          "sass-loader" // 将 Sass/Scss 编译成 CSS
        ]

      }
    ],
    // rules: [
    //   {
    //     test: /\.scss$/,
    //     // 以<link>标签形式引用css
    //     use: [
    //       "style-loader/url",
    //       {
    //         loader: "file-loader",
    //         options: {
    //           name: '[name].[hash].css'
    //         }
    //       },
    //       "sass-loader"
    //     ]

    //   }
    // ]

  }
};
