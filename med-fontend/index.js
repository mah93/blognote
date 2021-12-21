// 原文链接：https://juejin.cn/post/6844903856489365518

/**
 * 1.判断对象数据类型
 *  */ 
const isType = type => target => `[object ${type}]` === Object.prototype.toString.call(target);
const isArray = isType('Array');
console.log('1.判断对象数据类型:', isArray([]));

/**
 * 2.循环实现数组 map 方法
 * array.map(\item => item + 1);
 */

const selfMap = function(fn, context) {
  const arr = Array.prototype.slice.call(this); // 获取到调用者数组

  const mappedArr = new Array();
  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue;
    mappedArr[i] = fn.call(context, arr[i], i, this);
  }
  return mappedArr;
}

Array.prototype.selfMap = selfMap;
console.log('2.循环实现数组 map 方法:', [1,2,3,4].selfMap(n => n*2));

/**
 * 3.使用 reduce 实现数组 map 方法
 */

const selfMap2 = function(fn, context) {
  const arr = Array.prototype.slice.call(this);
  return arr.reduce((pre, cur, index) => {
    return [...pre, fn.call(context, cur, index, this)];
  }, []);
}

Array.prototype.selfMap2 = selfMap2;
console.log('3.使用 reduce 实现数组 map 方法:', [1,2,3,4].selfMap2(n => n*2));


/**
 * 4.循环实现数组 filter 方法
 */

const selfFilter = function(fn, context) {
  const arr = Array.prototype.slice.call(this);
  const filtered = new Array();
  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue;
    fn.call(context, arr[i], i, this) && filtered.push(arr[i]);
  }
  return filtered;
}

Array.prototype.selfFilter = selfFilter;
console.log('4.循环实现数组 filter 方法:', [1,2,3,4].selfFilter(n => n > 2));


/**
 * 5.使用 reduce 实现数组 filter 方法
 */

 const selfFilter2 = function(fn, context) {
  const arr = Array.prototype.slice.call(this);
  return arr.reduce((pre, cur, index) => {
    return fn.call(context, cur, index, this) ? [...pre, cur] : [...pre]
  }, []);
}

Array.prototype.selfFilter2 = selfFilter2;
console.log('5.使用 reduce 实现数组 filter 方法:', [1,2,3,4].selfFilter2(n => n <= 2));

/**
 * 6.循环实现数组的 some 方法
 */

const selfSome = function(fn, context) {
  const arr = Array.prototype.slice.call(this);
  if (!arr.length) return false;
  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue;
    const res = fn.call(context, arr[i], i, this);
    if (res) return true;
  }
  return false;
}

Array.prototype.selfSome = selfSome;
console.log('6.循环实现数组的 some 方法:', [1,2,3,4].selfSome(n => n <= 2));


/**
 * 7. 循环实现数组的 reduce 方法
 */

const selfReduce = function(fn, initialValue) {
  const arr = Array.prototype.slice.call(this);
  let res;
  let startIndex;
  if (initialValue === undefined) {
    for (let i = 0; i < arr.length; i++) {
      if (!arr.hasOwnProperty(i)) continue;
      startIndex = i;
      res = arr[i];
      break;
    }
  } else {
    res = initialValue;
  };
  for (let i = ++startIndex || 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue;
    res = fn(res, arr[i]);
  }
  return res;
}

Array.prototype.selfReduce = selfReduce;
console.log('7.循环实现数组的 reduce 方法:', [1,2,3,4].selfReduce((a, b) => {
  return a + b;
}, 0));


/**
 * 8. 使用 reduce 实现数组的 flat 方法
 */

const selfFlat = function (depth = 1) {
  const arr = Array.prototype.slice.call(this);
  if (depth === 0) return arr;
  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur)) {
      return [...pre, ...selfFlat.call(cur, depth - 1)];
    } else {
      return [...pre, cur];
    }
  }, []);
}

Array.prototype.selfFlat = selfFlat;
console.log('8.使用 reduce 实现数组的 flat 方法:', [1,2,3,[2,3]].selfFlat());


/**
 * 9.实现 ES6 的 class 语法
 */

function inherit(subType, superType) {
  // 寄生组合式继承
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      enumerable: false,
      configurable: true,
      writable: false,
      value: subType
    }
  });
  // 继承静态方法和静态属性
  Object.setPrototypeOf(subType, superType);
}

console.log('9.实现 ES6 的 class 语法');

