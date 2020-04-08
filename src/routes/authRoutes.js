import express from 'express';
import { validate } from 'express-validation';
import signInValidation from './validationSchemes/signInValidation';
import signUpValidation from './validationSchemes/signUpValidation';
import { signIn, signUp } from '../services/authServices';
import logger from '../helpers/logger';

let router = express.Router();

/**
 * Sign In API
 * @api {post} /api/auth/sign_in
 * @apiGroup auth
 *
 * @apiParam {string} email
 * @apiParam {string} password
 *
 * @apiSuccess {number}   status=200
 * @apiSuccess {string}   message="ok"
 * @apiSuccess {Object[]} data
 * @apiSuccess {string}   data.token  JWT token
 * @apiSuccess {string}   data.email  logged in email
 */
router.post(
  '/sign_in',
  validate(signInValidation, {}, { abortEarly: false }),
  (req, res, next) => {
    logger.silly('authRoute.logIn.start');
    const { email, password } = req.body;
    signIn(email, password)
      .then(response => {
        logger.silly('authRoute.logIn.success');
        res.send({
          status: 200,
          message: 'ok',
          data: {
            token: response.token,
            email: response.email
          }
        });
      })
      .catch(err => {
        logger.error('authRoute.logIn.fail');
        next(err);
      });
  }
);

/**
 * Sign Up API
 * @api {post} /api/auth/sign_up
 * @apiGroup auth
 *
 * @apiParam {string} userName
 * @apiParam {string} email
 * @apiParam {string} password
 *
 * @apiSuccess {number}   status=200
 * @apiSuccess {string}   message="ok"
 * @apiSuccess {Object[]} data
 * @apiSuccess {string}   data.token    JWT Token
 * @apiSuccess {string}   data.email    registered email
 */
router.post(
  '/sign_up',
  validate(signUpValidation, {}, { abortEarly: false }),
  (req, res, next) => {
    logger.silly('userRoute.registerUser.start');

    const { userName, email, password } = req.body;

    signUp(userName, email, password)
      .then(response => {
        logger.silly('userRoute.createUser.success');
        res.send({
          status: 200,
          message: 'ok',
          data: {
            token: response.token,
            email: response.email
          }
        });
      })
      .catch(error => {
        logger.error('userRoute.createUser.fail');
        next(error);
      });
  }
);

export default router;
