// 同步加载common.css
import './styles/common.css';

// 同步加载module1.js
import * as module1 from './module1/module1';

// 同步加载第三方包vendor.js
import * as vendor from '../vendor/vendor';

window.addEventListener('click', function () {
  // 异步加载module2.js
  import(/* webpackChunkName: 'module2'*/ './module2/module2').then(_ => {
    console.log('加载异步module2成功');
  });
  // async-style.css
  import(/* webpackChunkName: 'async-style'*/'./styles/async-style.css').then(_ => {
    console.log('加载异步async-style.css成功');
  });

});
