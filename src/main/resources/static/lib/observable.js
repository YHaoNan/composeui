class Observable {
    constructor(val) {
        this.val = val;
        this.counter = 0;
        this.observer = {};
    }

    set(val) {
        this.val = val;
        for (let observerId in this.observer) {
            this.observer[observerId](val);
        }
    }

    get() {
        return this.val;
    }

    observe(onchanged) {
        if (!(onchanged instanceof Function)) {
            throw 'onchanged must be a function';
        }

        let observerId = this.counter++;
        this.observer[observerId] = onchanged;
        return observerId;
    }

    cancel(id) {
        delete this.observer[id];
    }
}

class ListObservable extends Observable {
    constructor(val) {
        super(val);
    }

    setone(i, v) {
        super.get()[i] = v;
        super.set(this.get());
    }

    getone(i) {
        return super.get()[i];
    }

    length() {
        return super.get().length;
    }

    push(v) {
        let list = super.get();
        list.push(v);
        super.set(list);
    }

    pop() {
        let list = super.get();
        list.pop();
        super.set(list);
    }

    splice(start, end, ...args) {
        let list = super.get();
        let result = list.splice(start, end, args);
        super.set(list);
        return result;
    }
}



class Reactive {
    constructor(observable, composable_builder) {
        this.observable = observable;
        this.composable_builder = composable_builder;
    }
}

class Model {
    constructor(observable) {
        this.observable = observable;
    }
}

class Bind {
    constructor(observable) {
        this.observable = observable;
    }
}