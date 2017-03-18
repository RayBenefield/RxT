/* eslint-disable import/no-extraneous-dependencies */
import 'should';
import capitalized from 'lodash/capitalize';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import it from '.';

const observableCapitalized = result => Observable.of(capitalized(result));

it('should capitalize {{given}}', test => test
    .givenEach(
        ['hello', 'world']
    )
    .when(capitalized)
    .thenEach(
        (result, expected) => {
            result.length.should.be.exactly(5);
            result.should.be.exactly(expected);
        },
        ['Hello', 'World']
    )
);

it('should capitalize {{given}} with an observable', test => test
    .givenEach(
        ['hello', 'world']
    )
    .whenObserving(observableCapitalized)
    .thenEach(
        (result, expected) => {
            result.length.should.be.exactly(5);
            result.should.be.exactly(expected);
        },
        ['Hello', 'World']
    )
);
