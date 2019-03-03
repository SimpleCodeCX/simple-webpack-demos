const path = require("path");

module.exports = {
  mode: 'production' || 'development',
  entry: {
    src: "./src/index.js", // 入口文件
  },
  output: {
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "app.bundle.js",
  }
};



