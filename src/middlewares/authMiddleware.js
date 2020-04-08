import jwt from 'jsonwebtoken';
import config from '../config/config';
import logger from '../helpers/logger';
import APIError from '../errors/APIError';

/**
 * Auth Middleware
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export default function auth(req, res, next) {
  logger.silly('authMiddleware.auth.start');

  // get token from bearer token
  const token = getBearerToken(req.headers.authorization);

  // check if token empty
  if (!token) {
    logger.error('authMiddleware.auth.noToken');
    // pass 403 error to next handler if empty token
    next(
      new APIError(
        'authMiddleware.auth.noToken',
        'nonAuth',
        403,
        'Non Authorized, please log in first.'
      )
    );
  }

  // verify token
  try {
    // set req.user = decoded jwt token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    logger.silly('authMiddleware.auth.success');
    // call next handler
    next();
  } catch (err) {
    logger.error('authMiddleware.auth.tokenInvalid');
    // pass 403 error to next handler if token invalid
    next(
      new APIError(
        'authMiddleware.auth.tokenInvalid',
        err.name,
        403,
        'Non Authorized, please log in first.'
      )
    );
  }
}

/**
 * Get Bearer Token from headers['authorization']
 * @param {string} authHeader headers['authorization']
 * @return {string} bearerToken / null
 */
function getBearerToken(authHeader) {
  logger.silly('authMiddleware.getBearerToken.start');
  const bearerHeader = authHeader;

  if (bearerHeader) {
    // get token in bearer header
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    logger.silly('authMiddleware.getBearerToken.success');
    return bearerToken;
  } else {
    // return null if no bearer header
    logger.error('authMiddleware.getBearerToken.empty');
    return null;
  }
}
