import { pageNumber } from '../ProviderController';

describe('pageNumber', () => {
  it('Should output valid page number', () => {
    const req = {
      query: {
        page: 11
      }
    };
    const unit = pageNumber(req);
    expect(unit).toEqual(11);
  });

  it('Should handle string numbers', () => {
    const req = {
      query: {
        page: '11'
      }
    };
    const unit = pageNumber(req);
    expect(unit).toEqual(11);
  });

  it('Should output page 1 on negative number', () => {
    const req = {
      query: {
        page: -11
      }
    };
    const unit = pageNumber(req);
    expect(unit).toEqual(1);
  });

  it('Should output page 1 on invalid input', () => {
    const req = {
      query: {
        page: 'gibber'
      }
    };
    const unit = pageNumber(req);
    expect(unit).toEqual(1);
  });
});
