import { needsCache } from '../ProviderController';

describe('needsCache', () => {
  it('Should output needsCache', () => {
    const req = {
      query: {
        cache: true
      }
    };
    const unit = needsCache(req);
    expect(unit).toEqual(true);
  });

  it('Should not output needsCache', () => {
    const req = {
      query: {
        cache: false
      }
    };
    const unit = needsCache(req);
    expect(unit).toEqual(false);
  });

  it('Should handle string version not output needsCache', () => {
    const req = {
      query: {
        cache: 'false'
      }
    };
    const unit = needsCache(req);
    expect(unit).toEqual(false);
  });

  it('Should output needsCache if provided with bad value', () => {
    const req = {
      query: {
        cache: 'gibber'
      }
    };
    const unit = needsCache(req);
    expect(unit).toEqual(true);
  });

  it('Should output needsCache if provided with undefined', () => {
    const req = {
      query: {
        cache: undefined
      }
    };
    const unit = needsCache(req);
    expect(unit).toEqual(true);
  });
});
