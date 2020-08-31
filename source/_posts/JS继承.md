---
title: 笔记-JS继承
date: 2020-08-01 15:17:39
desc:
tags:
  - 知识点
  - 继承
categories: JavaScript
---

![梦琴](./JS继承/0.jpg)

{% cplayer %}
[530986963, 531040878]
{% endcplayer %}

### 前言

在开发大型项目的时候，我们经常需要用到对象，不论是使用内置对象、扩展对象或者自定义对象等，都是为了很好的把属性和方法封装在一起。所以本次我将 js 原型链以及继承自我总结一下，加强理解，如理解有误，欢迎讨论交流。

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

#### 一、 原型链继承

> 将构造函数的原型设置为另一个构造函数的实例对象，这样就可以继承另一个原型对象的所有属性和方法，可以继续往上，最终形成原型链。

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

#### 二、 借用构造函数继承

> 为了解决原型中包含引用类型值的问题，开始使用借用构造函数，也叫伪造对象或经典继承

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

优点：

1. 使用多个`call()` 函数，能够实现多继承
2. 只继承了父类构造函数的属性，解决了实例共享父类引用问题
3. `call()` 函数支持传参，可以向父类传递参数

看起来很不多，毕竟比原型链讲究了那么些，但是很快又发现了新的问题

缺点：

1. 很容易发现并不是父类的实例（毕竟是借的，不是亲生的）

```js
console.log(S1 instanceof Person) // false
console.log(S1 instanceof Student) // true
```

2. 每次用每次都要重新调用，无法实现构造函数的复用（毕竟是别人的构造函数）
3. 每个子类都有父类实例函数的副本，影响性能（每个人都借一次，印象不好）

---

#### 三、 组合继承（组合原型链继承和借用构造函数继承）（常用）

> 也叫伪经典继承，将原型链和借用构造函数的技术组合到一块。使用原型链实现对原型属性和方法的继承，而通过构造函数来实现对实例属性的继承。

```js
// 父类
function Person(name) {
  this.name = name
  this.todo = function (sth) {
    console.log(sth)
  }
}

Person.prototype.sex = 1

function Student(name) {
  if (name) {
    Person.call(this, name)
  }
  this.age = 16
}

// 原型链继承
Student.prototype = new Person('原始人')

// 可传参
const S1 = new Student('王晓')
const S2 = new Student()

// 从子类构造函数中获取
console.log(S1.name) // 王晓
console.log(S1.age) // 16
// 通过父类构造函数获取
console.log(S2.name) // 原始人

// 通过父类原型链获取
console.log(S2.sex) //1
```

下面是实例 S2 继承关系概要

```json
 Student {
  age: 16,
  __proto__: {
          name: "原始人",
          todo: ƒ (sth),
          __proto__: {
                  sex: 1,
                  constructor: ƒ Person(name),
                  __proto__: Object
          }
    }
 }
```

从实例中看到 `Student 构造函数` 中无 `name` 属性，所以会顺着 `原型链` 去查看，直到找到为止
在 `Person 构造函数` 找到了 `name` 属性 ,在 `Person 的原型` 找到了 `sex` 属性

组合继承结合了 `借用构造函数` 和 `原型链接触` 这两种方式，实现传参和复用父类的实例

优点：

- 继承父类属性，可传参以及复用父类的实例
- 每个实例引入的构造函数的属性都是私有的

缺点:

- 调用了两次父类构造函数（一次是创建子类原型时，另一次是子类构造函数的内部）
- 最终生成的子类型会包含了父类型的全部实例属性，需要重写这些属性（如下 S1 继承关系可见）

下面是实例 S1 继承关系概要

```json
 Student {
  age: 16,
  name: "王晓",
  todo: ƒ (sth),
  __proto__: {
          name: "原始人",
          todo: ƒ (sth),
          __proto__: {
                  sex: 1,
                  constructor: ƒ Person(name),
                  __proto__: Object
          }
    }
 }
```

---

#### 四、 原型式继承

> 不自定义类型的情况下，临时创建一个构造函数，借助已有的对象作为临时构造函数的原型，然后在此基础实例化对象，并返回。

```js
// 函数容器 本质上是object()对传入其中的对象执行了一次浅复制
function content(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

// 父类
function Person(name) {
  this.age = 10
  this.likes = ['吃饭', 'lol']
}

Person.prototype.sex = 0

const p = new Person()

const stu = content(p)
const stu2 = content(p)

console.log(stu.age) // 10
console.log(stu.sex) // 0
stu.likes.push('睡觉')

// 引用类型会受影响
console.log(stu2.likes) // [ '吃饭', 'lol', '睡觉' ]
```

