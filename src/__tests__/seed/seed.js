import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../user/User';
import Provider from '../../provider/Provider';

const USERS_SECRET = process.env.USERS_SECRET || 'rombomatic-random-string-2323lknjk432k3';

const user1id = new Types.ObjectId();
const user2id = new Types.ObjectId();

const users = [
  {
    _id: user1id,
    email: 'good@example.com',
    password: 'secret',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign(
            { _id: user1id, access: 'auth' },
            USERS_SECRET
          )
          .toString()
      }
    ]
  },
  {
    _id: user2id,
    email: 'bad@example.com',
    password: 'secret'
  }
];

const populateUsers = done => {
  User.deleteMany()
    .then(() => {
      const goodUser = new User(users[0])
        .save()
        .then((data, error) => console.log(error));
      const badUser = new User(users[1])
        .save()
        .then((data, error) => console.log(error));;
      return Promise.all([goodUser, badUser]);
    })
    .then(() => done());
};

const providers = [
  {
    'Provider Name': 'FLORIDA HOSPITAL',
    'Provider Street Address': '601 E ROLLINS ST',
    'Provider City': 'ORLANDO',
    'Provider State': 'FL',
    'Provider Zip Code': 32803,
    'Hospital Referral Region Description': 'FL - Orlando',
    'Total Discharges': 93,
    'Average Covered Charges': '$33,949.48',
    'Average Total Payments': '$6,845.37',
    'Average Medicare Payments': '$5,042.31'
  },
  {
    'Provider Name': "ST VINCENT'S MEDICAL CENTER",
    'Provider Street Address': '1 SHIRCLIFF WAY',
    'Provider City': 'JACKSONVILLE',
    'Provider State': 'FL',
    'Provider Zip Code': 32204,
    'Hospital Referral Region Description': 'FL - Jacksonville',
    'Total Discharges': 88,
    'Average Covered Charges': '$22,969.6',
    'Average Total Payments': '$5,777.48',
    'Average Medicare Payments': '$4,560.15'
  },
  {
    'Provider Name': 'BAPTIST MEDICAL CENTER',
    'Provider Street Address': '800 PRUDENTIAL DR',
    'Provider City': 'JACKSONVILLE',
    'Provider State': 'FL',
    'Provider Zip Code': 32207,
    'Hospital Referral Region Description': 'FL - Jacksonville',
    'Total Discharges': 103,
    'Average Covered Charges': '$21,729.69',
    'Average Total Payments': '$6,745.63',
    'Average Medicare Payments': '$4,615.54'
  },
  {
    'Provider Name': 'SARASOTA MEMORIAL HOSPITAL',
    'Provider Street Address': '1700 S TAMIAMI TRL',
    'Provider City': 'SARASOTA',
    'Provider State': 'FL',
    'Provider Zip Code': 34239,
    'Hospital Referral Region Description': 'FL - Sarasota',
    'Total Discharges': 92,
    'Average Covered Charges': '$26,361.33',
    'Average Total Payments': '$5,689.8',
    'Average Medicare Payments': '$4,666.79'
  },
  {
    'Provider Name': 'NORTH FLORIDA REGIONAL MEDICAL CENTER',
    'Provider Street Address': '6500 NEWBERRY RD',
    'Provider City': 'GAINESVILLE',
    'Provider State': 'FL',
    'Provider Zip Code': 32605,
    'Hospital Referral Region Description': 'FL - Gainesville',
    'Total Discharges': 108,
    'Average Covered Charges': '$50,730.63',
    'Average Total Payments': '$5,906.22',
    'Average Medicare Payments': '$4,624'
  },
  {
    'Provider Name': 'OCALA REGIONAL MEDICAL CENTER',
    'Provider Street Address': '1431 SW 1ST AVE',
    'Provider City': 'OCALA',
    'Provider State': 'FL',
    'Provider Zip Code': 34478,
    'Hospital Referral Region Description': 'FL - Ocala',
    'Total Discharges': 88,
    'Average Covered Charges': '$40,038.31',
    'Average Total Payments': '$5,344.64',
    'Average Medicare Payments': '$4,328.48'
  },
  {
    'Provider Name': 'NORTHEAST GEORGIA MEDICAL CENTER, INC',
    'Provider Street Address': '743 SPRING STREET',
    'Provider City': 'GAINESVILLE',
    'Provider State': 'GA',
    'Provider Zip Code': 30501,
    'Hospital Referral Region Description': 'GA - Atlanta',
    'Total Discharges': 82,
    'Average Covered Charges': '$25,197.6',
    'Average Total Payments': '$6,513.19',
    'Average Medicare Payments': '$4,760.65'
  }
];

const populateProviders = done => {
  Provider.deleteMany()
    .then(() => Provider.insertMany(providers))
    .then(() => done());
};

export { users, populateUsers, providers, populateProviders };
