import _ from 'lodash';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';

const attachId = function attachId() {
    return this.pairwise()
        .mergeMap(([previous, current]) => {
            if (!previous.id) {
                if (_.isEqual(previous, current)) {
                    return [_.extend(previous, { id: 0 })];
                }
                return [
                    _.extend(previous, { id: 0 }),
                    _.extend(current, { id: 1 }),
                ];
            }
            return [_.extend(current, { id: previous.id + 1 })];
        });
};

const extend = function extend(extension) {
    if (_.isFunction(extension)) return this.map(ex => _.extend(ex, extension(ex)));
    return this.map(ex => _.extend(ex, extension));
};

Observable.prototype.attachId = attachId;
Observable.prototype.extend = extend;

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
        // TODO: Should be able to handle functions
        return (new this(of(params)))
            .map(given => ({ given }))
            .extend(ex => ({ description: _.template(description)(ex) }))
            .scan((prev, curr) => _
                .extend(curr, {
                    givenId: prev.givenId !== undefined ? prev.givenId + 1 : 0,
                }), {}
            );
    }

    static givenEach(params, description) {
        // TODO: Should be able to handle functions
        if (_.isArray(params)) {
            return (new this(from(params)))
                .map(given => ({ given }))
                .extend(ex => ({ description: _.template(description)(ex) }))
                .scan((prev, curr) => _
                    .extend(curr, {
                        givenId: prev.givenId !== undefined ? prev.givenId + 1 : 0,
                    }), {}
                );
        }
        return (new this(of(params)))
            .map(given => ({ given }))
            .extend(ex => ({ description: _.template(description)(ex) }));
    }

    when(doSomething) {
        return this
            .extend(ex => ({ actual: doSomething(ex.given) }))
            .scan((prev, curr) => _
                .extend(curr, {
                    whenId: prev.whenId !== undefined ? prev.whenId + 1 : 0,
                }), {}
            );
    }

    whenObserving(doSomething) {
        return this.mergeMap(ex => Observable
            .merge(
                Observable.of(ex)
                .map(e => _.extend(e, { result: 'wait' })),
                doSomething(ex.given)
                .map(actual => _.extend(ex, { actual }))
                .map(e => _.extend(e, { result: 'done' }))
                .scan((prev, curr) => _
                    .extend(curr, {
                        whenId: prev.whenId !== undefined ? prev.whenId + 1 : 0,
                    }), {}
                ),
            ));
    }

    then(check) {
        return this
            .do((example) => {
                if (example.result === 'wait') return null;
                try {
                    return check(example.actual);
                } catch (e) {
                    _.extend(e, { example });
                    throw (e);
                }
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
            });
    }

    thenEach(check, expecteds) {
        return this.mergeMap(example => Observable
            .of(example)
            .do(() => {
                if (example.result === 'wait') return null;
                try {
                    check(example.actual, expecteds[example.givenId]);
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
}

export default module.exports = description => ({
    given: stuff => ExampleObservable.given(stuff, description),
    givenEach: stuff => ExampleObservable.givenEach(stuff, description),
});
