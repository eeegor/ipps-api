import request from 'supertest';
import app from './index';

describe('GET /', () => {
  it('should show root path', done => {
    request(app)
      .get('/')
      .expect('Ipps Patients Data Api')
      .expect(200)
      .end(error => done(error && error));
  });
});
