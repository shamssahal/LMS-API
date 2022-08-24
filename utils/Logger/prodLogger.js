const { format, createLogger, transports } = require('winston');

const {
    timestamp, combine, json, errors,
} = format;

const prodLogger = () => createLogger({
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json(),
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console(),
    ],
});

module.exports = prodLogger;
