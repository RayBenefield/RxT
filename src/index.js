/* eslint-disable no-console */
import _ from 'lodash';
import { Observable } from 'rxjs';
import formatter from './formatter';
import createExample from './example-observable';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
export default (specDescription, specCreator) => {
    const examples = [];
    specCreator((description, specification) => {
        const example = specification(createExample(description));
        examples.push(example
            .extend({ result: 'pass' })
            .catch((error) => {
                if (error.name !== 'AssertionError') return Observable.of(error);
                return Observable.of(
                    _.extend(error.example, { result: 'fail', error }),
                );
            })
        );
    });

    Observable.merge(...examples)
        .scan((all, current) => [].concat(all, [current]), [])
        .subscribe(formatter(specDescription));
};

