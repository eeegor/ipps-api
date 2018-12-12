# Patient Data Api

Hi, I'm a rest-api build with `express.js` and `node.js`


## Usage 

### Development

```bash
# install dependencies
yarn

# run locally
yarn dev

# build
yarn build

# preview production (pm2)
yarn start
```

The app will be running here: [`https://localhost:3000/`](https://localhost:3000/)

### Production

In order to deploy the application, you will need a [`zeit.co`](https://zeit.co/) account.

To successfully deploy the app, you need to rename `example.now.json` to `now.json` and provide your preffered deployment settings.

```
# will deploy using **now** (zeit.co)
yarn deploy
```
The app will be running here: `https://{deployment-url}/`

### Endpoints:


Root: `/`

## Tools, Libraries and Packages

### Express

Fast, unopinionated, minimalist web framework for Node.js

[https://expressjs.com/](https://expressjs.com/)

### Dotenv

Loads environment variables from `.env` file 

[https://github.com/motdotla/dotenv](https://github.com/motdotla/dotenv)

### Babel, Lint & Prettier

This application follows the [`airbnb`](https://github.com/airbnb/javascript) conding styleguide conventions for [`babel`](https://github.com/babel/babel) [`eslint`](https://eslint.org/) and [`prettier`](https://github.com/prettier/prettier).

### Nodemon

Development server to monitor for any changes and automatically restart the app: 

[https://github.com/remy/nodemon](https://github.com/remy/nodemon)

### Pm2

Production process manager: 

[http://pm2.keymetrics.io/](http://pm2.keymetrics.io/)

