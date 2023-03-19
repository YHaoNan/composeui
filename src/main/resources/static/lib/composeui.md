# Compose UI

ComposeUI是一个妄图使用函数的组合来完成整个页面设计的轮子，是我突发奇想要设计的。它其实和Jetpack Compose的思想类似，但由于JS语言中的种种限制，所以在具体实现上又有很多的差别。

ComposeUI中只有两个你要了解的角色，一个是`Composable`、另一个是`Observable`，本篇文档就是介绍这两个角色的。

## Composable

emmm......一切要从一个Composable说起......

Composable是一个特殊的函数，我们称它可组合函数。

这一点一定要清楚，当我们后文提到Composable这个关键词时，一定要清楚的知道，它是一个函数，可以被调用，只不过它的参数和返回值是有一些规范的。

### Composable函数返回一个元素


**一个标准的Composable会返回一个Dom元素，这个元素可以是它自己创建的，也可以是依赖其它Composable创建的，也可以是页面中本来就有的元素**，比如`div`这个Composable，它会创建一个`div`并返回。

```js
let element = div();
```

现在，`element`就是一个`HTMLElement`类型的对象的引用，该`HTMLElement`是一个div。实际上，这和你这样创建没有任何区别：

```js
let element = document.createElement('div');
```

下面的自定义函数也是一个合法的Composable：
```js
function mydiv() {
    return div({'class': 'mydiv'})
}
```

这个函数自己并不会创建任何Dom元素，而是委托其它Composable完成Dom元素创建，它只为创建出的元素设置一些属性——`class`被设成了`mydiv`。

对于`body`、`document`、`head`这种元素，它们的Composable不会创建任何新Dom元素，而是直接使用页面中的元素：
```js
console.log(doc() == document); // true
console.log(head() == document.head); // true
console.log(body() == document.body); // true
```

在所有的自带Composable中，有一个比较特殊的是`text(string)`，它接收一个字符串，创建一个`Text`节点：
```js
let t = text('hello');
```

这个代码等同于：
```js
let t = document.createTextNode('hello');
```

### 自带Composable的参数规范

Compose UI几乎为所有的HTML标签都提供了对应的Composable，一般来说，我们就是应用这些自带的Composable进行组合，完成页面开发。自带的Composable的参数是按照一定规则被解析的，而你自己设计的则不会。

自带Composable可以有任意多个参数，对于每一个参数，它会被这样解析：

1. 若参数类型是`HTMLElement`，追加到自己代表的Dom元素的子元素中
2. 若参数是`Text`或字符串，作为自己的内部文本，你可以理解为innerText
3. 若参数是`Reactive`，监控其中的observer，并负责在Observer发生更改时生成元素，并设置到自己代表的子元素中
4. 若参数是`Model`，在其中的observer和元素的值上做双向数据绑定
5. 若参数是`Array`，对于其中的每个元素，当作第1条或第2条处理
6. 若参数是`Object`，将内部的所有元素挂载到自己的属性上

对于第5条，有一些例外，若`Object`中的某一属性名为事件名时，比如`onclick`，则会将该属性的值作为该元素的对应事件的回调。

这些动态规则允许你灵活的组合Composable，想象，Composable会返回一个Dom元素，而Composable的参数就可以是一个Dom元素，参数中的Dom元素会被挂载到自己的子元素上，那么...

下面的代码创建了一`div`，并在其内部创建了一个`span`
```js
div(
    span('Hello')
)
```

下面的代码根据对象数组`tb`，动态创建了一个表格，其核心思想是使用了js中的函数式编程，将数组`tb`转换成一组Composable调用，实际上也就是一组Dom元素：
```js
let tb = [
    {name: 'xx', sid: '123', clz: '计科191', date: '2001-01-01'},
    /*假装这里有更多数据*/
];

table({ width: '400', cellspacing: '0' },
    tr(
        th('姓名'),
        th('学号'),
        th('班级'),
        th('日期'),
    ),
    tb.map({name, sid, clz, date} => 
        tr(
            td(name),
            td(sid),
            td(clz),
            td(date),
        )
    )
)
```

