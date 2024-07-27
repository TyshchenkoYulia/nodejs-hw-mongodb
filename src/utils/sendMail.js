import { SMTP } from '../constants/index.js';
import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import env from '../utils/env.js';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  secure: true,
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

const sendMail = async (options) => {
  try {
    const send = await transporter.sendMail(options);

    return send;
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export default sendMail;
