/* eslint-disable no-console, no-duplicate-imports, import/no-duplicates */
import describe from '../src';
import runTest from './utils/run-test';
import shouldHaveSteps from './utils/step-checker';

describe('RxT', (it) => {
    it('should run a simple passing and failing given/when/then test', test => test
        .given('givenWhenThen')
        .whenObserving(runTest)
        .then(shouldHaveSteps([
            { 'should capitalize just hello': 'pass' },
            { 'should fail to assert the proper hello': 'fail' },
        ]))
    );
});
