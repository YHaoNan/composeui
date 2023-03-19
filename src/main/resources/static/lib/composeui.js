/**
 * ComposeUI是一个简单的，甚至只用了不到二百行代码实现的JS响应式UI框架
 * 是Jetpack Compose编程思想在JS中的一次尝试。
 * 
 * 在ComposeUI中，UI组件被封装成可复用的函数，带来HTML难以实现的灵活性与复用性，并最大程度保证API的简洁
 * 使用ComposeUI，任何JS提供的功能都可以被你用来构建UI，比如流程控制、函数式编程等各种强大的功能
 * 
 * ComposeUI提供Observable类以实现响应式编程功能
 * 
 * Author: [YHaoNan](https://cnblogs.com/lilpig)
 */


/**
 * 一个composable UI函数的任务如下：
 *  创建(或找到)自己代表的元素
 *  将所有子元素挂载到自己之下
 *  设置属性
 *  返回自己代表的元素
 * 
 * 一个composable UI函数可以有任意多个参数，它将这样解析它们：
 *  1. 若参数是HTMLElement —— 挂载到自己之下
 *  2. 若参数是Text或String -- 作为自己的内部文本
 *  3. 若参数是Reactive    -- 监控其中的observer，并负责生成子元素
 *  4. 若参数是Model       -- 跳过，Model由Composable自行处理，完成双向数据绑定
 *  5. 若参数是Bind        -- 跳过，Bind由Composable自行处理，完成单向数据绑定
 *  6. 若参数是Array       -- 当作HTMLElement数组处理并忽略其他类型数据，当内部仍是一个列表时
 *  7. 若参数是Object      -- 当作要注入到自己身上的属性处理
 */
function _create_composable_ui_func() {
    let el = arguments[0];
    for (let i in arguments) {
        if (i==0) continue; // skip el

        let arg = arguments[i];
        
        // 字符串当作text处理
        if (typeof arg === 'string') {
            arg = text(arg);
        }

        if (__is_vaild_composable_element(arg)) {
            el.appendChild(arg);
        } else if (arg instanceof Reactive) {
            let {observable, composable_builder} = arg;
            let parent = el;
            let eles = __build_composable(composable_builder, observable.get());
            __append_all_to_parent(eles, parent);
            observable.observe((newval) => {
                // 1. 将原始的eles从父组件中清除
                // 2. 重新构建这些组件
                // 3. 重新挂载新的组件到它们的父组件中
                __remove_all_from_parent(eles, parent);
                eles = __build_composable(composable_builder, newval);
                __append_all_to_parent(eles, parent);
            });
        } else if(arg instanceof Model || arg instanceof Bind) {
            continue;
        } else if (arg instanceof Array) {
            for (let e of arg) {
                if (__is_vaild_composable_element(e)) el.appendChild(e);
            }
        } else if (arg instanceof Object) {
            for (let k in arg) {
                // 处理prop
                if (k === 'prop') {
                    let propObj = arg[k];
                    for (let propK in propObj) {
                        el[propK] = propObj[propK];
                    }
                    continue;
                }

                if (!handleEventAttributes(el, k, arg[k])) {
                    el.setAttribute(k, arg[k]);
                }
            }
        }
    }
    return el;
}

const _event_table = {
    'onclick': (el, callback) => el.onclick = callback,
    'oninput': (el, callback) => el.oninput = callback,
    'onchange': (el, callback) => el.onchange = callback,
}

function handleEventAttributes(el, ename, callback) {
    if (ename in _event_table) {
        _event_table[ename](el, callback);
        return true;
    }
    return false;
}

function items(v, mapfn) {
    return v.map(mapfn);
}

