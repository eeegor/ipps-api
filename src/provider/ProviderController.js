import Provider from './Provider';

const pageNumber = req => {
  const isNumber = parseInt(req.query.page, 10);
  const validPageNumber = isNumber && isNumber > 0 ? isNumber : 1;
  return validPageNumber;
};

const limit = req => {
  const isNumber = parseInt(req.query.per_page, 10);
  const validLimit = (isNumber && isNumber > 0 && isNumber) || parseInt(process.env.PER_PAGE, 10) || 100;
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

const needsCache = req => (req.query.cache && req.query.cache === 'false' ? false : true);

function setResponseHeaders(res, engine) {
  res.setHeader('X-db-engine', engine);
}

function getFromMongo(req, res, redis) {
  Provider.find({}, {}, paginationQuery(req), (error, providers) => {
    if (error || !providers || providers === null || providers === undefined) {
      return res.status(201).json({
        info: "Can't get providers",
        error
      });
    }
    if (needsCache(req) === true) {
      redis.setex(req.originalUrl, 10, JSON.stringify(providers), error => {
        if (error || !providers || providers === null) {
          return res.status(404).json({
            info: 'Redis data could not be saved',
            error
          });
        }
      });
    }
    setResponseHeaders(res, 'mongo');
    return res.status(200).json(providers);
  });
}

const countDocuments = (req, res, next) => {
  res.setHeader('X-current-page', responsePagination(req).page);
  res.setHeader('X-current-page-limit', responsePagination(req).perPage);
  res.setHeader('X-powered-by', 'Berlin');
  Provider.countDocuments((error, count) => {
    if (!error) {
      res.setHeader('X-total-count', count);
    }
    next();
  });
}

function ProviderController(app, redis) {
  app.use(countDocuments);
  app.get('/providers', (req, res) => {
    if (needsCache(req) === false) {
      return getFromMongo(req, res, redis);
    }
    redis.get(req.originalUrl, (error, cached) => {
      if (error || !cached || cached === null) {
        return getFromMongo(req, res, redis);
      }
      setResponseHeaders(res, 'redis');
      return res.status(200).json(JSON.parse(cached));
    });
  });
}

export default ProviderController;
