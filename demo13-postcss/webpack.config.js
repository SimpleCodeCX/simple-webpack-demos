const path = require("path");

module.exports = {
  mode: 'development',
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
          {
            loader: "style-loader",
            options: {
              singleton: true // 处理为单个style标签,注释掉试试看?
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            // 配置在postcss.config.js
            // options: {
            //   ident: "postcss",
            //   plugins: [
            //     require("autoprefixer")  /*postcss调用autoprefixer插件*/
            //   ]
            // }
          }
        ]

      }
    ],
    // rules: [
    //   {
    //     test: /\.css$/,
    //     // 以<link>标签形式引用css
    //     use: [
    //       "style-loader/url",
    //       {
    //         loader: "file-loader",
    //         options: {
    //           name: '[name].[hash].css'
    //         }
    //       },
    //       {
    //         loader: 'postcss-loader',
    //         // 配置在postcss.config.js
    //         // options: {
    //         //   plugins: [
    //         //     require("autoprefixer")  /*postcss调用autoprefixer插件*/
    //         //   ]
    //         // }
    //       }
    //     ]

    //   }
    // ]

  }
};
