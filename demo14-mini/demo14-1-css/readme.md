mini-css-extract-plugin
依赖于webpack，npm install --save-dev webpack
（官网有提到https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-all-css-in-a-single-file）


注意css的同步加载还是异步加载的引用方式：

同步加载：import './style2.css';

异步加载：import('./style2.css');

两种的打包结果是不一样的

mini-css-extract-plugin默认的打包规则为：
1 把入口的所有同步css模块打包进一个chunk
2 每个异步模块打包成各自的包

可以通过修改splitChunks配置来修改mini-css-extract-plugin的打包规则，从而实现自己想要的
打包结果以及包名：

-- 关于Long-term caching
  需要使用webpack.NamedChunksPlugin或HashedModuleIdsPlugin来实现
  
  Webpack 3 的 Long-term caching 在操作的时候，有个小问题，这个问题是关于 chunk 内容和 hash 变化不一致的：
在公共代码 Vendor 内容不变的情况下，添加 entry，或者 external 依赖，或者异步模块的时候，Vendor 的 hash 会改变。

Webpack 内部维护了一个自增的 id，每个 chunk 都有一个 id。
所以当增加 entry 或者其他类型 chunk 的时候，id 就会变化，
导致内容没有变化的 chunk 的 id 也发生了变化。
  
对此我们的应对方案是，使用 webpack.NamedChunksPlugin 把 chunk id 变为一个字符串标识符，
这个字符包一般就是模块的相对路径。这样模块的 chunk id 就可以稳定下来。


```javascript
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }
    ]
  }
}
```


异步加载： 
import(/* webpackChunkName: 'style'*/ "./style1.css").then(_ => {
    console.log("Change bg-color of html");
  });

这个插件不要和style-loader一起使用
这个插件不支持HMR，所以不要用在production模式中

production阶段压缩： 
uglifyjs-webpack-plugin
optimize-css-assets-webpack-plugin : https://github.com/NMFR/optimize-css-assets-webpack-plugin
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourcMap: true
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },

  UglifyJsPlugin会报错，好像是es6的问题，需要转化为es5
  https://stackoverflow.com/questions/41254538/error-in-bundle-js-from-uglifyjs

将所有的CSS提取到一个文件中
1 先将所有的异步文件提取到单独的文件
2 将剩下的同步文件提取到一个css文件

参考文档：
https://www.jianshu.com/p/91e60af11cc9
https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-all-css-in-a-single-file















other
Vue 项目打包后访问报错：Uncaught TypeError: Cannot read property 'call' of undefined
https://blog.csdn.net/sansan_7957/article/details/80229697
Webpack中的sourcemap以及如何在生产和开发环境中合理的设置sourcemap的类型
https://blog.csdn.net/liwusen/article/details/79414508
vuejs-templates/webpack
https://github.com/vuejs-templates/webpack/tree/develop/template/build