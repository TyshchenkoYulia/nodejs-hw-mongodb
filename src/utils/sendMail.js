import { SMTP } from '../constants/index.js';
import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import env from './env.js';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  secure: false,
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

console.log(transporter);
const transport = nodemailer.createTransport(transporter);

const sendMail = async (options) => {
  // console.log(options);
  try {
    const send = await transport.sendMail(options);

    console.log(send);

    return send;
  } catch (error) {
    console.log(error.message);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export default sendMail;
