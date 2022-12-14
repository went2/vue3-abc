const createApp = (rootComponent) => {
  return {
    mount(selector) {
      const container = document.querySelector(selector);
      let isMounted = false;
      let oldVNode = null;

      watchEffect(() => {
        if(!isMounted) {
          oldVNode = rootComponent.render();
          mount(oldVNode, container);
          isMounted = true;
        } else {
          const newNode = rootComponent.render();
          patch(oldVNode, newNode);
          oldVNode = newNode;
        }
      });
    }
  }
}