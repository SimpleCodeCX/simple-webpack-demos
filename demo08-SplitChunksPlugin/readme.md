## demo08 关于SplitChunksPlugin

### 1.SplitChunksPlugin 介绍
从 webpack4 开始，用 SplitChunksPlugin 插件替换了 CommonsChunkPlugin 插件。
相对于 CommonsChunkPlugin ，SplitChunksPlugin 的使用更加方便和清晰。

SplitChunksPlugin 是 webpack4 内置的开箱即用的代码块分离插件，webpack4 会根据你配置好 optimization.splitChunks 规则，进行代码分割，打包成不同的代码块。这样的好处在于避免代码重复引用，减少代码体积，按需加载，从而使浏览器资源加载速度快，并且减少服务器的压力和带宽。

>SplitChunksPlugin 文档：[https://www.webpackjs.com/plugins/split-chunks-plugin/](https://www.webpackjs.com/plugins/split-chunks-plugin/)

### 2.splitChunks参数配置

- chunks (默认是async) ：`initial` 、`async` 和 `all`
- minSize (默认是30000)：新代码块最小体积(压缩之前)，单位：字节（b）
- minChunks（默认是1）：代码块至少被引用的次数
- maxInitialRequests (默认是3)：入口处的最大并行请求数 
- maxAsyncRequests (默认是5)：按需加载时最大的并行请求数
- test (默认所有模块): 匹配需要处理的模块, 可以传的值类型: RegExp、String和Function
- automaticNameDelimiter (默认是'~'): 打包分隔符
- priority：缓存组打包的先后优先级

>属性优先级 minSize > maxSize > maxAsyncRequests > maxInitialRequest

这里重要介绍一下 chunks 的三个属性 `initial`、`async` 和 `all`。

- async 只对对动态（异步）导入的模块进行分离
- initial 对所有模块进行分离，如果一个模块既被异步引用，也被同部引用，那么会生成两个包
- all 对所有模块进行分离，如果一个模块既被异步引用，也被同部引用，那么只会生成一个共享包

>具体可以参考这篇文章: [Webpack 4 Mysterious SplitChunks Plugin](https://medium.com/dailyjs/webpack-4-splitchunks-plugin-d9fbbe091fd0)


### 3.安装相关依赖

> 通过 html-webpack-plugin 自动生成 index.html

```javascript
npm install -D html-webpack-plugin
npm install -D webpack // html-webpack-plugin 依赖于 webpack
```


### 3.目录结构

```javascript
// `--` 代表目录， `-` 代表文件
  --demo08
    --src
      -app1.js
      -app2.js
      -module1.js
      -module2.js
      -module3.js
    -index.html
    -webpack.config.js
```

src/module1.js
```javascript
export const module1 = 'module1';
```

src/module2.js
```javascript
export const module2 = 'module2';
```

src/module3.js
```javascript
export const module3 = 'module3';
```

src/app1.js
```javascript
import { module1 } from './module1';
import { module2 } from './module2';

// module1 module2 属于同步加载
console.log('app1: ', module1);
console.log('app1: ', module2);

// 通过require.ensure对module3.js进行加载调用（此写法在ts模式支持）
setTimeout(() => {
  require.ensure(
    [],
    function () {
      const module3 = require("./module3");
      console.log('app1: ', module3.module3);
    },
    "module3"
  );
}, 3000);

// // 异步加载的另一种写法（此写法在ts模式下不支持）
// setTimeout(() => {
//   import(/* webpackChunkName: 'module3'*/ "./module3").then(function (module3) {
//     console.log(module3.module3);
//   });
// }, 3000);
```

src/app2.js
```javascript
import { module1 } from './module1';
import { module2 } from './module2';
import { module3 } from './module3';

// module1 module2 module3 都属于同步加载（注意对比app1.js）
console.log('app2: ', module1);
console.log('app2: ', module2);
console.log('app2: ', module3);
```


### 4.编写 webpack 配置文件
webpack.config.js

```javascript
const path = require("path");
module.exports = {
  mode: 'production' || 'development',
  entry: {
    app1: "./src/app1.js",
    app2: "./src/app2.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js"
  },
  optimization: {
    // runtimeChunk: "single", // 使用single模式，可以避免每一个包都包含webpack的运行文件
    splitChunks: {
      cacheGroups: {
        modules: {
          chunks: "async" || "initial" || "all", // 三选一
          minChunks: 1, // 代码块至少被引用的次数
          maxInitialRequests: 3, // 设置最大的请求数
          minSize: 0, // 设置每个chunk最小的大小，只有大于这个值，才会被打包进一个chunk
          automaticNameDelimiter: '~'
        }
      }
    }
  }
};
```
### 5.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```
打包成功后，结果输出在 demo08 的dist目录下

> 在浏览器运行 dist/index.html，打开控制台可以观察异步加载模块的效果。

### 6.调试参数并验证输出结果
这里可以通过修改以上参数（比如 `chunks` , `minChunks` , `minSize`）的值来查看不同的输出结果。

如上 webpack.config.js 配置文件，设置 `minSize` 为 `0` ,以及 `minChunks` 为 `1` 以确保满足一个新块的条件。

#### 当设置 `chunks` 为 `async` 时
webpack只对异步加载的模块进行分离，所以输出结果为：
```javacript
app1.bundle.js
app2.bundle.js
modules~module3.chunk.js
```
>(注意以上例子中有两个入口文件 app1.js app2.js)

app1.js相关:
```javacript
app1.bundle.js ( app1 主模块，并且包含 module1.js 和 module2.js)
modules~module3.chunk.js
```

app2.js相关:
```javacript
app2.bundle.js ( app2 主模块，并且包含 module1.js、module2.js 和 module3.js)
```

#### 当设置 `chunks` 为 `initial` 时
webpack对所有模块进行分离，如果一个模块既被异步引用，也被同部引用，那么会生成两个包，所以输出结果为：
```javacript
app1.bundle.js
app2.bundle.js
module3.chunk.js
modules~app1.chunk.js
modules~app1~app2.chunk.js
modules~app2.chunk.js
```
app1.js相关:
```javacript
app1.bundle.js (app1主模块)
module3.chunk.js (包含 module3.js 异步加载模块)
modules~app1.chunk.js (包含app1独有的模块: 这里暂时没有)
modules~app1~app2.chunk.js (包含 module1.js 和 module2.js)
```
app2.js相关:
```javacript
app2.bundle.js (app2主模块)
modules~app2.chunk.js (包含app2独有的模块: 这里是module3.js)
modules~app1~app2.chunk.js (包含 module1.js 和 module2.js)
```

#### 当设置 `chunks` 为 `all` 时
webpack对所有模块进行分离，如果一个模块既被异步引用，也被同部引用，那么只会生成一个共享包，所以输出结果为：
```javacript
app1.bundle.js
app2.bundle.js
modules~app1.chunk.js
modules~app1~app2.chunk.js
modules~app2~module3.chunk.js
```
app1.js相关:
```javacript
app1.bundle.js ( app1 主模块)
modules~app1.chunk.js (包含 app1 独有的模块: 这里暂时没有)
modules~app1~app2.chunk.js (包含 module1.js 和 module2.js)
modules~app2~module3.chunk.js (包含 module3.js 模块,虽然名字没有 app1 ,但是可以通过测试知道，app1 是依赖此模块的，比如把此模块删除，然后在 index.html 中引入上面三个文件，查看控制台就能知道 app1 依赖此模块)
```
app2.js相关:
```javacript
app2.bundle.js ( app2 主模块)
modules~app1~app2.chunk.js (包含 module1.js 和 module2.js)
modules~app2~module3.chunk.js (包含 module3.js )
```


### 7.bundle vs chunk
不知你注意到没有，以上打包结果中，app1 的主模块（app1.bundle.js）和app2的主模块（app2.bundle.js）的文件名包含的是 bundle，而其他模块包含的是 chunk。

bundle 表明该代码块包含有 webpack [运行时](https://webpack.docschina.org/concepts/manifest/) 的代码。而 chunk 则没有。
那你可能会问，这样 app1.bundle.js 和 app2.bundle.js 就包含了同样的 webpack 运行时代码，可以把这份 webpack 运行时的代码单独分离出来作为一个单独的块吗？
答案是可以的。

在 webpack.config.js 配置文件中添加以下属性即可：
```javacript
runtimeChunk: "single"
```
这样在以上 chunks 为 all 的示例中，输出的结果为：
```javacript
app1.chunk.js
app2.chunk.js
modules~app1.chunk.js
modules~app1~app2.chunk.js
modules~app2~module3.chunk.js
runtime.bundle.js ( webpack 运行时模块)
```

### 8.源码地址
demo 代码地址: https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo08-SplitChunksPlugin

仓库代码地址(及目录): https://github.com/SimpleCodeCX/simple-webpack-demos



参考文档：

[Webpack 4 Mysterious SplitChunks](https://medium.com/dailyjs/webpack-4-splitchunks-plugin-d9fbbe091fd0) 

[SplitChunksPlugin官方文档](https://www.webpackjs.com/plugins/split-chunks-plugin/)

