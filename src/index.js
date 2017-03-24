/* eslint-disable no-console */
import _ from 'lodash';
import { Observable } from 'rxjs';
import formatter from './formatter';
import createExample from './example-observable';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
export const specStream = (specDescription, specCreator) => {
    const examples = [];
    specCreator((description, specification) => {
        const example = specification(createExample(description));
        examples.push(example);
    });

    return Observable.merge(...examples)
        .scan((all, current) => _.extend(all, { [current.description]: current }), {});
};

export default (specDescription, specCreator) => {
    specStream(specDescription, specCreator)
        .subscribe(formatter(specDescription));
};
