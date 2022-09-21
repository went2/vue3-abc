# 说明

课程学习笔记：

- vue3-deep-dive-with-evan-you
- https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/virtual-dom-and-render-functions

目录：

- [1. 虚拟dom概念](./1.virtual-dom.md)
- [2. 实现一个挂载函数](./2.mout-function.md)
- [3. 实现响应性函数reactive](./3.reactivity.md)
- [4. 实现mini-vue](./4.mini-vue.html)

从组件的生命周期看，vue核心过程：
  - 1.vue初始化，即将创建组件，调用`beforeCreate()`
  - 2.创建组件实例，准备它的数据、方法、响应性，调用 reactive() 初始化响应性，完成后调用 `created()`
  - 3.解析template，单文件组件交由 vue-loader 解析。模板解析成 render 函数，生成虚拟节点 VNode，调用 `beforeMount()`
  - 4. 调用 `mount()`，根据 VNode 创建 DOM 节点，并挂载到 html 文档中。调用 `mounted()`，此时可通过 ref 获得组件实例的引用
  - 5. 数据更新后，生成新的VNode，调用 `beforeUpdate()`；
  - 6. 调用 `patch()`，更新视图，调用 `updated()`；
  - 7. 组件实例销毁，VNode 从虚拟dom中移除，调用`beforeUnmount()`;
  - 8. 调用 `patch()`，更新视图，调用 `unmounted()`；