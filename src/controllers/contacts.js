import { getContactById, getContacts } from './services/contact.js';

export const getAllContactsController = async (req, res) => {
  const data = await getContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts!!!',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
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
};
