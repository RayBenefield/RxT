import chalk from 'chalk';
import clivas from 'clivas';

export default specDescription => (result) => {
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
};
