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

console.log('***** env *****', env);
if (env === 'development') {
  console.log('Using DB:', process.env.MONGO_DB);
} else if (env === 'test') {
  console.log('** SWITCH DB FOR TEST ***');
  process.env.PORT = 30023;
  process.env.MONGO_DB = process.env.MONGO_DB_TEST;
  console.log('Using DB:', process.env.MONGO_DB);
}

const port = process.env.PORT || 3000;

const whitelist =
  process.env.CORS_WHITELIST.split(',').map(w => w.trim()) || [];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const app = express();

if (env !== 'test' || env !== 'development') {
  app.use((req, res, next) => {
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
  });
  app.use(cors(corsOptions));
  app.options('*', cors());
}

const shouldCompress = (req, res) =>
  req.headers['x-no-compression'] ? false : compression.filter(req, res);
app.use(compression({ filter: shouldCompress }));

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_DB,
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
  console.log(`Server is running: http://127.0.0.1:${port}`);
});

export default server;
