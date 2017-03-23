/* eslint-disable import/no-extraneous-dependencies */
import 'should';
import capitalized from 'lodash/capitalize';
import describe from '../../src';

describe('Lodash Capitalize', (it) => {
    it('should capitalize just hello', ex => ex
        .given('hello')
        .when(capitalized)
        .then(result => result.should.be.exactly('Hello'))
    );
});
