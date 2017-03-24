/* eslint-disable no-console, no-duplicate-imports, import/no-duplicates */
import proxyquire from 'proxyquire';
import describe from '../src';
import { specStream } from '../src';

describe('RxT', (it) => {
    it('should run a simple given/when/then test', test => test
        .given('givenWhenThen')
        .whenObserving((testFile) => {
            const spec = proxyquire(`./samples/${testFile}`, {
                '../../src': {
                    default: specStream,
                },
            });
            return spec;
        })
        .then(result => result.should.have.keys('should capitalize just hello'))
    );
});
