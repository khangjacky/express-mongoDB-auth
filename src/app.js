import express from 'express';
import mongoose from 'mongoose';
import { ValidationError } from 'express-validation';
import status from 'http-status';
import cors from 'cors';

import config from './config/config';
import logger from './helpers/logger';
import morgan from './helpers/morgan';
import APIError from './errors/APIError';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

/**
 * connect DB
 */
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('MongoDB Connected'))
  .catch((err) => logger.error(err));

// express
const app = express();

// cors options
app.use(cors());

// Bodyparser Middleware
app.use(express.json());

// HTTP request logger Middleware
app.use(morgan);

// Router
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// forward 404 not found to error handler
app.use((req, res, next) => {
  const err = new APIError(
    'app.req.404NotFound',
    'pageNotFound',
    404,
    'Page Not Found'
  );
  next(err);
});

/// Error Handlers
/**
 * set default error status code = 500
 */
app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;
  next(err);
});

/**
 * API Error Structure
 *
 * @apiError {string} type error type
 * @apiError {number} status=500
 * @apiError {string} message
 * @apiError {string} error description
 * @apiError {Object[]} [details]
 */

/**
 * Validation Error Handler
 */
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    // construct response JSON
    let responseErr = {
      type: err.type,
      status: err.statusCode,
      message: err.message,
      error: err.error,
      details: err.details.body.map((body) => {
        return {
          message: body.message,
          path: body.path,
          type: body.type,
        };
      }),
    };

    logger.error('Input JOI ValidationError', {
      details: JSON.stringify(responseErr),
    });
    return res.status(err.statusCode).send(responseErr);
  }
  next(err);
});

/**
 * General Error Handler
 */
app.use(function (err, req, res, next) {
  logger.error(err);

  res.status(err.statusCode).json({
    type: err.type,
    status: err.statusCode,
    message: err.message,
    error: status[err.statusCode],
  });
});

export default app;
