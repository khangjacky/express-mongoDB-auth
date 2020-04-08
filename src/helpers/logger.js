import winston from 'winston';
import config from '../config/config';

/**
 * logger Custom field (optional)
 * entry - entry point of error
 * details - eror details
 * usage: logger.error('message', {entry: 'entry', details: 'details'})
 */

// add custom level & colors for morgan
const winstonCustomConfig = {
  levels: {
    ...winston.config.npm.levels,
    http: 7
  },
  colors: {
    ...winston.config.npm.colors,
    http: 'yellow'
  }
};

winston.addColors(winstonCustomConfig.colors);

// create logger
const logger = winston.createLogger({
  level: config.winstonLevel,
  levels: winstonCustomConfig.levels,
  format: winston.format.combine(
    winston.format.uncolorize(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // write logs level error and below to error.log
    new winston.transports.File({
      filename: config.errorLog,
      level: 'error'
    }),
    // write logs level info and below to combined.log
    new winston.transports.File({
      filename: config.combinedLog,
      level: 'info'
    })
  ]
});

// show log message in console
logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format(info => {
        info.level = `${info.timestamp} [${info.level.toUpperCase()}]:`;
        return info;
      })(),
      winston.format.colorize({ all: true }),
      winston.format.printf(info => {
        let entryPoint = info.entry ? `<${info.entry}>` : '';
        let errorDetails = info.details ? `\n\t${info.details}` : '';
        return `${info.level} ${info.message} ${entryPoint} ${errorDetails}`;
      })
    )
  })
);

// for morgan logging
logger.stream = {
  write(message) {
    logger.log('http', message.substring(0, message.lastIndexOf('\n')));
  }
};

export default logger;
