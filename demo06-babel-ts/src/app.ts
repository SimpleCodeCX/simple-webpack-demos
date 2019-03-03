import "@babel/polyfill";
import './new-features';
import { User } from './User';

const user1: User = {
  name: 'simple',
  age: '25',
  hobby: 'play the guitar'
};

// 这里参数不够，tsc编译器会报错，webpack编译不通过
// const user2: User = {
//   name: 'simple2',
//   age: '25'
// };

console.log(user1);

