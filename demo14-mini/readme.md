## demo14 webpack mini-css-extract-plugin + SplitChunksPlugin 处理 css 和 scss

### 1.关于 mini-css-extract-plugin
虽然webpack4不支持 `ExtractTextWebpackPlugin` 插件，但是我们可以使用 `mini-css-extract-plugin` 来实现把 css 提取为单独的文件。

相比 ExtractTextWebpackPlugin，mini-css-extract-plugin 有如下优点：

 * 异步加载
 * 不重复编译，性能更好
 * 更容易使用
 * 只针对CSS
 
 但目前 mini-css-extract-plugin 不支持HMR。
 
 详情见 `mini-css-extract-plugin` 官方文档：[https://github.com/webpack-contrib/mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
 
 `mini-css-extract-plugin` 的作用在于能够将所有的入口 chunk (entry chunks) 中引用的 *.css，移动到独立分离的 CSS 文件中。
 
因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（比如 styles.css）当中。 

如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。

使用  `mini-css-extract-plugin` 优点：
* CSS 请求并行
* CSS 单独缓存

缺点在于：

* 需要额外的 HTTP 请求


> 虽然 `file-loader` 也可以把 css 单独提取到 css 文件，但是无法合并多个css文件

### 2.关于打包方案（与 SplitChunksPlugin 结合）
- 为 Vendor 单独打包（Vendor 指第三方的库或者公共的基础组件，因为 Vendor 的变化比较少，单独打包利于缓存）
- 为 Manifest （Webpack 的 Runtime 代码）单独打包
- 为不同入口的公共业务代码打包（同理，也是为了缓存和加载速度）
- 为异步加载的代码打一个公共的包

https://juejin.im/post/5b304f1f51882574c72f19b0

### 3.异步 css 和异步 js

注意css的同步加载还是异步加载的引用方式：

同步加载：import './style2.css';

异步加载：import('./style2.css');

两种的打包结果是不一样的

### 4.自动生成 html HtmlWebpackPlugin
HtmlWebpackPlugin 简化了 HTML 文件的创建，以便为你的 webpack 包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 你可以让插件为你生成一个HTML文件，使用 lodash 模板提供你自己的模板，或使用你自己的 loader。

https://segmentfault.com/a/1190000007294861#articleHeader8


### 5.安装相关依赖
(注意：mini-css-extract-plugin 依赖于 webpack，因此需要在项目下安装 webpack)
```javascript
npm install -D webpack
npm install -D css-loader
npm install -D mini-css-extract-plugin
npm install -D html-webpack-plugin
```
### 6.目录结构
```javascript
// `--` 代表目录， `-` 代表文件
  --demo14
    --src
      --module1(同步模块)
        -module1.css
        -module1.js
      --module2(异步模块)
        -module2.css
        -module2.js
      --styles
        -async-style.css
        -common.css
      -app.js
    --vendor(第三方包)
      -vendor.css
      -vendor.js
    -index.html
    s-webpack.config.js
```


src/module1/module1.css

```javascript
body {
  color: black;
}

```

src/module1/module1.js

```javascript
import './module1.css';
console.log('这里是同步module1');
```

src/module2/module2.css

```javascript
body {
  font-size: 100px;
}
```

src/module2/module2.js

```javascript
import './module2.css';
console.log('这里是异步module2');
```

src/styles/async-style.css

```javascript
body {
  background-color: red;
}
```

src/styles/common.css

```javascript
body {
  font-family: monospace, "Microsoft Yahei", "微软雅黑", STXihei, "华文细黑";
}
```

vendor/vendor.css

```javascript
/* 第三方包css */
body {
  border: 1px solid black;
}

```

vendor/vendor.js

```javascript
// 这里假设vendor为第三方包
import './vendor.css';
console.log('这里是第三方依赖包');
```


src/app.js

```javascript
// 同步加载common.css
import './styles/common.css';

// 同步加载module1.js
import * as module1 from './module1/module1';

// 同步加载第三方包vendor.js
import * as vendor from '../vendor/vendor';

window.addEventListener('click', function () {
  // 异步加载module2.js
  import(/* webpackChunkName: 'module2'*/ './module2/module2').then(_ => {
    console.log('加载异步module2成功');
  });
  // async-style.css
  import(/* webpackChunkName: 'async-style'*/'./styles/async-style.css').then(_ => {
    console.log('加载异步async-style.css成功');
  });

});
```



### 7.编写 webpack 配置文件
webpack.config.js

```javascript
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'production' || 'development' || 'production',
  entry: {
    app: "./src/app.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[id].[name].[chunkhash:8].bundle.js", // 在development模式下,id为name
    chunkFilename: "[id].[name].[chunkhash:8].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: "single", // webpack运行时代码单独提取为一个包
    splitChunks: {
      cacheGroups: {
        async: { // 为异步代码打成一个公共包(在app.js修改一下代码,重新打包,不影响此包hash)
          name: 'async',
          chunks: 'async', // 为异步代码打包
          minChunks: 1,
          minSize: 0
        },
        vendors: { // 由于第三方代码变动比较小，所以把所有第三方单独打包，利于缓存(在app.js修改一下代码,重新打包,不影响此包hash)
          test: /[\\/]vendor[\\/]/,
          name: 'vendor',
          chunks: 'all', // 设置为all
          minChunks: 1,
          minSize: 0// 这里为了演示，设置为0以满足打包条件
        }
      }
    }
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

}
```

### 8.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```


### 9.验证打包结果

输出结果：
```javacript
0.async.512ec03b.chunk.js
0.async.512ec03b.css
1.app.4cfbacec.chunk.js
1.app.4cfbacec.css
2.runtime.0d1b9de2.bundle.js
3.vendor.c1185876.chunk.js
3.vendor.c1185876.css
index.html
```

在浏览器运行 dist/index.html 查看效果。


