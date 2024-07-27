import { OAuth2Client } from 'google-auth-library';
import { readFile } from 'fs/promises';
import path from 'node:path';
import env from '../utils/env.js';
import createHttpError from 'http-errors';

export const googleAuthSettingsPath = path.resolve('google-auth.json');
const googleAuthSettings = JSON.parse(await readFile(googleAuthSettingsPath));

const clientId = env('GOOGLE_AUTH_CLIENT_ID');
const clientSecret = env('GOOGLE_AUTH_CLIENT_SECRET');

const googleAuthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri: googleAuthSettings.web.redirect_uris[0],
});

export const getFullNameFromGoogleTokenPayload = ({
  given_name,
  family_name,
}) => {
  let fullName = 'Guest';
  if (given_name && family_name) {
    fullName = `${given_name} ${family_name}`;
  } else if (given_name) {
    fullName = given_name;
  }

  return fullName;
};

export const generateAuthUrl = () =>
  googleAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleAuthClient.getToken(code);

  if (!response.tokens.id_token) {
    throw createHttpError(401, 'Google OAuth code invalid');
  }

  const ticket = await googleAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};
