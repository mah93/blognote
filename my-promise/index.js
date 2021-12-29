/**
 * https://juejin.cn/post/7043758954496655397
 */

class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(func) {
    this.PromiseState = MyPromise.PENDING; // 储存当前Promise状态
    this.PromiseResult = null; // Prmise的结果
    this.onFulfilledCallbacks = []; //
    this.onRejectedCallbacks = []; //

    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(result) {
    if (this.PromiseState === MyPromise.PENDING) {
      setTimeout(() => {
        this.PromiseState = MyPromise.FULFILLED;
        this.PromiseResult = result;
        this.onFulfilledCallbacks.forEach(callback => callback(result));  
      })
    }
  }

  reject(reason) {
    if (this.PromiseState === MyPromise.PENDING) {
      setTimeout(() => {
        this.PromiseState = MyPromise.REJECTED;
        this.PromiseResult = reason;
        this.onRejectedCallbacks.forEach(callback => callback(reason))  
      })
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason;
    }
    if (this.PromiseState === MyPromise.PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }

    if (this.PromiseState === MyPromise.FULFILLED) {
      setTimeout(() => {
        onFulfilled(this.PromiseResult);
      })
    }
    if (this.PromiseState === MyPromise.REJECTED) {
      setTimeout(() => {
        onRejected(this.PromiseResult);
      })
    }
  }
}