主要也是通过原型链继承，适用于让一个对象与另一个对象保持类似的情况

缺点和原型链继承缺点类似

- 所有实例共享，引用类型会相互影响
- 无法复用

`注意:`

ES5 通过新增 Object.create()方法规范化了原型式继承。这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。在传入一个参数的情况下，Object.create()与这里的 content()方法的行为相同。第二个参数与 Object.defineProperties()方法的第二个参数格式相同：每个属性都是通过自己的描述符定义的。

---

#### 五、 寄生式继承（增强对象)

> 在原型式继承得到对象的基础上，在内部再以某种方式来增强对象，然后返回。

```js
// 函数容器
function content(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

// 对象加工厂
function createStudent(obj) {
  let clone = content(obj)
  clone.sayHi = function () {
    console.log('hi')
  }
  return clone
}

// 父类
function Person(name) {
  this.age = 10
}

const p = new Person()

const stu1 = createStudent(p)

stu1.sayHi() // hi
```

其实就是 `原型式继承` 的增强版，扩展了对象的属性和方法，缺点还是没有改进

---

#### 六、 寄生组合式继承（常用）

> 组合继承是 JS 中最常用的继承模式，但其实它也有不足，组合继承无论什么情况下都会调用两次超类型的构造函数，并且创建的每个实例中都要屏蔽超类型对 象的所有实例属性。
> 寄生组合式继承就解决了上述问题，被认为是最理想的继承范式。

因为使用 `组合继承` ，调用了两次 Person 构造函数，现在出现了两组属性，一组在实例上，一组在 Student 原型中。

回顾一下组合继承基本结构

```js
// 父类
function Person(name) {
  this.name = name
}

function Student(name) {
  Person.call(this, name)
}

// 原型链继承
Student.prototype = new Person('原始人') // 寄生组合式继承 将会替换这行

// ...
```

寄生组合式继承

```js
function content(o) {
  function F() {}
  F.prototype = o
  return new F()
}

// 其实只是需要父类的一个副本而已
function inheritPrototype(person, student) {
  // 是创建超类型原型的一个副本
  var prototype = content(person.prototype) // 创建对象

  // 为创建的副本添加 constructor 属性，从而弥补因重写原型而失去的默认的 constructor 属性
  prototype.constructor = student // 增强对象

  // 将新创建的对象（即副本）赋值给子类型的原型
  student.prototype = prototype // 指定对象
}

// 父类
function Person(name) {
  this.name = name
  this.todo = function (sth) {
    console.log(sth)
  }
}

Person.prototype.sex = 1

function Student(name) {
  if (name) {
    Person.call(this, name)
  }
  this.age = 16
}

// Student.prototype = new Person('原始人') // 寄生组合式继承 将会替换这行
inheritPrototype(Person, Student) // 这一句，替代了组合继承中的SubType.prototype = new Person()

// 可传参
const S1 = new Student('王晓')
const S2 = new Student()

// 从子类构造函数中获取
console.log(S1.name) // 王晓
console.log(S1.age) // 16
// 通过父类构造函数获取
console.log(S2.name) // undefined ,没有往父类构造函数传参

// 通过父类原型链获取
console.log(S2.sex) //1
```

这个例子的高效率体现在它只调用了一次 `Person 构造函数`，并且因此避免了 `Student.prototype` 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 `instanceof` 和 `isPrototypeOf()`。

---

#### Class

关键字 class 从 ES6 开始正式被引入到 JavaScript 中。class 的目的就是让定义类更简单

```js
class Person {
  constructor(age) {
    this.age = age
  }

  hello() {
    console.log('输出年龄', this.age)
  }

  // 静态方法
  static foo() {
    console.log('static foo')
  }
}

class Student extends Person {
  constructor(age, name) {
    // java 中如果不写 默认会自动生成，但是 js class super 必须在第一且不可省，
    super(age) // 用 super 调用父类的构造方法!
    this.name = name
  }
  hi() {
    // super.hello()就相当于a.prototype.hello()
    // this 指向子类
    super.hello()
  }
}

var s = new Student(16)

s.hi() // 输出年龄 16

Person.foo() // static foo
```

#### 参考资料

[JS 实现继承的 6 种方式](https://blog.csdn.net/longyin0528/article/details/80504270)
[JavaScript 高级程序设计: 继承](https://github.com/longyincug/Notebook/blob/master/src/JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1.md/#6c)
[实现继承的方式](https://blog.csdn.net/yingleiming/category_9935106.html)
