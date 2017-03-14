/* eslint-disable import/no-extraneous-dependencies */
import 'should';
import capitalize from 'lodash/capitalize';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import it from '.';

const capitalized = result => Observable.of(capitalize(result));

it('should capitalize {{given}}', test => test
    .givenEach(['hello', 'world'])
    .when(capitalized)
    .then(result =>
        result.length.should.be.exactly(5)
    )
);
