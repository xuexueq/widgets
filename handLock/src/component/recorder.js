import { defaultROptions } from '@/common/config';
import { 
    drawSolidCircle, 
    drawHollowCircle, 
    drawLine, 
    getCanvasPoint, 
    distancePoint
} from '@/common/utils'

export default class Recorder {
    static get ERR_NOT_ENOUGH_POINTS() {
        return 'not enough points';
    }
    static get ERR_NO_TASK() {
        return 'no task';
    }
    static get ERR_USER_CANCELED() {
        return 'user canceled';
    }
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

    cancel() {
        this.recordingTask && this.recordingTask.cancel();
        // return Promise.resolve({err: new Error(Recorder.ERR_NO_TASK)});
    }
    /**
    * 这里用 async 表示该函数返回的是一个 Promise 对象
    * 触点移动的过程中this.circles九个圆点会根据选中的圆点依次移除；
    * 每次开始touch的时候先清空画布，既保证了this.circles这时是九个完整的圆点可触；
    * 1. 画圆
    * 2. 画固定线条
    * 3. 画移动线条
    */
    async record() {
        this.cancel();

        let {
            circleCanvas,
            moveCanvas,
            circleCtx,
            moveCtx,
            lineCtx,
            options
        } = this;
        let {
            bgColor,
            focusColor,
            outerRadius,
            innerRadius,
            minPoint
        } = options; // options

        // 使用箭头函数 使能获取到 Recorder 对象实例
        let records = [];
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

                    // 画固定线条 由于circlesCtx在lineCtx的上层，所以固定线条从圆心为起点到半径那一部分的线段会被覆盖掉
                    if(records.length) {
                        let lineStartPoint = records[records.length - 1];
                        let x1 = lineStartPoint.x;
                        let y1 = lineStartPoint.y;
                        drawLine(lineCtx, focusColor, x1, y1, x0, y0);
                    }
                    let circles = this.circles.splice(i, 1);
                    records.push(circles[0]); // 记录手指触到的触点坐标，并删除该触点，表示此次touch不再触到该触点 splice删除掉的元素是在一个数组中
                    break; // 不加会报错，
                }
            }

            // 画移动线条
            if(records.length) {
                let moveLineStartPoint = records[records.length - 1];
                let x1 = moveLineStartPoint.x;
                let y1 = moveLineStartPoint.y;
                let x2 = touchPoint.x;
                let y2 = touchPoint.y;
                moveCtx.clearRect(0, 0, moveCanvas.width, moveCanvas.height); // 每次画移动线条前先清空
                drawLine(moveCtx, focusColor, x1, y1, x2, y2);
            }
        }
        circleCanvas.addEventListener('touchstart', () => {
            this.clearPath(); // 每次touch的时候先清空画布
        })
        circleCanvas.addEventListener('touchstart', handler);
        circleCanvas.addEventListener('touchmove', handler);

        // touchend时把本次的记录结果输出 考虑到要用这个结果后续来做验证更新等 即验证密码要用到手势记录的值，
        // 因此将手势触点这一动作放入一个Promise中 并将记录的结果 resolve 出去
        // 由于 touchend的时候才算本次触点结束，即Promise异步操作的结束取决于什么时候touchend 只需将touchend放入Promise执行器即可
        // touchend时，将结果resolve出去等待后续操作处理本次结果，移除所有的监听事件是为了在没有处理该结果前不允许再次绘画
        let recordingTask = {};
        let promise = new Promise((resolve, reject) => {
            /**
            * 取消手势记录行为，
            * 之所以把 cancel 事件写在 Promise 内部，是因为需要拿到同一个监听事件 handler 和 done
            * cancel 事件放在 done监听事件之前，函数表达式不会提升, done 中要保证移除改事件
            * @return {Promise}
            */
            recordingTask.cancel = () => {
                this.recordingTask = null; 
                // 置为 null, 毕竟是 record 函数返回出去的函数，此时 cancel与 record形成一个闭包。防止内存泄漏！！！
                circleCanvas.removeEventListener('touchstart', handler);
                circleCanvas.removeEventListener('touchmove', handler);
                document.removeEventListener('touchend', done);
            };
            
            const done = () => {
                if(!records.length) return;
                moveCtx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);
                circleCanvas.removeEventListener('touchstart', handler);
                circleCanvas.removeEventListener('touchmove', handler);
                // circleCanvas.removeEventListener('touchend', done); // touchend也要移除，否则会执行
                document.removeEventListener('touchend', done);

                let err = records.length < minPoint ? new Error(Recorder.ERR_NOT_ENOUGH_POINTS) : null;
                resolve({
                    err,
                    records: (records.map(item => item.pos.join(''))).join('')
                });
                this.recordingTask = null; // 除非手动调用cancel，将不会返回该事件。闭包，防止内存泄漏。
            };
            circleCanvas.addEventListener('touchend', done);
        });
        this.recordingTask = recordingTask;
        return promise;
    }
}