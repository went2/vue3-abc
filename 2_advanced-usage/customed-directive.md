# 自定义指令

## 1. 用途

实现自定义指令是为了对DOM元素进行自定义操作。自定义指令使用对象数据结构。

## 2. 用法

定义自定义组件是定义所选元素在生命周期内的行为，vue会传入被指令绑定的元素。

### 2.1 局部自定义指令

定义在组件内部，仅当前组件可用。

```js
// option 式写法, 在directives选项中定义
<script>
export default {
  directives: {
    focus: {
      mounted(el) {
        el.focus();
      }
    }
  }
}
</script>

// 在setup中的写法，定义一个标识符，标识符名为指令名
<script setup>
const vFocus = {
  mounted(el) {
    el?.focus();
  }
}
</script>
```

### 2.2 全局自定义指令

注册在根app上，所有组件可用。一般都定义全局指令。

```js
app.directives('focus', {
  mounted(el) {
    el.focus();
  }
})
```