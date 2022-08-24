/* eslint-disable no-shadow */
const { format, createLogger, transports } = require('winston');

const {
    timestamp, combine, colorize, errors, printf,
} = format;

const devLogger = () => {
    const logFormat = printf(({
        level, message, timestamp, stack,
    }) => `${timestamp} ${level}: ${stack || JSON.stringify(message, null, 2)}`);

    return createLogger({
        format: combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            logFormat,
        ),
        transports: [new transports.Console()],
    });
};

module.exports = devLogger;
