import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import it from '.';

it('should fail on hello', test => test
    .givenEach(['hello', 'world'])
    .when(Observable.of('testing'))
);
