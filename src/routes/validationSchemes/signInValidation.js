import { Joi } from 'express-validation';

/**
 * validate Log In API
 * @validate email required, email format
 * @validate password: required
 */
const signInValidation = {
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'email error',
        'string.empty': 'email required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'password required'
      })
  })
};

export default signInValidation;
