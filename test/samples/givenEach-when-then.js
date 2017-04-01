/* eslint-disable import/no-extraneous-dependencies */
import 'should';
import { Observable } from 'rxjs';
import capitalized from 'lodash/capitalize';
import describe from '../../src';

const observableCapitalized = given => Observable.of(capitalized(given))
    .delay(200);

export default module.exports = describe('Lodash Capitalize', (it) => {
    it('should keep the length of the word "{{given}}" equal to "5"', ex => ex
        .givenEach(['hello', 'stuff', 'style', 'world', 'again'])
        .when(observableCapitalized)
        .then(result => result.length.should.be.exactly(5))
    );
});
