/**
 * webpack支持ES6、CommonJs和AMD规范
 */

// ES6
import es6Hello from './lib/hello-es6';
es6Hello();

// CommonJs
var commonHello = require('./lib/hello-common');
commonHello();

// AMD
require(['./lib/hello-amd'], function (helloAmd) {
  helloAmd();
});