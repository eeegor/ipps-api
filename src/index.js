import express from 'express';

require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running: http://127.0.0.1:${port}`);
});

export default server;
