// Object.defineProperty()
class Observer {
  constructor(data) {
    // 遍历参数data的属性,给添加到this上
    for (let key of Object.keys(data)) {
      if (typeof data[key] === 'object') {
        data[key] = new Observer(data[key])
      }
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          console.log('你访问了' + key)
          return data[key] // 中括号法可以用变量作为属性名,而点方法不可以;
        },
        set(newVal) {
          console.log('你设置了' + key)
          console.log('新的' + key + '=' + newVal)
          if (newVal === data[key]) {
            return
          }
          data[key] = newVal
        },
      })
    }
  }
}

const obj = {
  name: 'app',
  age: '18',
  a: {
    b: 1,
    c: 2,
  },
}
const app = new Observer(obj)
app.age = 20
console.log(app.age)
app.newPropKey = '新属性'
console.log(app.newPropKey)

// Proxy

const obj = {
  name: 'app',
  age: '18',
  a: {
    b: 1,
    c: 2,
  },
}
const p = new Proxy(obj, {
  get(target, propKey, receiver) {
    console.log('你访问了' + propKey)
    return Reflect.get(target, propKey, receiver)
  },
  set(target, propKey, value, receiver) {
    console.log('你设置了' + propKey)
    console.log('新的' + propKey + '=' + value)
    Reflect.set(target, propKey, value, receiver)
  },
})
p.age = '20'
console.log(p.age)
p.newPropKey = '新属性'
console.log(p.newPropKey)
