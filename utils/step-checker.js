/* eslint-disable import/no-extraneous-dependencies */
import 'should';
import _ from 'lodash';

export const accumulateSteps = timeline => timeline.reduce((past, current) => {
    if (past.length === 0) return [current];
    return [].concat(past, [_.assign({}, past[past.length - 1], current)]);
}, []);

export default expected => (result) => {
    const stepNumber = result.step;
    const steps = accumulateSteps(expected);
    const results = result.results;

    results.should.have.keys(..._.keys(steps[stepNumber]));
    _.forIn(steps[stepNumber], (val, key) => {
        results[key].result.should.equal(val);
    });
};
