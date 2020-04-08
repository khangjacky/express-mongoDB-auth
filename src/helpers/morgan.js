import morgan from 'morgan';
import config from '../config/config';
import logger from './logger';

/**
 * HTTP request logger Middleware
 * doc: https://github.com/expressjs/morgan
 */
// Custom morgan format
morgan.token('req-headers', function(req, res) {
  return JSON.stringify(req.headers);
});
morgan.token('req-body', function(req, res) {
  return JSON.stringify(req.body);
});
const morganFormat =
  config.env === 'production'
    ? 'combined'
    : ':method :url :status :res[content-length] - :response-time ms \n' +
      '\tHEADER: :req-headers \n' +
      '\tBODY: :req-body';

// stream morgan log to logger
export default morgan(morganFormat, {
  stream: logger.stream
});
