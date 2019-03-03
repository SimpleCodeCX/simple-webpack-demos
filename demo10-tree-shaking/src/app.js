// 只导入了 sayHello1 ,观察打包后的 bundle 代码，移除了 sayHello2 和 sayHello3 的代码
import { sayHello1 } from './module';

sayHello1();