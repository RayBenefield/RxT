/* eslint-disable no-console */
import _ from 'lodash';
import chalk from 'chalk';
import clivas from 'clivas';
import { Observable } from 'rxjs';
import createExample from './example-observable';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
export default (specDescription, specCreator) => {
    const examples = [];
    specCreator((description, specification) => {
        const example = specification(createExample(description));
        examples.push(example
            .extend({ result: 'pass' })
            .catch((error) => {
                if (error.name !== 'AssertionError') return Observable.of(error);
                return Observable.of(
                    _.extend(error.example, { result: 'fail', error }),
                );
            })
        );
    });

    Observable.merge(...examples)
        .scan((all, current) => [].concat(all, [current]), [])
        .subscribe((result) => {
            clivas.clear();
            clivas.line('--------');
            clivas.line(specDescription);
            clivas.line('--------');
            result.forEach((item) => {
                const statusColor = item.result === 'pass' ? chalk.green.bold.inverse : chalk.red.bold.inverse;
                const status = statusColor(` ${item.result.toUpperCase()} `);
                const description = chalk.gray.bold(item.description);
                clivas.line(` ${status}  ${description}`);
                if (item.result === 'fail') {
                    clivas.line(` ${chalk.bgRed.white(`         - ${item.error}`)}`);
                }
            });
            clivas.line('--------');
        });
};

