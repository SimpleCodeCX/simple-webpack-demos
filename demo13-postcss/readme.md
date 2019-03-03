## demo13 webpack通过postcss-loader加工css和scss

### 1.关于 postcss-loader 和 postcss
>postcss: postcss 有一个插件体系，postcss 可以通过选择相应的插件对 css 进行转换和处理。
比如可以通过 Autoprefixer 插件来处理 css 的前缀，以实现浏览器的兼容性。

>postcss-loader: webpack 通过 postcss-loader 来调用 postcss

关于 PostCss 的文档：

英文文档: https://github.com/postcss/postcss

中文文档: https://github.com/postcss/postcss/blob/master/README-cn.md

### 2.webpack 如何配置 postcss
>在 postcss-loader 的 options 中配置 postcss
```javascript
      {
        loader: 'postcss-loader',
        options: {
          ident: "postcss",
          plugins: [
            require("autoprefixer") /* postcss 调用 autoprefixer 插件*/
          ]
        }
      }
```
>通过配置文件 postcss.config.js
```javascript
    module.exports = {
      parser: 'postcss',
      plugins: {
        'autoprefixer': {}
      }
    }
```

### 3.安装相关依赖
```javascript
npm install -D css-loader style-loader
npm install -D postcss-loader postcss autoprefixer
```

### 4.目录结构
// `--` 代表目录， `-` 代表文件
```javascript
  --demo13
    --src
      -app.js
      -style1.css
      -style2.css
    -index.html
    -postcss.config.js
    -webpack.config.js
```


### 5.编写 postcss.config.js 配置文件
webpack.config.js

```javascript
module.exports = {
  parser: 'postcss',
  plugins: {
    'autoprefixer': {}
  }
}
```

### 6.编写 webpack 配置文件
webpack.config.js

```javascript
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
```


### 7.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```


### 8.验证打包结果

transform 样式被添加了相应的前缀。

```javacript
transform: all 1s;
--------》
-webkit-transform: all 1s;
        transform: all 1s;
```
