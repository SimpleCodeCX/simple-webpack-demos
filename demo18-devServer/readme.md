## demo18 webpack-dev-server (开发模式)

### 1.development vs production
development 模式:
> 在开发环境中，我们希望能够更加方便的进行开发以及调试代码，当项目运行起来后，可以自动打开浏览器，webpack 能够通过监听代码的修改，自动重新编译打包，并且实时刷新浏览器。

production 模式:
>在生产模式中，我们希望能够得到一个更小的 bundle，更轻量的 source >map，从而改善加载时间。

如果没有设置 `mode` ，webpack 默认以 `production` 模式进行打包。

### 2.webpack-dev-server

webpack-dev-server 是 webpack 官方提供的一个小型 Express 服务器。
通过配置它可以在开发模式下为 webpack 打包生成的静态资源文件启动一个 web 服务器，并检测代码的变化进行实时更新。

> 注意：webpack-dev-server只能工作于 `development` 模式。


webpack4提供了一个 `devServer` 的选项，来配置 `webpack-dev-server`。

devServer 的配置项挺多的，详见文档：https://www.webpackjs.com/configuration/dev-server/

* contentBase: 设置静态资源的路径，默认是当前工作目录。
* hot: 设置热更新功能，实现不刷新浏览器就能对修改到的模块进行热更新。
* open： devServer 自动打开浏览器
* overlay: 配置当 webpack 编译警告或出错时，是否在浏览器显示

    ```javascript
    overlay: true // 显示错误
    或
    overlay: {
      warnings: true, // 显示警告
      errors: true // 显示错误
    }
    ```
 * port: 指定要监听请求的端口号
 * proxy: devServer 是一个基于 express 的后端服务，在后端中是没有跨域的限制的（因为跨域是浏览器的行为），因此，通过这个代理，浏览器就不会出现跨域的问题了。比如通过如下配置把 /api 代理到 http://xxx.xxx.xxx.xxx/api
    ```avascript
    proxy: {
      "/api": "http://xxx.xxx.xxx.xxx/api"
    }
    ```
 * historyApiFallback: 当使用 HTML5 History API 时，默认情况下任意的 404 响应都被替换为 index.html。
                       可以通过如下修改配置
    ```javascript
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' }
      ]
    }
    ```
 
### 3.安装相关依赖

>注意: webpack-dev-server 依赖于 webpack 和 webpack-cli，所以需要在本地安装 webpack 和 webpack-cli。

```javascript
npm install -D webpack-dev-server
npm install -D webpack webpack-cli
npm install -D css-loader url-loader file-loader 
npm install -D mini-css-extract-plugin 
npm install -D html-webpack-plugin clean-webpack-plugin
```
 

### 4.目录结构

```javascript
// `--` 代表目录， `-` 代表文件
  --demo14 font
    --src
      --assets
        --fonts
          -icomoon.css
          -icomoon.eot //3KB
          -icomoon.svg //5KB
          -icomoon.ttf //3KB
          -icomoon.woff //3KB
        --styles
          -app.css
      -app.js
    -index.html
    -webpack.config.js
```
src/assets/fonts/icomoon.css
```javascript
@font-face {
  font-family: "icomoon";
  src: url("./icomoon.eot?nn7hff");
  src: url("./icomoon.eot?nn7hff#iefix") format("embedded-opentype"),
    url("./icomoon.ttf?nn7hff") format("truetype"),
    url("./icomoon.woff?nn7hff") format("woff"),
    url("./icomoon.svg?nn7hff#icomoon") format("svg");
  font-weight: normal;
  font-style: normal;
}

[class^="icon-"],
[class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: "icomoon" !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-wechat:before {
  content: "\e900";
  color: #7bb32e;
}
.icon-github:before {
  content: "\e902";
}
.icon-envelop:before {
  content: "\e945";
}
```

src/assets/styles/app.css
```javascript
.icons-box {
  width: 500px;
  height: 100px;
  margin: auto;
  margin-top: 180px;
}

.icons-box i {
  font-size: 100px;
  margin-left: 20px;
}
```

src/app.js

```javascript
import "./assets/fonts/icomoon.css";
import "./assets/styles/app.css";
```



### 5.编写webpack配置文件
webpack.config.js

```javascript
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
```


### 6.修改package.json

package.json 添加 script 脚本
```javascript
  "scripts": {
    "dev": "webpack-dev-server --open"
  },
```


### 7.执行打包命令
```javacript
npm run dev
```

运行成功后，会自动打开浏览器并显示 index.html 页面，修改 css 或 js 代码后，浏览器会自动刷新。
