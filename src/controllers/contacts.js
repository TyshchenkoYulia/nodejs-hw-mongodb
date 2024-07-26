import {
  // getContactById,
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} from '../services/contact.js';
import { contactFieldList } from '../constants/contacts-constants.js';
import env from '../utils/env.js';
import createHttpError from 'http-errors';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseContactFilterParams from '../utils/parseContactFilterParams.js';
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, contactFieldList);
  const filterIsFavourite = { ...parseContactFilterParams(req.query), userId };

  const data = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filterIsFavourite,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!!!',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;

  const data = await getContacts({ _id: contactId, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const data = await addContact({ ...req.body, userId, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};
export const patchContactController = async (req, res, next) => {
  const { _id: userId } = req.user;


  const { contactId } = req.params;



  

  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }


  const result = await updateContact(
    { _id: contactId, userId },
    {
      ...req.body,
      photo: photoUrl,
    },
  );


  if (!result) {
    next(createHttpError(404, 'Contact with id ${contactId} not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const result = await deleteContact({ _id: contactId, userId });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).json({
    status: 204,
  });
};
