/* eslint-disable no-console */
import _ from 'lodash';
import TestObservable from './test-observable';

export default (description, testCreator) => {
    const observe = testCreator(TestObservable);
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    observe
        .extend(ex => ({ description: _.template(description)(ex) }))
        .subscribe(console.log);
};

