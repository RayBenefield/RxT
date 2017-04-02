import proxyquire from 'proxyquire';
import { specStream } from '../src';

export const runTestWithSteps = (testFile) => {
    const spec = proxyquire(`../test/samples/${testFile}`, {
        '../../src': {
            default: specStream,
        },
    });
    return spec;
};

export const runTestWithResults = testFile => runTestWithSteps(testFile).last();
