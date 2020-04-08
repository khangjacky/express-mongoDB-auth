import { Joi } from 'express-validation';

/**
 * validate User Registeration API
 * @validate userName: required
 * @validate email required, email format
 * @validate password: required
 */
const signUpValidation = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
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

export default signUpValidation;
