/* eslint-disable no-console, no-duplicate-imports, import/no-duplicates */
import _ from 'lodash';
import proxyquire from 'proxyquire';
import describe from '../src';
import { specStream } from '../src';

describe('RxT', (it) => {
    it('should run a simple passing and failing given/when/then test', test => test
        .given('givenWhenThen')
        .whenObserving((testFile) => {
            const spec = proxyquire(`./samples/${testFile}`, {
                '../../src': {
                    default: specStream,
                },
            });
            return spec;
        })
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
