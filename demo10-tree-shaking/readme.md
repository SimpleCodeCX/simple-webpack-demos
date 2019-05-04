## demo10 关于JS Tree Shaking

### 1.什么是 tree shaking
借助于 es6 (es2015) 模块系统 (import 和 export) 的静态解析，webpack 能够利用 Tree Shaking 进行按需加载，移除掉没有被引用的模块，从而减少包的大小，缩小应用的加载时间，从而提高性能体验。

### 2.需配合 `UglifyJSPlugin` 来实现 tree shaking

`UglifyJSPlugin` 的作用在于删除未被引用代码以及压缩代码。

从 webpack 4 开始，只需将 `"mode"` 设置为 `"production"` 模式，即可开启 `UglifyJSPlugin` 的功能。

详情可参考官方 Tree Shaking 文档：[https://www.webpackjs.com/guides/tree-shaking/](https://www.webpackjs.com/guides/tree-shaking/)


### 3.目录结构

```javascript
// `--` 代表目录， `-` 代表文件
  --demo10
    --src
      -app.js
      -module.js
    -webpack.config.js
```

module.js
```javascript
export const sayHello1 = () => {
  console.log('hello1');
}

export const sayHello2 = () => {
  console.log('hello2');
}

export const sayHello3 = () => {
  console.log('hello3');
}
```

app.js
```javascript
// 只导入了 sayHello1 ,观察打包后的 bundle 代码，移除了 sayHello2 和 sayHello3 的代码
import { sayHello1 } from './module';

sayHello1();
```

### 4.编写webpack配置文件
webpack.config.js

```javascript
const path = require("path");

module.exports = {
  mode: "production" || "development", // tree shaking 需要使用 "production" 模式
  entry: {
    app: "./src/app.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[name].bundle.js"
  }
};
```

### 5.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```
打包成功后，会在 demo08 目录下生成 dist/app.bundle.js

### 6.验证 tree shaking 是否生效

打开 app.bundle.js 文件，

发现查找不到 `Hi I want to say hello2` 和 `Hi I want to say hello3` ,

说明 Tree Shaking 生效了。

### 7.源码地址
demo 代码地址: https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo10-tree-shaking

仓库代码地址(及目录): https://github.com/SimpleCodeCX/simple-webpack-demos

参考文档：[tree shaking](https://www.webpackjs.com/guides/tree-shaking/)
