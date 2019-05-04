## webpack4系列实践笔记
### 1.webpack 是什么？
webpack 是目前 javascript 主流的工程自动构建工具，目前 Vue，React 以及 Angular 等项目脚手架都是基于 webpack 进行构建的。

webpack 官方中文文档：[https://www.webpackjs.com/concepts/](https://www.webpackjs.com/concepts/)

webpack 官方英文文档：[https://webpack.js.org/concepts](https://webpack.js.org/concepts)

### 2.webpack 需要安装的环境

>webpack 需要安装的环境有：
- webpack
- webpack-cli



>安装的方式有两种：

- 项目本地安装( `npm install webpack webpack-cli` )

    运行方法: 
    ```javascript
    .\node_modules\.bin\webpack .\index.js
    ```
  
- 全局安装( `npm install webpack webpack-cli -g` )

    运行方法: 
    ```javascript
    webpack .\index.js
    ```
    
>不理解本地安装和全局安装? 撸一遍npm的文档? [https://www.npmjs.cn/](https://www.npmjs.cn/)

为了避免每个demo都在本地安装一遍 webpack 和 webpack-cli ，这里推荐使用全局安装的方式。

>注意：有一些 webpack plugin 是依赖于 webpack 或 webpack-cli 的，比如 mini-css-extract-plugin, html-webpack-plugin 或 webpack-dev-server 等 ,这种情况需要本地安装 webpack: `npm install webpack` ,但编译环境依然可以使用全局 webpack 命令来进行编译打包（前提是你的本地 webpack 和全局的 webpack 版本兼容）。




### 3.我的webpack版本
webpack: `v4.29.5`

webpack-cli: `3.2.3`

>本 webpack4 系列的实践 demo 都是基于此版本进行的
### 4.关于安装webpack
3.1 首先安装 [nodejs](https://nodejs.org/zh-cn/download/) ,安装成功后，会自带 [npm](https://www.npmjs.com.cn/) 管理器

3.2 安装 webpack 
```javacript
npm install -g webpack webpack-cli
```
3.2 查看当前 webpack 版本号
```javacript
webpack -v
```
### 5.demo list
demo01: [最简单的 webpack 零配置实践](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo01)

demo02: [使用 webpack.config.js 配置文件](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo02-config)

demo03: [webpack 默认支持各种模块化规范](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo03-js-module)

demo04: [webpack + babel7](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo04-babel7)

demo05: [webpack + typescript](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo05-ts)

demo06: [webpack + babel7 + typescript](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo06-babel-ts)

demo07: [自动生成 Html 文件](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo07-html)

demo08: [关于 SplitChunksPlugin](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo08-SplitChunksPlugin)

demo09: [使用 SplitChunksPlugin 分离第三方依赖包以及异步包](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo09-split-vendor-async)

demo10: [关于 Tree Shaking](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo10-tree-shaking)

demo11: [webpack 处理 css](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo11-css)

demo12: [webpack 处理 scss](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo12-scss)

demo13: [webpack通过postcss-loader加工css和scss](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo13-postcss)

demo14: [mini-css-extract-plugin + SplitChunksPlugin 处理 css 和 scss](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo14-mini)
 
demo15: [webpack 处理图片](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo15-img)

demo16: [webpack 处理字体](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo16-font)

demo17: [demo17 clean-webpack-plugin (清除模式)](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo17-clean)

demo18: [webpack-dev-server (开发模式)](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo18-devServer)

demo19: [webpack 开发模式和生产模式](https://github.com/SimpleCodeCX/simple-webpack-demos/tree/master/demo19-dev-prod)


### 6.源码地址
https://github.com/SimpleCodeCX/simple-webpack-demos

### 7.关于作者
* GitHub: https://github.com/SimpleCodeCX
* 个人博客: http://www.cxdsimple.com 
* 个人线上简历: http://www.cxdsimple.com/cv/
* Email: 248200851@qq.com