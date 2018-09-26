import Recorder from '@/component/recorder'

let recorder = new Recorder({
    container: document.querySelector('#main'), // 和使用 '#handlock' 是一样的 canvas 画布区域取得是 Math.min(宽, 高)
});
recorder.record();