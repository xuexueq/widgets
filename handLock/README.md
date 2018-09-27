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