## demo11 webpack处理css

### 1.关于模块
在 webpack 中，所有类型的文件都是模块，比如 js、css、图片、字体、json（可以说是万物皆模块）。

但是，在普通的 js 代码中，我们直接 import (或require) 一张图片或css是会报错的。

但在 webpack 构建的项目中，归功于 loader（加载器），webpack 能够把 js 的模块化推广至其他类型文件，比如：
```javascript
import('xxx.css'); // 通过css-loader处理
```

### 2.处理 css 为什么要通过 webpack
传统引用 css 代码的方式是在 html 通过 `<style>` 或 `<link>` 标签来引入样式。

但是这样不是很方便，借助 webpack 的 `style-loader` 和 `css-loader` 等 loader (或plugin)，我们可以实现在 .js 或者 .ts 中引用 css 文件，并让样式以 `<style>` 或者 `<link>` 的方式自动添加到 html 文件中。

### 3.相关 loader 或 plugin
css-loader: 实现在 js 代码中加载 css 文件,并把 css 代码转化为 js 的一个 module ,比如 `import('./xxx.css')`

style-loader: 实现把加载的 css 代码作为 `style` 标签内容插入到 html 中

style-loader/url: 实现把加载的 css 代码以 `link` 内容插入到 html 中

file-loader: 实现对文件进行处理，比如修改文件名，并且输出到指定的路径，
file-loader 可以单独使用，也可以和 url-loader 一起使用

### 4.分别实现以 `<style>` 和 `<link>` 的方式引用 css
>4.1 以 `<style>` 方式引用 css 需要的 loader 为: `css-loader` + `style-loader`

webpack.config.js 关键配置如下：
```javascript
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
          "css-loader"
        ]

      }
    ],
```

>4.2 以 `<link>` 方式引用 css 需要的 loader 为: `file-loader` + `style-loader/url` (与 style-loader 是同一个包)

webpack.config.js 关键配置如下：
```javascript
    rules: [
      {
        test: /\.css$/,
        // 以<link>标签形式引用css
        use: [
          "style-loader/url",
          "file-loader"
        ]

      }
    ]
```


### 5.安装相关依赖
```javascript
npm install -D css-loader
npm install -D style-loader
npm install -D file-loader
```


### 6.目录结构
```javascript
// `--` 代表目录， `-` 代表文件
  --demo11
    --src
      -app.js
      -style1.css
      -style2.css
    -index.html
    -webpack.config.js
```

src/app.js
```javascript
// 同步加载
const style1 = import("./style1.css");
const style2 = import("./style2.css");


// window.addEventListener("click", function () {
//   // 试试异步加载? 查看控制台试试
//   const style1 = import("./style1.css");
//   const style2 = import("./style2.css");
// });
```

src/style1.css
```javascript
body {
  background-color: red;
}
/* console.log('11111'); */
```

src/style2.css
```javascript
body {
  color: black;
}
```

### 7.编写 webpack 配置文件
webpack.config.js

```javascript
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
        test: /\.css$/,
        // 以<style>标签形式引用css
        use: [
          {
            loader: "style-loader",
            options: {
              singleton: true // 处理为单个style标签,注释掉试试看?
            }
          },
          "css-loader"
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
    //       }
    //     ]

    //   }
    // ]

  }
};
```

### 8.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```

### 9.查看打包结果

创建 index.html 文件,引用打包生成的主文件 (这里是 app.bundle.js),
```html
  <script src="./dist/app.bundle.js"></script>
```
在浏览器打开，

在 <style> 模式下，会发现 css 以 `<style>` 的方式添加在 `<head>` 中，并且在设置 `singleton` 为 `true` 时，webpack 会把多个 css 文件合并在同一个 `<style>` 中。

在 <link> 模式下，会发现 css 以 `<link>` 的方式引用在 `<head>` 中。




