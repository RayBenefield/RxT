import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { zip } from 'rxjs/observable/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

class ExampleObservable extends Observable {
    constructor(source) {
        super();
        this.source = source;
    }
    lift(operator) {
        const observable = new ExampleObservable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    static given(params) {
        return (new this(of(params)))
            .map(given => ({ given }))
            .extend(ex => ({ description: _.template(ExampleObservable.description)(ex) }));
    }
    static givenEach(params) {
        if (_.isArray(params)) {
            return (new this(from(params)))
                .map(given => ({ given }))
                .extend(ex => ({ description: _.template(ExampleObservable.description)(ex) }));
        }
        return (new this(of(params)))
            .map(given => ({ given }))
            .extend(ex => ({ description: _.template(ExampleObservable.description)(ex) }));
    }
    when(doSomething) {
        return this.extend(ex => ({ actual: doSomething(ex.given) }));
    }
    whenObserving(doSomething) {
        return this.mergeMap(ex => doSomething(ex.given)
            .map(actual => _.extend(ex, { actual }))
        );
    }
    then(check) {
        return this.do(({ actual }) => check(actual));
    }
    thenEach(check, expecteds) {
        return new ExampleObservable(zip(
            this,
            ExampleObservable.givenEach(expecteds),
            (actual, expected) => {
                check(actual.actual, expected.given);
                return actual;
            },
        ));
    }
    extend(extension) {
        if (_.isFunction(extension)) return this.map(ex => _.extend(ex, extension(ex)));
        return this.map(ex => _.extend(ex, extension));
    }
}

export default module.exports = (description) => {
    ExampleObservable.description = description;
    return ExampleObservable;
};
