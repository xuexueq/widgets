import Recorder from './recorder'
import { defaultLOptions } from '@/common/config'

export default class Locker extends Recorder{
    static get ERR_PASSWORD_MISMATCH() {
        return 'password mismatch!';
    }
    constructor(options = {}) {
        options.check = {...defaultLOptions.check, ...options.check};
        options.update = {...defaultLOptions.update, ...options.update};
        // 深入一层拷贝，因为解构和 Object.assign 只能深拷贝一层
        super(options);
        // 在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。
        // 这是因为子类实例的构建，是基于对父类实例加工，只有super方法才能返回父类实例
    }
    async check(password) {
        let checked = this.options.check.checked;
        let res = await this.record();
        // await 后面跟的若是一个Promise对象，则会等待该Promise状态改变，即阻塞下面代码的执行 await表达式的值是resolve的结果;
        // 当然await后可以跟普通函数或表达式
        if(!res.err && res.records !== password) {
            res.err = new Error(Locker.ERR_PASSWORD_MISMATCH);
        }
        checked.call(this, res);
        this.check(); // 不断调用
        // return Promise.resolve(res);
    }
    async update() {
        let beforeRepeat = this.options.update.beforeRepeat;
        let afterRepeat = this.options.update.afterRepeat;
        let firstRes = await this.record();
        beforeRepeat.call(this, firstRes); // 第一次绘制的结果要输出出去（由调用者来决定错误结果和正确结果该如何处理）
        // 其实这里只需要将正确结果输出即可，错误的处理毕竟很单一 
        // 但是组件封装就是这样 方便后续开发复用
        if(firstRes.err) { // 第一次绘制有错误需要重新更新
            return this.update();
        }

        let secondRes = await this.record();
        if(!secondRes.err && secondRes.records !== firstRes.records) {
            secondRes.err = new Error(Locker.ERR_PASSWORD_MISMATCH);
        }
        
        afterRepeat.call(this, secondRes); // 把第二次绘制的结果输出出去（由调用者来决定错误结果和正确结果该如何处理）
        this.update();
    }
}