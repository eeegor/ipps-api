require('dotenv').config();
const csv = require('fast-csv');
const fs = require('fs');
const env = process.env;

function uppercaseFirst(str) {
  const words = str.split(' ');
  return words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase()
  ).join(' ')
}

console.log('*** transform csv ***')
console.log('from:', env.DATA_PATH_LOCAL)
console.log('---')
console.log('to:', env.DATA_PATH_TRANSFORMED)
console.log('---')
console.log('transforming data....');
csv
  .fromPath(env.DATA_PATH_LOCAL, { headers: true, trim: true })
  .transform(doc => ({
    'providerId': parseInt(doc['Provider Id'], 10),
    'providerName': uppercaseFirst(doc['Provider Name']),
    'providerStreetAddress': uppercaseFirst(doc['Provider Street Address']),
    'providerCity': uppercaseFirst(doc['Provider City']),
    'providerState': doc['Provider State'].toLocaleLowerCase(),
    'providerZipCode': parseInt(doc['Provider Zip Code'], 10),
    'hospitalReferralRegionDescription': uppercaseFirst(doc['Hospital Referral Region Description']),
    'totalDischarges': parseInt(doc['Total Discharges'], 10),
    'averageCoveredCharges': parseFloat(doc['Average Covered Charges'].replace('$', '')),
    'averageTotalPayments': parseFloat(doc['Average Total Payments'].replace('$', '')),
    'averageMedicarePayments': parseFloat(doc['Average Medicare Payments'].replace('$', ''))
    // 'drgDefinition': doc['DRG Definition'], # out of scope
  }))
  .on('end', () => {
    console.log('---')
    console.log('transform data success');
  })
  .pipe(csv.createWriteStream({ headers: true }))
  .pipe(fs.createWriteStream(env.DATA_PATH_TRANSFORMED, { encoding: 'utf8' }));
