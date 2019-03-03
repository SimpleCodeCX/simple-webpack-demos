// 使用javasript的新特性，比如Promise,WeadMap,Array.prototype.includes等
// 不兼容ie 11，因此需要在应用入口(app.ts)导入@babel/polyfill包,在ie 11浏览器进行测试

/**
 * Array.prototype.includes 不兼容ie 11,详见mdn文档
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 * 所以需要通过@babel/polyfill来实现
 */
const pets = ['cat', 'dog', 'bat'];
console.log(pets.includes('cat'));

/**
 * new Set不兼容ie 11,详见mdn文档
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
const set1 = new Set([1, 2, 3, 4, 5]);
console.log(set1.has(1));

/**
 * WeakMap 的 set方法在ie 11下不支持，详见mdn文档
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 */
var o1 = {},
  o2 = function () { },
  o3 = window;
let weakmap = new WeakMap();
weakmap.set(o1, 1);
weakmap.set(o2, 2);
weakmap.set(o3, 3);
console.log(weakmap.get(o1));   // => 1