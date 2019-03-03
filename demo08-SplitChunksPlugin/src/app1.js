import { module1 } from './module1';
import { module2 } from './module2';

// module1 module2 属于同步加载
console.log('app1: ', module1);
console.log('app1: ', module2);

// 通过require.ensure对module3.js进行加载调用（此写法在ts模式支持）
setTimeout(() => {
  require.ensure(
    [],
    function () {
      const module3 = require("./module3");
      console.log('app1: ', module3.module3);
    },
    "module3"
  );
}, 3000);

// // 异步加载的另一种写法（此写法在ts模式下不支持）
// setTimeout(() => {
//   import(/* webpackChunkName: 'module3'*/ "./module3").then(function (module3) {
//     console.log(module3.module3);
//   });
// }, 3000);
