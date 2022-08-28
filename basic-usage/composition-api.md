# Composition APi 学习与使用拾遗

## 定义响应式数据： reactive/ref 的应用场景

reactive 应用场景，用于保存复杂数据，对象、数组等。

1. reactive 应用于本地产生的数据，非从服务器获取的数据
2. reactive 中定义的数据有关系，是聚合的关系，组织在一起有特殊的意义，如收集一个表单内的数据，用{ username: '', password: '' }

reactive 不用于保存网络请求的数据在于：

```js
const userList = reactive([]);
const userList2 = ref([]);

onMounted(() => {
  const remoteUserList = [{id: 1, name: 'Tom'}, {id: 2, name: 'Jerry'}];

  //如果要把请求服务器的数据赋给本地的 userList，则要遍历 remoteUserList，逐个加入
  remoteUserList.forEach((item) => userList.push(item));

  // 不能直接赋值（以下做法达不到想要效果）
  userList = remoteUserList; // X

  // 用 ref 包装的数据则可以直接赋值
  userList2.value = remoteUserList;
});
```

ref 应用场景：
1. 其他场景基本都用ref，如定义本地简单数据
2. 定义从网络中获取的数据
