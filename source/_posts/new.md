---
title: new
date: 2021-01-21 20:04:42
desc:
tags:
  - new
categories: JavaScript
---

### 前言

> JavaScript 的 `new` 运算符干了啥？
> 自己写一遍加深一下。

---

### 用法

```js
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;

  return {
    abc: "js",
  };
}

const car1 = new Car("Eagle", "Talon TSi", 1993);

console.log(car1.abc);
// expected output: "js"

console.log(car1.make);
// expected output: "undefined"
```

---

### 实际

```js
function myNew(fun) {
  // 空对象
  let obj = Object.create(null);

  // 设置原型链
  obj.__proto__ = fun.prototype;

  // 让Func中的this指向obj。
  // 执行Func的函数体,看看有没有对象返回。
  const res = fun.call(obj);

  if (typeof res !== "objcet") {
    // 大部分情况下走这里
    return obj;
  } else {
    // fun返回的是一个对象的时候，new 也把这个对象返回出去
    // 结合 console.log(car1.abc); 很清晰
    return res;
  }
}
```

### 结束

果然自己写一遍就是不一样！ 🤣🤣🤣
