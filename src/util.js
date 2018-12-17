import winston from 'winston';
import initRedis from 'redis';

/**
 *
 * Logger
 */

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// istanbul ignore
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

/**
 *
 * Redis DB
 */

// istanbul ignore next
export const redis = new Promise((resolve, reject) => {
  const redisDb = initRedis
    .createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
      auth_pass: process.env.REDIS_AUTH_PASS
    })
    .on('error', err => reject(err));
  resolve(redisDb);
});

redis
  .then(() => logger.log('info', 'redis:connection:success'))
  .catch(
    // istanbul ignore next
    error => logger.log('info', 'redis:connection:error', error)
  );

/**
 *
 * Query Helper Min Max
 */

export const queryNumberMinMax = (doc, minParam, maxParam) => {
  const minValue = (minParam && parseInt(minParam, 10)) || undefined;
  const maxValue = (maxParam && parseInt(maxParam, 10)) || undefined;
  const docIsValid = doc && doc !== '';
  if (docIsValid && maxValue && minValue) {
    return {
      [doc]: {
        $gte: minValue,
        $lte: maxValue
      }
    };
  }
  if (docIsValid && maxValue) {
    return {
      [doc]: {
        $lte: maxValue
      }
    };
  }
  if (docIsValid && minValue) {
    return {
      [doc]: {
        $gte: minValue
      }
    };
  }
  return {};
};

/**
 *
 * Query Helper String
 */

export const queryString = (doc, param) => {
  const value = param && param !== '' && param;
  const isString =
    value && typeof value === 'string' && value.toLocaleLowerCase();
  const docIsValid = doc && doc !== '';
  if (isString && docIsValid) {
    return {
      [doc]: isString
    };
  }
  return {};
};
