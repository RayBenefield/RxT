/* eslint-disable import/no-extraneous-dependencies */
import 'should';
import capitalized from 'lodash/capitalize';
import { Observable } from 'rxjs/Observable';
import describe from '../src';

const observableCapitalized = given => Observable.of(capitalized(given))
    .delay(5000 * Math.random());

describe('Testing', (it) => {
    it('should capitalize just hello', ex => ex
        .given('hello')
        .when(capitalized)
        .then(result => result.should.be.exactly('Hello'))
    );

    it('should capitalize {{given}}', ex => ex
        .givenEach(
            ['hello', 'world', 'again']
        )
        .when(capitalized)
        .thenEach(
            (result, expected) => {
                result.length.should.be.exactly(5);
                result.should.be.exactly(expected);
            },
            ['Hello', 'World', 'Again']
        )
    );

    it('should fail {{given}}', ex => ex
        .givenEach(
            ['hello', 'world']
        )
        .when(capitalized)
        .thenEach(
            (result, expected) => {
                result.length.should.be.exactly(5);
                result.should.be.exactly(expected);
            },
            ['hello', 'world']
        )
    );

    it('should capitalize {{given}} with an observable', ex => ex
        .givenEach(
            ['hello', 'world', 'again', 'stuff', 'style']
        )
        .whenObserving(observableCapitalized)
        .thenEach(
            (result, expected) => {
                result.length.should.be.exactly(5);
                result.should.be.exactly(expected);
            },
            ['Hello', 'World', 'Again', 'Stuff', 'Style']
        )
    );

    it('should fail {{given}} with an observable', ex => ex
        .givenEach(
            ['hello', 'world']
        )
        .whenObserving(observableCapitalized)
        .thenEach(
            (result, expected) => {
                result.length.should.be.exactly(5);
                result.should.be.exactly(expected);
            },
            ['hello', 'world']
        )
    );
});
