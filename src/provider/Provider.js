import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
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

export default mongoose.model('Provider', providerSchema);
