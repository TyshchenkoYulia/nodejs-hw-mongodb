import Contact from '../db/models/contact.js';

export const getContacts = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);
