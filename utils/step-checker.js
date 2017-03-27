import _ from 'lodash';

export const stepAccumulator = timeline => timeline.reduce((past, current) => {
    if (past.length === 0) return [current];
    return [].concat(past, [_.assign({}, past[past.length - 1], current)]);
}, []);

export default module.exports = expected => (result) => {
    const steps = stepAccumulator(expected);
    result.results.should.have.keys(..._.keys(steps[result.step]));
    _.forIn(steps[result.step], (val, key) => {
        result.results[key].result.should.equal(val);
    });
};
