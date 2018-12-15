import expect from 'expect';
import request from 'supertest';
import { goodUser, populateProviders } from '../__tests__/seed/seed';
import app from '../index';

beforeEach(populateProviders);

describe('GET /providers', () => {
  it('should show response to logged in users', done => {
    request(app)
      .get('/providers', (data, d) => console.log(data, d))
      .query({
        min_discharges: 50,
        max_discharges: 100,
        min_average_covered_charges: 1000,
        max_average_medicare_payments: 10000
      })
      .query('cache', false)
      .set('x-auth', goodUser.tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(typeof res.body[0]['Average Covered Charges']).toBe('string')
        expect(typeof res.body[0]['Average Medicare Payments']).toBe('string')
        expect(typeof res.body[0]['Average Total Payments']).toBe('string')
        expect(typeof res.body[0]['Hospital Referral Region Description']).toBe('string')
        expect(typeof res.body[0]['Provider City']).toBe('string')
        expect(typeof res.body[0]['Provider Name']).toBe('string')
        expect(typeof res.body[0]['Provider State']).toBe('string')
        expect(typeof res.body[0]['Provider Street Address']).toBe('string')
        expect(typeof res.body[0]['Provider Zip Code']).toBe('number')
        expect(typeof res.body[0]['Total Discharges']).toBe('number')
        expect(typeof res.body[0]['Total Discharges']).toBe('number')
      })
      .end(error => done(error && error));
  });

  it('should return 401 for logged out visitors', done => {
    request(app)
      .get('/providers')
      .expect(401)
      .end(error => done(error && error));
  });
});
