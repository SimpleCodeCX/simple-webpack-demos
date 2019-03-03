### 1.模块化规范
webpack 默认支持 `es6` , `Commonjs` , `AMD` , `umd` 规范。

详见 webpack 模块文档: [https://www.webpackjs.com/concepts/modules/](https://www.webpackjs.com/concepts/modules/)

### 2.目录结构
```javascript
// `--` 代表目录， `-` 代表文件
--demo03
  --src
    --lib 
      -hello-amd.js
      -hello-common.js
      -hello-es6.js
    -app.js
  -babel.config.js
  -index.html
  -webpack.config.js
```
hello-amd.js
```javacript
// 使用amd规范来写代码
define(function (require, factory) {
  'use strict';
  return function () {
    console.log('amd: hello world!');
  }
});
```
hello-common.js
```javacript
// 使用commonjs规范来写代码
module.exports = function () {
  console.log('common: hello world!');
};
```
hello-es6.js
```javacript
// 使用es6规范来写代码
export default function () {
  console.log('es6: hello world!');
}
```
app.js
```javacript
/**
 * webpack支持ES6、CommonJs和AMD规范
 */

// ES6
import es6Hello from './lib/hello-es6';
es6Hello();

// CommonJs
var commonHello = require('./lib/hello-common');
commonHello();

// AMD
require(['./lib/hello-amd'], function (helloAmd) {
  helloAmd();
});
```
### 3.编写 webpack 配置文件
webpack.config.js
```javacript
const path = require("path");

module.exports = {
  mode: 'production' || 'development',
  entry: {
    app: "./src/app.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径，也可以设置为cdn：https://www.xxx.com(把这句注释掉，运行index.html试试)
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
打包成功后，打包结果在 dist 文件夹中

### 5.验证打包结果
创建 index.html 文件,引用打包好的主文件 (bundle.js) , 利用 Chrome 浏览器打开，并查看控制台。

输出结果：
```javacript
es6: hello world!
common: hello world!
amd: hello world!
```
