import Contact from '../db/models/сontact.js';

export const getContacts = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);
