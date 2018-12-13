import Provider from './Provider';

const pageNumber = req => {
  const isNumber = parseInt(req.query.page, 10);
  const validPageNumber = isNumber && isNumber > 0 ? isNumber : 1;
  return validPageNumber;
};

const limit = req => {
  const isNumber = parseInt(req.query.per_page, 10);
  const perPage = parseInt(process.env.PER_PAGE, 10);
  const validLimit = (isNumber && isNumber > 0 && isNumber) || perPage || 100;
  return validLimit;
};

const paginationQuery = req => ({
  skip: pageNumber(req),
  limit: limit(req)
});

const responsePagination = req => ({
  page: pageNumber(req),
  perPage: limit(req)
});

const needsCache = req =>
  // eslint-disable-next-line no-unneeded-ternary
  req.query.cache && req.query.cache === 'false' ? false : true;

function setResponseHeadersDbEngine(res, engine) {
  res.setHeader('X-db-engine', engine);
}

const unwrapJson = json => JSON.parse(JSON.stringify(json));

const transformResponse = providers =>
  providers.map(provider => {
    const item = unwrapJson(provider);
    const hospitalDesc = item.hospitalReferralRegionDescription.split(' - ');
    return {
      'Provider Name': item.providerName,
      'Provider Street Address': item.providerStreetAddress,
      'Provider City': item.providerCity,
      'Provider State': item.providerState.toUpperCase(),
      'Provider Zip Code': item.providerZipCode,
      'Hospital Referral Region Description': `${hospitalDesc[0].toUpperCase()} - ${hospitalDesc[1]}`,
      'Total Discharges': item.totalDischarges,
      'Average Covered Charges': `$${item.averageCoveredCharges.toLocaleString()}`,
      'Average Total Payments': `$${item.averageTotalPayments.toLocaleString()}`,
      'Average Medicare Payments': `$${item.averageMedicarePayments.toLocaleString()}`
    };
  });

function getFromMongo(req, res, redis) {
  Provider.find({}, { _id: 0 }, paginationQuery(req), (error, providers) => {
    if (error || !providers || providers === null || providers === undefined) {
      return res.status(201).json({
        info: "Can't get providers",
        error
      });
    }
    if (needsCache(req) === true) {
      redis.setex(req.originalUrl, 10, JSON.stringify(transformResponse(providers)), redisSetError => {
        if (redisSetError || !providers || providers === null) {
          return res.status(404).json({
            info: 'Redis data could not be saved',
            error: redisSetError
          });
        }
        return true;
      });
    }
    setResponseHeadersDbEngine(res, 'mongo');
    return res.status(200).json(transformResponse(providers));
  });
}

const paginationHeaders = (req, res, next) => {
  res.setHeader('X-current-page', responsePagination(req).page);
  res.setHeader('X-current-page-limit', responsePagination(req).perPage);
  Provider.countDocuments((error, count) => {
    if (!error) {
      res.setHeader('X-total-count', count);
    }
    next();
  });
};

function ProviderController(app, redis) {
  app.use(paginationHeaders);
  app.get('/providers', (req, res) => {
    if (needsCache(req) === false) {
      return getFromMongo(req, res, redis);
    }
    return redis.get(req.originalUrl, (error, cached) => {
      if (error || !cached || cached === null) {
        return getFromMongo(req, res, redis);
      }
      setResponseHeadersDbEngine(res, 'redis');
      return res.status(200).json(JSON.parse(cached));
    });
  });
}

export default ProviderController;
