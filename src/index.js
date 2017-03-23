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
        examples.push(example);
    });

    Observable.merge(...examples)
        .scan((all, current) => _.extend(all, { [current.description]: current }), {})
        .subscribe(formatter(specDescription));
};
