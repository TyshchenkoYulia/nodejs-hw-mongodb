import createHttpError from 'http-errors';
import {
  findUser,
  signup,
  requestResetToken,
  resetPassword,
  loginUser,
  // logoutUser,
} from '../services/auth.js';
import {
  createSession,
  deleteSession,
  findSession,
} from '../services/session.js';

const setupResponseSession = (
  res,
  { refreshToken, refreshTokenValidUntil, _id },
) => {
  console.log('22222222');

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });

  if (user) {
    throw createHttpError(409, 'Email in use!!!');
  }
  const newUser = await signup(req.body);

  // const payload = {
  //   id: newUser._id,
  //   email,
  // };

  // const token = jwt.sign(payload, jwt_secret);

  // const emailTemplateSource = await fs.readFile(verifyEmailPath, 'utf-8');
  // const emailTemplate = handlebars.compile(emailTemplateSource);
  // const html = emailTemplate({
  //   project_name: 'My contacts',
  //   app_domain,
  //   token,
  // });

  // const verifyEmail = {
  //   subject: 'Verify email',
  //   to: email,
  //   html,
  // };

  // await sendMail(verifyEmail);

  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered an user!!!',
    data,
  });
};

// export const verifyController = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const { id, email } = jwt.verify(token, jwt_secret);

//     const user = await findUser({ _id: id, email });
//     if (!user) {
//       throw createHttpError(404, 'User not found !!!');
//     }

//     await updateUser({ email }, { verify: true });

//     res.json({
//       status: 200,
//       message: 'Email verify successfully !!!',
//     });
//   } catch (error) {
//     throw createHttpError(401, error.message);
//   }
// };

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const currentSession = await findSession({ _id: sessionId, refreshToken });
  if (!currentSession) {
    throw createHttpError(401, 'Session not found !!!');
  }

  const refreshTokenExpiered =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (refreshTokenExpiered) {
    throw createHttpError(401, 'Session expired !!!');
  }

  const newSession = await createSession(currentSession.userId);
  setupResponseSession(res, newSession);
  res.json({
    status: 200,
    message: 'Successfully refreshed a session !!!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await deleteSession(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
