import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import initRedis from 'redis';
import cors from 'cors';
import compression from 'compression';
import provider from './provider/ProviderController';

require('dotenv').config();

const port = process.env.PORT || 3000;
const whitelist = process.env.CORS_WHITELIST.split(',').map(w => w.trim()) || [];
const corsOptions = {
  origin: (origin, callback) => {
    // console.log('origin', origin);
    // console.log('whitelist', whitelist);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const app = express();

app.use((req, res, next) => {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});
app.use(cors(corsOptions));
app.options('*', cors());

const shouldCompress = (req, res) => (req.headers['x-no-compression'] ? false : compression.filter(req, res));
app.use(compression({ filter: shouldCompress }));

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGO_DB,
  {
    useNewUrlParser: true
  }
);

const redis = initRedis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
  auth_pass: process.env.REDIS_AUTH_PASS
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (req, res) => {
  res.send('Hello World');
});

export const providers = provider(app, redis);

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running: http://127.0.0.1:${port}`);
});

export default server;
