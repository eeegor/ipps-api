import Provider from './Provider';

const getFromMongo = (req, res, redis) => {
  Provider.find(
    {},
    {},
    {
      limit: 10,
      page: 1
    },
    (error, providers) => {
      if (error) {
        res.status(404).json({
          info: "Can't get providers",
          error
        });
      }
      redis.set(req.originalUrl, JSON.stringify(providers), (error) => {
        if (error || !providers || providers === null) {
          return res.status(404).json({
            info: 'Redis data could not be saved',
            error
          })
        }
      });
      return res.status(200).json({
        engine: 'mongo',
        providers
      });
    }
  );
}

const ProviderController = (app, redis) => {
  app.get('/providers', (req, res) => {
    redis.get(req.originalUrl, (error, cached) => {
      if (error || !cached || cached === null) {
        return getFromMongo(req, res, redis);
      }
      return res.status(200).json({
        engine: 'redis',
        providers: JSON.parse(cached),
      });
    });
  });
};

export default ProviderController;
