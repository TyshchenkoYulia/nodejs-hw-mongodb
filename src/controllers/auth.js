import createHttpError from 'http-errors';
import { findUser, signup } from '../services/auth.js';
import { compareHash } from '../utils/hash.js';

export const registerController = async (req, res) => {
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

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(404, 'Email not found !!!');
  }

  const passwordCompare = await compareHash(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Password invalid !!!');
  }

  res.status(201).json({});
};
