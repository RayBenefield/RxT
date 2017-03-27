/* eslint-disable no-console */
import _ from 'lodash';
import { Observable } from 'rxjs';
import formatter from './formatter';
import createExample from './example-observable';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
export const specStream = (specDescription, specCreator) => {
    const examples = [];
    let onlyGlobal;
    const it = (description, specification, only = false) => {
        if (onlyGlobal && !only) return;
        const example = specification(createExample(description));
        examples.push(example);
    };
    it.only = (...args) => {
        if (!onlyGlobal) {
            examples.length = 0;
            onlyGlobal = true;
        }

        it(...args, true);
    };
    specCreator(it);

    return Observable.merge(...examples)
        .scan((all, current) => ({
            step: all.step !== undefined ? all.step + 1 : 0,
            results: _.extend(all.results, {
                [current.description]: current,
            }),
        }), {});
};

export default (specDescription, specCreator) => {
    specStream(specDescription, specCreator)
        .subscribe(formatter(specDescription));
};
