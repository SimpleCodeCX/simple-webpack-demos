### css-loader style-loader
css-loader: 

实现在js代码中加载css文件,并把css代码转化为js的一个module,比如 `import('./xxx.css')`

  如果没有使用 `css-loader` ,webpack会报解析css失败的错误

  备注：可以修改css文件，让其只包含console.log('在css文件中使用js代码')，并且在webpack.config.js中注释掉 `css-loader` ,试试看效果

style-loader: 实现把加载的css代码作为 `style` 标签或 `link` 内容插入到html中

（可以在webpack.config.js中注释掉style-loader试试看效果）