/**
 * 阶段一：期望实现以下效果：
 * 变量 msg 值发生改变后，会自动执行用到该变量的函数
 * 分析：变量 msg 叫依赖（dependent），内部要保存它的订阅者，同时设置规则：在获取它的值时触发依赖收集，在它的值改变时，通知订阅函数
 */
class Dep {
  constructor(value) {
    this._value = value;
    this.subscribers = new Set();
  }

  get value() {
    this.depend();
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    this.notify();
  }

  depend() {
    if(activeEffect){
      this.subscribers.add(activeEffect);
    }
  }

  notify() {
    this.subscribers.forEach(effect => effect());
  }
}

let msg1 = new Dep('1111');

let activeEffect;

activeEffect = function () {
  console.log(`rendering ${ msg1.value }.`);
}

activeEffect(); // 手动调用一次以触发依赖收集：打印 rendering 1111

msg1.value = '2222'; // 自动打印 rendering 2222
msg1.value = '3333'; // 自动打印 rendering 3333，效果实现

/**
 * 阶段二：定义 watchEffect，只要开发者调用 watchEffect, 就会设置为activeEffect，并调用一次以触发依赖收集
 * @param {} effect 函数
 */
function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

watchEffect(() => {
  console.log(`rendering again ${ msg1.value }`);
});

msg1.value = '4444'; // 自动打印 rendering againg 4444，效果实现

/**
 * 阶段三：上面把依赖的功能与值的存取放到一个函数中，只实现了 msg.value 的值改变时自动触发它的effect函数，现在需要要让一个普通对象的 key 也有这样的功能。要有一个结构存这个映射关系：key：对象，value: 这个对象的 key 的 depedents
 */

const targetMap = new WeakMap();
function getDep(target, key) {
  // 根据 target 对象取出它的 depsMap 对象
  let depsMap = targetMap.get(target);
  if(!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // 获取具体的 dep 对象
  let dep = depsMap.get(key);
  if(!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

// 劫持 raw object 
function reactive(raw) {
  Object.keys(raw).forEach(key => {
    const dep = getDep(raw, key);
    let value = raw[key];

    Object.defineProperty(raw, key, {
      get() {
        dep.depend();
        return value;
      },
      set(newValue) {
        if(value !== newValue) {
          value = newValue;
          dep.notify();
        }
      }
    })
  });
  return raw;
}

const info = reactive({ name: 'james', age: 20 });
const style = reactive({ color: 'red', margin: '12px' });

watchEffect(() => {
  console.log(`effect3333 ${ info.name }`)
})

info.name = 'tommy'; // 显示：effect3333 tommy，实现成功

/**
 * 阶段四：vue3 将 reactive() 用 Proxy 实现，其他不变
 */

function reactive3(raw) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const dep = getDep(target, key);
      dep.depend();
      return Reflect(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value, receiver);
      dep.notify();
      return result;
    }
  });
}