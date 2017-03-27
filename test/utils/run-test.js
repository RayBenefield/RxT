import proxyquire from 'proxyquire';
import { specStream } from '../../src';

export default module.exports = (testFile) => {
    const spec = proxyquire(`../samples/${testFile}`, {
        '../../src': {
            default: specStream,
        },
    });
    return spec;
};
