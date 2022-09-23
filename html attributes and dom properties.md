# html 元素的 attribute 和 DOM 对象的 property 有什么联系和区别

## 区别

出现的场景不同：

- html attribute 由 html 定义，写在 html 文档中；dom property 由 dom 定义，在文档载入浏览器后，通过dom接口访问

## 联系

- html attribute 会被用作dom对象属性的初始化。
- 非自定义 html attributes (如id, class 等) 会一对一映射到 dom 属性中。
- html attribute 的值是常量，不可改。修改的 dom 属性的值，attribute 值不会跟着改。

## 参考

[html-attribute-vs-dom-property](https://dotnettutorials.net/lesson/html-attribute-vs-dom-property/)