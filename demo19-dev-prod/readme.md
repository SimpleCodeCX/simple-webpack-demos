## demo19 webpack 开发模式和生产模式
### 1.开发环境和生产环境的 webpack 配置
开发环境和生产环境的构建目标是有很大的不同的。

在开发环境中，为了便于代码调试以及实现浏览器实时更新,我们需要开启 `source map` 和 `localhost server`。

而在生成环境中,为了实现缓存优化以及改善加载时间,我们的目标转向于打包成更小的 `bundle` 或 `chunk`,分离第三方包以及开启更轻量级的 `source map` 以及更优化的资源。

因此开发环境和生产环境需要单独配置 webpack。


### 2.定个需求
假设项目打包需求如下:

>公共部分:
* 自动生成html、并解析css、js文件 ([`html-webpack-plugin`](https://simplecodecx.github.io/blog/20190224/e9584fe7.html))
* 处理scss,以及自动添加css前缀 ( [`postcss-loader`](https://simplecodecx.github.io/blog/20190311/41443a76.html) [`sass-loader` `css-loader` `style-loader`](https://simplecodecx.github.io/blog/20190311/5bb783a3.html))
* 处理图片和字体,小于 20k 转化为base64字符串,大于20k则通过url引用 ([`url-loader` `file-loader`](https://simplecodecx.github.io/blog/20190311/1275f9d9.html))
* 处理typescript ([`ts-loader`](https://simplecodecx.github.io/blog/20190224/808417d9.html))

>在开发环境下:
* 开启 [`source map`](https://simplecodecx.github.io/blog/20190311/f1f1f195.html) 
* 开启 [`devServer`](https://simplecodecx.github.io/blog/20190311/f1f1f195.html)


>在生产环境下:
* 压缩代码
* 将css分离成单独的css文件,并进行压缩 [`mini-css-extract-plugin`](https://simplecodecx.github.io/blog/20190311/b166f567.html)
* 将第三方依赖包分离成单独的 chunk ([`SplitChunksPlugin`](https://simplecodecx.github.io/blog/20190311/ecf0b61.html))
* 将异步包分离成单独的 chunk

### 3.webpack配置文件

根据以上情况，我们需要定义三个webpack配置文件,分别是:
* webpack.base.conf.js

  用来配置开发模式和生产模式的wenpack公共配置
* webpack.dev.conf.js
  
  用来专门配置开发模式所需的webpack配置
* webpack.prod.conf.js
 
  用来专门配置生产模式所需的webpack配置

### 4.目录机构

```javascript
  --demo19 
    --build
      -config.js
      -webpack.base.conf.js //公共配置
      -webpack.dev.conf.js //开发环境
      -webpack.prod.conf.js //生产环境
    --src
      --app
        -app.ts
      --assets
        --fonts // 字体相关
          -icomoon.css
          -icomoon.eot
          -icomoon.svg
          -icomoon.ttf
          -icomoon.woff
        --images // 图片相关
          -1.png //18.6KB
          -2.png //12.1KB
          -3.png //14.9KB
          -me.jpg //2.58MB
        --styles
          -app.scss
      -index.html
    -postcss.config.js // 处理 css 前缀
    -tsconfig.json // 处理 ts
```

代码放在github上

### 5.安装相关依赖

```javascript
npm install -D css-loader style-loader node-sass sass-loader // 处理scss
npm install -D postcss postcss-loader autoprefixer  // 处理css前缀
npm install -D file-loader url-loader // 处理字体和图片
npm install -D ts-loader typescript // 处理ts
npm install -D html-webpack-plugin clean-webpack-plugin // 自动生成html文件以及清除dist目录
npm install -D webpack-dev-server // devServer
npm install -D mini-css-extract-plugin // 分离css为单独的文件
npm install -D optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin // 压缩css和js文件
npm install -D webpack-merge // 合并webpack配置: base + dev 或 base + prod
npm install -D webpack  webpack-cli
```


### 6.webpack配置文件如下
#### webpack.base.conf.js（开发和生产模式的公共配置）

```javascript
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


```

#### webpack.dev.conf.js （开发模式所需配置）

```javascript
'use strict'
const path = require('path');
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "../dist/"),
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          "css-loader", // 将 CSS 转化成 js 模块
          {
            loader: 'postcss-loader' // 配置在postcss.config.js
          },
          "sass-loader" // 将 Sass/Scss 编译成 CSS
        ]
      }
    ]
  },
  plugins: []
});
module.exports = devWebpackConfig;


```

#### webpack.prod.conf.js （生产模式所需配置）

```javascript
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
```

### 5.配置 npm scripts 命令
在 package.json 中添加如下 npm scripts
```javascript
  "scripts": {
    "dev": "webpack-dev-server --open --inline --progress --config build/webpack.dev.conf.js",
    "prod": "webpack --config build/webpack.prod.conf.js"
  },
```


### 6.执行命令 
> 执行如下命令，开启开发调试模式,自动打开浏览器,当修改代码时,浏览器自动刷新,便于开发和调试。
```javacript
npm run dev 
```
> 执行如下命令,webpack将以production模式进行打包,实现代码压缩,分离第三方模块以及css为单独的chunk,这样有利于对单独的包进行缓存优化。
```javascript
npm run prod
```

### 7.源码地址
demo 代码地址: https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo19-dev-prod

仓库代码地址(及目录): https://github.com/SimpleCodeCX/simple-webpack-demos