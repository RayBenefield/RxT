import isArray from 'lodash/isArray';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';

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
}

export default module.exports = TestObservable;
