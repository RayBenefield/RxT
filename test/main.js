/* eslint-disable no-console */
import proxyquire from 'proxyquire';
import describe from '../src';

describe('RxT', (it) => {
    it('should run a simple given/when/then test', test => test
        .given('givenWhenThen')
        .when(testFile =>
            proxyquire(`./samples/${testFile}`, {
                '../../src': {
                    default: (...args) => console.log(...args),
                },
            })
        )
        .then(() => true)
    );
});
