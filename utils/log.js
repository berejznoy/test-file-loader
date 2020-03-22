const winston = require('winston');

function logger(module) {

    return new winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                defaultMeta: { service: 'your-service-name' },
                handleExceptions: true,
                format: winston.format.combine(
                    winston.format.splat(),
                    winston.format.label({ label: getFilePath(module) }),
                    winston.format.colorize(),
                    winston.format.printf(nfo => {
                        return `${nfo.level}: ${nfo.message}`;
                    })
                )
            })
        ],
        exitOnError: false
    });
}

function getFilePath(module) {
    // Add filename in log statements
    return module.filename.split('/').slice(-2).join('/');
}

module.exports = logger;
