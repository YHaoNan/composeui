function search_bar(btn_label, placeholder, input_val, onsearch) {
    return div({class: 'search-bar'},
        input({placeholder}, new Model(input_val)),
        button({type: 'button'}, text(btn_label), {onclick: () => onsearch()})
    );
}

function divider_hori(width) {
    return div({style: `width: ${width}px; height: 0.5px; background: #aaa; margin: 0 auto;`});
}

function card(content, padding=true) {
    return div({class: `card${padding?' padding':''}`}, content)
}

function neo_form_entry(custom_class, content, inset=true) {
    return div({class: `neo-form-entry ${custom_class} ${inset?'inset':'uninset'}`}, content)
}

/**
 * 构建一个分页器组件
 * @param pageinfo  是一个Observable，内部包含一个对象，具有三个属性：pageNo、pageSize和maxPage。pageNo从1开始。
 * @param onpagechange 当页面发生变动时的回调，参数是新页面号
 * @returns {*}
 */
function pager(pageinfo, pagesizelist,onpagechange) {

    // 生成[1, n]的数
    function make_range(n) {
        let list = [];
        for (let i=1; i<=n; i++) list.push(i);
        return list;
    }

    return div({class: 'pager'},
        span(
            new Reactive(pageinfo, ({pageNo, pageSize, maxPage}) =>
                [
                    ...items(make_range(maxPage), i =>
                        span(
                            i === pageNo ? span({class: 'active-page-entry'}, text(i)) : a({class: 'page-entry'}, text(i), {href:'#', onclick: () => {
                                    onpagechange(i);
                                    return false;
                                }}),
                            spacer_hori(10)
                        )
                    ),
                    select(new Bind(new Observable(pageSize)),
                        items(pagesizelist, size =>
                            option(text(`${size}条/页`), {value: size})
                        ), {onchange: (e) => {
                                pageinfo.set({
                                    pageNo: 1, pageSize: parseInt(e.target.value), maxPage
                                });
                                console.log(pageinfo);
                                onpagechange(1);
                            }
                        }
                    )
                ]
            ),
        ),
    )
}