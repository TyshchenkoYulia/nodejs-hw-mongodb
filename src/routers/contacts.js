import { Router } from 'express';
import {
  getAllContactsController,
  getContactsByIdController,
} from '../controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/', getAllContactsController);

contactsRouter.get('/:contactId', getContactsByIdController);

export default contactsRouter;
