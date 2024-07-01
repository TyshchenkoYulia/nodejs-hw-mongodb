import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import env from './utils/env.js';
import { contactsRouter } from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const port = env('PORT', '3000');

const setupServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(express.json());
  app.use(cors());
  app.use(logger);

  app.use('/contacts', contactsRouter);
  // app.use('/contacts/:contactId', contactsRouter);

  app.use(notFoundHandler);

  app.listen(port, () => console.log(`Server is running on port ${port}`));
};

export default setupServer;
