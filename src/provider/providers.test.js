import expect from 'expect';
import request from 'supertest';
import {
  goodUser,
  populateProviders,
  flushRedis,
  providers
} from '../__tests__/seed/seed';
import app from '../index';

beforeEach(populateProviders);
beforeEach(flushRedis);

describe('GET /providers', () => {
  it('should show response to logged in users', done => {
    request(app)
      .get('/providers')
      .query({
        cache: false,
        min_discharges: 50,
        max_discharges: 100,
        min_average_covered_charges: 1000,
        max_average_medicare_payments: 10000
      })
      .set('x-auth', goodUser.tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.headers['x-db-engine']).toBe('mongo');
        expect(typeof res.body[0]['Average Covered Charges']).toBe('string');
        expect(typeof res.body[0]['Average Medicare Payments']).toBe('string');
        expect(typeof res.body[0]['Average Total Payments']).toBe('string');
        expect(typeof res.body[0]['Hospital Referral Region Description']).toBe(
          'string'
        );
        expect(typeof res.body[0]['Provider City']).toBe('string');
        expect(typeof res.body[0]['Provider Name']).toBe('string');
        expect(typeof res.body[0]['Provider State']).toBe('string');
        expect(typeof res.body[0]['Provider Street Address']).toBe('string');
        expect(typeof res.body[0]['Provider Zip Code']).toBe('number');
        expect(typeof res.body[0]['Total Discharges']).toBe('number');
        expect(typeof res.body[0]['Total Discharges']).toBe('number');
      })
      .end(error => done(error && error));
  });

  it('should return valid pagination', done => {
    request(app)
      .get('/providers')
      .query({
        cache: false,
        per_page: 5,
        page: 2
      })
      .set('x-auth', goodUser.tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(3);
        expect(parseInt(res.headers['x-current-page-limit'], 10)).toBe(5);
        expect(parseInt(res.headers['x-current-page'], 10)).toBe(2);
      })
      .end(error => done(error && error));
  });

  it('should return valid count', done => {
    request(app)
      .get('/providers')
      .query({
        cache: false
      })
      .set('x-auth', goodUser.tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(providers.length);
        expect(parseInt(res.headers['x-total-count'], 10)).toBe(
          providers.length
        );
      })
      .end(error => done(error && error));
  });

  it('should return valid provider state', done => {
    request(app)
      .get('/providers')
      .query({
        cache: false,
        state: 'TX'
      })
      .set('x-auth', goodUser.tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(4);
      })
      .end(error => done(error && error));
  });

  it('should return 401 for logged out visitors', done => {
    request(app)
      .get('/providers')
      .expect(401)
      .end(error => done(error && error));
  });

  it('should return cached response', done => {
    request(app)
      .get('/providers')
      .query({
        state: 'TX'
      })
      .set('x-auth', goodUser.tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(4);
      })
      .end(error => {
        if (error) {
          return done(error);
        }
        return request(app)
          .get('/providers')
          .query({
            state: 'TX'
          })
          .set('x-auth', goodUser.tokens[0].token)
          .expect(200)
          .expect(res => {
            expect(res.body.length).toBe(4);
            expect(res.headers['x-db-engine']).toBe('redis');
          })
          .end(error => done(error));
      });
  });

  it('should return empty object if no search query matches', done => {
    request(app)
      .get('/providers')
      .set('x-auth', goodUser.tokens[0].token)
      .query({
        cache: false,
        state: 'Non-existing'
      })
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(0);
      })
      .end(error => done(error && error));
  });
});
