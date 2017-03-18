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
            .catch(err => Observable.of(err))
        )
        .subscribe(ex => console.log(ex));
};

