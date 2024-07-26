import { Schema, model } from 'mongoose';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const contactShema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name must be'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'PhoneNumber must be'],
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
      enum: ['work', 'home', 'personal'],
      required: false,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    photo: { type: String },
  },

  { timestamps: true, versionKey: false },
);

contactShema.post('save', mongooseSaveError);
contactShema.pre('findOneAndUpdate', setUpdateSettings);
contactShema.post('findOneAndUpdate', mongooseSaveError);

const Contact = model('contact', contactShema);

export default Contact;
