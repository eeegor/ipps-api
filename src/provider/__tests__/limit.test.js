import { limit } from '../ProviderController';

describe('limit', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // this is important
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
    process.env.PER_PAGE = 80;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('Should output valid limit number', () => {
    const req = {
      query: {
        per_page: 11
      }
    };
    const unit = limit(req);
    expect(unit).toEqual(11);
  });

  it('Should handle string numbers', () => {
    const req = {
      query: {
        per_page: '11'
      }
    };
    const unit = limit(req);
    expect(unit).toEqual(11);
  });

  it('Should output page 1 on negative number', () => {
    const req = {
      query: {
        per_page: -11
      }
    };
    const unit = limit(req);
    expect(unit).toEqual(process.env.PER_PAGE);
  });

  it('Should output page 1 on invalid input', () => {
    const req = {
      query: {
        per_page: 'gibber'
      }
    };
    const unit = limit(req);
    expect(unit).toEqual(process.env.PER_PAGE);
  });
});
