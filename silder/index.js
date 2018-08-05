/*
    思路：通过绝对定位将所有要轮播的图片堆叠到一张图片上，利用 opacity: 1 来控制显示哪一个图片；
    步骤：
        1. 确定每个图片在所有轮播图片中的序号；通过这个序号来确定它是否显示 or 隐藏；（所有轮播图元素的集合是一个 NodeList 类数组对象)；
        2. 首先找到 opacity: 1 的那张图片（即被 selected 展示在视野内的图片），将其完全透明化 opacity: 0; 再将需要显示的图片样式改成 opacity: 1；（所有的轮播图中只有一张图片是 opacity: 1， 其他样式都为 opacity: 0；通过更改类名实现样式的切换）；

    优化：
        1. 鼠标移入小圆点上方切换图片、点击上一张或者下一张图片认为切换图片时，要取消自动切换；否则或造成性能上的影响以及视觉上的卡顿；
        2. 
*/
class Slider{
    constructor(id, cycle = 3000) {
        this.container = document.getElementById(id);
        this.items = this.container.querySelectorAll('.slider-list__item, .slider-list__item--selected');
        this.cycle = cycle;
        this.init();
    }
    init() {
        this.bindEvent();
    }
    bindEvent() {
        const controller = this.container.querySelector('.slider-list__control');
        const buttons = controller.querySelectorAll('.slider-list__control-buttons--selected, .slider-list__control-buttons');
        const next = this.container.querySelector('.slider-list__next');
        const previous = this.container.querySelector('.slider-list__previous');

        /*
            mouseover 鼠标移入目标元素上方触发。鼠标移到其后代元素上时会触发（支持冒泡）。
            mousemove 鼠标在元素内部移到时不断触发。更耗资源，比如要监控鼠标坐标的变化等。
        */
        if(controller) {
            controller.addEventListener('mouseover', (e) => {
                console.log('e------controller', e, e.target)
                let idx = Array.from(buttons).indexOf(e.target);
                if(idx >= 0) {
                    this.stop();
                    this.slideTo(idx);
                }
            })

            controller.addEventListener('mouseout', () => {
                this.start();
            })

            // 图片轮播过程需要点亮对应的小圆点
            this.container.addEventListener('slide', (e) => {
                let idx = e.detail.index;
                let selected = controller.querySelector('.slider-list__control-buttons--selected');
                if(selected) selected.className = 'slider-list__control-buttons';
                if(buttons) buttons[idx].className = 'slider-list__control-buttons--selected';
            })
        }

        if(next) {
            next.addEventListener('click', (e) => {
                e.preventDefault();
                this.stop();
                this.slideNext();
            })
        }
        
        if(previous) {
            previous.addEventListener('click', (e) => {
                e.preventDefault();
                this.stop();
                this.slidePrevious();
            })
        }
    }
    getSelectedItem() {
        let selected = this.container.querySelector('.slider-list__item--selected');
        console.log('selected', selected)
        return selected;
    }
    getSelectedItemIndex() {
        let selected = this.getSelectedItem();
        const index = Array.from(this.items).indexOf(selected);
        return index;
    }
    slideTo(idx) {
        let selected = this.getSelectedItem();
        if(selected) {
            console.log('1')
            selected.className = 'slider-list__item';
        }
        let item = this.items[idx];
        if(item) {
            console.log(2)
            item.className = 'slider-list__item--selected';
        }

        // 图片轮播过程需要点亮对应的小圆点 使用自定义事件来触发

        /*
            自定义事件
            自定义事件的写法

            1、创建事件 有两种方式：
            var clickElem = new Event("clickElem");
            或者 clickElem = new CustomEvent("clickElem", {detail: {xxx: xxx}}) 这种方式的优点在于可以携带自定义数据，可在监听器中通过 detail 属性访问到
            2、注册事件监听器
            elem.addEventListener("clickElem",function(e){
              //干点事
            })
            3、触发事件
            elem.dispatchEvent(clickElem);

            优点：各模块之间低耦合
            缺点：不好定位问题，容易导致诡秘的错误。

            区别：浏览器事件是生产者依赖消费者；而自定义事件是消费者依赖生产者
            <https://segmentfault.com/q/1010000011997537>
        */
        let detail = {index: idx};
        let event = new CustomEvent('slide', {bubbles: true, detail});
        this.container.dispatchEvent(event);
    }
    slideNext() {
        let currentIndex = this.getSelectedItemIndex();
        let nextIndex = (currentIndex + 1) % this.items.length;
        this.slideTo(nextIndex);
    }
    slidePrevious() {
        let currentIndex = this.getSelectedItemIndex();
        let preIndex = (this.items.length + currentIndex -1) % this.items.length;
        this.slideTo(preIndex);
    }
    start() {
        this.stop(); /*先清除定时器*/
        this._timer = setInterval(() => {
            this.slideNext();
        }, this.cycle)
    }
    stop() {
        clearInterval(this._timer);
    }
}
let slider = new Slider('my-slider');
slider.start();