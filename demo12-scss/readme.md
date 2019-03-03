## demo12 webpack 处理 scss

### 1.如何处理 scss

`sass-loader` > `css-loader` > `style-loader` (以 `<style>` 标签形式添加到 html 中)

或

`sass-loader` > `file-loader` > `style-loader/url` (以 `<link>` 标签形式添加到 html 中)

sass-loader: 处理 sass/scss 文件，并且把它们编译成 css

css-loader: 处理 css，并把 css 代码转化为一个 js module

style-loader: 实现把加载的 css 代码以 `style` 标签的形式插入到 html 中

file-loader: 在这里实现把 css 提取为文件



### 2.安装相关依赖

>注意：sass-loader 依赖于 node-sass

```javascript
npm install -D sass-loader node-sass
npm install -D css-loader style-loader file-loader
```

### 3.目录结构
```javascript
// `--` 代表目录， `-` 代表文件
  --demo12
    --src
      -app.js
      -style1.scss
      -style2.scss
    -index.html
    -webpack.config.js
```

src/app.js
```javacript
// 同步加载
// import "./style1.scss";
// import "./style2.scss";


window.addEventListener("click", function () {
  // 试试异步加载? 查看控制台试试
  const style1 = import("./style1.scss");
  const style2 = import("./style2.scss");
});
```

src/style1.scss
```javacript
$bgColor: red;
body {
  background-color: $bgColor;
}
```

src/style2.scss
```javacript
$color: black;
body {
  color: $color;
}
```

### 4.编写 webpack 配置文件
webpack.config.js
```javacript
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
```

### 5.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```
打包成功后，结果输出在 dist 目录中

### 6.查看打包结果

创建 index.html 文件,引用打包生成的主文件 (这里是 app.bundle.js),
```html
  <script src="./dist/app.bundle.js"></script>
```
在浏览器打开，

在 <style> 模式下，会发现 scss 被转化为css后以 `<style>` 的方式添加在 `<head>` 中，并且在设置 `singleton` 为 `true` 时，webpack 会把多个 css 文件合并在同一个 `<style>` 中。

在 <link> 模式下，会发现 scss 文件被转化 css 文件，并以 `<link>` 的方式引用在 `<head>` 中。

