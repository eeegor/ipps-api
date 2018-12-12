import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
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

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (req, res) => {
  res.send('Hello World');
});

const providers = provider(app);

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running: http://127.0.0.1:${port}`);
});

export default server;
