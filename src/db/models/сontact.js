import { Schema, model } from 'mongoose';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';
import { typeList } from '../../constants/contacts-constants.js';

const contactShema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: false,
      default: 'personal',
    },
  },

  { timestamps: true, versionKey: false },
);

contactShema.post('save', mongooseSaveError);
contactShema.pre('findOneAndUpdate', setUpdateSettings);
contactShema.post('findOneAndUpdate', mongooseSaveError);

const Contact = model('contact', contactShema);

export default Contact;
