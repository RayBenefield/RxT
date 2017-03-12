import TestObservable from './test-observable';

export default (description, testCreator) => {
    const observe = testCreator(TestObservable);
    observe.subscribe(console.log);
};
