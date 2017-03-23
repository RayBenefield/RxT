import _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';

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
                .attachId()
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
        return this.mergeMap(ex => Observable.merge(
            Observable.of(ex)
                .map(e => _.extend(e, { result: 'wait' })),
            doSomething(ex.given)
                .map(actual => _.extend(ex, { actual }))
                .map(e => _.extend(e, { result: 'done' })),
        ));
    }

    then(check) {
        return this.do((example) => {
            try {
                return check(example.actual);
            } catch (e) {
                _.extend(e, { example });
                throw (e);
            }
        })
        .map(ex => _.extend(ex, { result: 'pass' }));
    }

    thenEach(check, expecteds) {
        return this.mergeMap(example => Observable
            .of(example)
            .do(() => {
                if (example.result === 'wait') return null;
                try {
                    check(example.actual, expecteds[example.id]);
                } catch (e) {
                    _.extend(e, { example });
                    throw (e);
                }
                return example;
            })
            .map((ex) => {
                if (ex.result === 'wait') return ex;
                return _.extend(ex, { result: 'pass' });
            })
            .catch((error) => {
                if (error.name !== 'AssertionError') return Observable.of(error);
                return Observable.of(
                    _.extend(error.example, { result: 'fail', error }),
                );
            })
        );
    }

    extend(extension) {
        if (_.isFunction(extension)) return this.map(ex => _.extend(ex, extension(ex)));
        return this.map(ex => _.extend(ex, extension));
    }

    attachId() {
        return this.pairwise()
            .mergeMap(([previous, current]) => {
                if (!previous.id) {
                    return [
                        _.extend(previous, { id: 0 }),
                        _.extend(current, { id: 1 }),
                    ];
                }
                return [_.extend(current, { id: previous.id + 1 })];
            });
    }
}

export default module.exports = description => ({
    given: stuff => ExampleObservable.given(stuff, description),
    givenEach: stuff => ExampleObservable.givenEach(stuff, description),
});
