import Joi from 'joi';
// import emailRegexp from '../constants/users.js';

export const userSignupSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
