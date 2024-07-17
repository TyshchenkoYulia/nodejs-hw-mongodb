import createHttpError from 'http-errors';
import { findUser, signup } from '../services/auth.js';

export const signupController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  const newUser = await signup(req.body);

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};
