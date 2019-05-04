## demo04 webpack + babel7

### 1.关于 babel 7 版本
babel 7 于 2018 年 8 月份发布，在 babel 7 中，所有官方包更名为以 @babel 为开头,并且 babel 7 推荐使用 babel.config.js 来配置 babel 。

关于 babel 7 的重大改变，请参考这篇文章：[Babel 7 发布](https://babel.docschina.org/blog/2018/08/27/7.0.0)

对 babel 7 不熟的请先撸一下 babel 7 的配置文档：[https://babel.docschina.org/docs/en/](https://babel.docschina.org/docs/en/)

### 2.安装相关依赖包
@babel 相关
```javascript
npm install --save-dev @babel/core @babel/preset-env
npm install --save @babel/polyfill //(注意没有-dev )
```
webpack 相关

```javascript
npm install --save-dev babel-loader
```
相关包介绍：

[@babel/core](https://babel.docschina.org/docs/en/babel-core): babel的核心功能

[@babel/preset-env](https://babel.docschina.org/docs/en/babel-preset-env): @babel/preset-env 是一组官方已经配置好的babel plugins预设，省去了自己配置的plugins的麻烦


[@babel/polyfill](https://babel.docschina.org/docs/en/babel-polyfill): @babel/polyfills 用来实现所有新的javascript功能，比如 Promise , WeadMap , Array.prototype.includes 等

@babel/polyfills 的三种使用方法

>方法1）在代码入口 `import "@babel/polyfill";`

>方法2）通过配置 `"useBuiltIns: "usage"`（推荐用法）

>方法3）webpack 的 entry 中引入
```javascript
entry: ["@babel/polyfill","./src/app.js"] // "@babel/polyfill" 需作为第一个
```


>注意，@babel/polyfill 需要打包进代码中，因此需要以 `npm install（没有-dev）--save @babel/polyfill` 的形式来安装

### 3.目录结构
```javascript
// `--` 代表目录， `-` 代表文件
  --demo04
    --src
      -app.js
    -babel.config.js
    -index.html
    -webpack.config.js
```
src/app.js
```javascript
// import "@babel/polyfill";
let func = () => { };

/**
 * Array.prototype.includes 不兼容 ie 11,详见 mdn 文档
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 * 所以需要通过 @babel/polyfill 来实现
 */
const pets = ['cat', 'dog', 'bat'];
console.log(pets.includes('cat'));

/**
 * new Set不兼容 ie 11,详见 mdn 文档
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
const set1 = new Set([1, 2, 3, 4, 5]);
console.log(set1.has(1));

/**
 * WeakMap 的 set方法在 ie 11 下不支持，详见 mdn 文档
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 */
var o1 = {},
  o2 = function () { },
  o3 = window;
let weakmap = new WeakMap();
weakmap.set(o1, 1);
weakmap.set(o2, 2);
weakmap.set(o3, 3);
console.log(weakmap.get(o1));   // => 1
```


### 4.编写 babel 配置文件
babel.config.js
```javascript
const presets = [
  [
    "@babel/env",
    {
      targets: { // 配置需要兼容的浏览器
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
        ie: "11"
      },
      useBuiltIns: "usage"
    },
  ],
];

module.exports = { presets };
```
useBuiltIns 说明：

>通过设置 "@babel/env" 的 "useBuiltIns" 为 "usage" ，省去了手动导入 @babel/polyfill 的过程，而且更重要的是，通过此方式，babel 只会帮你 import 代码中所用到的 polyfill，避免导入整个 @babel/polyfill 包（压缩后将近80k）。

>(你可以把 useBuiltIns 注释，并且在 app.js 手动 `import "@babel/polyfill"` 试试，会导致整个包变大。)



### 5.编写 webpack 配置文件
webpack.config.js
```javascript
module.exports = {
  entry: {
    app: "./src/app.js"
  },
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```
### 6.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```
打包成功后，会在 demo04 目录下生成 dist/app.bundle.js

### 7.验证打包结果
创建 index.html 文件,引用打包生成的主文件 (app.bundle.js) ,
分别用 ie,Chrome 浏览器打开，并查看控制台。

输出结果：
```javacript
true
true
1
```


### 8.源码地址
demo 代码地址: https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo04-babel7

仓库代码地址(及目录): https://github.com/SimpleCodeCX/simple-webpack-demos





