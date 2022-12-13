const createApp = (rootComponent) => {
  return {
    mount(selector) {
      let isMounted = false;
      let preVNode = null;

      watchEffect(() => {
        if(!isMounted) {
          preVNode = rootComponent.render();
          mount(preVNode, document.querySelector(selector));
          isMounted = true;
        } else {
          const newNode = rootComponent.render();
          patch(newNode, preVNode);
          preVNode = newNode;
        }
      });
    },
  }
}