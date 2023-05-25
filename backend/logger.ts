import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
    level: 'info', // Set the log level according to your needs
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'file.log'}) // Set the desired path for your log file
    ]
});

export default logger;
