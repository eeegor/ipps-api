import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import initRedis from 'redis';
import provider from './provider/ProviderController';

require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

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
