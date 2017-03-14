import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

class TestObservable extends Observable {
    constructor(source) {
        super();
        this.source = source;
    }
    lift(operator) {
        const observable = new TestObservable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    static given(params) {
        return new this(of(params));
    }
    static givenEach(params) {
        if (isArray(params)) return new this(from(params));
        return new this(of(params));
    }
    when(doSomething) {
        if (isFunction(doSomething)) return this.mergeMap(doSomething);
        return this.mergeMap(() => doSomething);
    }
    then(check) {
        return this.do(check);
    }
}

export default module.exports = TestObservable;
