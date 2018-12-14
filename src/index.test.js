import expect from 'expect';
import request from 'supertest';
import {
  users,
  populateUsers,
  providers,
  populateProviders
} from './__tests__/seed/seed';
import app from './index';
import { User } from './user/User';

beforeEach(populateUsers);
beforeEach(populateProviders);

describe('GET /', () => {
  it('should show root path', done => {
    request(app)
      .get('/')
      .expect('Ipps Patients Data Api')
      .expect(200)
      .end(err => done(err && err));
  });
});

describe('POST /users', () => {
  it('should create a new user', done => {
    const email = 'bob@example.com';
    const password = 'bobs-secret';

    request(app)
      .post('/users')
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
      .post('/users')
      .send({ email })
      .expect(400)
      .end(err => done(err && err));
  });

  it('should not create user if email exists', done => {
    const email = users[0].email;

    request(app)
      .post('/users')
      .send({ email })
      .expect(400)
      .end(err => done(err && err));
  });
});

describe('GET /profile', () => {
  it('should return profile for logged in user', done => {
    request(app)
      .get('/profile')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(err => done(err && err));
  });

  it('should return 401 for logged out visitors', done => {
    request(app)
      .get('/profile')
      .expect(401)
      .end(err => done(err && err));
  });
});

describe('GET /providers', () => {
  it('should show list of providers', done => {
    request(app)
      .get('/providers')
      .expect(200)
      .end(err => done(err && err));
  });
});
