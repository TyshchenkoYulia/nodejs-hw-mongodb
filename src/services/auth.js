import { SMTP } from '../constants/index.js';
import { hashValue } from '../utils/hash.js';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import sendMail from '../utils/sendMail.js';
import env from '../utils/env.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Session } from '../db/models/session.js';
import { createSession } from './session.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';

export const findUser = (filter) => User.findOne(filter);

export const updateUser = (filter, data) =>
  User.findByIdAndUpdate(filter, data);

export const signup = async (data) => {
  const { password } = data;
  const hashPassword = await hashValue(password);

  return User.create({ ...data, password: hashPassword });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await Session.deleteOne({ userId: user._id });

  const session = createSession(user._id);
  return session;
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  await sendMail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a target="_blank" href="${env(
      'APP_DOMAIN',
    )}/auth/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await User.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession();

  return await Session.create({
    userId: user._id,
    ...newSession,
  });
};
