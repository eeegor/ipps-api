import { requestParams } from '../ProviderController';

describe('requestParams', () => {
  it('Should output valid request filter with all params', () => {
    const req = {
      query: {
        min_discharges: 11,
        max_discharges: 23,
        min_average_covered_charges: 1500,
        max_average_covered_charges: 5000,
        min_average_medicare_payments: 10000,
        max_average_medicare_payments: 13000,
        state: 'TX'
      }
    };
    const unit = requestParams(req);
    expect(unit).toEqual({
      averageCoveredCharges: {
        $gte: 1500,
        $lte: 5000
      },
      averageMedicarePayments: {
        $gte: 10000,
        $lte: 13000
      },
      providerState: 'tx',
      totalDischarges: {
        $gte: 11,
        $lte: 23
      }
    });
  });

  it('Should output valid request filter with some params', () => {
    const req = {
      query: {
        min_discharges: 11,
        min_average_covered_charges: 1500,
        max_average_medicare_payments: 13000
      }
    };
    const unit = requestParams(req);
    expect(unit).toEqual({
      averageCoveredCharges: {
        $gte: 1500
      },
      averageMedicarePayments: {
        $lte: 13000
      },
      totalDischarges: {
        $gte: 11
      }
    });
  });
});
