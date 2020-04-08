import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { validateEmail } from './validate';

const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema(
  {
    userName: {
      type: String,
      require: [true, 'Please enter user name']
    },

    email: {
      type: String,
      require: true,
      unique: true,
      validate: [
        {
          validator: validateEmail,
          msg: 'Invalid email',
          type: 'invalid-email' // custom validate.type as error type
        }
      ]
    },

    password: {
      type: String,
      required: [true, 'Please enter password']
    },

    salt: String,

    role: {
      type: String,
      default: 'user'
    }
  },
  { timestamps: true }
);

// set error type of uniqueValidator
userSchema.plugin(uniqueValidator, { type: 'unique-custom' });

// declare mongoose model
const User = mongoose.model('User', userSchema);

export default User;
