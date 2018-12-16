require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import initRedis from 'redis';
import cors from 'cors';
import compression from 'compression';
import user from './user/UserController';
import provider from './provider/ProviderController';

const env = process.env.NODE_ENV || 'development';
const port = env === 'test' ? process.env.PORT_TEST || 50023 : process.env.PORT || 5000;

console.log('***** env *****', env);
if (env === 'development' || env === 'production') {
  console.log('Using DB:', process.env.MONGO_DB);
  console.log('Using REDIS:', `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
} else if (env === 'test') {
  console.log('** SWITCH ENV FOR TEST ***');
  process.env.PORT = process.env.PORT_TEST || 50023;
  process.env.MONGO_DB = process.env.MONGO_DB_TEST;
  process.env.REDIS_PORT=process.env.REDIS_PORT_TEST;
  process.env.REDIS_HOST=process.env.REDIS_HOST_TEST;
  process.env.REDIS_AUTH_PASS=process.env.REDIS_AUTH_PASS_TEST;
  process.env.REDIS_TTL=process.env.REDIS_TTL_TEST;
  console.log('Using DB:', process.env.MONGO_DB);
  console.log('Using REDIS:', `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
}
console.log('Using PORT:', process.env.PORT);

const whitelist =
  process.env.CORS_WHITELIST.split(',').map(entry => {
    const trimmed = entry.trim();
    if (entry.match('localhost'|'127.0.0.1')) {
      const port = entry.split(':').map(p => p.trim())[1]
      return [
        `127.0.0.1:${port}`,
        `http://127.0.0.1:${port}`,
        `https://127.0.0.1:${port}`,
        `localhost:${port}`,
        `http://localhost:${port}`,
        `https://localhost:${port}`
      ]
    }
    return [
      `${trimmed}`,
      `http://${trimmed}`,
      `https://${trimmed}`
    ];
  }) || [];

const corsOptions = {
  origin: (origin, callback) => {
    const extendedWhitelist = [].concat.apply([], whitelist);
    // uncomment to debug
    console.log('*** ORIGIN ***', origin);
    console.log('*** WHITELIST ***', extendedWhitelist.join(', '))
    if (extendedWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  exposedHeaders:
    'x-auth, x-db-engine, x-current-page, x-current-page-limit, x-total-count'
};

const app = express();

// if (env !== 'test' || env !== 'development') {
//   app.use((req, res, next) => {
//     req.headers.origin = req.headers.origin || req.headers.host;
//     next();
//   });
//   app.use(cors(corsOptions));
//   app.options('*', cors());
// }

app.use(compression({ filter: (req, res) =>
  req.headers['x-no-compression'] ? false : compression.filter(req, res) }));

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(
  process.env.MONGO_DB,
  {
    useNewUrlParser: true
  }
);

const redis = initRedis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST,
  {
    auth_pass: process.env.REDIS_AUTH_PASS
  }
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (req, res) => {
  res.send('Ipps Patients Data Api');
});

export const users = user(app, redis);
export const providers = provider(app, redis);

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server url: http://127.0.0.1:${port}`);
});

export default server;
