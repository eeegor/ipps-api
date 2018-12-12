import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  'Provider Name': String,
  'Provider Street Address': String,
  'Provider City': String,
  'Provider State': String,
  'Provider Zip Code': Number,
  'Hospital Referral Region Description': String,
  'Total Discharges': Number,
  'Average Covered Charges': Number,
  'Average Total Payments': Number,
  'Average Medicare Payments': Number
});

export default mongoose.model('Provider', providerSchema);
