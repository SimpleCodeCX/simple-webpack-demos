const path = require("path");

module.exports = {
  mode: 'production' || 'development',
  entry: {
    app: "./src/app.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "app.bundle.js"
  }
};
