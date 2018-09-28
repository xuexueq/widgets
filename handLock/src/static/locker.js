/**
* 手势解锁实例
*/
import Locker from '@/component/locker'

let locker = new Locker({
    container: document.querySelector('#handlock'),
    check: {
        checked: (res) => {
            console.log(res);
        }
    },
    update: {
        /*
            这里beforeRepeat() afterRepeat()不要使用箭头函数 不然传入的this会失效
            箭头函数中的 this 是确定的值 无法通过call来改变内部this
        */
        beforeRepeat: function(res){
            this.clearPath();
            if(res.err) {
                console.log(res.err);
            } else {
                console.log('再一次输入');
            }
        },
        afterRepeat: function(res) {
            this.clearPath();
            if(res.err) {
                console.log(res.err);
            } else {
                console.log(res.records);
            }
        }
    }
})
//locker.check('11111');
locker.update();
/**
* 验证和更新密码可以不传入函数，需要内部的验证和更新密码函数返回一个结果即可。
* 这样会有一个问题，下次验证和更新需要手动调用该函数。这里的实现是，内部的验证和更新操作没有返回值，每次都会不断的调用自身
* 即这里通过传入回调函数的方式，把一些操作封装在组件的内部中进行调用
*/