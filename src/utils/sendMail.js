import nodemailer from 'nodemailer';
import 'dotenv/config';
import createHttpError from 'http-errors';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

const nodemailerConfig = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendMail = async (data) => {
  //   const email = { ...data, from: SMTP_USER };
  //   return transport.sendMail(email);

  try {
    const email = { ...data, from: SMTP_USER };
    const send = await transport.sendMail(email);
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
