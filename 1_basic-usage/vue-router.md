# vue-router

## 路由基本概念

router: 中文叫“路由器”，路由器会维护一张映射表：由路由器所在子网中各个节点的ip地址和对应mac地址的映射。

前端路由的核心也是维护一组映射：从 URL 到组件的映射，或者叫它路由规则。

**前端路由如何做到 URL 和内容的映射？** 监听 URL 的改变

前端路由的特点是，改变 URL，页面不进行整体刷新。

**如何做到改变URL不刷新页面？** 一种方法是利用 URL 的 hash 部分。

因此，整个故事是：
  - 改变 URL 的hash部分：
    - `<a href="#/about">` 标签
    -  JS（window.location.hash='#/about'）
  - 同时监听 URL 的变化：
    - window.addEventListener('hashchange', () => {})
  - 在 hashchange 的回调函数中处理内容的切换

还有一种改变URL的方式：HTML5 的 History API，使用 History API 实现路由的例子(hash 模式也类似)：

```js
const routerView = document.querySelector('/router-view');

// 1.劫持所有 a 标签的点击事件
cosnt aEles = document.getElementByTagName('a');
for (let aEle in aEles) {
  aEle.addEventListener('click', (e) => {
    e.preventDefault();
    const href = aEle.getAttribute('href');
    // 触发url改变
    history.pushState({}, '', href);
    historyChange();
  });
}

// 2.监听popstate 和 go事件
window.addEventListener('popstate', historyChange);
window.addEventListener('go', historyChange);

// 3.切换页面显式
function historyChange() {
  switch(location.pathname) {
    case '/home':
      routerView.innerHTML = 'home';
      break;
    case: '/about':
      routerView.innerHTML = 'about';
      break;
    default:
      routerView.innerHTML = 'default';
  }
}
```

## 使用 vue-router

1. 创建路由需要映射的组件；
2. 通过createRouter 创建路由对象，传入routes和history模式；
   1. routes数组是路径和组件映射关系的数组；
   2. 创建基于hash或history模式
3. 使用app.use注册路由对象
4. 使用路由：`<router-link>` 创建链接，`<router-view>`为路由的页面占位

## 路由懒加载

```js
component () => import(/* webpackChunkName:'home-chunk' */'../views/Home.vue');
```

## 动态匹配路由

```js
path: '/user/:id'
```

## NotFound

```js
path: '/:pathMatch(.*)'
```

## 动态添加路由

router.addRoute()

使用场景，后台管理系统的动态菜单生成：
- 动态生成左侧菜单(菜单提供`<router-link>`)
- 获取到用户详情后，动态添加路由对象

## 路由导航守卫

- 最重要的 beforeEach
- vue3 不推荐使用next()，代之以返回一个path 或 路由对象

使用场景：

进入某个页面前，进行登陆判断，如果未登录，重定向到登陆页面，如果已登陆则正常进入

```js
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');
  if(to.path === '/login') return;

  if(to.path === '/order' && !token) {
    return '/login';
  }
});
```