# Express IPPS Provider Api

This is an example [Express](https://expressjs.com/) rest api which serves IPPS Provider Data in JSON format to authenticated users

- You can find a hosted version of the api here [https://ipps-api.now.sh](https://ipps-api.now.sh)
- You can find a hosted version of a compatible client here [https://ipps-client.now.sh](https://ipps-client.now.sh)


## :rocket: Getting started

After you have cloned the repository to your computer please run the following commands inside the project folder:

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

### Endpoints:

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
|**body** *| object|```{ email: 'valid-email@example.com, password: 'any-one-you-choose'}```|

**`POST /login`**

|Param|Type|Example|
|---|---|---|
|**`x-auth`** * | string|[JWT_TOKEN](https://jwt.io/)	|
|**body** *| object|```{ email: 'valid-email@example.com, password: 'any-one-you-choose'}```|

**`POST /logout`**

|Param|Type|Example|
|---|---|---|
|**`x-auth`** * | string|[JWT_TOKEN](https://jwt.io/)	|

**`GET /profile`**

|Param|Type|Example|
|---|---|---|
|**`x-auth`** * | string|[JWT_TOKEN](https://jwt.io/)	|


## Tools, Libraries and Packages

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
  
