import Recorder from '@/component/recorder'

let recorder = new Recorder({
    container: document.querySelector('#main'), // 和使用 '#handlock' 是一样的 canvas 画布区域取得是 Math.min(宽, 高)
});

// 只要是 resolve 出的结果 拿到后便可继续重新绘画(通过再次调用record()方法)
const recordFun = (result) => {
    console.log(result.records)
    if(result.err) {
        recorder.clearPath(); // 有错误立即清空画布，表示绘制不成功；反之图案会留在画布上直到下次绘制前清空
        console.log(result.err);
        recorder.record().then(recordFun);
    } else {
        recorder.record().then(recordFun);
    }
}

recorder.record().then(recordFun);

// 一旦点击取消按钮 变不能再次绘画了 直到点击record按钮可再次绘画
let recordEle = document.querySelector('#record');
let cancelEle = document.querySelector('#cancel');

recordEle.addEventListener('click', () => {
    console.log('record enabled')
    recorder.record().then(recordFun);
});
cancelEle.addEventListener('click', ()=> {
    recorder.clearPath();
    recorder.cancel();
    console.log(recorder.cancel())
})

/**
* 这里页面渲染完成会自动调用record()方法，以便可以直接绘制；另外点击record按钮也会调用record()方法，
* 所以说当下面这种场景会出现一个bug: 
* 当点击n(n>=2)次record按钮的时候（或者页面刚渲染完毕直接点击record按钮），绘制会出现一条从起始触点到终止触点的移动线段，并在控制台打印出not enough points 的错误。
* 原因：连续调用两次record方法，会导致前一个record方法中注册的监听事件handler没有被移除（不点击record按钮，再次绘制没有这个bug，是因为touchend时删除了所有的监听事件），
* 所以解决办法是：每次调用record()方法时，先调用cancel()方法，移除所有的监听事件

* 这里因为移除监听事件需要的是同一个回调函数，所以吧cancel函数放在return中了，注意处理闭包导致的内存占用问题
* touchend 时，移除cancel的引用（这里想想为什么，移除后下次还能调用到cancel）
*/

