import _ from 'lodash';
import chalk from 'chalk';
import clivas from 'clivas';

export default specDescription => (result) => {
    clivas.clear();
    clivas.line('--------');
    clivas.line(specDescription);
    clivas.line('--------');
    _.forIn(result.results, (item) => {
        if (item instanceof Error) {
            clivas.line(chalk.bgRed.white(item.stack));
            return;
        }

        const statusColors = {
            wait: chalk.cyan.bold.inverse,
            pass: chalk.green.bold.inverse,
            fail: chalk.red.bold.inverse,
        };
        const status = statusColors[item.result](` ${item.result.toUpperCase()} `);
        const description = chalk.gray.bold(item.description);
        clivas.line(` ${status}  ${description}`);
        if (item.result === 'fail') {
            clivas.line(` ${chalk.bgRed.white(`         - ${item.error}`)}`);
        }
    });
    clivas.line('--------');
};
