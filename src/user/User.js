import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const USERS_SALT = 'salted-hash-goes-here';

const UserSchema = new mongoose.Schema({
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

// eslint-disable-next-line func-names
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return {
    id: userObject._id,
    email: userObject.email
  };
};

// eslint-disable-next-line func-names
UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, USERS_SALT);
  } catch (error) {
    return Promise.reject(error);
  }
  const result = User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
  return result;
};

// eslint-disable-next-line func-names
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, USERS_SALT)
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => token);
};

const User = mongoose.model('User', UserSchema);

export default User;
