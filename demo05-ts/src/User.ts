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
