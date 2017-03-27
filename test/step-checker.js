/* eslint-disable import/no-extraneous-dependencies */
import 'should';
import describe from '../src';
import { accumulateSteps } from '../utils/step-checker';

describe('Step Checker', (it) => {
    it('should return a single step', ex => ex
        .given([{ 'should do stuff': 'pass' }])
        .when(accumulateSteps)
        .then((result) => {
            result.should.eql([{ 'should do stuff': 'pass' }]);
        })
    );

    it('should return two steps', ex => ex
        .given([
            { 'should do stuff': 'pass' },
            { 'should do more stuff': 'pass' },
        ])
        .when(accumulateSteps)
        .then((result) => {
            result.should.eql([
                {
                    'should do stuff': 'pass',
                },
                {
                    'should do stuff': 'pass',
                    'should do more stuff': 'pass',
                },
            ]);
        })
    );

    it('should return an overriden step', ex => ex
        .given([
            { 'should do stuff': 'wait' },
            { 'should do stuff': 'pass' },
        ])
        .when(accumulateSteps)
        .then((result) => {
            result.should.eql([
                { 'should do stuff': 'wait' },
                { 'should do stuff': 'pass' },
            ]);
        })
    );

    it('should return several overriden and not overriden steps', ex => ex
        .given([
            { 'should do stuff': 'wait' },
            { 'return 500': 'wait' },
            { 'should do more stuff': 'pass' },
            { 'throw things': 'wait' },
            { 'should do stuff': 'pass' },
            { 'return 500': 'fail' },
            { 'throw things': 'pass' },
        ])
        .when(accumulateSteps)
        .then((result) => {
            result.should.eql([
                {
                    'should do stuff': 'wait',
                },
                {
                    'should do stuff': 'wait',
                    'return 500': 'wait',
                },
                {
                    'should do stuff': 'wait',
                    'return 500': 'wait',
                    'should do more stuff': 'pass',
                },
                {
                    'should do stuff': 'wait',
                    'return 500': 'wait',
                    'should do more stuff': 'pass',
                    'throw things': 'wait',
                },
                {
                    'should do stuff': 'pass',
                    'return 500': 'wait',
                    'should do more stuff': 'pass',
                    'throw things': 'wait',
                },
                {
                    'should do stuff': 'pass',
                    'return 500': 'fail',
                    'should do more stuff': 'pass',
                    'throw things': 'wait',
                },
                {
                    'should do stuff': 'pass',
                    'return 500': 'fail',
                    'should do more stuff': 'pass',
                    'throw things': 'pass',
                },
            ]);
        })
    );
});
