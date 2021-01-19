---
title: 实现Promise
date: 2021-01-19 22:00:55
desc:
tags:
  - Promise
categories: JavaScript
---

使用 `class `动手实现了一遍 `Promise`

使用 [promises-aplus-tests](https://www.npmjs.com/package/promises-aplus-tests) 检验通过

仓库： [MyPromise](https://github.com/PL-FE/Promise)

以下是主要代码

```js
const PENDING_STATE = "pending";
const FULFILLED_STATE = "fulfilled";
const REJECTED_STATE = "rejected";

const isFunction = function (fun) {
  return typeof fun === "function";
};

const isObject = function (value) {
  return value && typeof value === "object";
};

class Mypromsie {
  constructor(executor) {
    if (!this || this.constructor !== Mypromsie) {
      throw new TypeError("Promise must be called with new");
    }

    if (!isFunction(executor)) {
      throw new TypeError("Promise constructor's argument must be a function");
    }

    this.state = PENDING_STATE;
    this.value = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      resolutionProcedure(this, value);
    };

    const reject = (reason) => {
      if (this.state === PENDING_STATE) {
        this.state = REJECTED_STATE;
        this.value = reason;

        this.onRejectedCallbacks.forEach((callback) => callback());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }

    const resolutionProcedure = (promise, x) => {
      if (promise === x) {
        return reject(new TypeError("Promise can not resolved with it seft"));
      }

      if (x instanceof Mypromsie) {
        return x.then(resolve, reject);
      }

      if (isObject(x) || isFunction(x)) {
        let called = false;
        try {
          let then = x.then;

          if (isFunction(then)) {
            then.call(
              x,
              (y) => {
                if (called) return;
                called = true;
                resolutionProcedure(promise, y);
              },
              (error) => {
                if (called) return;
                called = true;
                reject(error);
              }
            );
            return;
          }
        } catch (error) {
          if (called) return;
          called = true;
          reject(error);
        }
      }

      if (promise.state === PENDING_STATE) {
        promise.state = FULFILLED_STATE;
        promise.value = x;

        promise.onFulfilledCallbacks.forEach((callback) => callback());
      }
    };
  }

  then(onFulfilled, onRejected) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : (value) => value;
    onRejected = isFunction(onRejected)
      ? onRejected
      : (error) => {
          throw error;
        };

    const promise2 = new Mypromsie((resolve, reject) => {
      const wrapOnFulfilled = () => {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        }, 0);
      };
      const wrapOnRejected = () => {
        setTimeout(() => {
          try {
            const x = onRejected(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        }, 0);
      };

      if (this.state === FULFILLED_STATE) {
        wrapOnFulfilled();
      } else if (this.state === REJECTED_STATE) {
        wrapOnRejected();
      } else {
        this.onFulfilledCallbacks.push(wrapOnFulfilled);
        this.onRejectedCallbacks.push(wrapOnRejected);
      }
    });

    return promise2;
  }

  catch(callback) {
    return this.then(null, callback);
  }

  finally(callback) {
    return this.then(
      (data) => {
        callback();
        return data;
      },
      (error) => {
        callback();
        throw error;
      }
    );
  }

  static resolve(value) {
    return value instanceof Mypromsie
      ? value
      : new Mypromsie((resolve) => resolve(value));
  }

  static reject(reason) {
    return new Mypromsie((resolve, reject) => reject(reason));
  }

  static race(promises) {
    return new Mypromsie((resolve, reject) => {
      promises.forEach((promise) =>
        Mypromsie.resolve(promise).then(resolve, rejec)
      );
    });
  }

  static all(promises) {
    return new Mypromsie((resolve, reject) => {
      let result = [];
      let resolveCount = 0;
      const len = promises.length;
      if (!len) {
        resolve([]);
      }

      for (let index = 0; index < len; index++) {
        Mypromsie.resolve(promises[index]).then(
          (data) => {
            result[index] = data;
            if (++resolveCount === len) {
              resolve(result);
            }
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }

  static allSettled(promises) {
    return new Mypromsie((resolve, reject) => {
      let result = [];
      let resolveCount = 0;
      const len = promises.length;
      if (!len) {
        resolve([]);
      }

      for (let index = 0; index < len; index++) {
        Mypromsie.resolve(promises[index]).then(
          (data) => {
            result[index] = {
              status: FULFILLED_STATE,
              value: data,
            };
            if (++resolveCount === len) {
              resolve(result);
            }
          },
          (error) => {
            result[index] = {
              status: REJECTED_STATE,
              value: error,
            };
            if (++resolveCount === len) {
              resolve(result);
            }
          }
        );
      }
    });
  }
}
```
