/*
    通过数组的两个方法 shift() push() 轮流切换状态（这里可以使用生成器函数来切换状态） 每次执行 toggle() 参数中第一项
    使 js 代码主要专注于状态的切换 做到代码的可复用性-----（可加入多个状态）

    指令式与声明式编程（函数式编程）
    指令式编程倾向于怎么做、声明式编程倾向于做什么
*/

// function toggle(...actions) {
//     return function(...args) {
//         console.log(...args);
//         let action = actions.shift();
//         actions.push(action);
//         return action.apply(this, args);
//     }
// }

function * loop(list, max=Infinity) {
    for(let i=0; i<max;i++) {
        yield list[i % list.length];
    }
    // let i = 0;
    // while(i<max) {
    //     yield list[i++ % list.length];
    // }
}

function toggle(...actions) {
    let gen = loop(actions);
    // wrong: let gen = loop(actions).next();
    return function(...args) {
        return gen.next().value.apply(this, args);
    }
}

// switcher.addEventListener('click', toggle(
//     e => e.target.className = 'off',
//     e => e.target.className = 'on'
// ));

switcher.addEventListener('click', toggle(
    e => e.target.className = 'off',
    e => e.target.className = 'warn',
    e => e.target.className = 'on'
));
