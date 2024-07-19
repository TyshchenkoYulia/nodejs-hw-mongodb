import createHttpError from 'http-errors';
import { findSession } from '../services/session.js';
import { findUser } from '../services/auth.js';

const authenticate = async (req, res, next) => {
  const authHeder = req.get('Authorization');
  if (!authHeder) {
    return next(createHttpError(401, 'Authorization header missing!'));
  }

  const [bearer, accessToken] = authHeder.split(' ');

  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Token must have Bearer type!'));
  }

  if (!accessToken) {
    return next(createHttpError(401, 'Token missing!'));
  }

  const session = await findSession({ accessToken });
  if (!session) {
    return next(createHttpError(401, 'Session not found!'));
  }

  const accessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (accessTokenExpired) {
    return next(createHttpError(401, 'Access token expired!'));
  }

  const user = await findUser({ _id: session.userId });
  if (!user) {
    return next(createHttpError(401, 'User not found!'));
  }

  req.user = user;
  next();
};

export default authenticate;
