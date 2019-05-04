## demo02 使用webpack.config.js配置文件

### 1.关于 webpack 配置文件
在 demo01 中，我们通过 `webpack xxxxx.js` 指定文件名的形式来进行代码打包，其实这样是不方便的。

webpack 是高度可配置的。webpack.config.js 是 webpack 默认的配置文件名，当直接运行 webpack ，webpack 默认根据 webpack.config.js 进行打包。

webpack 有四个核心概念：
- 入口 (entry)
- 输出 (output)
- loader
- 插件 (plugins)

具体参考 webpack 文档：[https://www.webpackjs.com/concepts/](https://www.webpackjs.com/concepts/)


### 2.目录结构

```javascript
// `--` 代表目录， `-` 代表文件
--demo02
  --src
    -hello.js
    -index.js
```

src/hello.js
```javacript
export function sayHello() {
  console.log('hello world!');
}
```
src/index.js
```javacript
import { sayHello } from './hello';
sayHello();
```

### 3.编写 webpack 配置文件

webpack.config.js

```javacript
const path = require("path");

module.exports = {
  mode: 'development', // 有development模式和production模式
  entry: {
    src: "./src/index.js", // 入口文件
  },
  output: {
    path: path.resolve(__dirname, "dist"), // 打包文件的输出目录
    filename: "app.bundle.js"
  }
};
```
### 4.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```

打包成功后，会在 demo02 目录下生成 dist/app.bundle.js

### 5.验证打包结果

```javacript
node dist/app.bundle.js
```


结果输出：hello world!

### 6.源码地址
demo 代码地址: https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo02-config

仓库代码地址(及目录): https://github.com/SimpleCodeCX/simple-webpack-demos