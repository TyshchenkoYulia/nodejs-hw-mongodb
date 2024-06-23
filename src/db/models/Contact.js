import { Schema, model } from 'mongoose';

const contactShema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumbe: {
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
      enum: ['work', 'home', 'personal'],
      required: false,
      default: 'personal',
    },
  },
  { timestamps: true, versionKey: false },
);

const Contact = model('contacts', contactShema);

export default Contact;
