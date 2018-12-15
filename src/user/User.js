import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const USERS_SECRET =
  process.env.USERS_SECRET || 'kkewiudc23aha87sadasb32n223';

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

UserSchema.statics.findByToken = function findByToken(token) {
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, USERS_SECRET);
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

UserSchema.statics.findByEmailPassword = function findByEmailPassword(
  email,
  password
) {
  const User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject('No user found...');
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, success) => {
        if (success) {
          resolve(user);
        }
        reject('The credentials are not valid');
      });
    });
  });
};

UserSchema.methods.toJSON = function toJSON() {
  const user = this;
  const userObject = user.toObject();
  return {
    id: userObject._id,
    email: userObject.email,
    password: userObject.password
  };
};

UserSchema.methods.generateAuthToken = function generateAuthToken() {
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, USERS_SECRET)
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => token);
};

UserSchema.methods.removeAuthToken = function removeAuthToken(token) {
  const user = this;

  return user
    .update({
      $pull: {
        tokens: {
          token
        }
      }
    })
    .then(() => token);
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

export const User = mongoose.model('User', UserSchema);
