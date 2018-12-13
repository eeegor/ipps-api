import { responsePagination } from '../ProviderController';

describe('responsePagination', () => {
  it('Should output valid responsePagination', () => {
    const req = {
      query: {
        page: 11,
        per_page: 100
      }
    };
    const unit = responsePagination(req);
    expect(unit).toEqual({
      page: 11,
      perPage: 100
    });
  });
});
