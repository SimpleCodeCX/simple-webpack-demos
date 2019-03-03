## demo09 使用 SplitChunksPlugin 分离第三方依赖包以及异步包

### 1.为什么要代码分离
在单页面或多页面应用中，通过代码分离的方式，能够优化性能。

比如把异步加载的代码分离成一个单独的chunk，等到需要调用的时候再按需加载（比如click时），这样可以减少首屏的代码体积，从而提高首屏的加载速度。

另外，在我们的项目中，可能会用到很多的第三方库（比如 lodash 、rxjs 等），而往往这些第三方依赖库的代码一般很少变化，因此，很适合把第三方依赖库单独分离成一个包，并且包名包含 hash（ webpack 可以轻松做到），这样的好处在于，可以配合浏览器http的缓存机制
（比如 max-age ），实现对相关资源包的长缓存，从而优化性能。

一般需要代码分割的场景有：
- 分离业务代码和第三方依赖
- 分离首次加载和异步加载的代码
- 分离业务代码和业务的公用代码

### 2.安装相关依赖

> 通过 html-webpack-plugin 自动生成 index.html

```javascript
npm install -D html-webpack-plugin
npm install -D webpack // html-webpack-plugin 依赖于 webpack
npm install --save axios lodash
```

### 3.目录结构

```javascript
// `--` 代表目录， `-` 代表文件
  --demo09
    --src
      -app.js
      -async-module1.js
      -async-module2.js
      -module.js
    -index.html
    -webpack.config.js
```

src/async-module1.js
```javascript
export const data = 'this is async module1';
```

src/async-module2.js
```javascript
export const data = 'this is async module2';
```

src/module.js
```javascript
export const sayHello1 = () => {
  console.log('Hi I want to say hello1');
}

export const sayHello2 = () => {
  console.log('Hi I want to say hello2');
}

export const sayHello3 = () => {
  console.log('Hi I want to say hello3');
}
```

src/app.js
```javascript
import { sayHello1, sayHello2, sayHello3 } from './module';

sayHello1();
sayHello2();
sayHello3();


// 异步加载 async-module1
setTimeout(() => {
  require.ensure(
    [],
    function () {
      const asyncModule = require("./async-module1");
      console.log(asyncModule.data);
    },
    "module1"
  );
}, 3000);

// 异步加载 async-module2
setTimeout(() => {
  require.ensure(
    [],
    function () {
      const asyncModule2 = require("./async-module2");
      console.log(asyncModule2.data);
    },
    "module2"
  );
}, 3000);


// 引用第三方库
// https://github.com/lodash/lodash
import * as _ from "lodash";
// https://github.com/axios/axios
import * as axios from "axios";

console.log(_);
console.log(axios);
```



### 3.配置打包第三方库的规则

使用 webpack4 的 `splitChunks` 可以很容易的做到。

关于`splitChunks` 的各个参数的用法，可以看我的这篇文章 [demo08 关于SplitChunksPlugin]()

```javascript
   splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: "all", // 使用 all 模式
          test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 下的模块
          name: "vendors", // 包命名，最终的命名要结合 output 的 chunkFilename
          minChunks: 1,
          minSize: 30000,
          priority: 10 // 设置优先级
        }
      }
    }
```

### 4.配置打包异步加载包的规则

打包异步加载包
```javascript
   splitChunks: {
      cacheGroups: {
        async: {
          chunks: "async",
          minChunks: 1, // 代码块至少被引用的次数
          maxInitialRequests: 3, // 设置最大的请求数
          minSize: 0, // 设置每个 chunk 最小的大小 (默认30000)，这里设置为 0，以方便测试
          automaticNameDelimiter: '~',
          priority: 9
        },
      }
    }
```
### 5.完整的 webpack 配置文件

```javascript
const path = require("path");

module.exports = {
  mode: 'development', // 使用development模式，方便看到各个包名中的 [name]，以区分各个包，在production模式下，[name]会被转化为0 1 2...
  entry: {
    app: "./src/app.js",
  },

  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[name].[chunkhash].bundle.js", // 每个包包含 chunkhash
    chunkFilename: "[id].[chunkhash].chunk.js"
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        async: {
          chunks: "async",
          minChunks: 1, // 代码块至少被引用的次数
          maxInitialRequests: 3, // 设置最大的请求数
          minSize: 0, // 设置每个 chunk 最小的大小 (默认30000)，这里设置为 0，以方便测试
          automaticNameDelimiter: '~',
          priority: 9
        },
        vendors: {
          chunks: "all", // 使用 all 模式
          test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 下的模块
          name: "vendors", // 包命名，最终的命名要结合 output 的 chunkFilename
          minChunks: 1,
          minSize: 30000,
          priority: 10 // 设置优先级
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
打包成功后，结果输出在 demo09 的 dist 目录下

(注意这里设置 `"mode"` 为 `"development"` )

```javascript
app.226a343cb53e0a689358.chunk.js (app主模块)
async~module1.87d116fd41640c30a6b2.chunk.js (async-module1模块)
async~module2.65866f4d15253512c981.chunk (async-module2模块)
runtime.4e6de616bd3030f8bff8.bundle.js (webpack运行时模块)
vendors.a83c085b3a7ac03b1b47.chunk.js (第三方依赖模块)

```

### 6.修改程序代码，验证打包结果
可以通过修改 app.js 等代码，再次运行 `webpack` 命令，你会发现，第三方依赖模块的包名没有被改变: `vendors.a83c085b3a7ac03b1b47.chunk.js`。

> 在浏览器运行 dist/index.html，打开控制台可以观察异步加载模块的效果。

>（备注：runtime.xxxxxxxx.bundle.js模块包含了对异步加载模块的引用逻辑，此外，异步加载引用的相对路径受 `output -> publicPath` 配置的影响）