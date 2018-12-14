import {
  users,
  populateUsers,
  providers,
  populateProviders
} from './__tests__/seed/seed';
import server from './index';

import expect from 'expect';
import request from 'supertest';
import app from './index';

// beforeEach(populateUsers);
// beforeEach(populateProviders);

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
  it('should return 401 for logged out visitors', done => {
    request(app)
      .get('/profile')
      .expect(401)
      .end((err) => done(err && err));
  });
});

describe('GET /providers', () => {
  it('should redirect logged out users to login / signup page', done => {
    request(app)
      .get('/providers')
      .expect(401)
      .end((err) => done(err && err));
  });
});
