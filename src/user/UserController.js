import User from './User';
import { pick } from 'lodash';

export const UserController = (app, redis) => {
  app.post('/users', (req, res) => {
    const body = pick(req.body, ['email', 'password']);
    const user = new User({ ...body });
    user
      .save()
      .then(() => user.generateAuthToken())
      .then(token => res.header('x-auth', token).send(user))
      .catch(error => {
        res.status(400).send(error);
      });
  });

  app.get('/profile', (req, res) => {
    const token = req.header('x-auth');
    User.findByToken(token)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            error: 'User not found...'
          });
        }
        return res.send(user);
      })
      .catch(error => {
        return res.status(401).send(error);
      });
  });
};

export default UserController;