// hardcode
function doc() { return _create_composable_ui_func(document, ...arguments); }
function head() { return _create_composable_ui_func(document.head, ...arguments); }
function body() { return _create_composable_ui_func(document.body, ...arguments); }
function title() { return _create_composable_ui_func(document.createElement('title'), ...arguments); }
function base() { return _create_composable_ui_func(document.createElement('base'), ...arguments); }
function link() { return _create_composable_ui_func(document.createElement('link'), ...arguments); }
function meta() { return _create_composable_ui_func(document.createElement('meta'), ...arguments); }
function style() { return _create_composable_ui_func(document.createElement('style'), ...arguments); }
function script() { return _create_composable_ui_func(document.createElement('script'), ...arguments); }
function noscript() { return _create_composable_ui_func(document.createElement('noscript'), ...arguments); }
function template() { return _create_composable_ui_func(document.createElement('template'), ...arguments); }
function section() { return _create_composable_ui_func(document.createElement('section'), ...arguments); }
function nav() { return _create_composable_ui_func(document.createElement('nav'), ...arguments); }
function article() { return _create_composable_ui_func(document.createElement('article'), ...arguments); }
function aside() { return _create_composable_ui_func(document.createElement('aside'), ...arguments); }
function h1() { return _create_composable_ui_func(document.createElement('h1'), ...arguments); }
function h2() { return _create_composable_ui_func(document.createElement('h2'), ...arguments); }
function header() { return _create_composable_ui_func(document.createElement('header'), ...arguments); }
function footer() { return _create_composable_ui_func(document.createElement('footer'), ...arguments); }
function address() { return _create_composable_ui_func(document.createElement('address'), ...arguments); }
function main() { return _create_composable_ui_func(document.createElement('main'), ...arguments); }
function p() { return _create_composable_ui_func(document.createElement('p'), ...arguments); }
function hr() { return _create_composable_ui_func(document.createElement('hr'), ...arguments); }
function pre() { return _create_composable_ui_func(document.createElement('pre'), ...arguments); }
function blockquote() { return _create_composable_ui_func(document.createElement('blockquote'), ...arguments); }
function ol() { return _create_composable_ui_func(document.createElement('ol'), ...arguments); }
function ul() { return _create_composable_ui_func(document.createElement('ul'), ...arguments); }
function li() { return _create_composable_ui_func(document.createElement('li'), ...arguments); }
function dl() { return _create_composable_ui_func(document.createElement('dl'), ...arguments); }
function dt() { return _create_composable_ui_func(document.createElement('dt'), ...arguments); }
function dd() { return _create_composable_ui_func(document.createElement('dd'), ...arguments); }
function figure() { return _create_composable_ui_func(document.createElement('figure'), ...arguments); }
function figcaption() { return _create_composable_ui_func(document.createElement('figcaption'), ...arguments); }
function div() { return _create_composable_ui_func(document.createElement('div'), ...arguments); }
function a() { return _create_composable_ui_func(document.createElement('a'), ...arguments); }
function em() { return _create_composable_ui_func(document.createElement('em'), ...arguments); }
function strong() { return _create_composable_ui_func(document.createElement('strong'), ...arguments); }
function small() { return _create_composable_ui_func(document.createElement('small'), ...arguments); }
function s() { return _create_composable_ui_func(document.createElement('s'), ...arguments); }
function cite() { return _create_composable_ui_func(document.createElement('cite'), ...arguments); }
function q() { return _create_composable_ui_func(document.createElement('q'), ...arguments); }
function dfn() { return _create_composable_ui_func(document.createElement('dfn'), ...arguments); }
function abbr() { return _create_composable_ui_func(document.createElement('abbr'), ...arguments); }
function data() { return _create_composable_ui_func(document.createElement('data'), ...arguments); }
function time() { return _create_composable_ui_func(document.createElement('time'), ...arguments); }
function code() { return _create_composable_ui_func(document.createElement('code'), ...arguments); }
function var_() { return _create_composable_ui_func(document.createElement('var_'), ...arguments); }
function samp() { return _create_composable_ui_func(document.createElement('samp'), ...arguments); }
function kbd() { return _create_composable_ui_func(document.createElement('kbd'), ...arguments); }
function sub() { return _create_composable_ui_func(document.createElement('sub'), ...arguments); }
function i() { return _create_composable_ui_func(document.createElement('i'), ...arguments); }
function b() { return _create_composable_ui_func(document.createElement('b'), ...arguments); }
function u() { return _create_composable_ui_func(document.createElement('u'), ...arguments); }
function mark() { return _create_composable_ui_func(document.createElement('mark'), ...arguments); }
function ruby() { return _create_composable_ui_func(document.createElement('ruby'), ...arguments); }
function rt() { return _create_composable_ui_func(document.createElement('rt'), ...arguments); }
function rp() { return _create_composable_ui_func(document.createElement('rp'), ...arguments); }
function bdi() { return _create_composable_ui_func(document.createElement('bdi'), ...arguments); }
function bdo() { return _create_composable_ui_func(document.createElement('bdo'), ...arguments); }
function span() { return _create_composable_ui_func(document.createElement('span'), ...arguments); }
function br() { return _create_composable_ui_func(document.createElement('br'), ...arguments); }
function wbr() { return _create_composable_ui_func(document.createElement('wbr'), ...arguments); }
function ins() { return _create_composable_ui_func(document.createElement('ins'), ...arguments); }
function del() { return _create_composable_ui_func(document.createElement('del'), ...arguments); }
function img() { return _create_composable_ui_func(document.createElement('img'), ...arguments); }
function iframe() { return _create_composable_ui_func(document.createElement('iframe'), ...arguments); }
function embed() { return _create_composable_ui_func(document.createElement('embed'), ...arguments); }
function object() { return _create_composable_ui_func(document.createElement('object'), ...arguments); }
function param() { return _create_composable_ui_func(document.createElement('param'), ...arguments); }
function video() { return _create_composable_ui_func(document.createElement('video'), ...arguments); }
function audio() { return _create_composable_ui_func(document.createElement('audio'), ...arguments); }
function source() { return _create_composable_ui_func(document.createElement('source'), ...arguments); }
function track() { return _create_composable_ui_func(document.createElement('track'), ...arguments); }
function canvas() { return _create_composable_ui_func(document.createElement('canvas'), ...arguments); }
function map() { return _create_composable_ui_func(document.createElement('map'), ...arguments); }
function area() { return _create_composable_ui_func(document.createElement('area'), ...arguments); }
function svg() { return _create_composable_ui_func(document.createElement('svg'), ...arguments); }
function math() { return _create_composable_ui_func(document.createElement('math'), ...arguments); }
function table() { return _create_composable_ui_func(document.createElement('table'), ...arguments); }
function caption() { return _create_composable_ui_func(document.createElement('caption'), ...arguments); }
function colgroup() { return _create_composable_ui_func(document.createElement('colgroup'), ...arguments); }
function col() { return _create_composable_ui_func(document.createElement('col'), ...arguments); }
function tbody() { return _create_composable_ui_func(document.createElement('tbody'), ...arguments); }
function thead() { return _create_composable_ui_func(document.createElement('thead'), ...arguments); }
function tfoot() { return _create_composable_ui_func(document.createElement('tfoot'), ...arguments); }
function tr() { return _create_composable_ui_func(document.createElement('tr'), ...arguments); }
function td() { return _create_composable_ui_func(document.createElement('td'), ...arguments); }
function th() { return _create_composable_ui_func(document.createElement('th'), ...arguments); }
function form() { return _create_composable_ui_func(document.createElement('form'), ...arguments); }
function fieldset() { return _create_composable_ui_func(document.createElement('fieldset'), ...arguments); }
function legend() { return _create_composable_ui_func(document.createElement('legend'), ...arguments); }
function label() { return _create_composable_ui_func(document.createElement('label'), ...arguments); }
function input() {
    let el = _create_composable_ui_func(document.createElement('input'), ...arguments);
    for (let arg of arguments) {
        if (__handle_bind_and_model_on_form_elements(el, arg)) break;
    }
    return el;
}
function button() { return _create_composable_ui_func(document.createElement('button'), ...arguments); }
function select() {
    let el = _create_composable_ui_func(document.createElement('select'), ...arguments);
    for (let arg of arguments) {
        if (__handle_bind_and_model_on_form_elements(el, arg)) break;
    }
    return el;
}
function datalist() { return _create_composable_ui_func(document.createElement('datalist'), ...arguments); }
function optgroup() { return _create_composable_ui_func(document.createElement('optgroup'), ...arguments); }
function option() { return _create_composable_ui_func(document.createElement('option'), ...arguments); }
function textarea() { return _create_composable_ui_func(document.createElement('textarea'), ...arguments); }
function keygen() { return _create_composable_ui_func(document.createElement('keygen'), ...arguments); }
function output() { return _create_composable_ui_func(document.createElement('output'), ...arguments); }
function progress() { return _create_composable_ui_func(document.createElement('progress'), ...arguments); }
function meter() { return _create_composable_ui_func(document.createElement('meter'), ...arguments); }
function details() { return _create_composable_ui_func(document.createElement('details'), ...arguments); }
function summary() { return _create_composable_ui_func(document.createElement('summary'), ...arguments); }
function menuitem() { return _create_composable_ui_func(document.createElement('menuitem'), ...arguments); }
function menu() { return _create_composable_ui_func(document.createElement('menu'), ...arguments); }
function spacer_hori(px) { return span({style: `display:inline-block;width: ${px}px`}); }
function spacer_vert(px) { return div({style: `height: ${px}px`}); }
function text(data) { return document.createTextNode(data); }

