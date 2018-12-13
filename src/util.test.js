import { queryString, queryNumberMinMax } from './util';

describe('queryString', () => {
  it('Should output proper key value pair', () => {
    const key = 'alpha';
    const value = 'beta';
    const unit = queryString(key, value);
    expect(unit).toEqual({ [key]: value });
  });

  it('Should output empty hash on bad key', () => {
    const key = '';
    const value = 'beta';
    const unit = queryString(key, value);
    expect(unit).toEqual({});
  });

  it('Should output empty hash on bad value', () => {
    const key = 'alpha';
    const value = '';
    const unit = queryString(key, value);
    expect(unit).toEqual({});
  });

  it('Should output empty hash on no value', () => {
    const key = 'alpha';
    const unit = queryString(key);
    expect(unit).toEqual({});
  });
});

describe('queryNumberMinMax', () => {
  it('Should output gte and lte with min max values', () => {
    const doc = 'alpha';
    const min = 1;
    const max = 10;
    const unit = queryNumberMinMax(doc, min, max);
    expect(unit).toEqual({
      [doc]: {
        $gte: min,
        $lte: max
      }
    });
  });

  it('Should output gte with min value', () => {
    const doc = 'alpha';
    const min = 1;
    const unit = queryNumberMinMax(doc, min);
    expect(unit).toEqual({
      [doc]: {
        $gte: min
      }
    });
  });

  it('Should output lte with max value', () => {
    const doc = 'alpha';
    const min = 0;
    const max = 10;
    const unit = queryNumberMinMax(doc, min, max);
    expect(unit).toEqual({
      [doc]: {
        $lte: max
      }
    });
  });

  it('Should output empty hash if no min max', () => {
    const doc = 'alpha';
    const unit = queryNumberMinMax(doc);
    expect(unit).toEqual({});
  });

  it('Should output empty hash if no min max', () => {
    const doc = '';
    const min = undefined;
    const max = 10;
    const unit = queryNumberMinMax(doc, min, max);
    expect(unit).toEqual({});
  });
});
