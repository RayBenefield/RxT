import isArray from 'lodash/isArray';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { zip } from 'rxjs/observable/zip';
import 'rxjs/add/operator/map';
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
        return this.map(given => ({
            given,
            result: doSomething(given),
        }));
    }
    whenObserving(doSomething) {
        return this.mergeMap(given => doSomething(given)
            .map(result => ({ given, result }))
        );
    }
    then(check) {
        return this.do(({ result }) => check(result));
    }
    thenEach(check, expecteds) {
        return new TestObservable(zip(
            this,
            TestObservable.givenEach(expecteds),
            (result, expected) => {
                check(result.result, expected);
                return result;
            },
        ));
    }
}

export default module.exports = TestObservable;
