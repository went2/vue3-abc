# 用 Pinia 管理状态

pinia实例可以用vue组件相关概念理解：

- 一个pinia实例 => 一个组件vue实例
- state => 组件中的 data() 
- getters => 组件中的 computed(计算属性)
- actions => 组件中的 methods


## 与 Vuex 的区别

- 提供了具有 Composition-api 风格的 API，更简单
- 与 Typescript 一起使用有可靠的类型推荐支持
- 没有 mutations 这个概念
- 没有 modules 的嵌套结构，没有命名空间，扁平地方式互相使用store，每个store都独立的

## 创建、在组件中使用

官方文档：

https://pinia.vuejs.org/core-concepts/#using-the-store

`defineStore()` 返回一个函数，调用它，得到一个store实例。

定义store时，有两种写配置的语法，选项式和组合式，用法同它们在vue组件中的用法。

- state, getters 不可直接从store实例中解构，store是个reactive包装的对象，要先用官方提供的`storeToRefs()`进行处理, `const { name } = storeToRefs(store)`
- actions 可以

- getters
  - 函数组成的对象
  - this 指向当前的store实例
  - 可访问当前store的其他getters
  - 可访问其他store的getters和state

- actions
  - 函数组成的对象，this 指向当前的store实例
  - 函数参数对应调用时的传入参数
  - 可进行异步操作，适合写业务逻辑
