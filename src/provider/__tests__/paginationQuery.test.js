import { paginationQuery } from '../ProviderController';

describe('paginationQuery', () => {
  it('Should output valid paginationQuery', () => {
    const req = {
      query: {
        page: 11,
        per_page: 100
      }
    };
    const unit = paginationQuery(req);
    expect(unit).toEqual({
      skip: 11,
      limit: 100
    });
  });
});
