## demo16 webpack 处理字体

### 1.关于字体
>字体的格式有很多种，各个浏览器对各个字体格式的支持程度也不同，字体格式有以下几种：
* TureTpe(.ttf) 格式 
 
  支持 `IE9+,Firefox3.5+,Chrome4+,Safari3+,Opera10+,iOS Mobile Safari4.2+`
* OpenType(.otf) 格式

  支持 `Firefox3.5+,Chrome4.0+,Safari3.1+,Opera10.0+,iOS Mobile Safari4.2+`
* Embedded Open Type(.eot) 格式：

  支持 `IE4+`
* Web Open Font Format(.woff) 格式：

  支持 `IE9+,Firefox3.5+,Chrome6+,Safari3.6+,Opera11.1+`
* SVG(.svg) 格式：
  
  支持 `IE9+,Chrome4+,Safari3.1+,Opera10.0+,iOS Mobile Safari3.2+`

>定义@font-face

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
```

>使用字体
```javascript
.div1 {
  font-family: "icomoon" !important;
}
```

### 2.制作自定义字体

通过 [IcoMoon](https://icomoon.io/app) 平台，我们可以挑选和定制项目所用到的字体 icon ，最后导出字体的 eot , svg , woff , ttf 格式，并包含一个定义了 `@font-face` 的 css 文件，也就是说我们不需要自己去定义 `@font-face` ，只要引用这份 css 文件，即可使用到字体图标。

IconMon 平台导出的文件包大概如下：
```javascript
icomoon.eot
icomoon.svg
icomoon.ttf
icomoon.woff
style.css // 定义了 @font-face，以及使用字体的相关样式
```

### 3.通过 url-loader 和 file-loader 处理字体


通过 url-loader 和 file-loader 配合可以实现：
>当字体大小 < 某个限定值（limit）时，转换为 base64 字符传，并打包进 bundle 中。

>当字体大小 > 某个限定值时，将图片放到指定目录下，并通过 url 引用。


当字体大小比较小时，可以把字体转化为 base64 字符串，从而减少一次浏览器发起 http 请求。

当字体比较大时，就没必要了，因为 base64 转换后，总体积会变大，此时比不上多一次 http 请求的性能。


### 4.安装相关依赖

```javascript
npm install -D css-loader style-loader
npm install -D file-loader url-loader
npm install -D html-webpack-plugin mini-css-extract-plugin
npm install -D webpack // html-webpack-plugin、mini-css-extract-plugin 依赖于 webpack
```

### 5.目录结构

```javascript
// `--` 代表目录， `-` 代表文件
  --demo16
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




### 6.编写 webpack 配置文件
webpack.config.js

```javascript
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js"
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
              limit: 3000, // size <= 3000B, 改成5000B试试?  
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
    })
  ]
};
```


### 7.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```


### 8.验证打包结果

输出结果:

```javacript
--dist
  --fonts
    -icomoon-69ba6.min.svg //5KB
  -0.app.a3d3cc59.css
  -app.bundle.js
  -index.html
```

<= 3KB 的字体文件被转换成 base64 字符串并打包进 `app.bundle.js` 中。

`icomoon.svg`(18.6KB) => `icomoon-69ba6.min.svg`


把 `limit` 改成 `5000` 试试? 
