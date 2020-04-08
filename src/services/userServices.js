import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import User from '../models/userModel';
import APIError from '../errors/APIError';
import logger from '../helpers/logger';

/**
 * Create User
 * @param {string} userName user name
 * @param {string} email unique email
 * @param {string} password user password
 * @return {Promise} id: user id, email, userName
 */
export async function createUser(userName, email, password) {
  logger.silly('userServices.createUser.checkDuplicateEmail');

  /// check duplicate email
  let user = await User.findOne({ email }).lean();
  // if duplicate, return Promise.reject(error)
  if (user) {
    logger.error('userServices.createUser.emailDuplicated');
    return Promise.reject(
      new APIError(
        'userServices.createUser.emailDuplicated',
        'validationError',
        400,
        'Email exist, please enter new email'
      )
    );
  }

  /// create user
  logger.silly('userServices.createUser.startCreate');
  // create salt & hash password
  let salt = randomBytes(32);
  let hashedPassword = await argon2.hash(password, { salt });

  // add user to db
  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
    salt,
  });

  // return save result
  return newUser
    .save()
    .then((user) => {
      // if save success, return resolve(user details)
      return Promise.resolve({
        id: user._id,
        userName: user.userName,
        email: user.email,
      });
    })
    .catch((error) => {
      logger.error('userServices.createUser.saveError', { details: error });
      // if save error, return reject(Error)
      return Promise.reject(
        new APIError(
          'userServices.createUser.saveError',
          'userCreateFail',
          500,
          'User Create Fail'
        )
      );
    });
}

/**
 * Get User Profile by ID
 * @param {string} _id user ID
 * @return {Promise} name: user name
 */
export async function getUserProfile(_id) {
  logger.silly('userServices.getUserProfile.start');

  /// check if user exist
  let user = await User.findOne({ _id });
  // if user not exist, return reject(Error)
  if (!user) {
    logger.error('userServices.getUserProfile.userNotFound');
    return Promise.reject(
      new APIError(
        'userServices.getUserProfile.userNotFound',
        'userNotFound',
        404,
        'User Not Found'
      )
    );
  }

  // return user profile
  return Promise.resolve({
    name: user.userName,
  });
}
