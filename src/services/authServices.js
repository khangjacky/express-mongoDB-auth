import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import APIError from '../errors/APIError';
import logger from '../helpers/logger';
import config from '../config/config';
import { createUser } from './userServices';

/**
 * Sign In
 * @param {string} email user email
 * @param {string} password user password
 * @return {Promise<Object>} token, email
 */
export async function signIn(email, password) {
  logger.silly('authServices.logIn.start');
  /// check if user exist
  let user = await User.findOne({ email }).lean();
  // if user not exist, return Promise.reject(Error)
  if (!user) {
    logger.error('authServices.logIn.userNotFound');
    return Promise.reject(
      new APIError(
        'authServices.logIn.userNotFound',
        'authFail',
        404,
        'Email / Password Incorrect'
      )
    );
  }

  /// Log In
  logger.silly('authServices.logIn.comparePassword');
  // compare password with db
  if (await argon2.verify(user.password, password)) {
    logger.silly('authServices.logIn.success');
    // if password correct, create jwt token & return resolve(logIn details)
    return Promise.resolve({
      token: generateToken(user),
      email: email,
    });
  } else {
    // if password incorrect, return reject(Error)
    logger.error('authServices.logIn.passwordNotMatch');
    return Promise.reject(
      new APIError(
        'authServices.logIn.passwordNotMatch',
        'authFail',
        404,
        'Email / Password Incorrect'
      )
    );
  }
}

/**
 * Sign Up by using createUser and generate JWT token if success
 * @param {string} userName
 * @param {string} email
 * @param {string} password
 * @return {Promise} email, token: JWT Token
 */
export async function signUp(userName, email, password) {
  logger.silly('authServices.signUp');
  try {
    let user = await createUser(userName, email, password);
    return Promise.resolve({
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    logger.error('authServices.signUp.fail');
    return Promise.reject(error);
  }
}

/**
 * Generate JWT Token
 * @param {mongoose.Model} user
 * @return {string} jwtToken
 */
function generateToken(user) {
  logger.silly(`authServices.generateToken.start - ${user._id}`);
  // generate jwt token & return
  return jwt.sign(
    {
      _id: user._id,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpired } // set expiry date
  );
}
