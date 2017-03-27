/* eslint-disable no-console, no-duplicate-imports, import/no-duplicates */
import _ from 'lodash';
import describe from '../src';
import runTest from './utils/run-test';

describe('RxT', (it) => {
    it('should run a simple passing and failing given/when/then test', test => test
        .given('givenWhenThen')
        .whenObserving(runTest)
        .then(
            (result) => {
                const expected = [
                    {
                        'should capitalize just hello': 'pass',
                    },
                    {
                        'should capitalize just hello': 'pass',
                        'should fail to assert the proper hello': 'fail',
                    },
                ];
                result.results.should.have.keys(..._.keys(expected[result.step]));
                _.forIn(expected[result.step], (val, key) => {
                    result.results[key].result.should.equal(val);
                });
            },
        )
    );
});
