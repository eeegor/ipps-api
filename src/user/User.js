import mongoose from 'mongoose';
import validator from 'validator';

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 3,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

export default User;
