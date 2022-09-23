# 说明

课程学习笔记仓。

- vue3-deep-dive-with-evan-you
- https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/virtual-dom-and-render-functions

目录：

- [1. 虚拟dom概念](./1.virtual-dom.md)
- [2. 实现一个挂载函数](./2.mout-function.md)
- [3. 实现响应性函数reactive](./3.reactivity.md)
- [4. 实现mini-vue](./4.mini-vue.html)

从组件的生命周期看，vue核心过程：

  - 1.vue初始化，即将创建组件，调用 `beforeCreate()`；
  - 2.创建组件实例，准备它的数据、方法、响应性，调用 `reactive()` 初始化响应性，完成后调用 `created()`；
  - 3.解析template，单文件组件交由 vue-loader 解析。模板解析成 render 函数，执行、生成虚拟节点VNode，调用 `beforeMount()`；
  - 4. 调用 `mount()`，根据 VNode 创建 DOM 节点，挂载到html文档。调用 `mounted()`，在里面就可以拿到绑定了ref的组件实例；
  - 5. 数据更新后，生成新的VNode，调用 `beforeUpdate()`；
  - 6. 调用 `patch()`，更新视图，调用 `updated()`；
  - 7. 组件实例销毁，将VNode从虚拟dom中移除，调用`beforeUnmount()`；
  - 8. 调用 `patch()`，更新视图，调用 `unmounted()`；

vue3引入`setup()`，据Evan You，组件初始化时的第一件事是调用`setup()`，代替了 `beforeCreate()` 和`created()`