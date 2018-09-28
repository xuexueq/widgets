// 入口文件可改为static文件下的文件，为了调试 recorder.html页面

import Locker from '@/component/locker';

let locker = new Locker({
    container: document.querySelector('#handlock'),
    check: {
        checked: function(res) {
            locker.clearPath();
            if(res.err) {
                if(res.err.message === Locker.ERR_PASSWORD_MISMATCH) {
                    hint.innerHTML = '密码错误，请重新绘制！';
                } else {
                    toast.className = 'show';
                    setTimeout(() => {
                        toast.className = 'hide';
                    }, 1000);
                }
            } else {
                hint.innerHTML = '密码正确！';
            }
        }
    },
    update: {
        beforeRepeat: function(res) {
            locker.clearPath();
            if(res.err) {
                toast.className = 'show';
                setTimeout(() => {
                    toast.className = 'hide';
                }, 1000);
            } else {
                hint.innerHTML = '请再次绘制相同图案';
            }
        },
        afterRepeat: function(res) {
            locker.clearPath();
            if(res.err) {
                if(res.err.message === Locker.ERR_PASSWORD_MISMATCH) {
                    hint.innerHTML = '密码错误，请重新绘制！';
                } else {
                    toast.className = 'show';
                    setTimeout(() => {
                        toast.className = 'hide';
                    }, 1000);
                }
            } else {
                hint.innerHTML = '密码更新成功！';
                localStorage.setItem('handlock_psw', res.records);
                checkmode.checked = 'checked'; // change事件是被代理到父元素上的，所以这里要触发change事件需要发生冒泡行为
                // checkmode.click();
            }
        }
    }
});

let password = localStorage.getItem('handlock_psw') || '11121323'; // 初始密码
locker.check('11121323');

selectMode.addEventListener('change', (e) => {
    let type = e.target.value;
    if(type === 'check') {
        hint.innerHTML = '验证密码，请绘制密码图案';
        locker.check(password);
    } else if (type === 'update') {
        hint.innerHTML = '设置密码，请绘制密码图案';
        locker.update();
    }
});