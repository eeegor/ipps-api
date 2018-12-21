require('dotenv').config();

/* eslint-disable import/first */
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import user from './user/UserController';
import provider from './provider/ProviderController';
import { logger } from './util';

/**
 *
 * Environment
 */

// istanbul ignore next
const env = process.env.NODE_ENV || 'development';

// istanbul ignore next
const port =
  env === 'test' ? process.env.PORT_TEST || 50023 : process.env.PORT || 5000;

// *** 1/2 RUN WITH TEST ENV ***
// Uncomment this if you want to serve the test database for debugging
// This will allow you to access the real test data in the database
// Please follow STEP 2 below
// const port =
//   env === 'test' || env === 'development'
//     ? process.env.PORT_TEST || 50023
//     : process.env.PORT || 5000;

// istanbul ignore next
if (env === 'development' || env === 'production') {
  // *** 2/2 RUN WITH TEST ENV ***
  // Uncomment this if you want to serve the test database for debugging
  // process.env.PORT = 50023;
  // process.env.MONGO_DB = process.env.MONGO_DB_TEST;
  // process.env.REDIS_PORT = process.env.REDIS_PORT_TEST;
  // process.env.REDIS_HOST = process.env.REDIS_HOST_TEST;
  // process.env.REDIS_AUTH_PASS = process.env.REDIS_AUTH_PASS_TEST;
  // process.env.REDIS_TTL = process.env.REDIS_TTL_TEST;
  logger.log('info', `Using DB: ${process.env.MONGO_DB}`);
  logger.log(
    'info',
    `Using REDIS: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  );
} else if (env === 'test') {
  logger.log('info', '** SWITCH ENV FOR TEST ***');
  process.env.PORT = process.env.PORT_TEST || 50023;
  process.env.MONGO_DB = process.env.MONGO_DB_TEST;
  process.env.REDIS_PORT = process.env.REDIS_PORT_TEST;
  process.env.REDIS_HOST = process.env.REDIS_HOST_TEST;
  process.env.REDIS_AUTH_PASS = process.env.REDIS_AUTH_PASS_TEST;
  process.env.REDIS_TTL = process.env.REDIS_TTL_TEST;
  logger.log('info', `Using DB: ${process.env.MONGO_DB}`);
  logger.log(
    'info',
    `Using REDIS: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  );
}
logger.log('info', `***** env: ${env} *****`);
logger.log('info', `Using PORT: ${process.env.PORT}`);

/**
 *
 * App
 */

const app = express();

/**
 *
 * Body Parser
 */

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/**
 *
 * Cors
 */

// istanbul ignore next
const whitelistEntries =
  process.env.CORS_WHITELIST.split(',').map(entry => {
    const trimmed = entry.trim();
    if (entry.match('localhost') || entry.match('127.0.0.1')) {
      const corsPort = entry.split(':').map(p => p.trim())[1];
      return [
        `127.0.0.1:${corsPort}`,
        `http://127.0.0.1:${corsPort}`,
        `https://127.0.0.1:${corsPort}`,
        `localhost:${corsPort}`,
        `http://localhost:${corsPort}`,
        `https://localhost:${corsPort}`
      ];
    }
    return [`${trimmed}`, `http://${trimmed}`, `https://${trimmed}`];
  }) || [];
const whitelist = [].concat([], ...whitelistEntries);

const exposedCorsHeaders =
  'x-auth, x-db-engine, x-current-page, x-current-page-limit, x-current-count, x-total-count, x-available-states';

// istanbul ignore next
const corsOptions = {
  origin: (origin, callback) => {
    // uncomment to debug cors in production
    // logger.log('info', `*** origin: ${origin} ***`);
    // logger.log('info', `*** whitelist ***`)
    // logger.log('info', extendedWhitelist.join(', '))
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  exposedHeaders: exposedCorsHeaders
};

// istanbul ignore else if
app.use((req, res, next) => {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});

// istanbul ignore next
if (env === 'test') {
  app.use((req, res, next) => {
    req.headers.origin = `localhost:${process.env.PORT_TEST || 50023}`;
    next();
  });
}

app.use(cors(corsOptions));
app.options('*', cors());

/**
 *
 * Compression
 */

// istanbul ignore next
app.use(
  compression({
    filter: (req, res) =>
      req.headers['x-no-compression'] ? false : compression.filter(req, res)
  })
);

/**
 *
 * Mongo DB
 */

// istanbul ignore next
export const mongo = new Promise((resolve, reject) => {
  mongoose.Promise = global.Promise;
  mongoose.set('useCreateIndex', true);
  mongoose
    .connect(
      process.env.MONGO_DB,
      {
        useNewUrlParser: true
      }
    )
    .catch(error => reject(error));
  resolve();
});

mongo
  .then(() => logger.log('info', 'mongo:connection:success'))
  .catch(
    // istanbul ignore next
    error => logger.log('info', 'mongo:connection:error', error)
  );

/**
 *
 * Root Route aka Welcome Page
 */

app.get('/', (req, res) => {
  res.send('Ipps Patients Data Api');
});

/**
 *
 * Resources
 */

export const users = user(app);
export const providers = provider(app);

/**
 *
 * Server
 */

const server = app.listen(port, () => {
  logger.log('info', `*** app ***`);
  logger.log('info', `listening on: http://127.0.0.1:${port}`);
});

export default server;
