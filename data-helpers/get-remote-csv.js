require('dotenv').config();
const http = require('http');
const fs = require('fs');
const env = process.env;

const file = fs.createWriteStream(env.DATA_PATH_LOCAL);
console.log('*** import csv ***')
console.log('from:', env.DATA_PATH_ORIGIN)
console.log('---')
console.log('to:', env.DATA_PATH_LOCAL)
http.get(env.DATA_PATH_ORIGIN, response => {
  console.log('---')
  console.log('fetching data....');
  response
  .on('end', () => {
      console.log('---')
      console.log('fetch data success');
    })
    .pipe(file);
});
