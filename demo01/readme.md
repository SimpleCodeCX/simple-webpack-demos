### 1.零配置 webpack
webpack4 支持零配置打包(无需 webpack.config.js 配置文件)，首先我们可以直接运行 `webpack index.js`（入口index.js）进行编译打包。
### 2.目录结构
在 demo01 目录下新建 hello.js 和 index.js

```javascript
// `--` 代表目录， `-` 代表文件
--demo01
  --src
    -hello.js
    -index.js
```

hello.js
```javacript
export function sayHello() {
  console.log('hello world!');
}
```
index.js
```javacript
import { sayHello } from './hello';
sayHello();
```
### 3.执行打包命令：webpack

>(默认你已经安装了全局 webpack 以及 webpack-cli )

```javacript
webpack ./src/index.js
```
打包成功后，会在 demo01 目录下生成 dist/main.js
### 4.验证打包结果

```javacript
node dist/main.js
```
结果输出：hello world!


### 5.总结

* 想了解更多 webpack 的命令?

  >通过执行 webpack --help 查看 webpack 的参数选项。

* 打包后为什么是 main.js?

  >当没有指定 webpack 的输出文件名时，webpack默认以 main 作为包名。

  >试试这个: webpack ./src/index.js --output ./dist/[name]-[hash].js

* 为什么 main.js 代码那么复杂?

  >webpack 打包会生成一份 runtime 和 manifest 来管理所有模块的交互，而这份代码也被打包进 main.js 中了。

  >关于 runtime 和 manifest: https://webpack.docschina.org/concepts/manifest/

* 代码被压缩?

  >在没有指定 webpack 的打包模式时，webpack 默认使用 production 模式进行打包，因此会对代码进行压缩。
  
  >试试这个: webpack ./src/index.js --mode development