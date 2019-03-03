// 使用amd规范来写代码
define(function (require, factory) {
  'use strict';
  return function () {
    console.log('amd: hello world!');
  }
});