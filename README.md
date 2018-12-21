# Express IPPS Provider Api

This is an example [Express](https://expressjs.com/) rest api which serves IPPS Provider Data in JSON format to authenticated users

- You can find a hosted version of the api here [https://ipps-api.now.sh](https://ipps-api.now.sh)
- You can find a hosted version of a compatible client here [https://ipps.now.sh](https://ipps.now.sh)
- [`React`](https://reactjs.org) client code is [here](https://github.com/eeegor/ipps-client)

## :gear: Configuration

Modify configuration in `.env` (start by renaming `env.example` to `.env`, [wondering why?](https://codeburst.io/process-env-what-it-is-and-why-when-how-to-use-it-effectively-505d0b2831e7))

Below the most important settings to get you started
```bash
MONGO_DB=mongodb-connection-string
MONGO_DB_TEST=mongodb-test-connection-string

REDIS_PORT=redis-port
REDIS_HOST=redis-host
REDIS_AUTH_PASS=redis-password

REDIS_PORT_TEST=6379
REDIS_HOST_TEST=localhost
REDIS_AUTH_PASS_TEST=
REDIS_TTL_TEST=2592000

CORS_WHITELIST="localhost:3000, 127.0.0.1:5000, 127.0.0.1:50023, https://your-custom-url.com"
```

## :books: Database and Data

[`MongoDB`](https://www.mongodb.com/) is used as the primary database. 

> Info: You will need to start `MongoDB` locally or use some web-service e.g. [mLab](https://mlab.com/). Read how to get started [here](https://redis.io/topics/rediscli)

```bash
# running
mongod

# should print something like
.... NETWORK  [initandlisten] waiting for connections on port 27017
```

[`Redis`](http://redis.js.org/) is used in the background to cache the responses and serve them quicker to following user. 

> Info: You will need to start `Redis` locally or use some web-service e.g. [RedisLabs](https://redislabs.com/). Read how to get started [here](https://docs.mlab.com/)

```bash
# running
redis-cli

# should print something like
127.0.0.1:6379>
```
Now that the databases are running let's take care of the data

The easiest way to get the [`CSV`](https://en.wikipedia.org/wiki/Comma-separated_values) dataset into Mongo is by using [`mongoimport`](https://docs.mongodb.com/manual/reference/program/mongoimport)

Before importing, the data needs to be [`sanitized`](https://en.wikipedia.org/wiki/Sanitization_(classified_information)) to avoid bad values and convert string currency formats into mathematic friendly integers. Also to rename or remove specific columns

Inside `/data-helpers` you will find
- get-remote-csv.js
  - helps to get remote csv from a url
- transform-local-csv.js
  - helps transform local `csv` to [`MongoDB`](https://www.mongodb.com/) friendly format

You will need to configure inside `.env` 

```bash
DATA_PATH_ORIGIN=http://url-to-your-csv/filename.csv
DATA_PATH_LOCAL=data/providers-master.csv
DATA_PATH_TRANSFORMED=data/providers.csv
```

You can then use it in the [`console`](https://en.wikipedia.org/wiki/System_console) like this

```bash
yarn csv:get
yarn csv:transform
```

After the transformation is complete, the cleaned data can be imported to [`MongoDB`](https://www.mongodb.com/)

```bash
# local
mongoimport --db localhost:27017 --collection providers --type csv --headerline --file data/providers.csv --drop

# remote
mongoimport -h {db-host:port} -d {db-name} -c providers -u {user} -p {password} --file data/providers.csv --drop --type csv --headerline
```

Voila! All data is now inside the database and the App is ready to reflect

## :rocket: Running the App

After you have cloned the repository to your computer configured the `.env` file and setup the databases, please run the following commands inside the project folder:

```bash
# install dependencies
yarn

# run the app (localhost:5000)
yarn start
```

## :construction: Test

To make sure the application works as expected you can run the test suite like this:

```bash
# runs all test files with coverage report
yarn test

# run tests that match a spec-name (e.g `App` or `components/Form`)
yarn test name-of-spec
```

> More info about the Mocha testing framework can be found [here](https://mochajs.org/)

## :rainbow: Prettier

Prettier is a code formatter that ensures that all outputted code conforms to a consistent style

Run the following command before each commit to make sure your changes are valid :nerd_face:

Formats all `Js/Jsx`, `Json` and `Css, Scss` files according to `package.json / .prettierrc` presets

```bash
# format all files
yarn format
```

## :vertical_traffic_light: Linter

> 
> Code linting can be seen, in a more broad sense, as static code analysis.
> 
> [What's the difference between Lint and Prettier?](https://restishistory.net/blog/whats-the-difference-between-eslint-and-prettier.html)

Lints all `Js/Jsx`, `Json` and `Css, Scss` files according to `package.json / eslint.json` presets

```bash
# lint all files
yarn lint
```

> **Note:** Before running `yarn lint`, please run `yarn format` first :wink:

## :factory: Build

If you wish to host this app, you will need to run the build command. After you've run the command, you will find the build artefacts in the `/dist` folder

```bash
# build static files
yarn build
```

## :truck: Deploy to Zeit.co

If you wish, you can deploy this app to Zeit.co. To do so please configure the following settings before you hit `yarn deploy` 

> Info: It's also possible to host with any other providers (e.g. Heroku) which support `node.js`

1. Modify configuration in `.env` (start by renaming `env.example` to `.env`, [wondering why?](https://codeburst.io/process-env-what-it-is-and-why-when-how-to-use-it-effectively-505d0b2831e7))
2. Modify configuration in `now.json` (start by renaming `example.now.json` to `now.json`
3. Make sure you've configured the `CORS_WHITELIST`, or set it to `*` to allow client apps hosted on different domains to query your api

Finally now you're ready to:

```bash
# deploy app to production
yarn deploy
```

### :checkered_flag: Endpoints:

> Info: - [Postman](https://www.getpostman.com) is the recommended tool to explore the api

*\* required*

**`GET /`**

|Param|Type|Example|
|---|---|---|
|---|---|---|

**`GET /providers`**

|Params|Type|Example|
|---|---|---|
|**`x-auth`** * | string|[JWT_TOKEN](https://jwt.io/)|
|`min_discharges` | number|0||
|`max_discharges` | number|100||
|`min_average_covered_charges` | number|0||
|`max_average_covered_charges` | number|10000||
|`min_average_medicare_payments` | number|0||
|`max_average_medicare_payments` | number|10000||
|`state` | string|TX||
|`page` | number|1||
|`per_page` | number|100||
|`cache` | boolean|false||

**`POST /signup`**

|Param|Type|Example|
|---|---|---|
|**`x-auth`** * | string|[JWT_TOKEN](https://jwt.io/)	|
|**`body`** *| object|```{ email: 'valid-email@example.com, password: 'any-one-you-choose'}```|

**`POST /login`**

|Param|Type|Example|
|---|---|---|
|**`x-auth`** * | string|[JWT_TOKEN](https://jwt.io/)	|
|**`body`** *| object|```{ email: 'valid-email@example.com, password: 'any-one-you-choose'}```|

**`POST /logout`**

|Param|Type|Example|
|---|---|---|
|**`x-auth`** * | string|[JWT_TOKEN](https://jwt.io/)	|

**`GET /profile`**

|Param|Type|Example|
|---|---|---|
|**`x-auth`** * | string|[JWT_TOKEN](https://jwt.io/)	|


## :green_book: Tools, Libraries and Packages

### Express

Fast, unopinionated, minimalist web framework for Node.js

[https://expressjs.com/](https://expressjs.com/)

##### Additional Packages
- [cors](https://github.com/expressjs/cors)
  - Helps with Cross-origin resource sharing
- [compression](https://github.com/expressjs/compression)
  - Node.js compression middleware
- [body-parser](https://github.com/expressjs/body-parser)
  - Parse incoming request bodies in a middleware before your handlers, available under the `req.body` property

### MongoDB

Flexible document data model `nosql` database, find more infos [here](https://www.mongodb.com/)

##### Additional Packages

- [mongoose](https://mongoosejs.com/)
  - MongoDB validation, casting and business logic boilerplate

### Redis

Redis is an open source (BSD licensed), in-memory data structure store, in this case used as a cache broker. More infos [here](http://redis.js.org/)

### Validator

A library of string validators and sanitizers. More info [here](https://github.com/chriso/validator.js)

### Jsonwebtoken

JWT for node.js

More info [here](https://github.com/auth0/node-jsonwebtoken)

### Crypto

JavaScript library of crypto standards, helps hashing and digesting hashed stuff

More info [here](https://github.com/brix/crypto-js)

### Bcrypt

JavaScript library to help you hash passwords

More info [here](https://github.com/kelektiv/node.bcrypt.js)

### Winston

A simple and universal logging library with support for multiple transports

More info [here](https://github.com/winstonjs/winston)

### Lodash

Utility functions
JavaScript utility library delivering modularity, performance & extras

More info [here](https://lodash.com/)

### Dotenv

Loads environment variables from `.env` file 

More info [here](https://github.com/motdotla/dotenv)

### Babel, Lint & Prettier

This application follows the [airbnb](https://github.com/airbnb/javascript) coding styleguide conventions for `ECMAScript 2018` setup with [babel](https://github.com/babel/babel) [eslint](https://eslint.org/) and [prettier](https://github.com/prettier/prettier).

### Nodemon

Development server to monitor for any changes and automatically restart the app 

More info [here](https://github.com/remy/nodemon)

### Pm2

Production process manager e.g. to automatically restart the app on crashing etc.

More info [here](http://pm2.keymetrics.io/)

### Mocha

Javascript test framework running on Node.js and in the browser, making asynchronous testing simple and fun

More info [here](https://mochajs.org/)

### Expect

When you're writing tests, you often need to check that values meet certain conditions. `expect` gives you access to a number of "matchers" that let you validate different things

More info [here](https://jestjs.io/docs/en/expect)

### Supertest

Super-agent driven library for testing node.js HTTP servers using a fluent API

More info [here](https://github.com/visionmedia/supertest)

### Nyc (former: Istanbul)

Istanbul instruments your ES5 and ES2015+ JavaScript code with line counters, so that you can track how well your unit-tests exercise your codebase

More info [here](https://github.com/gotwarlost/istanbul)
  
