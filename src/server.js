import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import env from './utils/env.js';
import { getContactById, getContacts } from './services/contacts.js';

const port = env('PORT', '3000');

const setupServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(logger);
  app.use(cors());

  app.get('/api/contacts', async (req, res) => {
    const data = await getContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!!',
      data,
    });
  });

  app.get('/api/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const data = await getContactById(contactId);

      if (!data) {
        return res.status(404).json({
          message: `Contact with id=${contactId} not found`,
        });
      }

      res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}`,
        data,
      });
    } catch (error) {
      const { status = 500 } = error;
      res.status(status).json({
        message: error.message,
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(port, () => console.log(`Server is running on port ${port}`));
};

export default setupServer;
