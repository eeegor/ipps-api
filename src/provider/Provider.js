import mongoose from 'mongoose';

const ProviderSchema = new mongoose.Schema({
  providerName: String,
  providerStreetAddress: String,
  providerCity: String,
  providerState: String,
  providerZipCode: Number,
  hospitalReferralRegionDescription: String,
  totalDischarges: Number,
  averageCoveredCharges: Number,
  averageTotalPayments: Number,
  averageMedicarePayments: Number
});

ProviderSchema.statics.getAllStates = function getAllStates() {
  const Provider = this;
  return Provider.distinct('providerState').then(states => {
    // istanbul ignore if
    if (!states) {
      return Promise.reject('No provider states found...');
    }
    return states;
  });
};

ProviderSchema.methods.toJSON = function toJSON() {
  const provider = this;
  const record = provider.toObject();
  const hospitalDesc = record.hospitalReferralRegionDescription.split(' - ');

  return {
    'Provider Name': record.providerName.toUpperCase(),
    'Provider Street Address': record.providerStreetAddress.toUpperCase(),
    'Provider City': record.providerCity.toUpperCase(),
    'Provider State': record.providerState.toUpperCase(),
    'Provider Zip Code': parseInt(record.providerZipCode, 10),
    'Hospital Referral Region Description': `${hospitalDesc[0].toUpperCase()} - ${
      hospitalDesc[1]
    }`,
    'Total Discharges': parseInt(record.totalDischarges, 10),
    'Average Covered Charges': `$${record.averageCoveredCharges.toLocaleString(
      undefined,
      { minimumFractionDigits: 2 }
    )}`,
    'Average Total Payments': `$${record.averageTotalPayments.toLocaleString(
      undefined,
      { minimumFractionDigits: 2 }
    )}`,
    'Average Medicare Payments': `$${record.averageMedicarePayments.toLocaleString(
      undefined,
      { minimumFractionDigits: 2 }
    )}`
  };
};

export const Provider = mongoose.model('Provider', ProviderSchema);
