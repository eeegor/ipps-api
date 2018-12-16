import expect from 'expect';
import request from 'supertest';
import { goodUser, badUser, populateUsers } from '../__tests__/seed/seed';
import { User } from './User';
import app from '../index';

beforeEach(populateUsers);

describe('POST /signup', () => {
  it('should create a new user', done => {
    const email = 'bob@example.com';
    const password = 'bobs-secret';

    request(app)
      .post('/signup')
      .send({ email, password })
      .expect(201)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.id).toBeTruthy();
        expect(res.body.email).toEqual(email);
      })
      .end(error => {
        if (error) {
          return done(error);
        }

        User.findOne({ email }).then(user => {
          expect(user).toBeTruthy();
          expect(user.password).not.toEqual(password);
        });
        done();
      });
  });

  it('should return validation errors for new user', done => {
    const email = 'bob@example.com';

    request(app)
      .post('/signup')
      .send({ email })
      .expect(400)
      .end(error => done(error && error));
  });

  it('should not create user if email exists', done => {
    const email = goodUser.email;

    request(app)
      .post('/signup')
      .send({ email })
      .expect(400)
      .end(error => done(error && error));
  });
});

describe('POST /login', () => {
  it('should login user and generate token', done => {
    request(app)
      .post('/login')
      .send({
        email: goodUser.email,
        password: goodUser.password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end(error => {
        if (error) {
          return done(error);
        }

        User.findById(goodUser._id)
          .then(user => {
            expect(user.tokens[0]).toHaveProperty('access', 'auth');
            expect(user.tokens[0]).toHaveProperty('token');
            expect(typeof user.tokens[0].token).toBe('string');
            done();
          })
          .catch(error => done(error && error));
      });
  });

  it('should not login user and not generate token', done => {
    request(app)
      .post('/login')
      .send({
        email: badUser.email,
        password: 'wrong-password'
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).not.toBeTruthy();
      })
      .end(error => {
        if (error) {
          return done(error);
        }

        User.findById(badUser._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(error => done(error && error));
      });
  });
});

describe('GET /profile', () => {
  it('should return profile for logged in user', done => {
    request(app)
      .get('/profile')
      .set('x-auth', goodUser.tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.id).toBe(goodUser._id.toHexString());
        expect(res.body.email).toBe(goodUser.email);
      })
      .end(error => done(error && error));
  });

  it('should return 401 for logged out visitors', done => {
    request(app)
      .get('/profile')
      .expect(401)
      .end(error => done(error && error));
  });
});
