function Person(name) {
  this.name = name
  this.todo = function (sth) {
    console.log(sth)
  }
}

Person.prototype.sex = 1

function Student() {
  Person.call(this, '王小')
  this.age = 16
}

const S1 = new Student()
console.log(S1.name)
console.log(S1.age)
console.log(S1.sex)
S1.todo('222')

console.log('S1 instanceof Student :>> ', S1 instanceof Student)
console.log('S1 instanceof Student :>> ', S1 instanceof Person)
