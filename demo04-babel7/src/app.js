// import "@babel/polyfill";
let func = () => { };

/**
 * Array.prototype.includes 不兼容 ie 11,详见 mdn 文档
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 * 所以需要通过 @babel/polyfill 来实现
 */
const pets = ['cat', 'dog', 'bat'];
console.log(pets.includes('cat'));

/**
 * new Set不兼容 ie 11,详见 mdn 文档
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
const set1 = new Set([1, 2, 3, 4, 5]);
console.log(set1.has(1));

/**
 * WeakMap 的 set方法在 ie 11 下不支持，详见 mdn 文档
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