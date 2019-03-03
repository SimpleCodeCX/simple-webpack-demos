import { sayHello1, sayHello2, sayHello3 } from './module';

sayHello1();
sayHello2();
sayHello3();


// 异步加载async-module1
setTimeout(() => {
  require.ensure(
    [],
    function () {
      const asyncModule = require("./async-module1");
      console.log(asyncModule.data);
    },
    "module1"
  );
}, 3000);

// 异步加载async-module2
setTimeout(() => {
  require.ensure(
    [],
    function () {
      const asyncModule2 = require("./async-module2");
      console.log(asyncModule2.data);
    },
    "module2"
  );
}, 3000);


// 引用第三方库
// https://github.com/lodash/lodash
import * as _ from "lodash";
// https://github.com/axios/axios
import * as axios from "axios";

console.log(_);
console.log(axios);
