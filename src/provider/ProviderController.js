import Provider from './Provider';

const ProviderController = app => {
  app.get('/providers', (req, res) => {
    Provider.find({}, {}, {
      limit: 100,
      page: 1
    }, (error, providers) => {
      if (error) {
        res.status(404).json({
          info: "Can't get providers",
          error
        });
      }
      res.status(200).json({
        info: 'Providers page 1',
        providers
      });
    });
  });
};

export default ProviderController;