/**
 * composableui初始化方法
 * 
 * @param {*} ctx composable ui上下文对象
 *                {
 *                  mount: 一个selector，composableui将composable挂载到这个selector匹配的所有元素上
 *                  composable: 要挂载的composable函数，注意，它不能是已经执行完的函数返回值，必须是一个无参的composable函数
 *                  onmountd: 当挂载完成 (非必要)
 *                  ondestroy: 生命周期结束 (非必要)
 *                }
 */
function composeui(ctx) {
    window.onload = function() {
        // 向所有挂载点挂载
        let mount_points = document.querySelectorAll(ctx.mount);
        for (let mp of mount_points) {
            _create_composable_ui_func(mp, ctx.composable());
        }

        if (ctx.onmounted) ctx.onmounted();
    }

    window.onbeforeunload = function() {
        if (ctx.ondestroy) ctx.ondestroy();
    }
}

function __is_vaild_composable_element(ele) {
    return ele instanceof HTMLElement || ele instanceof Text;
}

function __build_composable(builder, val) {
    // first build call
    let composables = builder(val);
    if (__is_vaild_composable_element(composables)) {
        composables = [composables]; // to list
    }
    if (!(composables instanceof Array)) {
        return [];
    }
    return composables.filter(c => __is_vaild_composable_element(c));
}

function __remove_all_from_parent(eles, parent) {
    if (eles.length <= 0) return;
    for (let ele of eles) {
        parent.removeChild(ele);
    }
}

function __append_all_to_parent(eles, parent) {
    if (eles.length <= 0) return;
    for (let ele of eles) {
        parent.appendChild(ele);
    }
}

function __handle_bind_and_model_on_form_elements(el, arg) {
    if (arg instanceof Model || arg instanceof Bind) {
        // 首次将el.value和observable的值绑定
        el.value = arg.observable.get();
        // 在select中，当内部被添加option时，浏览器会自动选择第一个option作为select的选择项
        // 并且不会触发onchange事件。此时，我们需要让el.value等于Model中的Observable的值
        // 这样才符合用户预期
        new MutationObserver(() => el.value = arg.observable.get()).observe(el, {childList: true});

        let originalVal = el.value;
        if (arg instanceof Model) {
            el.oninput = (e) => {
                let newval = e.target.value;
                if (originalVal !== newval) {
                    arg.observable.set(newval);
                    originalVal = newval;
                }
            }
        }
        arg.observable.observe(newval => {
            if (originalVal !== newval) {
                el.value = newval;
                originalVal = newval;
            }
        });
        return true;
    }
    return false;
}
