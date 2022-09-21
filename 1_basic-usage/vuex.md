# app状态管理——Vuex

## 为什么要有状态管理

状态用来描述会基于数据改变的视图效果(visual effect based on data)，按钮有按下和抬起的显示效果、列表有切换上下页的效果等，这些效果的发生由对应的变量控制，变量对应一种数据结构。

为什么要把状态管理和组件逻辑处理这两件事分开处理？目的是分而治之，组件的归组件，状态的归状态。一个应用在开发过程中会形成巨大组件树，如果数据处理的逻辑全部在组件内部，追踪组件间的通信会带来很大心智负担。合适的做法是，在状态管理的那边划分出模块，处理类似逻辑的状态，组件都从相应的状态库的模块中存取数据，这将开发逻辑分离地更清楚，也是一种通用的开发约定。

## 前端保存数据的方案

1. 页面级别的组件保存所有数据，分发给子组件，子组件拿来作展示

页面指通过路由改变显示的页面。

2. 页面级别的数据，抽取到Vuex中管理

此时Vuex中会全是actions

## 基本概念

单一状态树：整个应用的状态都保存到**一个对象**中。

使用vuex的方式：

之前会把异步请求直接写在组件的 created 或 mounted 生命周期回调中，引入vuex后，在生命周期回调中写action调用，而把action和mutations的具体实现拆分到store中实现。这是使用vuex的一种方式。

使用过程：

1. 创建store实例：store；
2. 通过插件的方式使用store，createApp.use(store)
3. 在组件中获取store（this.$store.state）

## store的创建

通过给 createStore() 传配置对象创建一个全局的store

```js
import {createStore} from 'vuex';

const store = createStore({
    state: () => ({
        id: 23,
        name: 'Jimmy',
        avatarUrl: 'http://www.xxxxx',
        age: 88
    }),
    getters: {
        doubleAge(state) {
            return state.age * 2;
        }
    }
})
```

## 在组件中使用store

1. mapState(): 从store中获取对应映射，mapState 返回一个对象，对象里面每个属性是函数，{ [key]: Function, [key]: Function }，可以把它直接展开用到computed()中

```js
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['name', 'id', 'account'])
    }
}
```

2. setup() 函数中使用store：直接从中解构需要的属性，使用解构语法后会使之失去响应性，所以要用toRefs()进行包装。

```js
import {toRefs} from 'vue';
import {useStore} from 'vuex';

<script setup>
const store = useStore();

const {name, id, account} = toRefs(sotre);
</script>
```

## getters

- 基本使用（传入 getters 对象，每个 getter 是一个函数）
- 在getter中使用其他getter，(state, getters) => {}
- 在getter中返回函数，在使用getter时可以传参
- getters 可以映射，使用 mapGetters，用法同 mapState

## mutations

修改state必须通过提交mustations，`state.commit('changeName', { name: 'Tommy' })`

mutations 是传入 createStore() 的配置对象中的属性，结构如：

```js
createStore({
    mutations: {
        changeName: (state, payload) => {
            state.name = payload.name;
        }
    }
})
```

mutations 可以映射使用，mapMutations()

## actions

mutations 中只能做同步操作，异步操作放在actions中进行，并且在actions中的异步操作完成后，需要修改state时，还是要提交mutations进行修改。可以将actions看作是异步修改state的前置操作

```js
actions: { 
    async updateUserAction(context) {
        // 与服务器通信
        res = await fetch('https://..', { method: 'post', body: JSON.stringify(data) });
        context.commit('updateUser', res);
    }    
}
```

actions 可以映射使用，mapActions()

vuex 提供的辅助函数（mapState, mapGetters, mapMutations, mapActions）与 options api 结合使用会很方便，能把函数名通过解构直接映射到methods中，省去声明函数的功夫，如：

```js
const actions = mapActions(['updateUserAction', 'incrementAction']);

methods:{
    ...actions
}
```

但在setup() 函数中，就无法直接解构，因为setup()内部没有将`this`绑定为组件实例，上述从store中获取 actions 的方式在底层为 `this.$store.updateUserAction`，如何在setup()中使用map系列的函数？

一种做法是为它绑定 `$store`，因为map系列函数返回的是由函数组成的对象

```js
import {useStore,mapActions} from 'vuex';

const store = useStore();
const actions = mapActions(['updateUserAction', 'incrementAction']);
const newActions = {};
Object.keys(actions).forEach(key => {
    newActions[key] = actions[key].bind({$store: store});
})

const { updateUserAction, incrementAction } = newActions;
```

另一种做法是不用map系列函数，使用默认做法：

```js
function increment() {
    store.dispatch('incrementAction')
}
```

## 分模块保存state

```js
// src/store/modules/moduleA.js
const moduleA = {
    state: () => ({}),
    mutations: {},
    actions: {},
    getters: {},
}

export default moduleA;

// src/store/modules/moduleB.js
const moduleB = {
    state: () => ({}),
    mutations: {},
    actions: {},
}

export default moduleB;

// src/store/index.js
import moduleA from './modules/moduleA';
import moduleB from './modules/moduleB';

const store = createStore({
    modules: {
        a: moduleA,
        b: moduleB,
    },
});

store.state.a; // 获取moduleA的状态
store.state.b;
```

除state以外，模块的其他项如getters, mutations, actions都会合并到一起，在同一个命名空间，所以在取变量名时如果重名会有问题。

所以在设置模块时，传入一个额外属性，`namespace: true`，设置后，相应的key就要加上模块名，如`"moduleA/incrementAction"`