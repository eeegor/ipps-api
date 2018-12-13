import { transformResponse } from '../ProviderController';

describe('transformResponse', () => {
  it('Should output valid transformResponse', () => {
    const providers = [
      {
        providerName: 'alpha',
        providerStreetAddress: 'beta',
        providerCity: 'gamma',
        providerState: 'delta',
        providerZipCode: 10011,
        hospitalReferralRegionDescription: 'AL - zeta',
        totalDischarges: 40,
        averageCoveredCharges: 1000.54,
        averageTotalPayments: 20000.65,
        averageMedicarePayments: 300000.06
      }
    ];
    const item = providers[0];
    const unit = transformResponse(providers);
    expect(unit).toEqual([
      {
        'Provider Name': item.providerName.toUpperCase(),
        'Provider Street Address': item.providerStreetAddress.toUpperCase(),
        'Provider City': item.providerCity.toUpperCase(),
        'Provider State': item.providerState.toUpperCase(),
        'Provider Zip Code': parseInt(item.providerZipCode, 10),
        'Hospital Referral Region Description': item.hospitalReferralRegionDescription,
        'Total Discharges': parseInt(item.totalDischarges, 10),
        'Average Covered Charges': `$${item.averageCoveredCharges.toLocaleString()}`,
        'Average Total Payments': `$${item.averageTotalPayments.toLocaleString()}`,
        'Average Medicare Payments': `$${item.averageMedicarePayments.toLocaleString()}`
      }
    ]);
  });
});
