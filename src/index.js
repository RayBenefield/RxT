/* eslint-disable no-console */
import _ from 'lodash';
import createExample from './example-observable';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
export default (description, specification) => {
    const example = specification(createExample(description));
    example
        .extend({ result: 'pass' })
        .subscribe(ex => console.log(ex));
};

