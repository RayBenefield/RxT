/* eslint-disable no-console */
import _ from 'lodash';
import { Observable } from 'rxjs';
import createExample from './example-observable';

const toTapFormat = (ex) => {
    if (ex.result === 'pass') return `ok - ${ex.description}`;
    return `not ok - ${ex.description}
  ---
  message: ${JSON.stringify(ex.error._message)}
  severity: fail
  ...`;
};

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
console.log('TAP version 13');
export default (description, specification) => {
    const example = specification(createExample(description));
    console.log('1..1');
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
