### 组件如何使用
1. Recorder组件描述：

* 该组件如何调用：

```
1. 实例化
2. 传参
@params: {Object}; 
必传字段：container 该组件的父容器元素；
例如：{container: document.getElementById('#xx')}
```

* 暴露的API：

`record()`: 开始绘制图案。

```
对于组件开发，为了方便后续开发复用，对于有错误提示的结果也要返回。

@return {Promise}; resolve：{Object}; 例如：{err: null, records: ''}
(err:表示绘制图案出错（最小点数没有达到）; records: 点数坐标)
```

`clearPath()`: 清除上次绘制的图案，并初始化画布，以便调用 record()可直接进行绘制。
`cancel()`: 取消图案的绘制操作，后续无法在画布绘制。

2. Locker组件描述：

* 该组件如何调用：

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
* 暴露的API：

`update()`: 更新密码。结果由调用者控制，如何处理第一次绘制的结果，以及第二次绘制的结果。
`check`: 验证密码。结果由调用者控制。

### 设计思路
1. 为什么要设计三个canvas层
首先方便操作：每个层做各自的任务，当绘画前需要清空时，不会影响其他层的图案；
其次：渲染效率高
2. 移动端中 click 事件与 touch 事件有冲突，不能在同一区域监听同时监听这两个事件

#### webpack 4
1. `"extract-text-webpack-plugin": "^4.0.0-beta.0"`

### babel
1. `babel-preset-env`里没有对应的`babel-plugin-transform-object-rest-spread`这个 plugin,需要单独安装。
2. `babel-polyfill`和`transform-runtime`区别。