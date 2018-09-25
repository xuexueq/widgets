// 画实心圆
function drawSolidCircle(ctx, color, x, y, radius) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true); // 2π rad = 360° true:逆时针画
    ctx.closePath();
    ctx.fill();
}

// 画空心圆
function drawHollowCircle(ctx, color, x, y, r){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
}

//画线段
function drawLine(ctx, color, x1, y1, x2, y2){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

/** 
* 获取 canvas 画布中的任一点相对 canvas 画布的位置坐标（以画布左上角为原点）
* @params {canvasElement} canvas canvas元素
* @params {number} x 相对于视口的 X 坐标
* @params {number} y 相对于视口的 Y 坐标
* @return {Object} 如：{x: 22,y:33}相对于canvas的位置坐标
*/
function getCanvasPoint(canvas, x, y) {
    let p = canvas.getBoundingClientRect(); // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置
    return {
        x: 2 * (x - p.left), // canvas 显示大小缩放为实际大小的 50%。为了让图形在 Retina 屏上清晰
        y: 2 * (y - p.top)
    }
}

/**
* 两点间的距离: 勾股定理
*/
function distancePoint(p1, p2) {
    let x = p1.x - p2.x;
    let y = p1.y - p2.y;
    return Math.sqrt(x * x + y * y);
}

export {
    drawSolidCircle,
    drawHollowCircle,
    drawLine,
    getCanvasPoint,
    distancePoint
}
