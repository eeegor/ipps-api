import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
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

UserSchema.methods.toJSON = function toJSON() {
  const user = this;
  const userObject = user.toObject();
  return {
    id: userObject._id,
    email: userObject.email,
    password: userObject.password
  };
};

UserSchema.statics.findByToken = function findByToken(token) {
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

UserSchema.methods.generateAuthToken = function generateAuthToken() {
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, USERS_SALT)
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => token);
};

// eslint-disable-next-line consistent-return
UserSchema.pre('save', function preSave(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) {
        Promise.reject(saltError);
      }
      bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) {
          Promise.reject(hashError);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
