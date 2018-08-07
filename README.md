# widgets
一些小组件
1. 
2. 功能：鼠标点击进行切换样式
抽离出 `toggle()` 方法，专注于状态的管理，状态切换代码逻辑封装；

使用：向 `toggle()` 方法中传入你要切换的样式类名；
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
