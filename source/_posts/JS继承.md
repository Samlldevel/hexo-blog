---
title: JS继承
date: 2020-08-01 15:17:39
desc:
tags:
  - 知识点
  - 继承
categories: JavaScript
---

![多态 - 梦琴](./JS继承/0.jpg)

{% cplayer %}
[530986963, 531040878]
{% endcplayer %}

### 前言

在开发大型项目的时候，我们经常需要用到对象，不论是使用内置对象、扩展对象或者自定义对象等，都是为了很好的把属性和方法封装在一起。所以本次我将 js 原型链以及继承自我总结一下，加强理解。

一张图补一下 `原型链` 的知识, 图片来自掘金作者[一灯](https://juejin.im/post/6844903826143592461)

![原型链](./JS继承/原型链.jpg)

关于 JS 继承分为 6 种

- 原型链继承
- 借用构造函数继承
- 组合继承（组合原型链继承和借用构造函数继承）（常用）
- 原型式继承
- 寄生式继承
- 寄生组合式继承（常用）

---

#### 原型链继承

```js
// 首先定义了两个类型 Person 和 Teacher。
// 父类
function Person(name) {
  this.name = name
  this.todo = function (sth) {
    console.log(sth)
  }
}

// 老师
function Teacher() {
  this.name = '张三'
}

// Person 原型 age 属性赋值
Person.prototype.age = 23

// 通过创建 Person 的实例（new Person()），并将该实例赋给 Teacher 的原型 （Teacher.prototype） 的方式继承了 Person。
// 即：Teacher 的原型 （Teacher.prototype） = Person 的实例（new Person()），实现继承
Teacher.prototype = new Person()

// new 一个数学老师出来
const MathTeacher = new Teacher()

// 此时存在于 Person 中实例中的所有属性和方法，也存在于 Teacher.prototype 中。
// Teacher的实例 MathTeacher 指向 Teacher 的原型 Teacher.prototype，Teacher.prototype 又指向 Person 的原型。

// MathTeacher 本身没有 todo(),todo 来自 Teacher.prototype
MathTeacher.todo('教数学') // 教数学

// MathTeacher 没有 name， 所以输出的是 Teacher 的 name
console.log(MathTeacher.name) // 张三

// MathTeacher、Teacher.prototype（等同Person 的实例）都没有 age 属性， 这里的 age 属性来自 Person.prototype
console.log(MathTeacher.age) // 23
```

很明显，他们的关系就像是一条链，父类新增原型方法/原型属性，子类都能访问到，实现起来也很简单。
这就是 `原型链继承` 的特点。

缺点是：

1. 无法实现多继承，因为是一条链。
2. 原型方法被所有实例共享，不容易维护
3. 无法向父类构造函数传参

---

#### 借用构造函数继承

```js
// 父类
function Person(name) {
  this.name = name
  this.todo = function (sth) {
    console.log(sth)
  }
}

function Student() {
  Person.call(this, '王小')
  this.age = 16
}

const S1 = new Student()
console.log(S1.name) // 王小
console.log(S1.age) // 16
console.log(S1.sex) //undefined
S1.todo('222') // '222'
```

RT，借用了父类的构造函数，
关键代码是

```js
Person.call(this, '王小')
```

用 [.call()](https://www.w3school.com.cn/js/js_function_call.asp) 和 [.apply()](https://www.w3school.com.cn/js/js_function_apply.asp) 将父类构造函数引入子类函数（在子类函数中做了父类函数的自执行（复制））

回头来看，第二种是为了解决 `原型链继承` 而诞生的

1. 使用多个`call()` 函数，能够实现多继承
2. 只继承了父类构造函数的属性，解决了实例共享父类引用问题
3. `call()` 函数支持传参，可以向父类传递参数

看起来很不多，毕竟比原型链讲究了那么些，但是很快又发现了新的问题

1. 很容易发现并不是父类的实例（毕竟是借的，不是亲生的）

```js
console.log(S1 instanceof Person) // false
console.log(S1 instanceof Student) // true
```

2. 每次用每次都要重新调用，无法实现构造函数的复用（毕竟是别人的构造函数）
3. 每个子类都有父类实例函数的副本，影响性能（每个人都借一次，印象不好）

#### 组合继承（组合原型链继承和借用构造函数继承）（常用）

未完待续
