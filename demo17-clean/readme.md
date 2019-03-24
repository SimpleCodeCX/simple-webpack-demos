## demo17 clean-webpack-plugin (清除模式)

### 1.为什么需要自动清除 dist 文件夹
在之前的 demo 中，webpack 打包后会在根目录下自动创建 dist 目录，并且把生成的文件输出到 dist 下。

当配置的输出包名含有 `[hash]` 时，hash值会随着文件内容的改变而改变。

因此，我们需要在下一次 webpack 打包输出之前，把 dist 目录清空。

clean-webpack-plugin 插件就能帮你做到。

### 2.clean-webpack-plugin
`clean-webpack-plugin` 可以实现 webpack 每次打包之前，清空指定目录。

>注意: `clean-webpack-plugin` 插件应该放在 `plugins` 的最后，因为 webpack 的插件执行顺序是从后往前执行的。
比如:
```javascript
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(["dist"]) // 需放在最后一个
  ]
```

### 3.安装相关依赖

```javascript
npm install -D clean-webpack-plugin
npm install -D css-loader style-loader
npm install -D html-webpack-plugin webpack 
```

### 4.目录结构

```javascript
// `--` 代表目录， `-` 代表文件
  --demo17
    --src
      -app.js
      -style.css      
    -index.html
    -webpack.config.js
```

src/style.css  
```javascript
body {
  background-color: red;
}
```

src/app.js
```javascript
const css = import('./style.css');
```


### 5.编写webpack配置文件
webpack.config.js

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[name]-[hash].bundle.js"
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
      minify: {
        // 压缩选项
        collapseWhitespace: true
      }
    }),
    new CleanWebpackPlugin(["dist"])
  ]
};
```


### 6.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```


### 7.验证打包结果

每次进行 webpack 打包都会先清除 dist 目录
