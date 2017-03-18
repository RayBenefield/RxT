/* eslint-disable no-console */
import _ from 'lodash';
import { Observable } from 'rxjs';
import createExample from './example-observable';

const toTapFormat = (ex) => {
    if (ex.result === 'pass') return 'ok';
    return 'not ok';
};

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
export default (description, specification) => {
    const example = specification(createExample(description));
    console.log('TAP version 13');
    console.log('1..5');
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
        .map(toTapFormat)
        .subscribe(console.log);
};

