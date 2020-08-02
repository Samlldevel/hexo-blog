function Person(name) {
  this.name = name
  this.todo = function (sth) {
    console.log(sth)
  }
}

Person.prototype.age = 23

// 老师
function Teacher() {
  this.name = '张三'
}

// 首先定义了两个类型 Person 和 Teacher。
// 此时 Teacher 通过创建 Person 的实例（new Person()），并将该实例（new Person()）赋给了 Teacher 的原型 Teacher.prototype 的方式继承了 Person。
Teacher.prototype = new Person()

// 此时存在于 Person 中实例中的所有属性和方法，也存在于 Teacher.prototype 中。

// Teacher的实例 MathTeacher 指向 Teacher 的原型 Teacher.prototype，Teacher.prototype 又指向 Person 的原型。

const MathTeacher = new Teacher()

MathTeacher.todo('教数学') // 教数v学
console.log(MathTeacher.name) // 张三
// 注意：age 仍然还在 Person.prototype 中，但 property 则位于 Teacher.prototype 中。这是因为 property 是一个实例属性，而 age 则是一个原型属性。
console.log(MathTeacher.age) // 23
