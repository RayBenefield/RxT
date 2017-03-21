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
                .pairwise()
                .mergeMap((pair) => {
                    if (!pair[0].id) {
                        return [
                            _.extend(pair[0], { id: 0 }),
                            _.extend(pair[1], { id: 1 }),
                        ];
                    }
                    return [_.extend(pair[1], { id: pair[0].id + 1 })];
                })
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
        return this.do((example) => {
            try {
                check(example.actual, expecteds[example.id]);
            } catch (e) {
                _.extend(e, { example });
                throw (e);
            }
            return example;
        });
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
