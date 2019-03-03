// 同步加载common.scss
import './styles/common.scss';

// 同步加载module1.js
import * as module1 from './module1/module1';

// 同步加载第三方包vendor.js
import * as vendor from '../vendor/vendor';

window.addEventListener('click', function () {
  // 异步加载module2.js
  import(/* webpackChunkName: 'module2'*/ './module2/module2').then(_ => {
    console.log('加载异步module2成功');
  });
  // async-style.scss
  import(/* webpackChunkName: 'async-style'*/'./styles/async-style.scss').then(_ => {
    console.log('加载异步async-style.scss成功');
  });

});
