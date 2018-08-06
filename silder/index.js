/*
    思路：通过绝对定位将所有要轮播的图片堆叠到一张图片上，利用 opacity: 1 来控制显示哪一个图片；
    步骤：
        1. 确定每个图片在所有轮播图片中的序号；通过这个序号来确定它是否显示 or 隐藏；（所有轮播图元素的集合是一个 NodeList 类数组对象)；
        2. 首先找到 opacity: 1 的那张图片（即被 selected 展示在视野内的图片），将其完全透明化 opacity: 0; 再将需要显示的图片样式改成 opacity: 1；（所有的轮播图中只有一张图片是 opacity: 1， 其他样式都为 opacity: 0；通过更改类名实现样式的切换）；

    优化：
        1. 采用自定义事件切换小圆点的状态，降低代码结构的耦合性；
        2. 将控制流部分（两个箭头切换、小圆点切换）当做三个插件，这部分复杂代码逻辑抽离出来，通过注入依赖的方式实现；做到对组件使用的灵活配置；（这三个插件功能是否调用，交给使用者决定）
        3. TODO: 控制流部分的灵活使用，应关联上 html 结构的变化 （不配置三个插件，对应的 html 结构也应该不显示）
*/
class Slider{
    constructor(id, cycle = 3000) {
        this.container = document.getElementById(id);
        this.items = this.container.querySelectorAll('.slider-list__item, .slider-list__item--selected');
        this.cycle = cycle;
    }
    /*
        简化构造函数 constructor() {}
        
        扩展操作符：用于函数调用

        function add(x, y) {
          return x + y;
        }

        const numbers = [4, 38];
        add(...numbers) // 42
    */
    registerPlugin(...plugins) {
        console.log(this);
        /*
            ![this](https://upload-images.jianshu.io/upload_images/4273576-adf696552dcb5085.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

            Class 中的方法是定义在原型中的； constructor 为构造函数；
        */

        plugins.forEach((plugin) => {
            plugin(this);
        });
    }
    getSelectedItem() {
        let selected = this.container.querySelector('.slider-list__item--selected');
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
            selected.className = 'slider-list__item';
        }
        let item = this.items[idx];
        if(item) {
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

/*
    把作为组件中复杂的功能逻辑（控制流部分）抽离出来，四个小圆点、上一张和下一张当做三个插件，注册插件时将创建其插件的slide注入插件函数（避免过度依赖）
    这样保证删除三个插件种的任一个，不影响组件的使用

    问题：删除任一插件，组件 html 部分应该也跟着删除；
*/
function pluginController(slider) {
    const controller = slider.container.querySelector('.slider-list__control');
    const buttons = controller.querySelectorAll('.slider-list__control-buttons--selected, .slider-list__control-buttons');

    /*
        mouseover 鼠标移入目标元素上方触发。鼠标移到其后代元素上时会触发（支持冒泡）。
        mousemove 鼠标在元素内部移到时不断触发。更耗资源，比如要监控鼠标坐标的变化等。
    */
    if(controller) {
        controller.addEventListener('mouseover', (e) => {
            let idx = Array.from(buttons).indexOf(e.target);
            if(idx >= 0) {
                slider.stop(); /*否则鼠标移上去不动，会进行自动轮播*/
                slider.slideTo(idx);
            }
        })

        controller.addEventListener('mouseout', () => {
            slider.start();
        })

        // 图片轮播过程需要点亮对应的小圆点
        slider.container.addEventListener('slide', (e) => {
            let idx = e.detail.index;
            let selected = controller.querySelector('.slider-list__control-buttons--selected');
            if(selected) selected.className = 'slider-list__control-buttons';
            if(buttons) buttons[idx].className = 'slider-list__control-buttons--selected';
        })
    }
}

function pluginPrevious(slider) {
    const previous = slider.container.querySelector('.slider-list__previous');
    if(previous) {
        previous.addEventListener('click', (e) => {
            e.preventDefault();
            slider.stop();
            slider.slidePrevious();
            slider.start();
        })
    }
}

function pluginNext(slider) {
    const next = slider.container.querySelector('.slider-list__next');
    if(next) {
        next.addEventListener('click', (e) => {
            e.preventDefault();
            slider.stop();
            slider.slideNext();
            slider.start();
        })
    }
}

let slider = new Slider('my-slider');
// slider.registerPlugin(pluginController, pluginPrevious, pluginNext);
slider.registerPlugin(pluginNext);
slider.start();

/*
    使用自定义事件的好处：代码之间的低耦合；
    例如：在轮播区外的部分做一个数据同步；
*/
document.addEventListener('slide', (e) => {
    other.innerHTML = `第${e.detail.index + 1}张`
})