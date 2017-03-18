import _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { zip } from 'rxjs/observable/zip';

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
    static given(params, description) {
        return (new this(of(params)))
            .map(given => ({ given }))
            .extend(ex => ({ description: _.template(description)(ex) }));
    }
    static givenEach(params, description) {
        if (_.isArray(params)) {
            return (new this(from(params)))
                .map(given => ({ given }))
                .extend(ex => ({ description: _.template(description)(ex) }));
        }
        return (new this(of(params)))
            .map(given => ({ given }))
            .extend(ex => ({ description: _.template(description)(ex) }));
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
        return this.do((example) => {
            try {
                return check(example.actual);
            } catch (e) {
                _.extend(e, { example });
                throw (e);
            }
        });
    }
    thenEach(check, expecteds) {
        return new ExampleObservable(zip(
            this,
            ExampleObservable.givenEach(expecteds),
            (example, expected) => {
                try {
                    check(example.actual, expected.given);
                } catch (e) {
                    _.extend(e, { example });
                    throw (e);
                }
                return example;
            },
        ));
    }
    extend(extension) {
        if (_.isFunction(extension)) return this.map(ex => _.extend(ex, extension(ex)));
        return this.map(ex => _.extend(ex, extension));
    }
}

export default module.exports = description => ({
    given: stuff => ExampleObservable.given(stuff, description),
    givenEach: stuff => ExampleObservable.givenEach(stuff, description),
});
