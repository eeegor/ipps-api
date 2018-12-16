import { Provider } from './Provider';
import { queryNumberMinMax, queryString } from '../util';
import { authenticate } from '../middleware';

export const pageNumber = req => {
  const isNumber = parseInt(req.query.page, 10);
  const validPageNumber = isNumber && isNumber > 0 ? isNumber : 1;
  return validPageNumber;
};

export const limit = req => {
  const isNumber = parseInt(req.query.per_page, 10);
  const perPage = parseInt(process.env.PER_PAGE, 10) || 100;
  const validLimit = (isNumber && isNumber > 0 && isNumber) || perPage;
  return validLimit;
};

export const paginationQuery = req => ({
  skip: pageNumber(req),
  limit: limit(req)
});

export const responsePagination = req => ({
  page: pageNumber(req),
  perPage: limit(req)
});

export const needsCache = req =>
  // eslint-disable-next-line no-unneeded-ternary
  req.query.cache === 'false' || req.query.cache === false ? false : true;

export const setResponseHeadersDbEngine = (res, engine) => {
  res.setHeader('x-db-engine', engine);
};

export const transformResponse = providers =>
  providers &&
  providers.length > 0 &&
  providers.map(item => {
    const hospitalDesc = item.hospitalReferralRegionDescription.split(' - ');
    return {
      'Provider Name': item.providerName.toUpperCase(),
      'Provider Street Address': item.providerStreetAddress.toUpperCase(),
      'Provider City': item.providerCity.toUpperCase(),
      'Provider State': item.providerState.toUpperCase(),
      'Provider Zip Code': parseInt(item.providerZipCode, 10),
      'Hospital Referral Region Description': `${hospitalDesc[0].toUpperCase()} - ${
        hospitalDesc[1]
      }`,
      'Total Discharges': parseInt(item.totalDischarges, 10),
      'Average Covered Charges': `$${item.averageCoveredCharges.toLocaleString(
        undefined,
        { minimumFractionDigits: 2 }
      )}`,
      'Average Total Payments': `$${item.averageTotalPayments.toLocaleString(
        undefined,
        { minimumFractionDigits: 2 }
      )}`,
      'Average Medicare Payments': `$${item.averageMedicarePayments.toLocaleString(
        undefined,
        { minimumFractionDigits: 2 }
      )}`
    };
  });

export const requestParams = req => ({
  ...queryNumberMinMax(
    'totalDischarges',
    req.query.min_discharges,
    req.query.max_discharges
  ),
  ...queryNumberMinMax(
    'averageCoveredCharges',
    req.query.min_average_covered_charges,
    req.query.max_average_covered_charges
  ),
  ...queryNumberMinMax(
    'averageMedicarePayments',
    req.query.min_average_medicare_payments,
    req.query.max_average_medicare_payments
  ),
  ...queryString('providerState', req.query.state)
});

export const setRedis = (req, res, redis, providers) => {
  redis.setex(
    req.originalUrl,
    process.env.REDIS_TTL || 3600,
    JSON.stringify(transformResponse(providers)),
    redisSetError => {
      if (redisSetError || !providers || providers === null) {
        return res.status(404).json({
          info: 'Redis data could not be saved',
          error: redisSetError
        });
      }
      return true;
    }
  );
};

export const getFromMongo = (req, res, redis) => {
  Provider.find(requestParams(req), { _id: 0 }, paginationQuery(req))
    .lean()
    .then(
      providers => {
        if (providers && providers.length > 0) {
          if (needsCache(req) === true) {
            setRedis(req, res, redis, providers);
          }
          setResponseHeadersDbEngine(res, 'mongo');
          return res.status(200).json(transformResponse(providers));
        }
        return res.status(200).json([]);
      },
      error =>
        res.json({
          info: "Can't get providers",
          error
        })
    );
};

export const getFromRedis = (req, res, redis) => {
  redis.get(req.originalUrl, (error, cached) => {
    if (error || !cached || cached === null) {
      return getFromMongo(req, res, redis);
    }
    setResponseHeadersDbEngine(res, 'redis');
    return res.status(200).json(JSON.parse(cached));
  });
};

export const paginationHeaders = (req, res, next) => {
  res.setHeader('x-current-page', responsePagination(req).page);
  res.setHeader('x-current-page-limit', responsePagination(req).perPage);
  Provider.countDocuments((error, count) => {
    if (!error) {
      res.setHeader('x-total-count', count);
    }
    next();
  });
};

export const ProviderController = (app, redis) => {
  app.use(paginationHeaders);
  app.get('/providers', authenticate, (req, res) =>
    needsCache(req) === false
      ? getFromMongo(req, res, redis)
      : getFromRedis(req, res, redis)
  );
};

export default ProviderController;
