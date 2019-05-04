## demo06 webpack + babel7 + typescript

### 1.说明
本 demo06 演示 webpack 打包 babel 和 typescript ，关于 babel 和 typescript 的 webpack 单独打包介绍，请看我之前的 demo04 和 demo05

### 2.关于 @babel 和 typescript 的结合
[Babel 7 的发布](https://babel.docschina.org/blog/2018/08/27/7.0.0) 中有提到 Babel 团队与 Typescript 团队合作，让 Badel 使用 `@babel/preset-typescript` 来解析转换类型语法。

这篇是 Typescript 团队的相关文章：[TypeScript and Babel 7](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/)

不过根据文章描述以及我的个人实践，发现当在 Babel 配置文件中通过 @babel/preset-typescript 来编译ts时，`useBuiltIns: "usage"` 没有生效，导致我需要在 ts 中手动导入整个 @babel/polyfills ，导致整个打包结果比较大。

因此，本 demo06 暂时采用 webpack 结合 ts-loader 的方法来进行 ts 的编译。

### 3.安装相关依赖

@babel 相关
```javascript
npm install --save-dev @babel/core @babel/preset-env
npm install --save @babel/polyfill //(注意没有-dev )
```

typescript 相关
```javascript
npm install --save-dev typescript
```

webpack 相关

```javascript
npm install --save-dev babel-loader
npm install --save-dev ts-loader
```


### 4.目录结构
```javascript
// `--` 代表目录， `-` 代表文件
  --demo06
    --src
      -app.ts
      -new-features.ts
      -User.js
    -babel.config.js
    -index.html
    -tsconfig.json
    -webpack.config.js
```
src/app.ts

```javascript
import "@babel/polyfill";
import './new-features';
import { User } from './User';

const user1: User = {
  name: 'simple',
  age: '25',
  hobby: 'play the guitar'
};

// 这里参数不够，tsc编译器会报错，webpack编译不通过
// const user2: User = {
//   name: 'simple2',
//   age: '25'
// };

console.log(user1);
```

src/new-features.ts
```javascript
// 使用javasript的新特性，比如Promise,WeadMap,Array.prototype.includes等
// 不兼容ie 11，因此需要在应用入口(app.ts)导入@babel/polyfill包,在ie 11浏览器进行测试

/**
 * Array.prototype.includes 不兼容ie 11,详见mdn文档
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 * 所以需要通过@babel/polyfill来实现
 */
const pets = ['cat', 'dog', 'bat'];
console.log(pets.includes('cat'));

/**
 * new Set不兼容ie 11,详见mdn文档
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
const set1 = new Set([1, 2, 3, 4, 5]);
console.log(set1.has(1));

/**
 * WeakMap 的 set方法在ie 11下不支持，详见mdn文档
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

src/User.ts
```javascript
// interface typescript 的类型
export interface User {
  name: String,
  age: String,
  hobby: String,
  options?: Object // 可选参数
}

// 理解一下 webpack 的 Tree Sharking?
export interface Animal {
  name: String
}
```

### 5.编写 babel 配置文件
babel.config.js
```javascript
const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
        ie: "11"
      },
      // useBuiltIns: "usage" // 和ts结合的情况，这个属性无效，需要手动import "@babel/polyfill";
    },
  ],
];

module.exports = { presets };
```
### 6.编写 tsconfig.json 配置文件
tsconfig.json

```javascript
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "allowJs": true,
    "lib": [
      "es2018",
      "dom"
    ],
  },
  "include": [
    "./src/*"
  ],
  "exclude": [
    "./node_modules"
  ]
}
```
### 7.编写 webpack 配置文件
webpack.config.js

```javascript
const path = require("path");
module.exports = {
  mode: 'production' || 'development',
  entry: {
    index: "./src/app.ts"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "app.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
```
### 8.执行打包命令
```javacript

>(默认你已经安装了全局 webpack 以及 webpack-cli )

webpack
```
打包成功后，会在 demo06 目录下生成 dist/bundle.js
### 9.验证打包结果
创建 index.html 文件,引用打包生成的文件 (app.bundle.js),
分别用 ie , Chrome 浏览器打开，并查看控制台。

输出结果：
```javacript
true
true
1
{name: "simple", age: "25", hobby: "play the guitar"}
```

### 10.源码地址
demo 代码地址: https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo06-babel-ts

仓库代码地址(及目录): https://github.com/SimpleCodeCX/simple-webpack-demos