# widgets
一些小组件
一、 slider

功能：图片轮播（自动轮播，并可配置是否需要可手动控制图片的轮播方向以及让任意某张图片停留）

做法：通过依赖注入的方式实现控制流部分，由外部框架（class外部）自动实例化该对象，并将需要的控制流逻辑方法传递到模块内。

使用：实例化Silder;是否注入依赖；开启开关进行自动轮播；
```
let slider = new Slider('my-slider');
// slider.registerPlugin(pluginController, pluginPrevious, pluginNext);
//slider.registerPlugin(pluginNext);
slider.start();
```

二、 toggle

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

三、 handLock

功能：手势解锁（包括手指绘制、密码验证、密码更新）

做法：es6 组件化开发；canvas绘图；Promise、Async/Await异步操作

使用：

1. **Recorder组件组件如何使用**：

```
1. 实例化
2. 传参
@params: {Object}; 
必传字段：container 该组件的父容器元素；
例如：{container: document.getElementById('#xx')}
```

**暴露的API**：

* `record()`: 开始绘制图案。

```
对于组件开发，为了方便后续开发复用，对于有错误提示的结果也要返回。

@return {Promise}; resolve：{Object}; 例如：{err: null, records: ''}
(err:表示绘制图案出错（最小点数没有达到）; records: 点数坐标)
```

* `clearPath()`: 清除上次绘制的图案，并初始化画布，以便调用 record()可直接进行绘制。
* `cancel()`: 取消图案的绘制操作，后续无法在画布绘制。

2. **Locker组件组件如何使用**：

```
1. 实例化
2. 传参
@params: {Object}; 回调（对结果如何处理，包括错误 or 正确）
必传字段：
container: '', 该组件的如容器元素
check: {checked: function(){}}, 验证密码的回调
update: {beforeRepeat: function(){}, afterRepeat: function(){}} 更新密码的回调: 两次绘制结果的回调
要求：回调函数的声明不允许使用箭头函数！
```

**暴露的API**：

* `update()`: 更新密码。结果由调用者控制，如何处理第一次绘制的结果，以及第二次绘制的结果。
* `check`: 验证密码。结果由调用者控制。
