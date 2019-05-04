## demo15 webpack 处理图片

### 1.通过 url-loader 和 file-loader 处理图片

通过 url-loader 和 file-loader 配合可以实现：
>当图片大小 < 某个限定值（limit）时，转换为 base64 字符传，并打包进 bundle 中。

>当图片大小 > 某个限定值时，将图片放到指定目录下，并通过 url 引用。


### 2.关于 url-loader
url-loader: 可以将 css 文件中的字体和图片 url 转化为 base64 字符串，从而减少对资源的发起 http 请求次数。

url-loader 的配置参数如下：

- limit {Number} : 设置一个限定值（单位字节）

   >当图片或字体的大小 < limit 时，会被转成 base64，并打包进 bundle 中

   >当图片或字体的大小 > limit 时，默认会调用 file-loader 来处理图片
   
   >在没有配置 limit (单位字节) 值的情况下，所有大小的图片都会被转成base64

           
- mimetype {String} : 设置 base64 格式的编码格式，没有设置此属性时，默认根据图片扩展名来判断
  > 例如 `mimetype: 'image/png'` 
- fallback {String} : 当图片或字体的大小 > limit 时，默认会使用 url-loader 来处理，也可以通过此属性设置其他的 loader 来处理

  >( 注意: file-loader 和 url-loader 共享同一个 options , file-loader 和 url-loader 的 option 是不冲突的 )


配置示例:

(处理图片)
```javascript
{
  test: /\.(png|jpg|jpeg|gif)$/, // 处理图片
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192, // size <= 8KB
          name: 'img/[hash].[ext]', // 属于file-loader的属性
          publicPath: "fonts/",  // 属于file-loader的属性
          outputPath: "fonts/"  // 属于file-loader的属性
        }
      }
    ]
}
```

(处理字体)
```javascript
{
  test: /\.(eot|woff2?|ttf|svg)$/, // 处理字体
    use: [
      {
        loader: "url-loader",
        options: {
        limit: 5000, // size <= 5KB
          name: "[name]-[hash:5].min.[ext]", // 属于file-loader的属性
          publicPath: "fonts/",  // 属于file-loader的属性
          outputPath: "fonts/"  // 属于file-loader的属性
        }
      }
    ]
}
```
### 3.关于 file-loader

实现对文件进行处理，比如修改文件名，并且输出到指定的路径，file-loader 可以单独使用，也可以与 url-loader 一起使用。

>url-loader 在处理图片或字体时，当文件的大小大于 limit 时，默认使用 file-loader 来处理。

file-loader 的配置参数如下：

- name 
  - [name] 原文件名字，不包含扩展名
  - [hash:8] hash 值，默认是 32 位
  - [ext] 原文件扩展名
  - [path] 实际上是相对于 context 的路径，context 默认是 webpack.config.js 的路径
  
- context 影响[path],默认为 webpack.config.js context

- publicPath 打包后资源文件的引用会基于此路径，也可以设置为 cdn：`https://www.xxx.com/img`。（默认使用 output 的 publicPath 属性）

- outputPath publicPath/outputPath/[name].[ext]



### 4.目录结构

这里准备了三张图片，大小分别是：18.6k、12.1k、14.9k。并设置 `limit:15360` (15k)，

```javascript
// `--` 代表目录， `-` 代表文件
  --demo15
    --src
      --assets
        --imgs
          -1.png //18.6KB
          -2.png //12.1KB
          -3.png //14.9KB
        --styles
          -app.css
      -app.js
    -index.html
    -webpack.config.js
```


src/assets/styles/app.css

```javascript
*,
body {
  margin: 0;
  padding: 0;
}

.container div{
  width:200px;
  height: 200px; 
  float: left;
}
.div1{
  background: url("../imgs/1.png") no-repeat;
}

.div2{
  background: url("../imgs/2.png") no-repeat;
}

.div3{
  background: url("../imgs/3.png") no-repeat;
}
```

src/app.js
```javascript
// 同步加载
import "./assets/styles/app.css";

// window.addEventListener("click", function () {
//   // 试试异步加载? 查看浏览器控制台试试
//   import("./assets/styles/app.css");
// });
```


### 5.安装相关依赖

```javascript
npm install -D css-loader style-loader
npm install -D file-loader url-loader
npm install -D html-webpack-plugin webpack 
```


### 6.编写 webpack 配置文件
webpack.config.js

```javascript
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
  --static
    -1-bd4ee.min.png //18.6KB
  -app.bundle.js
  -index.html
```

`2.png` (12.1KB) 和 `3.png` (14.9KB) 被转换成 base64 字符串并打包进 `app.bundle.js` 中。

`1.png`(18.6KB) => `1-bd4ee.min.png`


把 `limit` 改成 `15257` (<14.9KB) 试试? 

### 9.源码地址
demo 代码地址: https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo15-img

仓库代码地址(及目录): https://github.com/SimpleCodeCX/simple-webpack-demos