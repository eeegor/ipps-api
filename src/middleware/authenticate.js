import { User } from '../user/User';

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');
  User.findByToken(token)
    .then(user => {
      if (!user) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('There was a problem fetching the user...');
      }
      req.user = user;
      req.token = token;
      return next();
    })
    .catch(error => res.status(401).send(error));
};

export default authenticate;
