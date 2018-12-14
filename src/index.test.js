import expect from 'expect';
import {
  users,
  populateUsers,
  providers,
  populateProviders
} from './__tests__/seed/seed';

import request from 'supertest';
import app from './index';

beforeEach(populateUsers);
beforeEach(populateProviders);

describe('GET /', () => {
  it('should show root path', done => {
    request(app)
      .get('/')
      .expect('Ipps Patients Data Api')
      .expect(200)
      .end((err) => done(err && err));
  });
});

describe('GET /profile', () => {
  it('should return profile for logged in user', done => {
    request(app)
      .get('/profile')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end((err) => done(err && err));
  });

  it('should return 401 for logged out visitors', done => {
    request(app)
      .get('/profile')
      .expect(401)
      .end((err) => done(err && err));
  });
});

describe('GET /providers', () => {
  it('should show list of providers', done => {
    request(app)
      .get('/providers')
      .expect(200)
      .end((err) => done(err && err));
  });
});
