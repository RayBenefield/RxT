/* eslint-disable no-console, no-duplicate-imports, import/no-duplicates */
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
                    ['should capitalize just hello'],
                    [
                        'should capitalize just hello',
                        'should fail to assert the proper hello',
                    ],
                ];
                result.results.should.have.keys(...expected[result.step]);
            },
        )
    );
});
