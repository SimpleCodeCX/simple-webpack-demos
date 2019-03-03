### postcss-loader和postcss的关系
PostCSS postcss有一个插件体系，postcss可以通过使用插件系统中的某些插件来对css进行转换和处理。
        比如可以通过Autoprefixer插件来处理css的前缀，以实现浏览器的兼容性。
而postcss-loader是一个webpack用来调用PostCSS的loader

关于PostCss的文档：
英文文档: https://github.com/postcss/postcss

中文文档: https://github.com/postcss/postcss/blob/master/README-cn.md


### 依赖
postcss-loader依赖于postcss，而postcss依赖于插件，比如autoprefixer

```javacript
npm install -D postcss-loader
npm install -D postcss autoprefixer
```

### 配置
在postcss-loader的options中配置postcss

```javascript
  {
            loader: 'postcss-loader',
            options: {
              ident: "postcss",
              plugins: [
                require("autoprefixer") /*在这里添加*/
              ]
            }
          }
```

或在postcss.config.js中配置postcss
  
  ```javascript
  module.exports = {
  parser: 'postcss',
  plugins: {
    'autoprefixer': {}
  }
}
  ```



  参考文档：
  autoprefixer:https://github.com/postcss/autoprefixer
  PostCSS自学笔记（一）【安装使用篇】: https://segmentfault.com/a/1190000010926812
