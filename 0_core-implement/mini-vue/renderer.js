/**
 * implementation of core renderer logic: VNode to DOM
 * h()
 * mout()
 * patch()
 */

function h(type, props, children) {
  return {
    type, props, children
  }
}

// create DOM and mount
function mount(vNode, containerEle) {
  const el = vNode.el = document.createElement(vNode.type);

  // 处理props: attributes or function
  if(vNode.props) {
    for(const key in vNode.props) {
      if(key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), vNode.props[key]);
      } else {
        el.setAttribute(key, vNode.props[key]);
      }
    }
  }

  // 处理children string or vNode[]
  if(vNode.children) {
    if(typeof vNode.children === 'string') {
      el.textContent = vNode.children;
    } else {
      vNode.children.forEach(item => {
        mount(item, el);
      });
    }
  }
  containerEle.appendChild(el);
}

/**
 * compare new virtual node with old one and apply rendering
 * @param {n1} oldVNode type props children
 * @param {n2} newVNode
 */
function patch(n1, n2) { 
  // type 是否相同
  if(n2.tag !== n1.tag) {
    // replace
    const eleParent = n1.el.parentElement;
    eleParent.removeChild(n1.el);
    mount(n2, eleParent);

  } else {
    const el = n2.el = n1.el;

    // diff
    // 1.props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // add new props
    for(const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if(newValue !== oldValue) {
        if(key.startsWith('on')) {
          el.addEventListener(key.slice(2).toLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }

    // remove old props
    for(const key in oldProps) {
      if(key.startsWith('on')) {
        el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
      }
      if(!(key in newProps)) {
        el.removeAttribute(key);
      }
    }

    // 2.children
    const oldChildren = n1.children || [];
    const newChildren = n2.children || [] ;

    if(typeof newChildren === 'string') {
      if(typeof oldChildren === 'string') {
        if(newChildren !== oldChildren) {
          el.textContent = newChildren;
        }
      } else {
        el.innerHTML = newChildren;
      }
    } else { // newChildren: vNode[]
      // oldChildren: string
      if(typeof oldChildren === 'string') {
        el.innerHTML = '';
        newChildren.forEach(item => {
          mount(item, el);
        })
      } else {// old and new: both vNode[]
        // 先对相同 children 元素做 patch
        const commomLength = Math.min(oldChildren.length, newChildren.length);
        for(let i=0; i<commomLength; i++) {
          patch(oldChildren[i], newChildren[i]);
        }

        // newChildren length 短, 移除
        if(newChildren.length < oldChildren.length) {
          oldChildren.slice(commomLength).forEach(item => {
            el.removeChild(item.el);
          })
        }

        // newChildren length 长, 增加
        if(newChildren.length > oldChildren.length) {
          newChildren.slice(commomLength).forEach(item => {
            mount(item, el);
          })
        }
      }
    }
  }
}