### prop（单向数据绑定）
有时，你希望在元素对象本身上挂载一些属性，举个例子：
```js
let mychkbox = input({type: 'checkbox', checked: true})
```

你希望这个`checked`挂载到`mychkbox`这个对象本身上，就像这样：
```js
mychkbox.check = true;
```

而不是挂载到HTML元素上：
```html
<input type="checkbox" checked="true"/>
```

这时，你可以使用`prop`

```js
let mychkbox = input({type: 'checkbox', prop: {
    checked: true
}})
```

> 实际上，ComposeUI应该对`style`提供一样的特殊化处理，但这里我们并未提供。

使用`prop`，可以完成类似Vue中单向数据绑定的功能

### items方法
实际上，ComposeUI中有一个方法专门用于做上面的这种事情，那就是`items`：

```js
table({ width: '400', cellspacing: '0' },
    tr(
        th(text('姓名')),
        th(text('学号')),
        th(text('班级')),
        th(text('日期')),
    ),
    items(tb, ({name, sid, clz, date}) => {
        tr(
            td(text(name)),
            td(text(sid)),
            td(text(clz)),
            td(text(date)),
        )
    })
)
```

`items`只是`map`的一层封装，但会让代码更加具有ComposeUI的风格。

> 关于`text`函数，主要是为了符合ComposeUI中一切元素皆可复用函数的思想，但实际上自带Composable也可以识别字符串，并将它自动转换为等价的`text`函数表示，所以，你可以使用`text`，也可以直接使用字符串。
>
> 尽管支持直接使用字符串，我还是推荐你，在你向Composable中传入的参数大于一个时，使用`text`包裹，这样可以让人更好的理解你是向其内部添加了一个文本，比如下面的第一行表示创建一个`li`，将`item`作为其内部文本，但这可能会让人产生迷惑，而第二行则很清晰：
> ```js
> li({id: 'xxx'}, item)
> li({id: 'xxx'}, text(item))
> ```

现在，可以尝试使用ComposeUI构建一些复杂的页面了。

### 自定义Composable
Composable的一大优势就是，你可以创建自定义的Composable，然后在需要的时候复用它。

比如，下面的`labeled_form_entry`：

```js
function labeled_form_entry(label, hint, name) {
    return div(
        span(text(label)),
        input({placeholder: hint, name})
    )
}
```

它的作用是创建一个左边带`span`的`input`表单项，你可以通过`label`、`hint`、`name`来分别控制`span`的文字、输入框的`placeholder`以及`input`的`name`。

实际上，使用ComposeUI，你能做到的可能总会比你想象的要更多。

### 尽量不接触DOM API，但随你啊

ComposeUI提供了几乎所有HTML标签的Composable，所以，原则上，尽量不想用户接触HTML标签，但怎么做完全是随你的，如下的函数也是一个合法的Composable：
```js
function mycomposable() {
    let mydiv = document.createElement(div);
    mydiv.innerText = 'hello';
    return mydiv;
}
```

你也可以将它与其它Composable组合使用：
```js
div(
    mycomposable()
)
```

# Observable和Reactive
如果想要用户脱离DomAPI，那么ComposeUI肯定要支持响应式编程，以让数据可以直接驱动UI的构建和重构，而无需手动设置。

我们使用`Observable`和`Reactive`两个对象带来完成这一点

## Observable

现在，我们先把目光从构建界面中移出来，`Observable`只是一个可观察的数据，再无其它。

如下代码创建一个可观察数据`x`，它的值为6：
```js
let x = new Observable(6);
```

我们可以这样观察一个`Observable`，当`x`被修改时，回调函数会被调用：
```js
x.observe(val => {
    console.log(`value of x change to => ${val}`);
});
```

你只可以通过`set`方法来修改`x`：
```js
x.set(6); // 所有观察者接到通知
```

你也可以通过`get`方法来获取原值：
```js
let val = x.get();
```

每次你调用`observe`观察数据变动，都是向`Observable`添加了一个`Observer`（观察者），它会返还给你一个observer id，凭该id，可以取消观察：
```js
let id = x.observe(val => {/*do something*/});
x.cancel(id); // 从这以后，上一行处的回调不会再接到任何通知
```