/**
 * 10.函数柯里化
 */

function curry(fn) {
  if (fn.length <= 1) return fn;
  const generator = (...args) => {
    if (fn.length === args.length) {
      return fn(...args);
    } else {
      return (...args2) => {
        return generator(...args, ...args2);
      }
    }
  }
  return generator;
}

const add = (a, b, c, d) => a + b + c + d;
const curriedAdd = curry(add);
console.log('10.函数柯里化:', curriedAdd(5)(6)(7)(8));


/**
 * 11. 函数柯里化（支持占位符）
 */

const curry2 = (fn, placeholder = '_') => {
  curry2.placeholder = placeholder;
  if (fn.length <= 1) return fn;
  const argsList = [];
  const generator = (...args) => {
    let currentPlaceholderIndex = -1;
    args.forEach(arg => {
      const placeholderIndex = argsList.findIndex(
        item => item === curry2.placeholder
      )
      if (placeholderIndex < 0) {
        currentPlaceholderIndex = argsList.push(arg) - 1;
      } else if (placeholderIndex !== currentPlaceholderIndex) {
        argsList[placeholderIndex] = arg;
      } else {
        argsList.push(arg);
      }
    })

    const realArgsList = argsList.filter(arg => arg !== curry2.placeholder);
    if (realArgsList.length === fn.length) {
      return fn(...argsList);
    } else if (realArgsList.length > fn.length){
      throw new Error('超出初始函数参数最大值');
    } else {
      return generator;
    }
  }
  return generator;
}

const add2 = (a, b, c, d) => a + b + c + d;
const curriedAdd2 = curry2(add2);
console.log('11.函数柯里化（支持占位符）:', curriedAdd2('_', 5)(6, '_')(7)(8));


/**
 * 12. 偏函数
 */

const partialFunc = (func, ...args) => {
  let placeholderNum = 0;
  return (...args2) => {
    args2.forEach(arg => {
      let index = args.findIndex(item => item === '_');
      if (index < 0) return;
      args[index] = arg;
      placeholderNum++;
    })
    if (placeholderNum < args2.length) {
      args2 = args2.slice(placeholderNum, args2.length)
    }
    return func.apply(this, [...args, ...args2]);
  }
}

const add3 = (a, b, c, d) => a + b + c + d;
const partialAdd3 = partialFunc(add3, '_', 2, '_');
console.log('12.偏函数:', partialAdd3(1,4,5));


/**
 * 13. 斐波那契数列及其优化
 */

let fibonacci = function (n) {
  if (n < 1) throw new Error('参数有误');
  if (n === 1 || n === 2) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memory = function (fn) {
  const obj = {};
  return function (n) {
    if (obj[n] === undefined) obj[n] = fn(n);
    return obj[n];
  }
}

fibonacci = memory(fibonacci);

console.log('13.斐波那契数:', fibonacci(50));

function fibonacci_DP(n) {
  let res = 1;
  if (n === 1 || n === 2) return res;
  n = n - 2;
  let cur = 1;
  let pre = 1;
  while(n) {
    res = cur + pre;
    pre = cur;
    cur = res;
    n --;
  }
  return res;
}

console.log('13.斐波那契数DP:', fibonacci_DP(50));


/**
 * 14. 实现函数 bind 方法
 */

const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && obj !== null;

const selfBind = function(bindTarge, ...args1) {
  if(typeof this !== 'function') throw new TypeError('Bind must be called on a function');
  const originFunc = this;
  const boundFunc = function(...args2) {
    if (new.target) {
      let res = originFunc.call(this, ...args1, ...args2);
      if (isComplexDataType(res)) return res;
      return this;
    } else {
      originFunc.call(bindTarge, ...args1, ...args2);
    }
  }

  if (originFunc.prototype) {
    boundFunc.prototype = originFunc.prototype;
  }

  const desc = Object.getOwnPropertyDescriptor(originFunc);
  Object.defineProperties(boundFunc, {
    length: desc.length,
    name: Object.assign(desc.name, {
      value: `bound ${desc.name.value}`
    })
  });

  return boundFunc;
}

/**
 * 15. 实现函数 call 方法
 */

const selfCall = function(context, ...args) {
  let func = this;
  context || (context = window);
  if (typeof func !== 'function') throw new TypeError('Call must be called on a function');
  let caller = new Symbol('caller');
  context[caller] = func;
  let res = context[caller](...args);
  delete context[caller];
  return res;
}

