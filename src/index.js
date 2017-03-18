/* eslint-disable no-console */
import _ from 'lodash';
import createExample from './test-observable';

export default (description, testCreator) => {
    const observe = testCreator(createExample(description));
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    observe
        .subscribe(ex => console.log(ex.description));
};

