/* eslint-disable no-console, no-duplicate-imports, import/no-duplicates */
import describe from '../src';
import runTest from '../utils/run-test';
import shouldHaveSteps from '../utils/step-checker';

describe('RxT', (it) => {
    it('should run a simple passing and failing given/when/then test', test => test
        .given('given-when-then')
        .when(runTest)
        .then(shouldHaveSteps([
            { 'should capitalize just hello': 'pass' },
            { 'should fail to assert the proper hello': 'fail' },
        ]))
    );

    it('should run a single test marked with \'only\'', test => test
        .given('run-just-one')
        .when(runTest)
        .then(shouldHaveSteps([
            { 'should fail to assert the proper hello': 'fail' },
        ]))
    );

    it('should skip a single test marked with \'skip\'', test => test
        .given('skip-one')
        .when(runTest)
        .then(shouldHaveSteps([
            { 'should fail to assert the proper hello': 'fail' },
        ]))
    );

    it('should support functions that return observables with when', test => test
        .given('givenEach-when-then')
        .when(runTest)
        .then(shouldHaveSteps([
            { 'should keep the length of the word "hello" equal to "5"': 'wait' },
            { 'should keep the length of the word "stuff" equal to "5"': 'wait' },
            { 'should keep the length of the word "style" equal to "5"': 'wait' },
            { 'should keep the length of the word "world" equal to "5"': 'wait' },
            { 'should keep the length of the word "again" equal to "5"': 'wait' },
            { 'should keep the length of the word "hello" equal to "5"': 'pass' },
            { 'should keep the length of the word "stuff" equal to "5"': 'pass' },
            { 'should keep the length of the word "style" equal to "5"': 'pass' },
            { 'should keep the length of the word "world" equal to "5"': 'pass' },
            { 'should keep the length of the word "again" equal to "5"': 'pass' },
        ]))
    );

    it('should fail a test but continue with the rest', test => test
        .given('givenEach-fail-but-continue')
        .when(runTest)
        .then(shouldHaveSteps([
            { 'should fail if length of "hello" is not equal to "5"': 'wait' },
            { 'should fail if length of "stuff" is not equal to "5"': 'wait' },
            { 'should fail if length of "at" is not equal to "5"': 'wait' },
            { 'should fail if length of "world" is not equal to "5"': 'wait' },
            { 'should fail if length of "again" is not equal to "5"': 'wait' },
            { 'should fail if length of "hello" is not equal to "5"': 'pass' },
            { 'should fail if length of "stuff" is not equal to "5"': 'pass' },
            { 'should fail if length of "at" is not equal to "5"': 'fail' },
            { 'should fail if length of "world" is not equal to "5"': 'pass' },
            { 'should fail if length of "again" is not equal to "5"': 'pass' },
        ]))
    );
});
