import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { User, USERS_SECRET } from '../../user/User';
import { Provider } from '../../provider/Provider';
import { redis, logger } from '../../util';

export const flushRedis = () =>
  redis
    .then(db => {
      // logger.log('info', 'redis:flush:success');
      db.flushdb();
    })
    .catch(error => logger.log('info', error));

const goodUserId = new Types.ObjectId();
const badUserId = new Types.ObjectId();

const users = [
  {
    _id: goodUserId,
    email: 'good@example.com',
    password: 'secret',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: goodUserId, access: 'auth' }, USERS_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: badUserId,
    email: 'bad@example.com',
    password: 'secret'
  }
];

export const goodUser = users[0];
export const badUser = users[1];

const populateUsers = done => {
  User.deleteMany()
    .then(() => {
      const nextGoodUser = new User(users[0]).save();
      const nextBadUser = new User(users[1]).save();
      return Promise.all([nextGoodUser, nextBadUser]);
    })
    .then(() => done());
};

const providers = [
  {
    providerName: 'ZERO',
    providerStreetAddress: '601 E ROLLINS ST',
    providerCity: 'ORLANDO',
    providerState: 'tx',
    providerZipCode: 32803,
    hospitalReferralRegionDescription: 'FL - Orlando',
    totalDischarges: 93,
    averageCoveredCharges: 33949.48,
    averageTotalPayments: 6845.37,
    averageMedicarePayments: 5042.31
  },
  {
    providerName: 'FIRST',
    providerStreetAddress: '601 E ROLLINS ST',
    providerCity: 'ORLANDO',
    providerState: 'tx',
    providerZipCode: 32803,
    hospitalReferralRegionDescription: 'FL - Orlando',
    totalDischarges: 93,
    averageCoveredCharges: 33949.48,
    averageTotalPayments: 6845.37,
    averageMedicarePayments: 5042.31
  },
  {
    providerName: 'SECOND',
    providerStreetAddress: '1 SHIRCLIFF WAY',
    providerCity: 'JACKSONVILLE',
    providerState: 'tx',
    providerZipCode: 32204,
    hospitalReferralRegionDescription: 'FL - Jacksonville',
    totalDischarges: 88,
    averageCoveredCharges: 22969.6,
    averageTotalPayments: 5777.48,
    averageMedicarePayments: 4560.15
  },
  {
    providerName: 'THIRD',
    providerStreetAddress: '800 PRUDENTIAL DR',
    providerCity: 'JACKSONVILLE',
    providerState: 'tx',
    providerZipCode: 32207,
    hospitalReferralRegionDescription: 'FL - Jacksonville',
    totalDischarges: 103,
    averageCoveredCharges: 21729.69,
    averageTotalPayments: 6745.63,
    averageMedicarePayments: 4615.54
  },
  {
    providerName: 'FOURTH',
    providerStreetAddress: '1700 S TAMIAMI TRL',
    providerCity: 'SARASOTA',
    providerState: 'fl',
    providerZipCode: 34239,
    hospitalReferralRegionDescription: 'FL - Sarasota',
    totalDischarges: 92,
    averageCoveredCharges: 26361.33,
    averageTotalPayments: 5689.8,
    averageMedicarePayments: 4666.79
  },
  {
    providerName: 'FIFTH',
    providerStreetAddress: '6500 NEWBERRY RD',
    providerCity: 'GAINESVILLE',
    providerState: 'fl',
    providerZipCode: 32605,
    hospitalReferralRegionDescription: 'FL - Gainesville',
    totalDischarges: 108,
    averageCoveredCharges: 50730.63,
    averageTotalPayments: 5906.22,
    averageMedicarePayments: 4624
  },
  {
    providerName: 'SIXTH',
    providerStreetAddress: '1431 SW 1ST AVE',
    providerCity: 'OCALA',
    providerState: 'fl',
    providerZipCode: 34478,
    hospitalReferralRegionDescription: 'FL - Ocala',
    totalDischarges: 12,
    averageCoveredCharges: 40038.31,
    averageTotalPayments: 5344.64,
    averageMedicarePayments: 4328.48
  },
  {
    providerName: 'SEVENTH',
    providerStreetAddress: '743 SPRING STREET',
    providerCity: 'GAINESVILLE',
    providerState: 'ga',
    providerZipCode: 30501,
    hospitalReferralRegionDescription: 'GA - Atlanta',
    totalDischarges: 10,
    averageCoveredCharges: 25197.6,
    averageTotalPayments: 6513.19,
    averageMedicarePayments: 4760.65
  }
];

const populateProviders = done => {
  Provider.deleteMany()
    .then(() => Provider.insertMany(providers))
    .then(() => done());
};

export { users, populateUsers, providers, populateProviders };
