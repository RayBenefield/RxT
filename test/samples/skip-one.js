/* eslint-disable import/no-extraneous-dependencies */
import 'should';
import capitalized from 'lodash/capitalize';
import describe from '../../src';

export default module.exports = describe('Lodash Capitalize', (it) => {
    it.skip('should capitalize just hello', ex => ex
        .given('hello')
        .when(capitalized)
        .then(result => result.should.be.exactly('Hello'))
    );
    it('should fail to assert the proper hello', ex => ex
        .given('hello')
        .when(capitalized)
        .then(result => result.should.be.exactly('hello'))
    );
});
