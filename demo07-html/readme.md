## demo07 自动生成 Html 文件

### 1.为什么要自动生成html?
在之前的 demo 中，执行完 `webpack` 后要手动把生成的同步模块的 js 包 (或css包) 引入到html中，这样其实是比较繁琐的。

尤其是在真正的项目开发中，为了对静态资源或第三方包做长缓存，我们会配置 webpack ，让其生成的每个包的文件名都自动带上该包对应的 chunkhash 值。如果文件内容有改变的话，那么该文件对应的包的 chunkhash 也会改变，这样就导致对应的 html 引用的 url 地址也需要进行相应的修改。

因此，我们需要通过 webpack 插件来自动生成 html 以及自动引用相应的 js 包。

html-webpack-plugin 插件就能帮你做到。

### 2.html-webpack-plugin

html-webpack-plugin 可以根据你配置的 html 模板，自动生成一个 html 文件，并且引用相关的资源文件。

```javascript
  new HtmlWebpackPlugin({
      title: '设置html的title',// 当设置了template选项后，title选项将失效
      filename: "index.html",
      template: "./index.html",
      minify: {
        // 压缩选项
        collapseWhitespace: true
      }
    }),
```

- title 设置生成的 html 文件的标题(当设置了template选项后，title选项将失效)
- filename 生成 html 的文件名
- template 指定一个模板文件来生成 html ，可选的模板有 html,jade , ejs 等等，使用自定义模板时，需要安装相对应的 loader 。
- inject 配置 `<script>` (即js包) 标签在 html 中的注入选项：true(默认) | body | head | false
    - true `<script>` 标签放在 `<body>` 底部
    - body 效果与 true 相同
    - head `<script>` 标签放在 html 的 `<head>` 标签内
    - false 不引用 webpack 生成的 js 文件
- favicon 设置 html 文件的 favicon
- minify (默认false) 对 html 文件进行压缩
- hash 在引用 js 或 css 文件的 url 中添加一个唯一的 hash 值，用于避免缓存命中
- chunks 默认情况下，html 会引用 webpack 生成的所有同步模块的js文件（即使是多入口），通过此选型可以指定只引入哪些特定入口的文件
- excludeChunks 与 chunks 选项相反

   官方文档：[https://github.com/jantimon/html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)


### 3.安装相关依赖

(注意：html-webpack-plugin 依赖于 webpack，因此需要在项目下安装 webpack)
```javascript
npm install -D html-webpack-plugin
npm install -D webpack
npm install -D css-loader // 把 css 转化为 js 模块
npm install -D style-loader // 将 css 以 style 节点插入 html 中
```

### 4.目录结构
```javascript
// `--` 代表目录， `-` 代表文件
  --demo07
    --src
      -app.js
      -app2.js
      -style.css
    --index.html
    --webpack.config.js
```


src/app.js
```javascript
// const css = import('./style.css');
window.addEventListener("click", function () {
  const css = import('./style.css');
  console.log(css);
});
```

src/style.js
```javascript
body{
  background-color: red;
}
```

### 5.编写webpack配置文件
webpack.config.js

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.js"
    // app2: "./src/app2.js"
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
        // css处理为style标签
        use: [
          "style-loader",
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '设置html的title',// 当设置了template选项后，title选项将失效
      filename: "index.html",
      template: "./index.html",
      // chunks: ["app"], // entry中的app入口才会被打包
      minify: {
        // 压缩选项
        collapseWhitespace: true
      }
    }),
  ]
};
```

### 6.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```

### 7.验证打包结果
在 dist 文件夹中包含 index.html , 并自动引用相应的 js 包。
输出结果：
```javacript
1.bundle.js
app.bundle.js
index.html
```
