# RxT

`RxT` stands for ReactiveX Testing. `RxT` is built as a declarative testing
framework inspired by the potential for utilizing custom operators for
[`RxJS`](http://reactivex) `Observables` to create a Domain Specific Language
(`DSL`) for powerful, but readable testing. The DSL is modeled off of Behaviour
Driven Development (`BDD`) terminology to drive feature development.

The power of `Observables` enables `RxT` to turn tests into powerful declarative
streams that are capable of handling a multitude of testing parameters for
variation in a single test as well as being able to test the results of
asynchronous side effects without messy nested callbacks. This results in the
ability of `RxT` to handle many variations on asynchronous tasks in parallel
which is useful when you want to do something like calling an API with a variety
of parameters and validate the results.


## Install

Installing RxT is easy. You can install it with one of the following commands
(as a testing framework, installing as a dev dependency is recommended):

```
yarn add --dev rxt
npm i -D rxt
npm install --save-dev rxt
```


## Basic Usage

The below code utilizes [`should.js`](https://github.com/shouldjs/should.js/) as
the assertion library and tests the `capitalize` function from
[`lodash`](https://lodash.com/). The assertions can easily be done with any
assertion library and the function under test can return any value or can return
any `Observable` from [`RxJS`](http://reactivex.io/rxjs/).

```js
/* ES2015 */
import 'should';                              // Assertion Library
import describe from 'rxt';                   // RxT
import capitalize from 'lodash/capitalize';   // Function under test

// Setup the test suite
describe('My Code Under Test', (it) => {

    // Individual test
    it('should capitalize hello', example => example
        .given(
            'hello'                           // Parameter for function
        )
        .when(value =>
            capitalize(value)                 // Function under test
        )
        .then(result =>
            result.should.be.exactly('Hello') // Assertion of result
        )
    );

});
```

See the [`test/`](./test/) directory for more examples.


## Team

|[![Ray Benefield](http://gravatar.com/avatar/e931b13306ea1022549766266727f789?s=144)](https://github.com/RayBenefield) |
|:---:|
|[Ray Benefield](https://github.com/RayBenefield) |
|[Solution Architect](https://en.wikipedia.org/wiki/Solution_architect) |


## License

MIT © [Ray Benefield](https://github.com/RayBenefield)
