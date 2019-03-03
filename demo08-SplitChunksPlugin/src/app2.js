import { module1 } from './module1';
import { module2 } from './module2';
import { module3 } from './module3';

// module1 module2 module3 都属于同步加载（注意对比app1.js）
console.log('app2: ', module1);
console.log('app2: ', module2);
console.log('app2: ', module3);