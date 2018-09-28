const defaultROptions = {
    container: null, // 创建canvas的容器，如果不填，自动在 body 上创建覆盖全屏的层
    focusColor: "#e06555", // 当前选中的圆的颜色
    fgColor: "#d6dae5", // 未选中的圆的颜色
    bgColor: "#fff", // canvas背景颜色
    n: 3, // 圆点的数量： n x n
    innerRadius: 20, // 圆点的内半径
    outerRadius: 50, // 圆点的外半径，focus 的时候显示
    minPoint: 4 // 移动线条至少过几个点 最小允许的点数
    // customStyle: false // 自定义样式 单独定义一个字段而不是去更改默认的配置属性
}

const defaultLOptions = {
    update: {
        beforeRepeat: function() {},
        afterRepeat: function() {}
    },
    check: {
        checked: function () {}
    }
}

export {
    defaultROptions,
    defaultLOptions
}