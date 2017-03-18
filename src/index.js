/* eslint-disable no-console */
import _ from 'lodash';
import { Observable } from 'rxjs';
import createExample from './example-observable';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
export default (description, specification) => {
    const example = specification(createExample(description));
    Observable.of(0)
        .mergeMap(() => example
            .extend({ result: 'pass' })
            .catch((error) => {
                if (error.name !== 'AssertionError') return Observable.of(error);
                return Observable.of(
                    _.extend(error.example, { result: 'fail', error }),
                );
            })
        )
        .subscribe(ex => console.log(ex));
};

