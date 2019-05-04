## demo05 webpack + typescript

### 1.关于 typescript
typescript（简称 ts ）是 javascript 的超集，具有类型系统，是可编译的。可以想象得到，在代码运行之前能够进行代码类型检查和编译是多么重要的事儿（就像 Java 等强类型语言一样）。

>比如前端框架 @Angular 就默认集成了 ts , 赋予了 @Angular 项目可以编译的功能。

对 ts 不了解的? 先撸一遍 ts 文档?：https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html

ts 默认根据 [tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html) 配置文件（很强大）来对 ts 进行编译。

ts 可以单独使用 typescript 编译器编译，也可以在 webpack 中通过 ts-loader 来进行编译（类似于 babel-loader ）。

### 2.安装相关依赖

typescript 相关
```javascript
npm install --save-dev typescript
```
webpack 相关

```javascript
npm install --save-dev ts-loader
```

### 3.目录结构
```javascript
// `--` 代表目录， `-` 代表文件
  --demo05
    --src
      -app.js
      -User.js
    -index.html
    -tsconfig.json
    -webpack.config.js
```

src/app.js
```javascript
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

src/User.ts
```javascript
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


### 4.编写 tsconfig.json 配置文件
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
关于 tsconfig.json 满多学问的，具体的配置根据项目或者参考配置文档来：https://www.tslang.cn/docs/handbook/tsconfig-json.html

也可以找一些开源项目，看一下别人是怎么配置的。

### 5.编写 webpack 配置文件
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
    filename: "bundle.js"
  },
  module: {
    rules: [
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

### 6.执行打包命令

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack
```
打包成功后，会在demo05目录下生成 dist/app.bundle.js
### 7.验证打包结果
创建 index.html 文件,引用打包生成的主文件 (app.bundle.js),
分别用 ie , Chrome 浏览器打开，并查看控制台。

输出结果：
```javacript
{name: "simple", age: "25", hobby: "play the guitar"}
```

### 8.源码地址
demo 代码地址: https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo05-ts

仓库代码地址(及目录): https://github.com/SimpleCodeCX/simple-webpack-demos