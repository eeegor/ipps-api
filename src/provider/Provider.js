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

const Provider = mongoose.model('Provider', ProviderSchema);
export default Provider;
