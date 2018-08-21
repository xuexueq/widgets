# widgets
一些小组件
1. slider

功能：图片轮播（自动轮播，并可配置是否需要可手动控制图片的轮播方向以及让任意某张图片停留）

做法：通过依赖注入的方式实现控制流部分，由外部框架（class外部）自动实例化该对象，并将需要的控制流逻辑方法传递到模块内。

使用：实例化Silder;是否注入依赖；开启开关进行自动轮播；
```
let slider = new Slider('my-slider');
// slider.registerPlugin(pluginController, pluginPrevious, pluginNext);
//slider.registerPlugin(pluginNext);
slider.start();
```

2. toggle

功能：鼠标点击进行切换样式

做法：抽离出 `toggle()` 方法，专注于状态的管理，状态切换代码逻辑封装；

使用：向 `toggle()` 方法中传入你需要的回调函数；
```
switcher.addEventListener('click', toggle(
    e => e.target.className = 'classname1',
    e => e.target.className = 'classname2',
    ...
    ...
    ...
    e => e.target.className = '初始类名'
));
```