## ListObservable
`Observable`隐藏了内部值的类型，只暴露出`get`和`set`方法，在很多情况下会引起很多麻烦，比如你使用列表，你想要向其中添加一条数据的时候：
```js
let x = new Observable([]);
let original_list = x.get();
original_list.push('value');
x.set(original_list);
```

`ListObservble`封装了大多数列表类型的操作，你可以直接在上面`push`、`setone`、`getone`、`length`、`pop`、`splice`等。使用`ListObservable`改写上面的代码：
```js
let x = new ListObservable([]);
x.push('value');
```

## Reactive——响应式UI
现在，我们有了可观测对象，如何将它应用到ComposeUI中？

我们需要`Reactive`！

`Reactive`所干的事情也很简单，你需要给它传一个`Observable`，它会自动调用`observe`观测它。你还要传递给它一个回调函数，这个回调函数的作用就是根据`Observable`中的数据建立Dom元素，或一组Dom元素列表。

Composable会将`Reactive`创建的Dom元素或元素列表挂载到自己的下级。

下面举个实际的例子：

```js
let tb = new ListObservable([
    {name: 'xx', sid: '123', clz: '计科191', date: '2001-01-01'},
    /*假装这里有更多数据*/
]);

table({ width: '400', cellspacing: '0' },
    tr(
        th('姓名'),
        th('学号'),
        th('班级'),
        th('日期'),
    ),
    new Reactive(tb, (it) => 
        items(it, ({name, sid, clz, date}) => {
            tr(
                td(name),
                td(sid),
                td(clz),
                td(date),
            )
        })
    )
)
```

`tb`是一个`ListObservable`，`table`中使用`Reactive`来观测这个`ListObservable`，`Reactive`的回调函数中通过`items`来将`tb`内部的值转换成一组Composable调用，也就是说返回一组Dom元素，每一组都是一个`tr`，其内部有四个`td`，这样就完成了整个表格的创建。

当`ListObservable`内部状态发生改变时，`Reactive`会将其原来返回的所有子元素销毁，并重新调用回调建立子元素，这样就完成了响应式编程。

实际上，这里仍有很多优化空间，比如对于`ListObsevable`的`push`操作，不销毁原来的DOM元素，只添加一个元素。

## Model——双向数据绑定
有时，你需要为某些元素——比如输入框——绑定一个可观测值，你希望当可观测值发生变化时，输入框中的文字也发生变化，你希望输入框中的文字发生变化时，可观测值也发生变化。这时，你可以使用`Model`。

```js
let name = Observable('');
div(
    input({type: 'text'}, new Model(name)),
    button({type: 'button', onclick: () => {
        // 获取最新的name值
        submit(name.get());
    }})
)
```

框架没法为任意Composable支持`Model`，因为框架不会知道如何监控Composable返回的元素中值的变动方式。举个例子，对于`select`元素，我们需要监控它的`onchange`，对于`input`，我们将会监控它的`oninput`。

ComposeUI提供了对`input`和`select`的支持，但并未暴露用户自定义处理方式的接口。

实际上一个成熟的JS框架需要考虑到很多的应用场景，需要做很多特殊的处理来让框架提供的功能能够尽量满足更多的应用场景，但又不失简单性和优雅，这挺难的。

# 使用`composeui`作为页面的入口
ComposeUI很灵活，比如，你可能这样将你的composable注入到dom中

```js
body(
    mycomposable()
)
```

但挂载到页面中本来就有的节点上，可能就无能为力了，如果你不手动使用DOMAPI写代码的话，但`composeui`函数提供了这种能力

```js
composeui({
    mount: 'selector',
    composable: composable,
    onmounted: () => {
        
    },
    ondestroy: () => {

    }
});
```

该函数接收一个对象，该对象有四个属性，`mount`是一个选择器，`composable`就是一个Composable，`composeui`函数执行时，会将`composable`分别挂载到每一个选择器匹配的DOM元素上，注意，被挂载的各个元素是独立的，因为只有`composable`被实际调用了，DOM元素才创建。

`onmounted`会在挂载结束后被调用，`ondestroy`会在页面销毁时被调用，挂载会在`window.onload`中开始。


# ComposeUI对全局命名空间的污染
略