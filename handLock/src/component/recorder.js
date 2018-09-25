import { defaultROptions } from '@/common/config';
import { drawSolidCircle, drawHollowCircle, getCanvasPoint, distancePoint } from '@/common/utils'

export default class Recorder {
    constructor(options) {
        this.options = {...defaultROptions, ...options};
        // this.options = Object.assign({}, defaultROptions, options);这两种方式都只能深拷贝第一层的数据。
        this.render();
    }
    render() {
        // 创建 canvas 的容器，考虑到这个容器参数不传因此做好兼容
        let options = this.options;
        let container = options.container || document.createElement('div');
        if(!options.container) {
            Object.assign(container.style, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                lineHeight: '100%',
                backgroundColor: options.bgColor
            });
            document.body.appendChild(container);
        }
        this.container = container;

        // 绘制 canvas 画布（空间）: 2 倍大小，为了支持 retina 屏
        let { width, height } = this.container.getBoundingClientRect();
        let circleCanvas = document.createElement('canvas'); // 最外层的 canvas
        circleCanvas.width = circleCanvas.height = 2 * (Math.min(width, height));
        Object.assign(circleCanvas.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.5)'
        });
        let lineCanvas = circleCanvas.cloneNode(true);
        let moveCanvas = circleCanvas.cloneNode(true); // 是否采用深度克隆,如果为true,则该节点的所有后代节点也都会被克隆,如果为false,则只克隆该节点本身.
        container.appendChild(lineCanvas); // 移动线条 在最底层
        container.appendChild(moveCanvas); // 移动线条 中间层
        container.appendChild(circleCanvas); // 画圆点线条 最上层

        this.lineCanvas = lineCanvas;
        this.moveCanvas = moveCanvas;
        this.circleCanvas = circleCanvas;

        this.container.addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, {
            passive: false
        }) // 移动端本身有滚动功能，所有要取消默认行为 不写 passive: false或者值为 true 无法阻止默认行为

        // 渲染画布的初始图案 在这之前要先清除上次绘画的路径
        this.clearPath();
    }
    clearPath() {
        if(!this.circleCanvas) this.render();
        // 访问 canvas 绘画上下文进行画图操作
        let { circleCanvas, lineCanvas, moveCanvas } = this;
        let circleCtx = circleCanvas.getContext('2d');
        let lineCtx = lineCanvas.getContext('2d');
        let moveCtx = moveCanvas.getContext('2d');
        this.circleCtx = circleCtx;
        this.lineCtx = lineCtx;
        this.moveCtx = moveCtx;

        // 先清空画布内容
        let width = circleCanvas.width;
        circleCtx.clearRect(0, 0, width, width);
        lineCtx.clearRect(0, 0, width, width);
        moveCtx.clearRect(0, 0, width, width);

        // drawCircleCenters 圆心的位置将画布均分
        // 绘制九个内圆（未选中的圆），并且保存圆点的中心坐标，并把圆点的行列位置进行保存
        let { n, fgColor, innerRadius } = this.options; // let
        let range = Math.round(width / (n + 1));
        let circles = [];
        for(let i = 1; i <= n; i++) {
            for(let j = 1; j <= n; j++) {
                let x = i * range;
                let y = j * range;
                drawSolidCircle(circleCtx, fgColor, x, y, innerRadius);
                let circlePoint = { x, y };
                circlePoint.pos = [i, j];
                circles.push(circlePoint);
            }
        }
        this.circles = circles;
    }
    record() {
        let {
            circleCanvas,
            circleCtx,
        } = this;
        let {
            bgColor,
            focusColor,
            outerRadius,
            innerRadius
        } = this.options;

        // 使用箭头函数 使能获取到 Recorder 对象实例
        const handler = e => {
            let { clientX, clientY } = e.touches[0]; // clientX: 返回触点相对于可见视区(visual viewport)左边沿的的X坐标. 不包括任何滚动偏移.这个值会根据用户对可见视区的缩放行为而发生变化.
            let touchPoint = getCanvasPoint(circleCanvas, clientX, clientY);
            for(let i = 0, len = this.circles.length; i < len; i++) {
                let point = this.circles[i];
                let x0 = point.x;
                let y0 = point.y;
                if(distancePoint(touchPoint, point) < outerRadius) {
                    // drawFocusCircle 画选中的圆 先把未选中的圆抹掉（通过再画一个和背景色相同的圆进行将其覆盖掉）
                    drawSolidCircle(circleCtx, bgColor, x0, y0, outerRadius); 
                    drawSolidCircle(circleCtx, focusColor, x0, y0, innerRadius);
                    drawHollowCircle(circleCtx, focusColor, x0, y0, outerRadius);
                }
            }
        }
        circleCanvas.addEventListener('touchstart', () => {
            this.clearPath(); // 每次touch的时候先清空画布
        })
        circleCanvas.addEventListener('touchstart', handler);
        circleCanvas.addEventListener('touchmove', handler);
    }
}