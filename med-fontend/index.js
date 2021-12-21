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

/**
 * 16.简易CO模块
 */

function run(generatorFunc) {
  const it = generatorFunc();
  const result = it.next();

  return new Promise((resolve, reject) => {
    const next = function(result) {
      if (result.done) {
        resolve(result.value);
      }
      result.value = Promise.resolve(result.value);
      result.value.then(res => {
        let result = it.next(res);
        next(result);
      }).catch(err => {
        reject(err);
      });
    }
    next(result);
  });
}

/**
 * 17.函数防抖
 */

const debounce = (func, time = 17, options = {
  leading: true,
  context: null,
}) => {
  let timer;
  const _debounce = function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    if (options.leading && !timer) {
      timer = setTimeout(null, time);
      func.apply(options.context, args);
    } else {
      timer = setTimeout(() => {
        func.apply(options.context, args);
        timer = null;
      }, time);
    }
  }

  _debounce.cancel = function() {
    clearTimeout(timer);
    timer = null;
  }

  return _debounce;
}


/**
 * 18.函数节流
 */

const throttle = (func, time = 17, options = {
  leading : true,
  trailing : false,
  context: null
}) => {
  let previous = new Date(0).getTime();
  let timer;
  const _throttle = function(...args) {
    let now = new Date().getTime;

    if(!options.leading) {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        func.apply(options.context, args);
      }, time);
    } else if(now - previous > time) {
      func.apply(options.context, args);
      previous = now;
    } else if(options.trailing) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(options.context, args);
      },time);
    }
  }

  _throttle.cancel = () => {
    previous = 0;
    clearTimeout(timer);
    timer = null;
  }

  return _throttle;
}


/**
 * 19.图片懒加载
 */

// const imageList = [...document.querySelectorAll("img")];
// const num = imageList.length;

// const lazyLoad = (function() {
//   let count = 0;
//   return function() {
//     let deleteIndexList = [];
//     imageList.forEach((img, index) => {
//       let rect = img.getBoundingClientRect();
//       if (rect.top < window.innerHeight) {
//         img.src = img.dataset.src;
//         deleteIndexList.push(index);
//         count++;
//         if (count === num) {
//           document.removeEventListener('scroll', lazyLoad);
//         }
//       }
//     })
//     imageList = imageList.filter((_, index) => !deleteIndexList.includes(index));
//   }
// })();


/**
 * 20.new关键字
 */

const isComplexDataType1 = obj => (typeof obj === 'object' || typeof obj === 'function') && obj !== null;
const selfNew = function(fn, ...rest) {
  let instance = Object.create(fn.prototype);
  let res = fn.apply(instance, rest);
  return isComplexDataType1(res) ? res : instance;
}

/**
 * 21.实现 Object.assign
 */
const isComplexDataType2 = obj => (typeof obj === 'object' || typeof obj === 'function') && obj !== null;
const selfAssign = function(target, ...source) {
  if (target === null) {
    throw new TypeError('Cannot');
  }

  return source.reduce((acc, cur) => {
    isComplexDataType2(acc) || (acc = new Object(acc));
    if (cur === null) {
      return acc;
    }
    [...Object.keys(cur), ...Object.getOwnPropertySymbols(cur)].forEach((key) => {
      acc[key] = cur[key];
    })
    return acc;
  }, target);
}


/**
 * 22. instanceof
 */

const selfInstanceof = function(left, right) {
  let proto = Object.getPrototypeOf(left);
  while(true) {
    if(proto === null) return false;
    if (proto === right.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
}

/**
 * 23.私有变量实现
 */

// 使用Proxy代理
const proxy = function(obj) {
  return new Proxy(obj, {
    get(target, key) {
      if (key.startsWith('_')) {
        throw new Error('private key');
      }
      return Reflect.get(target, key);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(key => !key.startsWith('_'));
    }
  });
}

// 使用闭包
const Person = (function() {
  const _name = Symbol('name');
  class Person {
    constructor(name) {
      this[_name] = name;
    }

    getName() {
      return this[_name];
    }
  }

  return Person;
})();


// 闭包2
class Person2 {
  constructor(name) {
    let _name = name;
    this.getName = function() {
      return _name;
    }
  }
}

// WeakMap
const Person3 = (function() {
  let wp = new WeakMap();
  
  class Person {
    constructor(name) {
      wp.set(this, {
        name
      })
    }

    getName() {
      return wp.get(this).name;
    }
  }

  return Person;
})()


/**
 * 24.洗牌算法
 */

// 原地
function shuffle(arr) {
  for(let i = 0; i < arr.length; i++) {
    let randomIndex = i + Math.floor(Math.random() * (arr.length - i));
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}

console.log('24.原地洗牌算法', shuffle([1,2,3,4,5,6,7,8,9]));

// 非原地
function shuffle2(arr) {
  let _arr = [];
  while(arr.length) {
    let randomIndex = Math.floor(Math.random() * arr.length);
    _arr.push(arr.splice(randomIndex, 1)[0]);
  }
  return _arr;
}

console.log('24.非原地洗牌算法', shuffle2([1,2,3,4,5,6,7,8,9]));


/**
 * 25.单例
 */

function proxy(func) {
  let instance;
  let handler = {
    constructor(target, args) {
      if(!instance) {
        instance = Reflect.constructor(func, args);
      }
      return instance;
    }
  }
  return new Proxy(func, handler)
}

/**
 * 26.promisify
 */

function promisify(asyncFunc) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      args.push(function callback(err, ...values) {
        if (err) {
          return reject(err);
        }
        return resolve(...values);
      })
      asyncFunc.call(this, ...args);
    })
  }
}

const fsp = new Proxy(fs, {
  get(target, key) {
    return promisify(target[key])
  }
})

/**
 * 27. 优雅的处理async/await
 */

async function errorCaptured(asyncFunc) {
  try {
    let res = await asyncFunc();
    return [null, res];
  } catch (err) {
    return [e, null];
  }
}

/**
 * 28.发布订阅 EventEmitter
 */

class EventEmitter {
  constructor() {
    this.subs = {}
  }

  on(event, cb) {
    (this.subs[event] || (this.subs[event] = [])).push(cb);
  }

  trigger(event, ...args) {
    this.subs[event] && this.subs[event].forEach(cb => {
      cb(...args)
    })
  }

  once(event, onceCb) {
    const cb = (...args) => {
      onceCb(...args)
      this.off(event, onceCb)
    }
    this.on(event, cb);
  }

  off(event, offCb) {
    if(this.subs[event]) {
      let index = this.subs[event].findIndex(cb => cb === offCb);
      this.subs[event].splice(index, 1);
      if(!this.subs[event].length) delete this.subs[event]
    }
  }
}
